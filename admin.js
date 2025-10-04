// Admin Dashboard JavaScript

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
}

// Handle login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in production, this should be server-side)
    if (username === 'admin' && password === 'admin123') {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
    } else {
        alert('Invalid credentials. Try username: admin, password: admin123');
    }
});

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadDashboardData();
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
}

function loadDashboardData() {
    const stats = Analytics.getStats();
    
    // Update summary stats
    document.getElementById('totalSessions').textContent = stats.totalSessions.toLocaleString();
    document.getElementById('totalPageViews').textContent = stats.totalPageViews.toLocaleString();
    document.getElementById('totalClicks').textContent = stats.totalClicks.toLocaleString();
    document.getElementById('totalForms').textContent = stats.totalFormSubmits.toLocaleString();
    document.getElementById('avgTime').textContent = formatTime(stats.avgTimeOnPage);
    
    // Render charts
    renderLocationChart(stats.locations);
    renderBrowserChart(stats.browsers);
    renderDeviceChart(stats.devices);
    renderRecentActivity(stats.recentActivity);
}

function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
}

function renderLocationChart(locations) {
    const container = document.getElementById('locationChart');
    if (Object.keys(locations).length === 0) {
        container.innerHTML = '<p class="no-data">No location data yet</p>';
        return;
    }
    
    let html = '<div class="bar-chart">';
    const maxValue = Math.max(...Object.values(locations));
    
    for (const [country, count] of Object.entries(locations).sort((a, b) => b[1] - a[1])) {
        const percentage = (count / maxValue) * 100;
        html += `
            <div class="bar-item">
                <div class="bar-label">${country}</div>
                <div class="bar-wrapper">
                    <div class="bar" style="width: ${percentage}%"></div>
                    <div class="bar-value">${count}</div>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function renderBrowserChart(browsers) {
    const container = document.getElementById('browserChart');
    if (Object.keys(browsers).length === 0) {
        container.innerHTML = '<p class="no-data">No browser data yet</p>';
        return;
    }
    
    let html = '<div class="pie-chart-legend">';
    const total = Object.values(browsers).reduce((a, b) => a + b, 0);
    
    for (const [browser, count] of Object.entries(browsers).sort((a, b) => b[1] - a[1])) {
        const percentage = Math.round((count / total) * 100);
        html += `
            <div class="legend-item">
                <span class="legend-color" style="background: ${getBrowserColor(browser)}"></span>
                <span class="legend-text">${browser}: ${count} (${percentage}%)</span>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function renderDeviceChart(devices) {
    const container = document.getElementById('deviceChart');
    if (Object.keys(devices).length === 0) {
        container.innerHTML = '<p class="no-data">No device data yet</p>';
        return;
    }
    
    let html = '<div class="pie-chart-legend">';
    const total = Object.values(devices).reduce((a, b) => a + b, 0);
    
    for (const [device, count] of Object.entries(devices).sort((a, b) => b[1] - a[1])) {
        const percentage = Math.round((count / total) * 100);
        html += `
            <div class="legend-item">
                <span class="legend-color" style="background: ${getDeviceColor(device)}"></span>
                <span class="legend-text">${device}: ${count} (${percentage}%)</span>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function renderRecentActivity(activities) {
    const container = document.getElementById('recentActivity');
    if (!activities || activities.length === 0) {
        container.innerHTML = '<p class="no-data">No recent activity</p>';
        return;
    }
    
    let html = '<div class="activity-items">';
    
    activities.forEach(activity => {
        const time = new Date(activity.timestamp).toLocaleString();
        const icon = getActivityIcon(activity.type);
        const description = getActivityDescription(activity);
        
        html += `
            <div class="activity-item">
                <div class="activity-icon">${icon}</div>
                <div class="activity-details">
                    <div class="activity-desc">${description}</div>
                    <div class="activity-time">${time}</div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function getActivityIcon(type) {
    const icons = {
        'pageview': '📄',
        'click': '🖱️',
        'form_submit': '📝',
        'scroll': '📜',
        'time_on_page': '⏱️',
        'location': '🌍'
    };
    return icons[type] || '📌';
}

function getActivityDescription(activity) {
    switch (activity.type) {
        case 'pageview':
            return `Page view: ${activity.page}`;
        case 'click':
            return `Clicked on ${activity.element}: "${activity.text.substring(0, 30)}..."`;
        case 'form_submit':
            return `Form submitted: ${activity.formId}`;
        case 'scroll':
            return `Scrolled to ${activity.depth}%`;
        case 'time_on_page':
            return `Spent ${formatTime(activity.duration)} on page`;
        case 'location':
            return `Visitor from ${activity.city}, ${activity.country}`;
        default:
            return 'Unknown activity';
    }
}

function getBrowserColor(browser) {
    const colors = {
        'Chrome': '#4285f4',
        'Firefox': '#ff7139',
        'Safari': '#00bcd4',
        'Edge': '#0078d7',
        'Other': '#9e9e9e'
    };
    return colors[browser] || '#9e9e9e';
}

function getDeviceColor(device) {
    const colors = {
        'Desktop': '#4caf50',
        'Mobile': '#ff9800',
        'Tablet': '#9c27b0'
    };
    return colors[device] || '#9e9e9e';
}

function refreshDashboard() {
    loadDashboardData();
    alert('Dashboard refreshed!');
}

function exportData() {
    const data = Analytics.getAnalyticsData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Initialize on page load
checkAuth();
