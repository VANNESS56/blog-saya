const fs = require('fs-extra');
const path = require('path');

const defaultSettings = {
    botName: "BOT KUCAI AKUN",
    ownerName: "Alvin Kucai",
    ownerNumbers: ["6283140021959", "79658775265356", "628999991950"],
    prefix: [".", "#", "!", "/"],
    noPrefix: true,
    pairingCode: true,
    customPairingCode: "",
    channelLink: "https://whatsapp.com/channel/0029VbD8Wx9545uqEqWnPY3E",
    phoneNumber: "",
    presenceStatus: "composing", // 'composing' (Mengetik), 'recording' (Merekam), atau 'disabled' (Mati)
    workHoursEnabled: false,
    workStartTime: "08:00",
    workEndTime: "22:00",
    workDays: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    offlineMessage: "Halo Kak! Mohon maaf saat ini toko kami sedang Offline/Tutup. Pesan Anda akan dibalas segera setelah kami kembali aktif.",
    autoRead: true,
    vercelUrl: "https://bot-gt2-admin.vercel.app",
    supabaseUrl: "https://kswvikgwuihzxfyxyxqq.supabase.co",
    supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzd3Zpa2d3dWloenhmeXh5eHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTY5MjAsImV4cCI6MjA5ODU3MjkyMH0.-Oe8wGdw5OUVIfECyYocWMi4Qok1NTpPEoTP1xVHB54"
};

const dynamicSettingsPath = path.join(__dirname, 'database', 'bot_settings.json');
let mergedSettings = { ...defaultSettings };

if (fs.existsSync(dynamicSettingsPath)) {
    try {
        const dynamicSettings = fs.readJsonSync(dynamicSettingsPath);
        mergedSettings = { ...defaultSettings, ...dynamicSettings };
    } catch (e) {
        console.error('Gagal membaca file dynamic settings.js:', e.message);
    }
}

module.exports = mergedSettings;
