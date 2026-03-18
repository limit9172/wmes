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
        nama: 'Lizarus',
        role: 'admin',
        motto:'kami masuk tanpa izin, keluar tanpa jejak—meninggalkan pelajaran, bukan luka',
        avatar: 'https://files.catbox.moe/2rkywj.jpg'
    },
    {
        nama: './Mr-Shahed',
        role: 'aadmin',
        motto: 'Kami bukan ancaman, kami adalah bayangan yang mengingatkan bahwa keamanan itu ilusi',
        avatar: 'https://files.catbox.moe/1b16ah.jpg'
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


window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1000);
    }
});


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


document.addEventListener('DOMContentLoaded', () => {
    renderTeam();
});
