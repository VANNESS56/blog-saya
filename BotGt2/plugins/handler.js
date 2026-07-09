const fs = require('fs-extra');
const { proto, generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const chalk = require('chalk');
const config = require('../settings');
const { query } = require('../database/sqlite');
const axios = require('axios');

// Local API URL for trigger socket notification
const API_URL = 'http://localhost:3000';

function formatRuntime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const hDisplay = h > 0 ? h + " jam, " : "";
    const mDisplay = m > 0 ? m + " menit, " : "";
    const sDisplay = s > 0 ? s + " detik" : "0 detik";
    return hDisplay + mDisplay + (hDisplay || mDisplay ? sDisplay : sDisplay);
}

module.exports = async (conn, m) => {
    try {
        // Load dynamic bot settings to overwrite config
        const botSettingsPath = './database/bot_settings.json';
        let dynamicSettings = {};
        if (fs.existsSync(botSettingsPath)) {
            try {
                dynamicSettings = fs.readJsonSync(botSettingsPath);
            } catch (err) {
                console.error('Gagal membaca database bot_settings:', err.message);
            }
        }
        const config = { ...require('../settings'), ...dynamicSettings };

        let from = m.key.remoteJid;
        const sender = m.key.participant || from;
        
        let realSender = sender;
        if (sender.endsWith('@lid')) {
            const contact = Object.values(conn.contacts || {}).find(c => c.lid === sender);
            if (contact && contact.id) {
                realSender = contact.id;
            }
        }

        // Resolve real JID if remoteJid is a LID JID
        if (from.endsWith('@lid')) {
            const contact = Object.values(conn.contacts || {}).find(c => c.lid === from);
            if (contact && contact.id) {
                from = contact.id;
            } else if (!from.endsWith('@g.us') && realSender.endsWith('@s.whatsapp.net')) {
                from = realSender;
            }
        }
        const senderNumber = realSender.split('@')[0];
        // Load owners dynamically (settings + database/owners.json)
        const ownersPath = './database/owners.json';
        let owners = [...config.ownerNumbers];
        if (fs.existsSync(ownersPath)) {
            try {
                const extraOwners = fs.readJsonSync(ownersPath);
                if (Array.isArray(extraOwners)) {
                    owners = [...new Set([...owners, ...extraOwners])];
                }
            } catch (err) {
                console.error('Gagal membaca database owners:', err.message);
            }
        }
        const isOwnerBase = owners.includes(senderNumber) || (conn.ownerLids && conn.ownerLids.includes(senderNumber));
        let isOwner = isOwnerBase;

        const isGroup = from.endsWith('@g.us');
        if (isGroup) {
            try {
                const groupMetadata = await conn.groupMetadata(from);
                const participants = groupMetadata.participants || [];
                const participant = participants.find(p => p.id === sender || p.id === realSender);
                if (participant && (participant.admin === 'admin' || participant.admin === 'superadmin')) {
                    isOwner = true;
                }
            } catch (err) {
                // Fail silently
            }
        }

        // Load bot settings (verified status)
        // (verified status is now read dynamically from config.verifiedQuoted)

        // Auto-typing simulator helper
        const sendReply = async (text, options = {}) => {
            const pStatus = config.presenceStatus || 'composing';
            if (pStatus && pStatus !== 'disabled') {
                const presenceType = pStatus === 'recording' ? 'recording' : 'composing';
                conn.sendPresenceUpdate(presenceType, from).catch(() => {});
                setTimeout(() => {
                    conn.sendPresenceUpdate('paused', from).catch(() => {});
                }, 2500); // perpanjang sedikit jedanya agar terlihat di WA HP
            }

            const quotedMsg = config.verifiedQuoted ? {
                key: {
                    remoteJid: 'status@broadcast',
                    participant: '0@s.whatsapp.net',
                    fromMe: false,
                    id: 'OFFICIAL_STORE'
                },
                message: {
                    conversation: `© ${config.botName.toUpperCase()}`
                }
            } : m;

            try {
                let msgContent = { ...options };
                if (msgContent.image) {
                    msgContent.caption = text;
                } else {
                    msgContent.text = text;
                }
                return await conn.sendMessage(from, msgContent, { quoted: quotedMsg });
            } catch (err) {
                console.error('Failed to send message with quoted, falling back to unquoted:', err.message);
                let msgContent = { ...options };
                if (msgContent.image) {
                    msgContent.caption = text;
                } else {
                    msgContent.text = text;
                }
                return await conn.sendMessage(from, msgContent);
            }
        };

        // Save JID to database for broadcast list
        const chatsPath = './database/chats.json';
        let chats = [];
        if (fs.existsSync(chatsPath)) {
            try { chats = fs.readJsonSync(chatsPath); } catch { }
        }
        if (!Array.isArray(chats)) chats = [];
        if (!chats.includes(from)) {
            chats.push(from);
            fs.writeJsonSync(chatsPath, chats, { spaces: 2 });
        }

        // Parse and unwrap wrapper message types (ephemeralMessage, viewOnceMessage, etc.)
        const getRealType = (msg) => {
            if (!msg) return '';
            return Object.keys(msg).find(k => k !== 'messageContextInfo' && k !== 'senderKeyDistributionMessage') || Object.keys(msg)[0];
        };

        let type = getRealType(m.message);
        if (type === 'ephemeralMessage') {
            m.message = m.message.ephemeralMessage.message;
            type = getRealType(m.message);
        }
        if (type === 'viewOnceMessage') {
            m.message = m.message.viewOnceMessage.message;
            type = getRealType(m.message);
        }
        if (type === 'viewOnceMessageV2') {
            m.message = m.message.viewOnceMessageV2.message;
            type = getRealType(m.message);
        }

        const messageContent = m.message[type] || m.message;
        let body = '';
        if (type === 'conversation') {
            body = m.message.conversation;
        } else if (type === 'extendedTextMessage') {
            body = m.message.extendedTextMessage.text;
        } else if (type === 'imageMessage') {
            body = m.message.imageMessage.caption;
        } else if (type === 'videoMessage') {
            body = m.message.videoMessage.caption;
        } else if (type === 'buttonsResponseMessage') {
            body = m.message.buttonsResponseMessage?.selectedButtonId || '';
        } else if (type === 'templateButtonReplyMessage') {
            body = m.message.templateButtonReplyMessage?.selectedId || '';
        } else if (type === 'listResponseMessage') {
            body = m.message.listResponseMessage?.singleSelectReply?.selectedRowId || '';
        } else if (type === 'interactiveResponseMessage') {
            const nativeFlow = m.message.interactiveResponseMessage?.nativeFlowResponseMessage;
            if (nativeFlow?.paramsJson) {
                try {
                    const params = JSON.parse(nativeFlow.paramsJson);
                    body = params.id || '';
                } catch (e) {
                    console.error('Failed to parse interactiveResponseMessage:', e.message);
                }
            }
        }

        if (!body) return;
        const cleanText = body.trim();
        const cleanTextLower = cleanText.toLowerCase();

        // Beautiful Terminal Logger
        const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const pushName = m.pushName || 'No Name';
        // isGroup is already defined above
        const chatTypeBadge = isGroup ? chalk.bold.black.bgCyan(' GROUP ') : chalk.bold.black.bgGreen(' PRIVATE ');
        const roleBadge = isOwner ? chalk.bold.red('[Owner]') : chalk.bold.yellow('[Customer]');

        console.log(
            chalk.gray(`[${timeStr}]`) + ' ' +
            chatTypeBadge + ' ' +
            roleBadge + ' ' +
            chalk.green(`@${senderNumber}`) + chalk.gray(` (${pushName})`) + ' ' +
            chalk.white('➔') + ' ' +
            chalk.bold.magenta(cleanText)
        );

        // ===== Auto-Reply Schedule (Jam Kerja Bot) =====
        if (config.workHoursEnabled && !isOwner) {
            // Dapatkan hari saat ini dalam bahasa Indonesia
            const hariIndo = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
            const now = new Date();
            const currentDay = hariIndo[now.getDay()];
            
            // Format waktu saat ini: HH:mm
            const padZero = (n) => n < 10 ? '0' + n : n;
            const currentTimeStr = `${padZero(now.getHours())}:${padZero(now.getMinutes())}`;
            
            // Cek apakah hari ini masuk dalam daftar hari kerja
            const daysConfig = Array.isArray(config.workDays) ? config.workDays : [];
            const isWorkingDay = daysConfig.includes(currentDay);
            
            let isWorkingHour = false;
            if (isWorkingDay && config.workStartTime && config.workEndTime) {
                const [startH, startM] = config.workStartTime.split(':').map(Number);
                const [endH, endM] = config.workEndTime.split(':').map(Number);
                const currentMin = now.getHours() * 60 + now.getMinutes();
                const startMin = startH * 60 + startM;
                const endMin = endH * 60 + endM;
                
                if (currentMin >= startMin && currentMin <= endMin) {
                    isWorkingHour = true;
                }
            }
            
            // Jika hari ini libur ATAU jam sekarang di luar jam kerja, kirim pesan offline
            if (!isWorkingDay || !isWorkingHour) {
                console.log(chalk.yellow(`[Schedule Manager] Bot offline. Mengirim pesan offline ke @${senderNumber}.`));
                return await sendReply(config.offlineMessage || 'Halo! Maaf kami sedang offline.');
            }
        }

        // 1. Static growtopia trade triggers
        const sellKeywords = ['jual akun', 'sell akun', 'sell', 'jual'];
        const buyKeywords = ['buy akun', 'beli akun', 'buy', 'beli'];

        if (sellKeywords.some(keyword => cleanTextLower.includes(keyword))) {
            const response = `Boleh cai, gas send spesifikasi akun kamu sekarang! 🔥\n\n` +
                `*(Noted: Akun wajib Ready Change Email, ya!)*\n\n` +
                `Kirim screenshot detail berikut:\n` +
                `📊 Level Akun & Roles Level\n` +
                `🔒 Untrade Items & Umur Akun\n` +
                `🎒 Isi Backpack`;
            return await sendReply(response);
        }

        if (buyKeywords.some(keyword => cleanTextLower.includes(keyword))) {
            const response = `Boleh Cai , Mau angkut akun kode berapa nih? 🔥`;
            return await sendReply(response);
        }

        // 2. Load dynamic triggers
        const triggersPath = './database/triggers.json';
        let triggers = {};
        if (fs.existsSync(triggersPath)) {
            try {
                triggers = fs.readJsonSync(triggersPath);
            } catch (err) {
                console.error('Gagal membaca database triggers:', err.message);
            }
        }

        // Check if dynamic trigger matches
        let matchedTriggerObj = null;

        // 1. Cek Exact Match (Sama Persis)
        if (triggers[cleanTextLower]) {
            const tr = triggers[cleanTextLower];
            const mode = typeof tr === 'object' ? tr.match_mode : 'exact';
            if (mode === 'exact') {
                matchedTriggerObj = tr;
            }
        }

        // 2. Cek Contains Match (Jika kalimat mengandung kata kunci)
        if (!matchedTriggerObj) {
            for (const key of Object.keys(triggers)) {
                const tr = triggers[key];
                const mode = typeof tr === 'object' ? tr.match_mode : 'exact';
                if (mode === 'contains' && cleanTextLower.includes(key)) {
                    matchedTriggerObj = tr;
                    break;
                }
            }
        }

        if (matchedTriggerObj) {
            let responseText = typeof matchedTriggerObj === 'object' ? matchedTriggerObj.value : matchedTriggerObj;
            let imageUrl = typeof matchedTriggerObj === 'object' ? matchedTriggerObj.image_url : null;

            responseText = responseText.replace(/\${pushname}/g, pushName);
            responseText = responseText.replace(/\${senderNumber}/g, senderNumber);
            responseText = responseText.replace(/\${time}/g, timeStr);
            responseText = responseText.replace(/\${date}/g, new Date().toLocaleDateString('id-ID'));
            responseText = responseText.replace(/\${botName}/g, config.botName || 'Bot');
            
            if (imageUrl && imageUrl.trim()) {
                const crypto = require('crypto');
                const path = require('path');
                const axios = require('axios');
                
                const cacheDir = './database/cache_images';
                fs.ensureDirSync(cacheDir);
                
                const cleanUrl = imageUrl.trim();
                const hash = crypto.createHash('md5').update(cleanUrl).digest('hex');
                const fileExt = path.extname(new URL(cleanUrl).pathname) || '.jpg';
                const cachedFilePath = path.join(cacheDir, `${hash}${fileExt}`);
                
                if (fs.existsSync(cachedFilePath)) {
                    // Jika sudah ada di cache, kirim file lokal
                    return await sendReply(responseText, { image: { url: cachedFilePath } });
                } else {
                    // Jika belum ada, download dan simpan
                    try {
                        console.log(chalk.cyan(`[Cache Manager] Mendownload gambar baru untuk cache: ${cleanUrl}`));
                        const response = await axios({
                            method: 'get',
                            url: cleanUrl,
                            responseType: 'stream'
                        });
                        
                        const writer = fs.createWriteStream(cachedFilePath);
                        response.data.pipe(writer);
                        
                        await new Promise((resolve, reject) => {
                            writer.on('finish', resolve);
                            writer.on('error', reject);
                        });
                        
                        return await sendReply(responseText, { image: { url: cachedFilePath } });
                    } catch (err) {
                        console.error('[Cache Manager] Gagal mendownload gambar, fallback mengirim langsung dari URL:', err.message);
                        return await sendReply(responseText, { image: { url: cleanUrl } });
                    }
                }
            } else {
                return await sendReply(responseText);
            }
        }

        // 3. Owner admin commands (multi-prefix & no-prefix support)
        const prefixes = Array.isArray(config.prefix) ? config.prefix : [config.prefix];
        let isCmd = false;
        let usedPrefix = '';
        let cleanCmdText = cleanText;

        for (const p of prefixes) {
            if (cleanText.startsWith(p)) {
                isCmd = true;
                usedPrefix = p;
                cleanCmdText = cleanText.slice(p.length).trim();
                break;
            }
        }

        // If no prefix matched, check if noPrefix is enabled and first word is a command name
        if (!isCmd && config.noPrefix) {
            const words = cleanText.trim().split(/ +/);
            const firstWord = words[0].toLowerCase();
            if (['config', 'regist', 'addtrigger', 'deltrigger', 'listtrigger', 'listtriggers', 'addowner', 'delowner', 'menu', 'help', 'owner', 'bc', 'broadcast', 'saluran', 'ch', 'channel', 'verified'].includes(firstWord)) {
                isCmd = true;
                cleanCmdText = cleanText;
            }
        }

        if (isCmd) {
            const args = cleanCmdText.trim().split(/ +/);
            const command = args.shift().toLowerCase();
            const displayPrefix = usedPrefix || config.prefix[0] || '.';

            switch (command) {
                case 'config': {
                    if (!isOwner) return await sendReply('❌ Perintah ini hanya dapat dijalankan oleh Owner/Admin!');
                    const response = `🔧 *WEB CONFIGURATION PANEL* 🔧\n\n` +
                        `Halo! Gunakan tautan di bawah ini untuk mengonfigurasi fitur bot (seperti menambah/mengedit trigger):\n\n` +
                        `🌐 *Link Panel*: ${config.vercelUrl}\n\n` +
                        `*(Catatan: Anda sekarang menggunakan database SQLite lokal yang terintegrasi dengan web dashboard Anda)*`;
                    return await sendReply(response);
                }

                case 'regist': {
                    if (!isOwner) return await sendReply('❌ Perintah ini hanya dapat dijalankan oleh Owner!');

                    const target = args.join(' ').trim();
                    if (!target) return await sendReply(`⚠️ Penggunaan:\n*${displayPrefix}regist <nomor_wa_atau_email>*\n\nContoh:\n*${displayPrefix}regist 628999991950*\n*${displayPrefix}regist admin@gmail.com*`);

                    // Clean identifier jika berupa no telepon
                    let cleanIdentifier = target;
                    if (!target.includes('@')) {
                        cleanIdentifier = target.replace(/[^0-9]/g, '');
                    }

                    if (cleanIdentifier.length < 5) {
                        return await sendReply('❌ Masukkan nomor WhatsApp atau email yang valid!');
                    }

                    // Generator token acak 16 karakter (kombinasi huruf besar, kecil, angka)
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let token = '';
                    for (let i = 0; i < 16; i++) {
                        token += chars.charAt(Math.floor(Math.random() * chars.length));
                    }

                    try {
                        // SQLite Upsert using INSERT OR REPLACE
                        await query.run(
                            "INSERT OR REPLACE INTO web_admins (identifier, token) VALUES (?, ?)",
                            [cleanIdentifier, token]
                        );

                        const msg = `🔑 *TOKEN PENDAFTARAN WEB* 🔑\n\n` +
                            `👤 *Identifier*: \`${cleanIdentifier}\`\n` +
                            `🔑 *Token Login*: \`${token}\`\n\n` +
                            `Gunakan info di atas untuk masuk ke Website Dashboard. Simpan token ini baik-baik!`;
                        return await sendReply(msg);
                    } catch (err) {
                        console.error('Gagal mendaftarkan admin di SQLite:', err.message);
                        return await sendReply('❌ Gagal membuat token pendaftaran: ' + err.message);
                    }
                }

                case 'addtrigger': {
                    if (!isOwner) return await sendReply('❌ Perintah ini hanya dapat dijalankan oleh Owner!');

                    const rest = args.join(' ');
                    if (!rest.trim()) {
                        const tempDir = './temp';
                        if (!fs.existsSync(tempDir)) fs.ensureDirSync(tempDir);
                        const filePath = `${tempDir}/addtrigger.html`;

                        // Read the Growtopia-themed HTML template
                        const path = require('path');
                        const templatePath = path.join(__dirname, '..', 'templates', 'addtrigger.html');
                        let htmlContent = fs.readFileSync(templatePath, 'utf-8');
                        
                        // Inject dynamic values
                        const botNumber = conn.user.id.split(':')[0];
                        htmlContent = htmlContent.replace('{{PREFIX}}', displayPrefix);
                        htmlContent = htmlContent.replace('{{BOT_NUMBER}}', botNumber);
                        
                        fs.writeFileSync(filePath, htmlContent);

                        await conn.sendMessage(from, {
                            document: fs.readFileSync(filePath),
                            fileName: 'addtrigger.html',
                            mimetype: 'text/html',
                            caption: `🌳 *FORM ADD BULK TRIGGERS* 🌳\n\nSilakan unduh dan buka berkas HTML di atas pada HP/PC Anda. Anda bisa menambahkan banyak trigger sekaligus! Setelah diisi, klik *"Kirim ke WhatsApp"* atau *"Salin Perintah"* untuk menerapkan.`
                        }, { quoted: m });

                        try { fs.unlinkSync(filePath); } catch {}
                        return;
                    }

                    // Check if it's a bulk import code
                    if (rest.trim().startsWith('TRG-')) {
                        const base64Data = rest.trim().substring(4);
                        try {
                            const decodedJson = Buffer.from(base64Data, 'base64').toString('utf-8');
                            const newTriggers = JSON.parse(decodedJson);

                            if (typeof newTriggers !== 'object' || newTriggers === null || Array.isArray(newTriggers)) {
                                return await sendReply('❌ *Gagal*: Format data bulk trigger tidak valid.');
                            }

                            const keys = Object.keys(newTriggers);
                            if (keys.length === 0) {
                                return await sendReply('⚠️ Kode bulk trigger tidak memiliki data trigger.');
                            }

                             // Merge
                             for (const key of keys) {
                                 const trimmedKey = key.toLowerCase().trim();
                                 const val = newTriggers[key];
                                 let dbVal = typeof val === 'object' ? val.value : val;
                                 let dbImg = typeof val === 'object' ? val.image_url : null;
                                 let dbMode = typeof val === 'object' ? val.match_mode || 'exact' : 'exact';

                                 triggers[trimmedKey] = {
                                     value: dbVal,
                                     match_mode: dbMode,
                                     image_url: dbImg
                                 };

                                 // SQLite import
                                 try {
                                     await query.run(
                                         "INSERT OR REPLACE INTO triggers (key, value, match_mode, image_url) VALUES (?, ?, ?, ?)",
                                         [trimmedKey, dbVal, dbMode, dbImg]
                                     );
                                 } catch (err) {
                                     console.error(`Gagal menyimpan trigger ${trimmedKey} ke SQLite:`, err.message);
                                 }
                             }
                             fs.writeJsonSync(triggersPath, triggers, { spaces: 2 });
                             // Notify socket web clients via local API call
                             axios.post(`${API_URL}/api/connection/action`, { action: '' }).catch(() => {});

                            return await sendReply(`✅ *Bulk Import Sukses!*\n\nBerhasil mengimpor *${keys.length} trigger* baru secara masal:\n` + keys.map(k => `• *${k}*`).join('\n'));
                        } catch (err) {
                            return await sendReply(`❌ *Gagal mengimpor*: Kode rusak atau salah format.\nError: ${err.message}`);
                        }
                    }

                    const parts = rest.split('|');
                    if (parts.length < 2) {
                        return await sendReply(`⚠️ Format salah!\nGunakan: *${displayPrefix}addtrigger perintah|teks balasan|url_gambar*\nContoh: *${displayPrefix}addtrigger p|Halo kucai!|https://image.com/kucai.png*`);
                    }

                    const triggerKey = parts[0].trim().toLowerCase();
                    const triggerValue = parts[1].trim();
                    const triggerImage = parts[2] ? parts[2].trim() : null;

                    // Validation
                    if (!triggerKey || !triggerValue) {
                        return await sendReply(`⚠️ Format salah! Perintah atau balasan tidak boleh kosong.`);
                    }

                     triggers[triggerKey] = {
                         value: triggerValue,
                         match_mode: 'exact',
                         image_url: triggerImage
                     };
                     fs.writeJsonSync(triggersPath, triggers, { spaces: 2 });

                     try {
                         await query.run(
                             "INSERT OR REPLACE INTO triggers (key, value, match_mode, image_url) VALUES (?, ?, 'exact', ?)",
                             [triggerKey, triggerValue, triggerImage]
                         );
                         // Trigger socket update on web dashboard
                         axios.post(`${API_URL}/api/connection/action`, { action: '' }).catch(() => {});
                     } catch (err) {
                         console.error(`Gagal menambahkan trigger ${triggerKey} ke SQLite:`, err.message);
                     }

                     let successMsg = `✅ *Trigger Berhasil Ditambahkan!*\n\n🔑 Perintah: *${triggerKey}*\n💬 Balasan:\n${triggerValue}`;
                     if (triggerImage) {
                         successMsg += `\n🖼️ URL Gambar: ${triggerImage}`;
                     }
                     return await sendReply(successMsg);
                }

                case 'deltrigger': {
                    if (!isOwner) return await sendReply('❌ Perintah ini hanya dapat dijalankan oleh Owner!');

                    const triggerKey = args.join(' ').trim().toLowerCase();
                    if (!triggerKey) {
                        return await sendReply(`⚠️ Format salah! Gunakan: *${displayPrefix}deltrigger perintah*`);
                    }

                    if (!triggers[triggerKey]) {
                        return await sendReply(`❌ Trigger *"${triggerKey}"* tidak ditemukan.`);
                    }

                     delete triggers[triggerKey];
                     fs.writeJsonSync(triggersPath, triggers, { spaces: 2 });

                     try {
                         await query.run("DELETE FROM triggers WHERE key = ?", [triggerKey]);
                         axios.post(`${API_URL}/api/connection/action`, { action: '' }).catch(() => {});
                     } catch (err) {
                         console.error(`Gagal menghapus trigger ${triggerKey} di SQLite:`, err.message);
                     }

                     return await sendReply(`🗑️ Trigger *"${triggerKey}"* berhasil dihapus!`);
                }

                case 'listtrigger':
                case 'listtriggers': {
                    const keys = Object.keys(triggers);
                    if (keys.length === 0) {
                        return await sendReply('ℹ️ Belum ada trigger dinamis terdaftar.');
                    }

                    let listMsg = `📂 *DAFTAR TRIGGER TERDAFTAR*:\n\n`;
                    keys.forEach((key, idx) => {
                        listMsg += `${idx + 1}. *${key}*\n`;
                    });
                    return await sendReply(listMsg);
                }

                case 'addowner': {
                    if (!isOwner) return await conn.sendMessage(from, { text: '❌ Perintah ini hanya dapat dijalankan oleh Owner!' }, { quoted: m });

                    const targetOwner = args.join(' ').trim().replace(/[^0-9]/g, '');
                    if (!targetOwner) {
                        return await conn.sendMessage(from, { text: `⚠️ Format salah! Gunakan: *${displayPrefix}addowner nomor_owner*\nContoh: *${displayPrefix}addowner 6281234567890*` }, { quoted: m });
                    }

                    let extraOwners = [];
                    if (fs.existsSync(ownersPath)) {
                        try { extraOwners = fs.readJsonSync(ownersPath); } catch { }
                    }
                    if (!Array.isArray(extraOwners)) extraOwners = [];

                    if (extraOwners.includes(targetOwner) || config.ownerNumbers.includes(targetOwner)) {
                        return await conn.sendMessage(from, { text: `ℹ️ Nomor *${targetOwner}* sudah terdaftar sebagai Owner.` }, { quoted: m });
                    }

                    extraOwners.push(targetOwner);
                    fs.writeJsonSync(ownersPath, extraOwners, { spaces: 2 });

                    try {
                        const newOwnerList = [...new Set([...config.ownerNumbers, ...extraOwners])];
                        await query.run("UPDATE bot_settings SET owner_numbers = ? WHERE id = 1", [JSON.stringify(newOwnerList)]);
                        axios.post(`${API_URL}/api/connection/action`, { action: '' }).catch(() => {});
                    } catch (err) {
                        console.error('Gagal memperbarui owners di SQLite:', err.message);
                    }

                    return await conn.sendMessage(from, {
                        text: `✅ Berhasil menambahkan *@${targetOwner}* sebagai Owner baru!`,
                        mentions: [targetOwner + '@s.whatsapp.net']
                    }, { quoted: m });
                }

                case 'delowner': {
                    if (!isOwner) return await conn.sendMessage(from, { text: '❌ Perintah ini hanya dapat dijalankan oleh Owner!' }, { quoted: m });

                    const targetOwner = args.join(' ').trim().replace(/[^0-9]/g, '');
                    if (!targetOwner) {
                        return await conn.sendMessage(from, { text: `⚠️ Format salah! Gunakan: *${displayPrefix}delowner nomor_owner*` }, { quoted: m });
                    }

                    if (config.ownerNumbers.includes(targetOwner)) {
                        return await conn.sendMessage(from, { text: `❌ Nomor *${targetOwner}* adalah Owner utama di settings.js dan tidak bisa dihapus.` }, { quoted: m });
                    }

                    let extraOwners = [];
                    if (fs.existsSync(ownersPath)) {
                        try { extraOwners = fs.readJsonSync(ownersPath); } catch { }
                    }
                    if (!Array.isArray(extraOwners)) extraOwners = [];

                    if (!extraOwners.includes(targetOwner)) {
                        return await conn.sendMessage(from, { text: `❌ Nomor *${targetOwner}* tidak ditemukan di daftar Owner tambahan.` }, { quoted: m });
                    }

                    extraOwners = extraOwners.filter(num => num !== targetOwner);
                    fs.writeJsonSync(ownersPath, extraOwners, { spaces: 2 });

                    try {
                        const baseList = Array.isArray(config.ownerNumbers) ? config.ownerNumbers : [];
                        const newOwnerList = [...new Set([...baseList.filter(num => num !== targetOwner), ...extraOwners])];
                        await query.run("UPDATE bot_settings SET owner_numbers = ? WHERE id = 1", [JSON.stringify(newOwnerList)]);
                        axios.post(`${API_URL}/api/connection/action`, { action: '' }).catch(() => {});
                    } catch (err) {
                        console.error('Gagal menghapus owner di SQLite:', err.message);
                    }

                    return await conn.sendMessage(from, {
                        text: `🗑️ Nomor *@${targetOwner}* berhasil dihapus dari daftar Owner!`,
                        mentions: [targetOwner + '@s.whatsapp.net']
                    }, { quoted: m });
                }

                case 'menu':
                case 'help': {

                    const runtimeSecs = process.uptime();
                    const runtimeStr = formatRuntime(runtimeSecs);

                    // Formulasi Salam waktu Ucapan Indo
                    const nowHour = new Date().getHours();
                    let ucapanIndo = 'Malam';
                    if (nowHour >= 4 && nowHour < 11) ucapanIndo = 'Pagi';
                    else if (nowHour >= 11 && nowHour < 15) ucapanIndo = 'Siang';
                    else if (nowHour >= 15 && nowHour < 18) ucapanIndo = 'Sore';

                    // Formulasi Hari Indo
                    const hariIndoList = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                    const hariIndoVal = hariIndoList[new Date().getDay()];

                    // Template Default jika database kosong
                    const defaultTemplate = `*{namebot}*\n\n_• Server: wibusoft.com_\n_• Version: v4.0_\n\n*GAME*\n- {prefix}asahotak\n- {prefix}buylimit\n- {prefix}caklontong\n- {prefix}dare\n- {prefix}family100\n- {prefix}hint\n- {prefix}math\n- {prefix}nyerah\n- {prefix}redeem`;
                    
                    let rawMenuBody = config.menuBody || defaultTemplate;

                    // Mengganti variables
                    let menuText = rawMenuBody
                        .replace(/{pushname}/g, pushName)
                        .replace(/{prefix}/g, displayPrefix)
                        .replace(/{namebot}/g, config.botName || 'Bot')
                        .replace(/{ucapan}/g, ucapanIndo)
                        .replace(/{tanggal}/g, new Date().toLocaleDateString('id-ID'))
                        .replace(/{hari}/g, hariIndoVal)
                        .replace(/{owner}/g, config.ownerName || 'Alvin Kucai')
                        .replace(/{runtime}/g, runtimeStr);

                    // Interactive native flow quick reply buttons
                    const buttons = [
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🛒 Beli Akun",
                                id: "buy akun"
                            })
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "💵 Jual Akun",
                                id: "jual akun"
                            })
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🚀 Owner",
                                id: `${displayPrefix}owner`
                            })
                        }
                    ];

                    const interactiveMessage = proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({ text: menuText }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: `© ${config.ownerName}` }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            title: config.menuTitle || `BOT KUCAI AKUN`,
                            hasMediaAttachment: false
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: buttons
                        })
                    });

                    const cleanQuoted = config.verifiedQuoted ? {
                        key: {
                            remoteJid: 'status@broadcast',
                            participant: '0@s.whatsapp.net',
                            fromMe: false,
                            id: 'OFFICIAL_STORE'
                        },
                        message: {
                            conversation: `© ${config.botName.toUpperCase()}`
                        }
                    } : m;

                    let msg;
                    try {
                        msg = generateWAMessageFromContent(from, {
                            viewOnceMessage: {
                                message: {
                                    messageContextInfo: {
                                        deviceListMetadata: {},
                                        deviceListMetadataVersion: 2
                                    },
                                    interactiveMessage: interactiveMessage
                                }
                            }
                        }, { quoted: cleanQuoted });
                    } catch (err) {
                        console.error('Failed to generate WAMessage with cleanQuoted, falling back:', err.message);
                        msg = generateWAMessageFromContent(from, {
                            viewOnceMessage: {
                                message: {
                                    messageContextInfo: {
                                        deviceListMetadata: {},
                                        deviceListMetadataVersion: 2
                                    },
                                    interactiveMessage: interactiveMessage
                                }
                            }
                        });
                    }

                    const isGroup = from.endsWith('@g.us');
                    const additionalNodes = [
                        {
                            tag: 'biz',
                            attrs: {},
                            content: [
                                {
                                    tag: 'interactive',
                                    attrs: { type: 'native_flow', v: '1' },
                                    content: [
                                        {
                                            tag: 'native_flow',
                                            attrs: { name: 'mixed', v: '9' }
                                        }
                                    ]
                                }
                            ]
                        }
                    ];
                    if (!isGroup) {
                        additionalNodes.push({
                            tag: 'bot',
                            attrs: { biz_bot: '1' }
                        });
                    }

                    return await conn.relayMessage(from, msg.message, {
                        messageId: msg.key.id,
                        additionalNodes
                    });
                }

                case 'owner': {
                    const ownerNum = config.ownerNumbers[0];
                    const vcard = 'BEGIN:VCARD\n'
                        + 'VERSION:3.0\n'
                        + `FN:${config.ownerName}\n`
                        + 'ORG:Alvin Kucai;\n'
                        + `TEL;type=CELL;type=VOICE;waid=${ownerNum}:+${ownerNum}\n`
                        + 'END:VCARD';

                    return await conn.sendMessage(from, {
                        contacts: {
                            displayName: config.ownerName,
                            contacts: [{ vcard }]
                        }
                    }, { quoted: m });
                }

                case 'bc':
                case 'broadcast': {
                    if (!isOwner) return await conn.sendMessage(from, { text: '❌ Perintah ini hanya dapat dijalankan oleh Owner!' }, { quoted: m });

                    const textBc = args.join(' ').trim();
                    if (!textBc) {
                        return await conn.sendMessage(from, { text: `⚠️ Format salah! Gunakan: *${displayPrefix}bc teks_pengumuman*` }, { quoted: m });
                    }

                    const dbChatsPath = './database/chats.json';
                    let dbChats = [];
                    if (fs.existsSync(dbChatsPath)) {
                        try { dbChats = fs.readJsonSync(dbChatsPath); } catch { }
                    }
                    if (!Array.isArray(dbChats)) dbChats = [];

                    if (dbChats.length === 0) {
                        return await conn.sendMessage(from, { text: 'ℹ️ Belum ada daftar chat terdaftar untuk broadcast.' }, { quoted: m });
                    }

                    await conn.sendMessage(from, { text: `📢 *Memulai Broadcast ke ${dbChats.length} chat...*` }, { quoted: m });

                    let successCount = 0;
                    let failCount = 0;

                    for (const jid of dbChats) {
                        try {
                            await conn.sendMessage(jid, { text: textBc });
                            successCount++;
                            // Delay 1 second to avoid WhatsApp spam triggers
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        } catch (err) {
                            failCount++;
                        }
                    }

                    return await conn.sendMessage(from, {
                        text: `✅ *Broadcast Selesai!*\n\n🟢 Berhasil: *${successCount}*\n🔴 Gagal: *${failCount}*`
                    }, { quoted: m });
                }

                case 'saluran':
                case 'ch':
                case 'channel': {
                    return await conn.sendMessage(from, {
                        text: `📢 *SALURAN WHATSAPP ${config.botName.toUpperCase()}* 📢\n\nIkuti saluran resmi kami untuk informasi dan stock terbaru:\n${config.channelLink}`
                    }, { quoted: m });
                }

                case 'verified': {
                    if (!isOwner) return await sendReply('❌ Perintah ini hanya dapat dijalankan oleh Owner!');

                    const action = args[0]?.toLowerCase();
                    let targetVal = false;
                    if (action === 'on') {
                        targetVal = true;
                    } else if (action === 'off') {
                        targetVal = false;
                    } else {
                        return await sendReply(`⚠️ Status saat ini: *${config.verifiedQuoted ? 'ON' : 'OFF'}*\nGunakan: *${displayPrefix}verified on* atau *${displayPrefix}verified off*`);
                    }

                    try {
                        await query.run("UPDATE bot_settings SET verified_quoted = ? WHERE id = 1", [targetVal ? 1 : 0]);
                        axios.post(`${API_URL}/api/connection/action`, { action: '' }).catch(() => {});
                    } catch (err) {
                        console.error('Gagal memperbarui verified_quoted di SQLite:', err.message);
                    }
                    
                    // Update local file immediately
                    const dynamicSettingsPath = './database/bot_settings.json';
                    let dyn = {};
                    if (fs.existsSync(dynamicSettingsPath)) {
                        try { dyn = fs.readJsonSync(dynamicSettingsPath); } catch {}
                    }
                    dyn.verifiedQuoted = targetVal;
                    fs.writeJsonSync(dynamicSettingsPath, dyn, { spaces: 2 });

                    return await sendReply(`✅ *Fake Verified Quoted berhasil ${targetVal ? 'diaktifkan' : 'dinonaktifkan'}!*`);
                }
            }
        }
    } catch (e) {
        console.error('Error processing inside handler plugin:', e);
    }
};
