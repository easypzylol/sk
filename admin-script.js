// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    const lastLoginTime = localStorage.getItem('adminLastLogin');
    
    if (adminLoggedIn === 'true') {
        showAdminDashboard();
        if (lastLoginTime) {
            console.log('Last login:', new Date(lastLoginTime).toLocaleString());
        }
    } else {
        document.getElementById('loginScreen').style.display = 'block';
    }
    
    // Default admin credentials
    if (!localStorage.getItem('adminCredentials')) {
        localStorage.setItem('adminCredentials', JSON.stringify({
            username: 'admin',
            password: 'admin123'
        }));
    }
    
    // Set up login form
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            
            if (authenticateAdmin(username, password)) {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminLastLogin', new Date().toISOString());
                showAdminDashboard();
                showNotification('Admin login successful!', 'success');
            } else {
                showNotification('Invalid credentials!', 'error');
            }
        });
    }
    
    // Load initial data
    loadAdminData();
});

// Authentication
function authenticateAdmin(username, password) {
    const credentials = JSON.parse(localStorage.getItem('adminCredentials'));
    return credentials.username === username && credentials.password === password;
}

// Show admin dashboard
function showAdminDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    
    loadGameData();
    loadGuesserList();
    loadPremiumList();
    loadContactData();
    loadAdData();
}

// Logout function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    location.reload();
}

// Load game data
function loadGameData() {
    const gameId = document.getElementById('gameSelect').value;
    const games = JSON.parse(localStorage.getItem('matkaGames')) || [];
    const game = games.find(g => g.id == gameId);
    
    if (game) {
        document.getElementById('gameName').value = game.name;
        document.getElementById('gameTime').value = game.time;
        document.getElementById('gameYesterday').value = game.yesterday || '';
    }
}

// Update game
function updateGame() {
    const gameId = parseInt(document.getElementById('gameSelect').value);
    const gameName = document.getElementById('gameName').value.trim();
    const gameTime = document.getElementById('gameTime').value.trim();
    const gameYesterday = document.getElementById('gameYesterday').value.trim();
    
    if (!gameName || !gameTime) {
        showNotification('Game name and time are required!', 'error');
        return;
    }
    
    let games = JSON.parse(localStorage.getItem('matkaGames')) || [];
    const gameIndex = games.findIndex(g => g.id === gameId);
    
    if (gameIndex === -1) {
        showNotification('Game not found!', 'error');
        return;
    }
    
    // Update game details
    games[gameIndex].name = gameName;
    games[gameIndex].time = gameTime;
    
    if (gameYesterday) {
        const yesterdayNumber = parseInt(gameYesterday);
        if (!isNaN(yesterdayNumber) && yesterdayNumber >= 0 && yesterdayNumber <= 99) {
            games[gameIndex].yesterday = yesterdayNumber;
        }
    }
    
    localStorage.setItem('matkaGames', JSON.stringify(games));
    showNotification('Game updated successfully!', 'success');
}

// Load guesser list
function loadGuesserList() {
    const guessers = JSON.parse(localStorage.getItem('matkaGuessers')) || [];
    const guesserList = document.getElementById('guesserList');
    
    if (!guesserList) return;
    
    guesserList.innerHTML = '';
    
    guessers.forEach(guesser => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${guesser.id}</td>
            <td>${guesser.name}</td>
            <td>
                <span class="${guesser.status === 'active' ? 'active-status' : 'inactive-status'}">
                    ${guesser.status}
                </span>
            </td>
            <td>
                <button onclick="toggleGuesserStatus('${guesser.id}')" class="btn btn-small ${guesser.status === 'active' ? 'btn-warning' : 'btn-success'}">
                    ${guesser.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button onclick="deleteGuesser('${guesser.id}')" class="btn btn-small btn-danger">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        guesserList.appendChild(row);
    });
}

