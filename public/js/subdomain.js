async function scanSubdomain() {
    let domain = domainInput.value.trim();
    
    if (!domain) {
        alert('Masukkan domain!');
        return;
    }
    
    domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    resultsArea.style.display = 'block';
    resultsContent.innerHTML = `<div class="loading"><div class="loading-spinner"></div><p>scanning...</p></div>`;
    countBadge.textContent = '...';
    
    try {
        // Panggil API sendiri
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
            resultsContent.innerHTML = `<div class="error-message">no subdomains found</div>`;
            return;
        }
        
        // Render results
        let html = '';
        subdomains.forEach(sub => {
            html += `<div class="subdomain-item"><a href="https://${sub}" target="_blank">${sub}</a></div>`;
        });
        resultsContent.innerHTML = html;
        
    } catch (err) {
        resultsContent.innerHTML = `<div class="error-message">error: ${err.message}</div>`;
        countBadge.textContent = '0';
    }
}
