const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// ===== KONFIGURASI =====
const PORT = 3000;
const DOMAIN = 'wmes.my.id'; 
const PUBLIC_DIR = path.join(__dirname, 'public');


app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
    next();
});


app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

app.use((req, res, next) => {
    if (req.url.match(/\.(js|css|html|json)$/)) {
        const referer = req.headers.referer || '';
        
        
        if (referer.includes('localhost') || 
            referer.includes(DOMAIN) ||
            referer.includes('127.0.0.1')) {
            return next();
        }
        
        
        console.log(`[BLOCKED] ${req.ip} mencoba akses ${req.url}`);
        return res.status(403).sendFile(path.join(PUBLIC_DIR, '403.html'));
    }
    next();
});


const requestCounts = {};
const WINDOW_MS = 15 * 60 * 1000; 
const MAX_REQUESTS = 100;

app.use((req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requestCounts[ip]) {
        requestCounts[ip] = [];
    }
    
    // Hapus request lama
    requestCounts[ip] = requestCounts[ip].filter(timestamp => 
        now - timestamp < WINDOW_MS
    );
    
    // Cek apakah melebihi batas
    if (requestCounts[ip].length >= MAX_REQUESTS) {
        console.log(`[RATE LIMIT] ${ip} melebihi batas`);
        return res.status(429).send('Too many requests');
    }
    
    // Catat request
    requestCounts[ip].push(now);
    next();
});


app.use(express.static(PUBLIC_DIR));

app.use((req, res) => {
    res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

app.get('/admin*', (req, res) => {
    res.status(403).sendFile(path.join(PUBLIC_DIR, '403.html'));
});


app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.stack}`);
    res.status(500).sendFile(path.join(PUBLIC_DIR, '500.html'));
});


app.listen(PORT, () => {
    console.log(`🚀 WMES running on http://localhost:${PORT}`);
    console.log(`📁 Serving from: ${PUBLIC_DIR}`);
    console.log(`🔒 Domain: ${DOMAIN}`);
    console.log(`📝 Error pages: 404.html, 403.html, 500.html`);
    
    // Cek apakah file error pages ada
    const requiredFiles = ['404.html', '403.html', '500.html'];
    requiredFiles.forEach(file => {
        const filePath = path.join(PUBLIC_DIR, file);
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️  File ${file} tidak ditemukan di ${PUBLIC_DIR}`);
        } else {
            console.log(`✅ ${file} siap`);
        }
    });
});