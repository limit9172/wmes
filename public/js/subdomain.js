const domainInput = document.getElementById('domainInput');
const searchBtn = document.getElementById('searchBtn');
const resultsArea = document.getElementById('resultsArea');
const resultsContent = document.getElementById('resultsContent');
const countBadge = document.getElementById('countBadge');

async function scanSubdomain() {
    let domain = domainInput.value.trim();
    
    if (!domain) {
        alert('masukin domain bray');
        return;
    }
    
    domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
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
            resultsContent.innerHTML = `<div class="error-message">${data.error}</div>`;
            countBadge.textContent = '0';
            return;
        }
        
        const subdomains = data.subdomains || [];
        const total = subdomains.length;
        
        countBadge.textContent = total;
        
        if (total === 0) {
            resultsContent.innerHTML = `<div class="error-message">no subdomains found for ${domain}</div>`;
            return;
        }
        
        let html = '';
        subdomains.forEach(sub => {
            html += `
                <div class="subdomain-item">
                    <a href="https://${sub}" target="_blank" rel="noopener noreferrer">${sub}</a>
                </div>
            `;
        });
        resultsContent.innerHTML = html;
        
    } catch (err) {
        console.error('Error:', err);
        resultsContent.innerHTML = `<div class="error-message">error: ${err.message}</div>`;
        countBadge.textContent = '0';
    }
}

if (searchBtn) {
    searchBtn.addEventListener('click', scanSubdomain);
}
if (domainInput) {
    domainInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') scanSubdomain();
    });
}


setTimeout(() => {
    if (domainInput && domainInput.value) {
        scanSubdomain();
    }
}, 500);
