// ===== SUBDOMAIN SCANNER =====
const domainInput = document.getElementById('domainInput');
const searchBtn = document.getElementById('searchBtn');
const resultsArea = document.getElementById('resultsArea');
const resultsContent = document.getElementById('resultsContent');
const countBadge = document.getElementById('countBadge');

async function scanSubdomain() {
    let domain = domainInput.value.trim();
    
    if (!domain) {
        alert('Masukkan domain!');
        return;
    }
    
    // Remove protocol if exists
    domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    // Show loading
    resultsArea.style.display = 'block';
    resultsContent.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>scanning subdomains for ${domain}...</p>
        </div>
    `;
    countBadge.textContent = '...';
    
    try {
        const response = await fetch(`/api/subdomain?domain=${encodeURIComponent(domain)}`);
        const data = await response.json();
        
        if (data.error) {
            resultsContent.innerHTML = `<div class="error-message">${data.error}<small>try another domain</small></div>`;
            countBadge.textContent = '0';
            return;
        }
        
        const subdomains = data.subdomains || [];
        const total = subdomains.length;
        
        countBadge.textContent = total;
        
        if (total === 0) {
            resultsContent.innerHTML = `
                <div class="error-message">
                    no subdomains found for ${domain}
                    <small>try another domain or check later</small>
                </div>
            `;
            return;
        }
        
        // Group by subdomain level
        const grouped = {};
        subdomains.forEach(sub => {
            const parts = sub.split('.');
            const level = parts.length - 2;
            if (!grouped[level]) grouped[level] = [];
            grouped[level].push(sub);
        });
        
        // Render results
        let html = '';
        
        for (const [level, subs] of Object.entries(grouped).sort((a,b) => parseInt(a[0]) - parseInt(b[0]))) {
            const lvl = parseInt(level);
            const levelName = lvl === 0 ? 'main domain' : `${lvl}${lvl === 1 ? 'st' : lvl === 2 ? 'nd' : lvl === 3 ? 'rd' : 'th'} level subdomains`;
            
            html += `
                <div class="level-group">
                    <div class="level-title">${levelName} (${subs.length})</div>
            `;
            subs.sort().forEach(sub => {
                html += `
                    <div class="subdomain-item">
                        <a href="https://${sub}" target="_blank" rel="noopener noreferrer">${sub}</a>
                    </div>
                `;
            });
            html += `</div>`;
        }
        
        resultsContent.innerHTML = html;
        
    } catch (err) {
        resultsContent.innerHTML = `<div class="error-message">error: ${err.message}<small>check console for details</small></div>`;
        countBadge.textContent = '0';
    }
}

// Event listeners
if (searchBtn) {
    searchBtn.addEventListener('click', scanSubdomain);
}
if (domainInput) {
    domainInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') scanSubdomain();
    });
}

// Auto scan on load if domain is preset
setTimeout(() => {
    if (domainInput && domainInput.value) {
        scanSubdomain();
    }
}, 500);