// Create guesser
function createGuesser() {
    const guesserId = document.getElementById('guesserId').value.trim();
    const guesserName = document.getElementById('guesserName').value.trim();
    const password = document.getElementById('guesserPassword').value.trim();
    
    if (!guesserId || !guesserName || !password) {
        showNotification('All fields are required!', 'error');
        return;
    }
    
    let guessers = JSON.parse(localStorage.getItem('matkaGuessers')) || [];
    
    // Check if ID already exists
    if (guessers.some(g => g.id === guesserId)) {
        showNotification('Guesser ID already exists!', 'error');
        return;
    }
    
    // Add new guesser
    guessers.push({
        id: guesserId,
        name: guesserName,
        password: password,
        status: 'active',
        rating: 4.5,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('matkaGuessers', JSON.stringify(guessers));
    
    // Clear form
    document.getElementById('guesserId').value = '';
    document.getElementById('guesserName').value = '';
    document.getElementById('guesserPassword').value = '';
    
    showNotification(`Guesser ${guesserId} created successfully!`, 'success');
    loadGuesserList();
}

// Toggle guesser status
function toggleGuesserStatus(guesserId) {
    let guessers = JSON.parse(localStorage.getItem('matkaGuessers')) || [];
    const guesserIndex = guessers.findIndex(g => g.id === guesserId);
    
    if (guesserIndex !== -1) {
        guessers[guesserIndex].status = guessers[guesserIndex].status === 'active' ? 'inactive' : 'active';
        localStorage.setItem('matkaGuessers', JSON.stringify(guessers));
        loadGuesserList();
        showNotification('Guesser status updated!', 'success');
    }
}

// Delete guesser
function deleteGuesser(guesserId) {
    if (!confirm('Delete this guesser?')) return;
    
    let guessers = JSON.parse(localStorage.getItem('matkaGuessers')) || [];
    guessers = guessers.filter(g => g.id !== guesserId);
    localStorage.setItem('matkaGuessers', JSON.stringify(guessers));
    
    // Also delete their predictions
    let predictions = JSON.parse(localStorage.getItem('matkaPredictions') || '[]');
    predictions = predictions.filter(p => p.guesserId !== guesserId);
    localStorage.setItem('matkaPredictions', JSON.stringify(predictions));
    
    showNotification('Guesser deleted!', 'success');
    loadGuesserList();
}

// Load premium list
function loadPremiumList() {
    const premium = JSON.parse(localStorage.getItem('matkaPremium')) || [];
    const premiumList = document.getElementById('premiumList');
    
    if (!premiumList) return;
    
    premiumList.innerHTML = '';
    
    premium.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>
                <span class="${user.status === 'active' ? 'active-status' : 'inactive-status'}">
                    ${user.status}
                </span>
            </td>
            <td>
                <button onclick="togglePremiumStatus('${user.id}')" class="btn btn-small ${user.status === 'active' ? 'btn-warning' : 'btn-success'}">
                    ${user.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button onclick="deletePremium('${user.id}')" class="btn btn-small btn-danger">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        premiumList.appendChild(row);
    });
}

// Create premium user
function createPremium() {
    const premiumId = document.getElementById('premiumId').value.trim();
    const premiumName = document.getElementById('premiumName').value.trim();
    const password = document.getElementById('premiumPassword').value.trim();
    
    if (!premiumId || !premiumName || !password) {
        showNotification('All fields are required!', 'error');
        return;
    }
    
    let premium = JSON.parse(localStorage.getItem('matkaPremium')) || [];
    
    if (premium.some(p => p.id === premiumId)) {
        showNotification('Premium ID already exists!', 'error');
        return;
    }
    
    premium.push({
        id: premiumId,
        name: premiumName,
        password: password,
        status: 'active',
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('matkaPremium', JSON.stringify(premium));
    
    document.getElementById('premiumId').value = '';
    document.getElementById('premiumName').value = '';
    document.getElementById('premiumPassword').value = '';
    
    showNotification(`Premium user ${premiumId} created!`, 'success');
    loadPremiumList();
}

// Toggle premium status
function togglePremiumStatus(userId) {
    let premium = JSON.parse(localStorage.getItem('matkaPremium')) || [];
    const userIndex = premium.findIndex(p => p.id === userId);
    
    if (userIndex !== -1) {
        premium[userIndex].status = premium[userIndex].status === 'active' ? 'inactive' : 'active';
        localStorage.setItem('matkaPremium', JSON.stringify(premium));
        loadPremiumList();
        showNotification('Premium user status updated!', 'success');
    }
}

// Delete premium user
function deletePremium(userId) {
    if (!confirm('Delete this premium user?')) return;
    
    let premium = JSON.parse(localStorage.getItem('matkaPremium')) || [];
    premium = premium.filter(p => p.id !== userId);
    localStorage.setItem('matkaPremium', JSON.stringify(premium));
    
    showNotification('Premium user deleted!', 'success');
    loadPremiumList();
}

// Load contact data
function loadContactData() {
    const contacts = JSON.parse(localStorage.getItem('matkaContacts')) || [];
    
    contacts.forEach(contact => {
        switch(contact.platform) {
            case 'Telegram Group':
                document.getElementById('telegramGroup').value = contact.url;
                break;
            case 'WhatsApp Support':
                document.getElementById('whatsappSupport').value = contact.url;
                break;
            case 'Khaiwal Telegram':
                document.getElementById('khaiwalTelegram').value = contact.url;
                break;
            case 'Support Email':
                document.getElementById('supportEmail').value = contact.url;
                break;
        }
    });
}

// Update contacts
function updateContacts() {
    const contacts = [
        { platform: 'Telegram Group', url: document.getElementById('telegramGroup').value.trim(), icon: 'fab fa-telegram' },
        { platform: 'WhatsApp Support', url: document.getElementById('whatsappSupport').value.trim(), icon: 'fab fa-whatsapp' },
        { platform: 'Khaiwal Telegram', url: document.getElementById('khaiwalTelegram').value.trim(), icon: 'fab fa-telegram' },
        { platform: 'Support Email', url: document.getElementById('supportEmail').value.trim(), icon: 'fas fa-envelope' }
    ];
    
    localStorage.setItem('matkaContacts', JSON.stringify(contacts));
    showNotification('Contact links updated!', 'success');
}

// Load ad data
function loadAdData() {
    const ads = JSON.parse(localStorage.getItem('matkaAds')) || {};
    
    if (ads.topBanner) {
        document.getElementById('topBannerAd').value = ads.topBanner;
    }
    if (ads.sidebar) {
        document.getElementById('sidebarAd').value = ads.sidebar;
    }
    if (ads.rectangle) {
        document.getElementById('rectangleAd').value = ads.rectangle;
    }
}

// Update ads
function updateAds() {
    const ads = {
        topBanner: document.getElementById('topBannerAd').value.trim(),
        sidebar: document.getElementById('sidebarAd').value.trim(),
        rectangle: document.getElementById('rectangleAd').value.trim()
    };
    
    localStorage.setItem('matkaAds', JSON.stringify(ads));
    showNotification('Ads updated successfully!', 'success');
}

// Save historical result
function saveHistoricalResult() {
    const date = document.getElementById('resultDate').value;
    const gameId = parseInt(document.getElementById('resultGame').value);
    const number = document.getElementById('resultNumber').value.trim();
    
    if (!date || !number) {
        showNotification('Date and number are required!', 'error');
        return;
    }
    
    const resultNumber = parseInt(number);
    if (isNaN(resultNumber) || resultNumber < 0 || resultNumber > 99) {
        showNotification('Please enter a valid number (00-99)!', 'error');
        return;
    }
    
    let games = JSON.parse(localStorage.getItem('matkaGames')) || [];
    const gameIndex = games.findIndex(g => g.id === gameId);
    
    if (gameIndex === -1) {
        showNotification('Game not found!', 'error');
        return;
    }
    
    // Add historical result
    games[gameIndex].results.push({
        date: new Date(date).toISOString(),
        number: resultNumber,
        published: true
    });
    
    localStorage.setItem('matkaGames', JSON.stringify(games));
    showNotification('Historical result saved!', 'success');
}

// Export all data
function exportAllData() {
    const data = {
        games: JSON.parse(localStorage.getItem('matkaGames') || '[]'),
        guessers: JSON.parse(localStorage.getItem('matkaGuessers') || '[]'),
        premium: JSON.parse(localStorage.getItem('matkaPremium') || '[]'),
        predictions: JSON.parse(localStorage.getItem('matkaPredictions') || '[]'),
        contacts: JSON.parse(localStorage.getItem('matkaContacts') || '[]'),
        ads: JSON.parse(localStorage.getItem('matkaAds') || '{}'),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `matka-backup-${new Date().toISOString().split('T')[0]}.json`);
    link.click();
    
    showNotification('Data exported successfully!', 'success');
}

// Clear all data
function clearAllData() {
    if (!confirm('WARNING: This will delete ALL data!')) return;
    
    localStorage.clear();
    initializeStorage();
    showNotification('All data cleared! Default data restored.', 'warning');
    loadAdminData();
}

// Reset to default
function resetToDefault() {
    if (!confirm('Reset to default settings?')) return;
    
    const credentials = localStorage.getItem('adminCredentials');
    const loggedIn = localStorage.getItem('adminLoggedIn');
    
    localStorage.clear();
    
    if (credentials) localStorage.setItem('adminCredentials', credentials);
    if (loggedIn) localStorage.setItem('adminLoggedIn', loggedIn);
    
    initializeStorage();
    showNotification('Reset to default successful!', 'success');
    loadAdminData();
}

// Backup data
function backupData() {
    const backup = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        backup[key] = localStorage.getItem(key);
    }
    
    localStorage.setItem('backup_' + Date.now(), JSON.stringify(backup));
    showNotification('Backup created successfully!', 'success');
}

// Load all admin data
function loadAdminData() {
    loadGameData();
    loadGuesserList();
    loadPremiumList();
    loadContactData();
    loadAdData();
}

// Helper function for notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00c853' : type === 'error' ? '#ff1744' : '#2196f3'};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize storage (from main script)
function initializeStorage() {
    if (!localStorage.getItem('matkaGames')) {
        const games = [
            { 
                id: 1, 
                name: 'FARIDABAD', 
                time: '17:15', 
                yesterday: 70, 
                today: null, 
                results: [],
                isPublished: false
            },
            { 
                id: 2, 
                name: 'GAZIABAD', 
                time: '21:15', 
                yesterday: 70, 
                today: null, 
                results: [],
                isPublished: false
            },
            { 
                id: 3, 
                name: 'GALI', 
                time: '22:30', 
                yesterday: 20, 
                today: null, 
                results: [],
                isPublished: false
            },
            { 
                id: 4, 
                name: 'DESHWAR', 
                time: '16:45', 
                yesterday: 25, 
                today: null, 
                results: [],
                isPublished: false
            },
            { 
                id: 5, 
                name: 'GALI DUBAI', 
                time: '14:30', 
                yesterday: 30, 
                today: null, 
                results: [],
                isPublished: false
            },
            { 
                id: 6, 
                name: 'DESHWAR DUBAI', 
                time: '23:45', 
                yesterday: 35, 
                today: null, 
                results: [],
                isPublished: false
            }
        ];
        localStorage.setItem('matkaGames', JSON.stringify(games));
    }
}
