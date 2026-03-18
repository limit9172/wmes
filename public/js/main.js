const teamData = [
    {
        name: './Mr-Rubic',
        role: 'founder & bug hunter',
        motto: 'melihat yang tak terlihat. data adalah bayangan',
        avatar: 'https://files.catbox.moe/haxm0f.jpg'
    },
    {
        name: 'ZenithxNecxus',
        role: 'admin & bug hunter',
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
    }
];

// ===== RENDER TEAM =====
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

// ===== LOADER =====
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1000);
    }
});

// ===== SMOOTH SCROLL =====
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

// ===== SCROLL SPY =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    renderTeam();
});
