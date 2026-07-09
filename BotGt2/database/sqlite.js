const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');

const dbPath = path.join(__dirname, 'bot.db');
fs.ensureDirSync(__dirname);

let resolveReady;
const dbReady = new Promise((resolve) => {
    resolveReady = resolve;
});

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Gagal membuka database SQLite:', err.message);
    } else {
        console.log('[SQLite] Terhubung ke database lokal bot.db');
        initTables();
    }
});

function initTables() {
    db.serialize(() => {
        // Table: web_admins
        db.run(`
            CREATE TABLE IF NOT EXISTS web_admins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                identifier TEXT UNIQUE NOT NULL,
                token TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Insert default admin if table is empty
        db.get("SELECT COUNT(*) as count FROM web_admins", [], (err, row) => {
            if (!err && row.count === 0) {
                db.run("INSERT INTO web_admins (identifier, token) VALUES (?, ?)", ['6283140021959', 'KUC-ALVIN99']);
            }
        });

        // Table: triggers
        db.run(`
            CREATE TABLE IF NOT EXISTS triggers (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                match_mode TEXT DEFAULT 'exact',
                image_url TEXT DEFAULT NULL
            )
        `);

        // Table: bot_settings
        db.run(`
            CREATE TABLE IF NOT EXISTS bot_settings (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                bot_name TEXT,
                owner_name TEXT,
                owner_numbers TEXT,
                prefix TEXT,
                no_prefix INTEGER DEFAULT 1,
                verified_quoted INTEGER DEFAULT 0,
                channel_link TEXT,
                presence_status TEXT DEFAULT 'composing',
                work_hours_enabled INTEGER DEFAULT 0,
                work_start_time TEXT DEFAULT '08:00',
                work_end_time TEXT DEFAULT '22:00',
                work_days TEXT,
                offline_message TEXT,
                auto_read INTEGER DEFAULT 1,
                menu_title TEXT DEFAULT 'BOT KUCAI AKUN',
                menu_body TEXT DEFAULT 'Halo! Gunakan panel untuk mengonfigurasi fitur bot.'
            )
        `);

        // Insert default settings if empty
        db.get("SELECT COUNT(*) as count FROM bot_settings WHERE id = 1", [], (err, row) => {
            if (!err && row.count === 0) {
                db.run(`
                    INSERT INTO bot_settings (
                        id, bot_name, owner_name, owner_numbers, prefix, no_prefix, 
                        verified_quoted, channel_link, presence_status, work_hours_enabled, 
                        work_start_time, work_end_time, work_days, offline_message, auto_read,
                        menu_title, menu_body
                    ) VALUES (
                        1, 
                        'BOT KUCAI AKUN', 
                        'Alvin Kucai', 
                        '["6283140021959", "79658775265356", "628999991950"]', 
                        '[".", "#", "!", "/"]', 
                        1, 
                        0, 
                        'https://whatsapp.com/channel/0029VbD8Wx9545uqEqWnPY3E', 
                        'composing', 
                        0, 
                        '08:00', 
                        '22:00', 
                        '["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]', 
                        'Halo Kak! Mohon maaf saat ini toko kami sedang Offline/Tutup. Pesan Anda akan dibalas segera setelah kami kembali aktif.', 
                        1,
                        'BOT KUCAI AKUN',
                        'Halo! Gunakan panel untuk mengonfigurasi fitur bot.'
                    )
                `);
            } else {
                // Ensure columns exist on older DB creations
                db.run("ALTER TABLE bot_settings ADD COLUMN menu_title TEXT DEFAULT 'BOT KUCAI AKUN'", () => {});
                db.run("ALTER TABLE bot_settings ADD COLUMN menu_body TEXT DEFAULT 'Halo! Gunakan panel untuk mengonfigurasi fitur bot.'", () => {});
            }
        });

        // Table: bot_connection
        db.run(`
            CREATE TABLE IF NOT EXISTS bot_connection (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                status TEXT DEFAULT 'disconnected',
                phone_number TEXT,
                bot_number TEXT,
                pairing_code TEXT,
                action TEXT,
                reason TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Table: changelogs
        db.run(`
            CREATE TABLE IF NOT EXISTS changelogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                version TEXT NOT NULL,
                date TEXT NOT NULL,
                type TEXT NOT NULL, -- IMPROVEMENT, FITUR, BUGFIX
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                details TEXT, -- JSON array of strings
                is_latest INTEGER DEFAULT 0
            )
        `);

        // Insert default changelogs if table is empty
        db.get("SELECT COUNT(*) as count FROM changelogs", [], (err, row) => {
            if (!err && row.count === 0) {
                db.run(`
                    INSERT INTO changelogs (version, date, type, title, description, details, is_latest)
                    VALUES 
                    (
                        'v4.11.0', 
                        '28 Juni 2026', 
                        'IMPROVEMENT', 
                        'Indikator saat pindah halaman', 
                        'Sekarang ada bar tipis di atas yang muncul saat halaman dimuat, jadi kamu tahu klikmu sudah masuk walau respon agak lambat.', 
                        '["Bar progress tipis di bagian atas saat berpindah halaman dashboard", "Hilang otomatis begitu halaman selesai dimuat"]',
                        1
                    ),
                    (
                        'v4.10.2', 
                        '21 Juni 2026', 
                        'IMPROVEMENT', 
                        'Peningkatan kecil', 
                        'Beberapa penyempurnaan biar makin nyaman dipakai.', 
                        '["Tambah template event antikudeta dengan variabel nama bot dan pelaku", "Filter dan pencarian di daftar kini diingat saat kamu kembali dari halaman detail", "Perbaikan tampilan di mobile (tombol pagination dan aksi header tidak lagi melebar)"]',
                        0
                    ),
                    (
                        'v4.10.1', 
                        '19 Juni 2026', 
                        'FITUR', 
                        'Kelola sesi & perangkat login', 
                        'Kelola dan pantau sesi perangkat WhatsApp yang terhubung secara realtime melalui panel.', 
                        '["Lihat daftar perangkat aktif", "Tombol Hapus Sesi / logout sekali klik"]',
                        0
                    )
                `);
            }
        });

        // Table: transactions
        db.run(`
            CREATE TABLE IF NOT EXISTS transactions (
                order_id TEXT PRIMARY KEY,
                amount INTEGER NOT NULL,
                status TEXT DEFAULT 'pending',
                payment_url TEXT,
                qris_data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Insert default connection if empty
        db.get("SELECT COUNT(*) as count FROM bot_connection WHERE id = 1", [], (err, row) => {
            if (!err && row.count === 0) {
                db.run("INSERT INTO bot_connection (id, status) VALUES (1, 'disconnected')");
            }
            
            // Ensure columns exist on older DB creations
            db.run("ALTER TABLE bot_settings ADD COLUMN menu_title TEXT DEFAULT 'BOT KUCAI AKUN'", () => {});
            db.run("ALTER TABLE bot_settings ADD COLUMN menu_body TEXT DEFAULT 'Halo! Gunakan panel untuk mengonfigurasi fitur bot.'", () => {});
            db.run("ALTER TABLE bot_settings ADD COLUMN maker_menu_active INTEGER DEFAULT 0", () => {});
            
            // Mark database initialization completed
            resolveReady();
        });
    });
}

// Helper methods as promises
const query = {
    get: (sql, params = []) => new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
    }),
    all: (sql, params = []) => new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
    }),
    run: (sql, params = []) => new Promise((resolve, reject) => {
        db.run(sql, params, function(err) { err ? reject(err) : resolve(this); });
    })
};

module.exports = { db, query, dbReady };
