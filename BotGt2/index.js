// Polyfill WebSocket for Node.js versions below 22 (needed by Supabase client)
if (typeof global.WebSocket === 'undefined') {
    try {
        global.WebSocket = require('ws');
    } catch (e) {
        console.warn('[Warning] ws module not found. Supabase realtime might fail on Node versions < 22.');
    }
}

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, delay, Browsers, fetchLatestWaWebVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const readline = require('readline');
const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const config = require('./settings');
const { db, query, dbReady } = require('./database/sqlite');

// Ensure database folder exists
fs.ensureDirSync('./database');

// Anti-spam configuration
const processedMsgsPath = './database/processed_messages.json';
let processedMsgs = [];
try {
    if (fs.existsSync(processedMsgsPath)) {
        processedMsgs = fs.readJsonSync(processedMsgsPath);
        if (!Array.isArray(processedMsgs)) processedMsgs = [];
    }
} catch (e) {
    console.error('Failed to load processed messages cache:', e.message);
}

function markMsgAsProcessed(id) {
    if (!id) return;
    if (!processedMsgs.includes(id)) {
        processedMsgs.push(id);
        if (processedMsgs.length > 1000) {
            processedMsgs.shift();
        }
        try {
            fs.writeJsonSync(processedMsgsPath, processedMsgs);
        } catch (e) {
            console.error('Failed to save processed messages cache:', e.message);
        }
    }
}

function isMsgProcessed(id) {
    return id && processedMsgs.includes(id);
}

let connectionOpenTime = 0;
let conn = null; // WhatsApp Socket Connection Instance

// ===== Express API Server & Socket.io Setup =====
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.use(cors());
app.use(express.json());

// Serve static web dashboard files
app.use(express.static(path.join(__dirname, 'web')));

// Clean Pretty URLs for Dashboard Sections
const serveIndex = (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
};

app.get('/dashboard', serveIndex);
app.get('/menu', serveIndex);
app.get('/config', serveIndex);
app.get('/triggers', serveIndex);
app.get('/pairing', serveIndex);

// Broadcast helper for Socket.io
function broadcastUpdate(channel, data) {
    io.emit(channel, data);
}

// Redirect console logs to socket clients for real-time terminal sync
const originalLog = console.log;
const originalError = console.error;

