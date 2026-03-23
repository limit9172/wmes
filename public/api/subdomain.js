export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { domain } = req.query;
    
    if (!domain) {
        return res.status(400).json({ error: 'Domain parameter required' });
    }
    
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
        return res.status(400).json({ error: 'Invalid domain format' });
    }
    
    try {
        const url = `https://crt.sh/?q=%25.${domain}&output=json`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract subdomains dari response
        const subdomains = new Set();
        
        for (const item of data) {
            const nameValue = item.name_value || '';
            const parts = nameValue.split('\n');
            
            for (const part of parts) {
                const sub = part.trim();
                if (sub && sub.endsWith(domain) && sub !== domain) {
                    subdomains.add(sub);
                }
            }
        }
        
        const sorted = Array.from(subdomains).sort();
        
        return res.status(200).json({
            success: true,
            domain: domain,
            total: sorted.length,
            subdomains: sorted
        });
        
    } catch (error) {
        console.error('Error fetching from crt.sh:', error);
        return res.status(500).json({
            error: 'Failed to fetch subdomains',
            message: error.message
        });
    }
}
