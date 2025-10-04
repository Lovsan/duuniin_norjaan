// Analytics Tracking System
class Analytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.sessionStart = Date.now();
        this.interactions = [];
        this.pageViews = [];
        this.init();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        // Track page load
        this.trackPageView(window.location.pathname);
        
        // Track clicks
        document.addEventListener('click', (e) => this.trackClick(e));
        
        // Track form submissions
        document.addEventListener('submit', (e) => this.trackFormSubmit(e));
        
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
            if (scrollPercent > maxScroll) {
                maxScroll = Math.floor(scrollPercent);
                this.trackScroll(maxScroll);
            }
        });
        
        // Track time on page
        window.addEventListener('beforeunload', () => this.trackTimeOnPage());
        
        // Track user location (approximate)
        this.trackLocation();
    }

    trackPageView(page) {
        const data = {
            type: 'pageview',
            page: page,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language
        };
        
        this.pageViews.push(data);
        this.sendToServer(data);
    }

    trackClick(event) {
        const target = event.target;
        const data = {
            type: 'click',
            element: target.tagName,
            text: target.textContent?.substring(0, 50) || '',
            href: target.href || '',
            id: target.id || '',
            class: target.className || '',
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            x: event.clientX,
            y: event.clientY
        };
        
        this.interactions.push(data);
        this.sendToServer(data);
    }

    trackFormSubmit(event) {
        const form = event.target;
        const data = {
            type: 'form_submit',
            formId: form.id || 'unknown',
            formAction: form.action || '',
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        };
        
        this.interactions.push(data);
        this.sendToServer(data);
    }

    trackScroll(percent) {
        // Only track milestones: 25%, 50%, 75%, 100%
        if (percent === 25 || percent === 50 || percent === 75 || percent === 100) {
            const data = {
                type: 'scroll',
                depth: percent,
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId
            };
            
            this.interactions.push(data);
            this.sendToServer(data);
        }
    }

    trackTimeOnPage() {
        const timeSpent = Math.floor((Date.now() - this.sessionStart) / 1000);
        const data = {
            type: 'time_on_page',
            duration: timeSpent,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            totalInteractions: this.interactions.length
        };
        
        this.sendToServer(data);
    }

    async trackLocation() {
        try {
            // Using a free IP geolocation API
            const response = await fetch('https://ipapi.co/json/');
            const locationData = await response.json();
            
            const data = {
                type: 'location',
                country: locationData.country_name || 'Unknown',
                city: locationData.city || 'Unknown',
                region: locationData.region || 'Unknown',
                countryCode: locationData.country_code || 'XX',
                ip: locationData.ip || 'Unknown',
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId
            };
            
            this.sendToServer(data);
        } catch (error) {
            console.log('Could not fetch location data');
        }
    }

    sendToServer(data) {
        // Store in localStorage for admin dashboard (in production, send to actual server)
        const existingData = JSON.parse(localStorage.getItem('analyticsData') || '[]');
        existingData.push(data);
        
        // Keep only last 1000 events to prevent localStorage overflow
        if (existingData.length > 1000) {
            existingData.shift();
        }
        
        localStorage.setItem('analyticsData', JSON.stringify(existingData));
        
        // In production, you would send to a server:
        // fetch('/api/analytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // }).catch(err => console.log('Analytics error:', err));
    }

    static getAnalyticsData() {
        return JSON.parse(localStorage.getItem('analyticsData') || '[]');
    }

    static getStats() {
        const data = this.getAnalyticsData();
        const sessions = [...new Set(data.map(d => d.sessionId))];
        
        const stats = {
            totalSessions: sessions.length,
            totalPageViews: data.filter(d => d.type === 'pageview').length,
            totalClicks: data.filter(d => d.type === 'click').length,
            totalFormSubmits: data.filter(d => d.type === 'form_submit').length,
            avgTimeOnPage: 0,
            locations: {},
            browsers: {},
            devices: {},
            recentActivity: data.slice(-20).reverse()
        };
        
        // Calculate average time on page
        const timeEvents = data.filter(d => d.type === 'time_on_page');
        if (timeEvents.length > 0) {
            const totalTime = timeEvents.reduce((sum, e) => sum + e.duration, 0);
            stats.avgTimeOnPage = Math.floor(totalTime / timeEvents.length);
        }
        
        // Count locations
        data.filter(d => d.type === 'location').forEach(d => {
            const country = d.country || 'Unknown';
            stats.locations[country] = (stats.locations[country] || 0) + 1;
        });
        
        // Parse user agents (simplified)
        data.filter(d => d.userAgent).forEach(d => {
            const ua = d.userAgent;
            if (ua.includes('Chrome')) stats.browsers['Chrome'] = (stats.browsers['Chrome'] || 0) + 1;
            else if (ua.includes('Firefox')) stats.browsers['Firefox'] = (stats.browsers['Firefox'] || 0) + 1;
            else if (ua.includes('Safari')) stats.browsers['Safari'] = (stats.browsers['Safari'] || 0) + 1;
            else stats.browsers['Other'] = (stats.browsers['Other'] || 0) + 1;
            
            if (ua.includes('Mobile')) stats.devices['Mobile'] = (stats.devices['Mobile'] || 0) + 1;
            else stats.devices['Desktop'] = (stats.devices['Desktop'] || 0) + 1;
        });
        
        return stats;
    }
}

// Initialize analytics on page load
let analytics;
if (typeof window !== 'undefined') {
    analytics = new Analytics();
}