console.log = function(...args) {
    originalLog.apply(console, args);
    const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    // Remove chalk terminal color codes for web browser display compatibility
    const cleanMsg = msg.replace(/\x1B\[\d+m/g, '');
    io.emit('bot-log', cleanMsg);
};

console.error = function(...args) {
    originalError.apply(console, args);
    const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    const cleanMsg = msg.replace(/\x1B\[\d+m/g, '');
    io.emit('bot-log', '[ERROR] ' + cleanMsg);
};

// REST API Endpoints
// Auth Endpoint
app.post('/api/auth/login', async (req, res) => {
    const { identifier, token } = req.body;
    try {
        const admin = await query.get("SELECT id FROM web_admins WHERE identifier = ? AND token = ?", [identifier, token]);
        if (admin) {
            res.json({ success: true, message: 'Login sukses!' });
        } else {
            res.status(401).json({ success: false, message: 'Kredensial login salah!' });
        }
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// Triggers Endpoint
app.get('/api/triggers', async (req, res) => {
    try {
        const rows = await query.all("SELECT * FROM triggers");
        res.json(rows);
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.post('/api/triggers', async (req, res) => {
    const { key, value, match_mode, image_url } = req.body;
    try {
        await query.run("INSERT OR REPLACE INTO triggers (key, value, match_mode, image_url) VALUES (?, ?, ?, ?)", [
            key.toLowerCase().trim(), value, match_mode || 'exact', image_url || null
        ]);
        // Refresh local cache JSON
        await syncJsonData();
        // Notify socket clients
        broadcastUpdate('triggers-update', { action: 'change' });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.delete('/api/triggers/:key', async (req, res) => {
    const key = req.params.key.toLowerCase().trim();
    try {
        await query.run("DELETE FROM triggers WHERE key = ?", [key]);
        await syncJsonData();
        broadcastUpdate('triggers-update', { action: 'change' });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// Bot Settings Endpoint
app.get('/api/settings', async (req, res) => {
    try {
        const row = await query.get("SELECT * FROM bot_settings WHERE id = 1");
        if (row) {
            // Map to camelCase expected by client
            const mappedSettings = {
                id: row.id,
                bot_name: row.bot_name,
                owner_name: row.owner_name,
                owner_numbers: JSON.parse(row.owner_numbers || '[]'),
                prefix: JSON.parse(row.prefix || '[]'),
                no_prefix: !!row.no_prefix,
                verified_quoted: !!row.verified_quoted,
                channel_link: row.channel_link,
                presence_status: row.presence_status,
                work_hours_enabled: !!row.work_hours_enabled,
                work_start_time: row.work_start_time,
                work_end_time: row.work_end_time,
                work_days: JSON.parse(row.work_days || '[]'),
                offline_message: row.offline_message,
                auto_read: !!row.auto_read,
                menu_title: row.menu_title || 'BOT KUCAI AKUN',
                menu_body: row.menu_body || 'Halo! Gunakan panel untuk mengonfigurasi fitur bot.'
            };
            res.json(mappedSettings);
        } else {
            res.status(404).json({ success: false, message: 'Settings not found' });
        }
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.post('/api/settings', async (req, res) => {
    const settings = req.body;
    try {
        await query.run(`
            INSERT OR REPLACE INTO bot_settings (
                id, bot_name, owner_name, owner_numbers, prefix, no_prefix, 
                verified_quoted, channel_link, presence_status, work_hours_enabled, 
                work_start_time, work_end_time, work_days, offline_message, auto_read,
                menu_title, menu_body
            ) VALUES (
                1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `, [
            settings.bot_name,
            settings.owner_name,
            JSON.stringify(settings.owner_numbers || []),
            JSON.stringify(settings.prefix || []),
            settings.no_prefix ? 1 : 0,
            settings.verified_quoted ? 1 : 0,
            settings.channel_link,
            settings.presence_status,
            settings.work_hours_enabled ? 1 : 0,
            settings.work_start_time,
            settings.work_end_time,
            JSON.stringify(settings.work_days || []),
            settings.offline_message,
            settings.auto_read ? 1 : 0,
            settings.menu_title || 'BOT KUCAI AKUN',
            settings.menu_body || 'Halo! Gunakan panel untuk mengonfigurasi fitur bot.'
        ]);
        await syncJsonData();
        // Broadcast settings update to Web Dashboard socket
        const updatedRow = await query.get("SELECT * FROM bot_settings WHERE id = 1");
        const mappedSettings = {
            id: updatedRow.id,
            bot_name: updatedRow.bot_name,
            owner_name: updatedRow.owner_name,
            owner_numbers: JSON.parse(updatedRow.owner_numbers || '[]'),
            prefix: JSON.parse(updatedRow.prefix || '[]'),
            no_prefix: !!updatedRow.no_prefix,
            verified_quoted: !!updatedRow.verified_quoted,
            channel_link: updatedRow.channel_link,
            presence_status: updatedRow.presence_status,
            work_hours_enabled: !!updatedRow.work_hours_enabled,
            work_start_time: updatedRow.work_start_time,
            work_end_time: updatedRow.work_end_time,
            work_days: JSON.parse(updatedRow.work_days || '[]'),
            offline_message: updatedRow.offline_message,
            auto_read: !!updatedRow.auto_read,
            menu_title: updatedRow.menu_title,
            menu_body: updatedRow.menu_body
        };
        broadcastUpdate('bot-settings-update', mappedSettings);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// Bot Connection Endpoint
app.get('/api/connection', async (req, res) => {
    try {
        const row = await query.get("SELECT * FROM bot_connection WHERE id = 1");
        if (row) {
            row.uptime = process.uptime();
        }
        res.json(row);
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.post('/api/connection/action', async (req, res) => {
    const { action, phone_number } = req.body;
    try {
        if (action === 'pair') {
            await query.run("UPDATE bot_connection SET action = 'pair', phone_number = ? WHERE id = 1", [phone_number]);
            broadcastUpdate('bot-connection-update', await query.get("SELECT * FROM bot_connection WHERE id = 1"));
            triggerPairingFlow(phone_number);
        } else if (action === 'logout') {
            await query.run("UPDATE bot_connection SET action = 'logout' WHERE id = 1");
            broadcastUpdate('bot-connection-update', await query.get("SELECT * FROM bot_connection WHERE id = 1"));
            triggerLogoutFlow();
        } else if (action === null || action === '') {
            await query.run("UPDATE bot_connection SET action = null, phone_number = null, pairing_code = null, status = 'disconnected' WHERE id = 1");
            broadcastUpdate('bot-connection-update', await query.get("SELECT * FROM bot_connection WHERE id = 1"));
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// Start Express server on port 3000
const API_PORT = 3000;
server.listen(API_PORT, () => {
    console.log(chalk.green(`[Web API] Server running on http://localhost:${API_PORT}`));
});


// Helper to update connection status in SQLite
async function updateConnectionStatus(status, extra = {}) {
    try {
        const keys = Object.keys(extra);
        const values = Object.values(extra);
        let sql = "UPDATE bot_connection SET status = ?, updated_at = CURRENT_TIMESTAMP";
        const params = [status];
        
        keys.forEach(k => {
            sql += `, ${k} = ?`;
        });
        sql += " WHERE id = 1";
        
        await query.run(sql, [...params, ...values]);
        console.log(chalk.gray(`[Connection Manager] Status → ${status}`));
        
        // Broadcast connection update dynamically
        const connRow = await query.get("SELECT * FROM bot_connection WHERE id = 1");
        broadcastUpdate('bot-connection-update', connRow);
    } catch (err) {
        console.error('[Connection Manager] Failed to update status:', err.message);
    }
}

// Helper to synchronise database tables to local JSON files
async function syncJsonData() {
    try {
        // Sync Triggers
        const triggerRows = await query.all("SELECT * FROM triggers");
        const dynamicTriggers = {};
        triggerRows.forEach(row => {
            dynamicTriggers[row.key.toLowerCase().trim()] = {
                value: row.value,
                match_mode: row.match_mode || 'exact',
                image_url: row.image_url || null
            };
        });
        fs.writeJsonSync('./database/triggers.json', dynamicTriggers, { spaces: 2 });

        // Sync Settings
        const settingsRow = await query.get("SELECT * FROM bot_settings WHERE id = 1");
        if (settingsRow) {
            const botSettings = {
                botName: settingsRow.bot_name,
                ownerName: settingsRow.owner_name,
                ownerNumbers: JSON.parse(settingsRow.owner_numbers || '[]'),
                prefix: JSON.parse(settingsRow.prefix || '[]'),
                noPrefix: !!settingsRow.no_prefix,
                verifiedQuoted: !!settingsRow.verified_quoted,
                channelLink: settingsRow.channel_link,
                presenceStatus: settingsRow.presence_status || "composing",
                workHoursEnabled: !!settingsRow.work_hours_enabled,
                workStartTime: settingsRow.work_start_time || "08:00",
                workEndTime: settingsRow.work_end_time || "22:00",
                workDays: JSON.parse(settingsRow.work_days || '[]'),
                offlineMessage: settingsRow.offline_message || "",
                autoRead: settingsRow.auto_read !== 0,
                menuTitle: settingsRow.menu_title || 'BOT KUCAI AKUN',
                menuBody: settingsRow.menu_body || 'Halo! Gunakan panel untuk mengonfigurasi fitur bot.'
            };
            fs.writeJsonSync('./database/bot_settings.json', botSettings, { spaces: 2 });
        }
    } catch (e) {
        console.error('[Sync] Gagal mensinkronkan SQLite ke JSON file:', e.message);
    }
}


// Action Handlers called from API
let activePairingPhone = null;
async function triggerPairingFlow(phone) {
    if (!conn) return;
    const targetNumber = phone.trim().replace(/[^0-9]/g, '');
    if (!targetNumber) return;
    
    console.log(chalk.cyan(`[Pairing Manager] Menerima permintaan pairing untuk: ${targetNumber}`));
    // Berikan jeda agar socket siap
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
        const code = await conn.requestPairingCode(targetNumber, config.customPairingCode || undefined);
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(chalk.bold.yellow(`\n=> KODE PAIRING: `) + chalk.bold.cyan(formattedCode));
        await updateConnectionStatus('pairing', { pairing_code: formattedCode, phone_number: targetNumber, action: null });
    } catch (err) {
        console.error('[Pairing Manager] Gagal membuat pairing code:', err.message);
        await updateConnectionStatus('waiting_pair', { 
            reason: 'Gagal membuat kode pairing: ' + err.message,
            phone_number: null,
            pairing_code: null,
            action: null
        });
    }
}

async function triggerLogoutFlow() {
    if (!conn) return;
    console.log(chalk.red('[Pairing Manager] Perintah LOGOUT diterima!'));
    try {
        await conn.logout();
    } catch (err) {
        console.error('Logout error:', err.message);
    }
    try { fs.removeSync('./session'); } catch {}
    await updateConnectionStatus('disconnected', {
        reason: 'Diputuskan dari Web Dashboard',
        bot_number: null,
        pairing_code: null,
        action: null
    });
    console.log(chalk.yellow('[Connection] Session dihapus. Restarting bot...'));
    setTimeout(() => { startBot(); }, 3000);
}


async function startBot() {
    console.log(chalk.bold.blue(`\n=== MENYALAKAN ${config.botName.toUpperCase()} ===`));

    // Lakukan inisiasi sinkronisasi JSON di awal booting
    await syncJsonData();

    const { state, saveCreds } = await useMultiFileAuthState('session');

    // Fetch latest WhatsApp Web version to avoid 405 Connection Failure
    let version = [2, 3000, 1015901307]; // Fallback
    try {
        const { version: latestVersion, isLatest } = await fetchLatestWaWebVersion();
        version = latestVersion;
        console.log(chalk.cyan(`[INFO] Using WhatsApp Web v${version.join('.')}, isLatest: ${isLatest}`));
    } catch (e) {
        console.log(chalk.yellow(`[WARNING] Failed to fetch latest WA Web version, using fallback v${version.join('.')}`));
    }

    // Update status to connecting
    await updateConnectionStatus('connecting', { pairing_code: null, reason: null });

    conn = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['Ubuntu', 'Chrome', '20.0.0'],
        version,
        keepAliveIntervalMs: 30000,
        syncFullHistory: false,
        shouldSyncHistoryMessage: () => false
    });

    // ===== Pairing Code Flow (Web Dashboard + Terminal fallback) =====
    if (config.pairingCode && !conn.authState.creds.registered) {
        await updateConnectionStatus('waiting_pair', { pairing_code: null, bot_number: null });

        // If phone number is already in settings, request pairing code immediately
        if (config.phoneNumber) {
            setTimeout(async () => {
                const targetNumber = config.phoneNumber.trim().replace(/[^0-9]/g, '');
                if (targetNumber) {
                    try {
                        const code = await conn.requestPairingCode(targetNumber, config.customPairingCode || undefined);
                        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
                        console.log(chalk.bold.yellow(`\n=> KODE PAIRING ANDA: `) + chalk.bold.cyan(formattedCode));
                        await updateConnectionStatus('pairing', { pairing_code: formattedCode, phone_number: targetNumber });
                    } catch (err) {
                        console.error('Gagal membuat pairing code:', err.message);
                        await updateConnectionStatus('waiting_pair', { reason: err.message });
                    }
                }
            }, 3000);
        }
    }

    conn.contacts = {};
    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('contacts.upsert', (contacts) => {
        for (const contact of contacts) {
            conn.contacts[contact.id] = {
                id: contact.id,
                lid: contact.lid || contact.lidJid || undefined,
                name: contact.name || contact.notify || contact.verifiedName || undefined
            };
        }
    });

    conn.ev.on('contacts.update', (updates) => {
        for (const update of updates) {
            if (conn.contacts[update.id]) {
                Object.assign(conn.contacts[update.id], update);
            } else {
                conn.contacts[update.id] = update;
            }
        }
    });

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const statusCode = lastDisconnect.error?.output?.statusCode || lastDisconnect.error?.output?.payload?.statusCode;
            let shouldReconnect = true;
            let reasonText = '';

            try {
                conn.end();
            } catch { }

            if (statusCode === DisconnectReason.badSession) {
                reasonText = 'Sesi rusak/corrupted. Mohon hapus folder "session" dan jalankan ulang.';
                shouldReconnect = true;
            } else if (statusCode === DisconnectReason.connectionClosed) {
                reasonText = 'Koneksi terputus secara fisik.';
                shouldReconnect = true;
            } else if (statusCode === DisconnectReason.connectionLost) {
                reasonText = 'Koneksi hilang dari server.';
                shouldReconnect = true;
            } else if (statusCode === DisconnectReason.connectionReplaced) {
                reasonText = 'Koneksi bertabrakan (nomor Anda terhubung di perangkat/bot lain). Menghentikan proses untuk mencegah spam...';
                shouldReconnect = false;
            } else if (statusCode === DisconnectReason.loggedOut) {
                reasonText = 'Perangkat telah keluar (logged out). Hapus folder "session" dan scan ulang.';
                shouldReconnect = false;
            } else if (statusCode === DisconnectReason.restartRequired) {
                reasonText = 'Server WhatsApp meminta restart.';
                shouldReconnect = true;
            } else if (statusCode === DisconnectReason.timedOut) {
                reasonText = 'Waktu koneksi habis (timeout).';
                shouldReconnect = true;
            } else {
                reasonText = `Kesalahan tidak diketahui (Status Code: ${statusCode}).`;
                shouldReconnect = true;
            }

            console.log(chalk.red(`\n[Connection Closed] ${reasonText}`));

            // Update SQLite connection status
            await updateConnectionStatus('disconnected', {
                reason: reasonText,
                pairing_code: null,
                phone_number: null,
                bot_number: null
            });

            if (shouldReconnect) {
                console.log(chalk.yellow('[Connection] Menghubungkan ulang bot secara otomatis dalam 5 detik...'));
                setTimeout(() => {
                    startBot();
                }, 5000);
            } else {
                // For loggedOut, also clean session so user can re-pair
                if (statusCode === DisconnectReason.loggedOut) {
                    try { fs.removeSync('./session'); } catch {}
                    console.log(chalk.yellow('[Connection] Session dihapus. Restart untuk re-pair...'));
                    setTimeout(() => { startBot(); }, 5000);
                } else {
                    process.exit(0);
                }
            }
        } else if (connection === 'open') {
            const botNumber = conn.user.id.split(':')[0];
            console.log(chalk.bold.green(`\n[SUCCESS] Connected to WhatsApp as @${botNumber}!`));
            connectionOpenTime = Date.now();

            // Update SQLite status to connected
            await updateConnectionStatus('connected', {
                bot_number: botNumber,
                pairing_code: null,
                reason: null
            });

            conn.ownerLids = [];
            const config = require('./settings');
            for (const num of config.ownerNumbers) {
                try {
                    const res = await conn.onWhatsApp(num);
                    if (res && res[0] && res[0].exists && res[0].lid) {
                        const lidNum = res[0].lid.split('@')[0];
                        conn.ownerLids.push(lidNum);
                        console.log(chalk.cyan(`[INFO] Resolved Owner LID: @${lidNum} for Phone: @${num}`));
                    }
                } catch (err) {
                    console.error(`Gagal mendapatkan LID untuk owner ${num}:`, err.message);
                }
            }
        }
    });

    conn.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            if (chatUpdate.type !== 'notify') return;
            for (const mek of chatUpdate.messages) {
                if (!mek.message) continue;

                // Anti-spam check
                if (isMsgProcessed(mek.key.id)) continue;

                // Grace period check (5s during startup to ignore old message buffers)
                if (Date.now() - connectionOpenTime < 5000) continue;

                // Mark processed
                markMsgAsProcessed(mek.key.id);

                // Mark read (hanya jika autoRead diaktifkan)
                const config = require('./settings');
                if (config.autoRead !== false) {
                    await conn.readMessages([mek.key]).catch(() => { });
                }

                // Forward to handler
                const handlerPath = './plugins/handler';
                // Always clear require cache in dev or for dynamic updates
                delete require.cache[require.resolve(handlerPath)];
                await require(handlerPath)(conn, mek);
            }
        } catch (e) {
            console.error('Error handling message:', e);
        }
    });
}

dbReady.then(() => {
    startBot();
});
