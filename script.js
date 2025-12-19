// Main JavaScript File - Admin Controlled Results
document.addEventListener('DOMContentLoaded', function() {
    initializeStorage();
    loadGames();
    loadPredictions();
    loadContactLinks();
    loadAds();
    updateLiveTimers();
    
    // Check for new results every 30 seconds
    setInterval(checkForNewResults, 30000);
    setInterval(updateLiveTimers, 30000);
    setInterval(loadPredictions, 60000);
});

// Initialize localStorage with 6 specific games
function initializeStorage() {
    // 6 Specific Games with admin-controlled results
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
    
    // Predictions data
    if (!localStorage.getItem('matkaPredictions')) {
        const predictions = [
            { 
                id: 1, 
                guesserId: 'G001', 
                guesserName: 'Expert Raj', 
                gameId: 1, 
                type: 'single',
                numbers: [55], 
                timestamp: new Date().toISOString(),
                status: 'pending'
            },
            { 
                id: 2, 
                guesserId: 'G002', 
                guesserName: 'Gali Master', 
                gameId: 2, 
                type: 'spot',
                numbers: [76, 56], 
                timestamp: new Date().toISOString(),
                status: 'pending'
            }
        ];
        localStorage.setItem('matkaPredictions', JSON.stringify(predictions));
    }
    
    // Contact links
    if (!localStorage.getItem('matkaContacts')) {
        const contacts = [
            { platform: 'Telegram Group', url: 'https://t.me/matkaking', icon: 'fab fa-telegram' },
            { platform: 'WhatsApp Support', url: 'https://wa.me/919876543210', icon: 'fab fa-whatsapp' },
            { platform: 'Khaiwal Telegram', url: 'https://t.me/khaiwalmatka', icon: 'fab fa-telegram' },
            { platform: 'Support Email', url: 'mailto:support@matkaking.com', icon: 'fas fa-envelope' }
        ];
        localStorage.setItem('matkaContacts', JSON.stringify(contacts));
    }
    
    // Guessers data
    if (!localStorage.getItem('matkaGuessers')) {
        const guessers = [
            { id: 'G001', name: 'Expert Raj', password: 'pass123', status: 'active', rating: 4.8 },
            { id: 'G002', name: 'Gali Master', password: 'pass123', status: 'active', rating: 4.7 },
            { id: 'G003', name: 'Khaiwal Pro', password: 'pass123', status: 'active', rating: 4.9 }
        ];
        localStorage.setItem('matkaGuessers', JSON.stringify(guessers));
    }
    
    // Premium users
    if (!localStorage.getItem('matkaPremium')) {
        const premium = [
            { id: 'P001', name: 'VIP User', password: 'vip123', status: 'active' }
        ];
        localStorage.setItem('matkaPremium', JSON.stringify(premium));
    }
    
    // Ads data
    if (!localStorage.getItem('matkaAds')) {
        const ads = {
            topBanner: '<div class="ad-placeholder">Top Banner Ad (728x90)</div>',
            sidebar: '<div class="ad-placeholder">Sidebar Ad (300x600)</div>',
            rectangle: '<div class="ad-placeholder">Rectangle Ad (300x250)</div>'
        };
        localStorage.setItem('matkaAds', JSON.stringify(ads));
    }
}

// Load games with admin-controlled results
function loadGames() {
    const games = JSON.parse(localStorage.getItem('matkaGames')) || [];
    
    games.forEach(game => {
        const resultElement = document.getElementById(`result-${game.id}`);
        const statusElement = document.getElementById(`status-${game.id}`);
        const yesterdayElement = document.getElementById(`yesterday-${game.id}`);
        const todayElement = document.getElementById(`today-${game.id}`);
        const timeElement = document.getElementById(`time-${game.id}`);
        
        if (!resultElement || !statusElement) return;
        
        // Update game time
        if (timeElement) {
            timeElement.textContent = formatTime(game.time);
        }
        
        // Update yesterday
        if (yesterdayElement && game.yesterday !== null) {
            yesterdayElement.textContent = game.yesterday.toString().padStart(2, '0');
        }
        
        // Update today (only if result is published)
        if (todayElement) {
            if (game.isPublished && game.today !== null) {
                todayElement.textContent = game.today.toString().padStart(2, '0');
                todayElement.style.color = '#00e676';
            } else {
                todayElement.textContent = '--';
                todayElement.style.color = '#a0a0c0';
            }
        }
        
        // Update result display based on published status
        if (game.isPublished && game.today !== null) {
            // Result is published - show it
            resultElement.textContent = game.today.toString().padStart(2, '0');
            resultElement.className = 'single-result present';
            
            // Update status
            statusElement.textContent = 'Result Published ✓';
            statusElement.className = 'result-status published';
            
            // Check game time
            const now = new Date();
            const [hours, minutes] = game.time.split(':');
            const gameTime = new Date();
            gameTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            if (now < gameTime) {
                statusElement.textContent = 'Early Result Published ✓';
            }
        } else {
            // Result not published
            const now = new Date();
            const [hours, minutes] = game.time.split(':');
            const gameTime = new Date();
            gameTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            resultElement.textContent = '--';
            resultElement.className = 'single-result absent';
            
            if (now < gameTime) {
                // Game hasn't started yet
                statusElement.textContent = `Game starts at ${formatTime(game.time)}`;
                statusElement.className = 'result-status waiting';
            } else {
                // Game time passed, waiting for result
                const minutesPassed = Math.floor((now - gameTime) / (1000 * 60));
                if (minutesPassed < 5) {
                    statusElement.textContent = 'Result coming soon...';
                } else {
                    statusElement.textContent = 'Waiting for result';
                }
                statusElement.className = 'result-status waiting';
            }
        }
    });
}

// Check for new results from admin
function checkResult(gameId) {
    const resultElement = document.getElementById(`result-${gameId}`);
    const statusElement = document.getElementById(`status-${gameId}`);
    
    if (!resultElement || !statusElement) return;
    
    // Show loading
    resultElement.textContent = '...';
    resultElement.className = 'single-result checking';
    statusElement.textContent = 'Checking for updates...';
    
    setTimeout(() => {
        const games = JSON.parse(localStorage.getItem('matkaGames')) || [];
        const game = games.find(g => g.id === gameId);
        
        if (game && game.isPublished && game.today !== null) {
            // New result available
            resultElement.textContent = game.today.toString().padStart(2, '0');
            resultElement.className = 'single-result present';
            statusElement.textContent = 'New Result Published! ✓';
            statusElement.className = 'result-status published';
            
            // Update today display
            const todayElement = document.getElementById(`today-${gameId}`);
            if (todayElement) {
                todayElement.textContent = game.today.toString().padStart(2, '0');
                todayElement.style.color = '#00e676';
            }
            
            showNotification(`New ${getGameName(gameId)} result: ${game.today.toString().padStart(2, '0')}!`, 'success');
        } else {
            // No new result
            resultElement.textContent = '--';
            resultElement.className = 'single-result absent';
            
            const now = new Date();
            const [hours, minutes] = game.time.split(':');
            const gameTime = new Date();
            gameTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            if (now < gameTime) {
                statusElement.textContent = `Game starts at ${formatTime(game.time)}`;
            } else {
                statusElement.textContent = 'No result yet. Check back soon.';
            }
            statusElement.className = 'result-status waiting';
            
            showNotification('No new result available yet.', 'info');
        }
    }, 1000);
}

// Check all games for new results
function checkForNewResults() {
    const games = JSON.parse(localStorage.getItem('matkaGames')) || [];
    let hasNewResults = false;
    
    games.forEach(game => {
        if (game.isPublished && game.today !== null) {
            const todayElement = document.getElementById(`today-${game.id}`);
            const resultElement = document.getElementById(`result-${game.id}`);
            const statusElement = document.getElementById(`status-${game.id}`);
            
            if (todayElement && todayElement.textContent === '--') {
                hasNewResults = true;
                
                // Update display
                todayElement.textContent = game.today.toString().padStart(2, '0');
                todayElement.style.color = '#00e676';
                
                if (resultElement) {
                    resultElement.textContent = game.today.toString().padStart(2, '0');
                    resultElement.className = 'single-result present';
                }
                
                if (statusElement) {
                    statusElement.textContent = 'Result Published ✓';
                    statusElement.className = 'result-status published';
                }
            }
        }
    });
    
    if (hasNewResults) {
        console.log('New results detected and updated');
    }
}

// Load predictions
function loadPredictions() {
    const predictions = JSON.parse(localStorage.getItem('matkaPredictions')) || [];
    const guessers = JSON.parse(localStorage.getItem('matkaGuessers')) || [];
    const predictionsList = document.getElementById('predictions-list');
    
    if (!predictionsList) return;
    
    predictionsList.innerHTML = '';
    
    const recentPredictions = predictions
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
    
    if (recentPredictions.length === 0) {
        predictionsList.innerHTML = '<p style="text-align: center; color: #a0a0c0;">No predictions yet. Be the first to predict!</p>';
        return;
    }
    
    recentPredictions.forEach(prediction => {
        const guesser = guessers.find(g => g.id === prediction.guesserId);
        if (!guesser) return;
        
        const typeBadge = prediction.type === 'single' 
            ? '<span class="badge badge-single">Single</span>' 
            : '<span class="badge badge-spot">Spot</span>';
        
        const predictionElement = document.createElement('div');
        predictionElement.className = 'prediction-item';
        predictionElement.innerHTML = `
            <div class="prediction-header">
                <div>
                    <span class="guesser-name">${guesser.name}</span>
                    <span class="guesser-id">(${guesser.id})</span>
                    ${typeBadge}
                </div>
                <div class="guesser-rating">
                    <i class="fas fa-star"></i> ${guesser.rating}
                </div>
            </div>
            <div>Game: ${getGameName(prediction.gameId)}</div>
            <div class="prediction-numbers">
                ${prediction.numbers.map(num => 
                    `<span class="prediction-number">${num.toString().padStart(2, '0')}</span>`
                ).join('')}
            </div>
            <div class="prediction-time">
                ${formatTime(new Date(prediction.timestamp).toLocaleTimeString())}
            </div>
        `;
        
        predictionsList.appendChild(predictionElement);
    });
}

// Load contact links
function loadContactLinks() {
    const contacts = JSON.parse(localStorage.getItem('matkaContacts')) || [];
    const contactLinksContainer = document.getElementById('contact-links');
    
    if (!contactLinksContainer) return;
    
    contactLinksContainer.innerHTML = '';
    
    contacts.forEach(contact => {
        const linkElement = document.createElement('a');
        linkElement.className = 'contact-link';
        linkElement.href = contact.url;
        linkElement.target = '_blank';
        linkElement.innerHTML = `
            <i class="${contact.icon}"></i>
            <span>${contact.platform}</span>
        `;
        contactLinksContainer.appendChild(linkElement);
    });
    
    // Set Telegram button
    const telegramBtn = document.getElementById('telegram-group-btn');
    const khaiwalBtn = document.getElementById('khaiwal-telegram');
    
    if (telegramBtn) {
        const telegram = contacts.find(c => c.platform === 'Telegram Group');
        if (telegram) telegramBtn.href = telegram.url;
    }
    
    if (khaiwalBtn) {
        const khaiwal = contacts.find(c => c.platform === 'Khaiwal Telegram');
        if (khaiwal) khaiwalBtn.href = khaiwal.url;
    }
}

// Load ads
function loadAds() {
    const ads = JSON.parse(localStorage.getItem('matkaAds')) || {};
    
    const topBanner = document.getElementById('ad-banner-top');
    const sidebar = document.getElementById('ad-sidebar-1');
    const rectangle = document.getElementById('ad-rectangle');
    
    if (topBanner && ads.topBanner) {
        topBanner.innerHTML = ads.topBanner;
    }
    
    if (sidebar && ads.sidebar) {
        sidebar.innerHTML = ads.sidebar;
    }
    
    if (rectangle && ads.rectangle) {
        rectangle.innerHTML = ads.rectangle;
    }
}

// Update live timers
function updateLiveTimers() {
    const games = JSON.parse(localStorage.getItem('matkaGames')) || [];
    const now = new Date();
    
    games.forEach(game => {
        const [hours, minutes] = game.time.split(':');
        const gameTime = new Date();
        gameTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const timeElement = document.getElementById(`time-${game.id}`);
        const statusElement = document.getElementById(`status-${game.id}`);
        
        if (!timeElement || !statusElement) return;
        
        if (game.isPublished && game.today !== null) {
            // Result already published
            timeElement.textContent = `${formatTime(game.time)} (Result Published)`;
            timeElement.style.color = '#00e676';
            return;
        }
        
        if (now < gameTime) {
            const diff = gameTime - now;
            const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
            const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (hoursLeft > 0) {
                timeElement.textContent = `${formatTime(game.time)} (in ${hoursLeft}h ${minutesLeft}m)`;
                timeElement.style.color = '#ffd600';
                statusElement.textContent = `Starts in ${hoursLeft}h ${minutesLeft}m`;
            } else if (minutesLeft > 0) {
                timeElement.textContent = `${formatTime(game.time)} (in ${minutesLeft}m)`;
                timeElement.style.color = '#ff9100';
                statusElement.textContent = `Starts in ${minutesLeft}m`;
            } else {
                timeElement.textContent = `${formatTime(game.time)} (Starting now)`;
                timeElement.style.color = '#00e676';
                statusElement.textContent = 'Starting now';
            }
        } else {
            const diff = now - gameTime;
            const minutesPassed = Math.floor(diff / (1000 * 60));
            
            if (minutesPassed < 5) {
                timeElement.textContent = `${formatTime(game.time)} (Result coming...)`;
                timeElement.style.color = '#ff4081';
                statusElement.textContent = 'Result coming soon...';
            } else {
                timeElement.textContent = `${formatTime(game.time)} (Waiting for result)`;
                timeElement.style.color = '#a0a0c0';
                statusElement.textContent = 'Waiting for result';
            }
        }
    });
}

// Show predictions modal
function showPrediction(gameId) {
    const predictions = JSON.parse(localStorage.getItem('matkaPredictions')) || [];
    const guessers = JSON.parse(localStorage.getItem('matkaGuessers')) || [];
    const gamePredictions = predictions.filter(p => p.gameId === parseInt(gameId));
    const gameName = getGameName(parseInt(gameId));
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div style="background: #1a1a2e; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #ff4081;">${gameName} Predictions</h2>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            ${gamePredictions.length > 0 ? 
                gamePredictions.map(prediction => {
                    const guesser = guessers.find(g => g.id === prediction.guesserId);
                    const typeBadge = prediction.type === 'single' 
                        ? '<span style="background: #4caf50; color: white; padding: 2px 8px; border-radius: 3px; font-size: 0.8rem; margin-left: 10px;">Single</span>' 
                        : '<span style="background: #2196f3; color: white; padding: 2px 8px; border-radius: 3px; font-size: 0.8rem; margin-left: 10px;">Spot</span>';
                    
                    return `
                        <div style="background: rgba(255,255,255,0.05); padding: 15px; margin-bottom: 10px; border-radius: 5px; border-left: 4px solid #2196f3;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <div>
                                    <strong style="color: #2196f3;">${guesser ? guesser.name : prediction.guesserName}</strong>
                                    ${typeBadge}
                                </div>
                                <span style="color: #ffd600;">
                                    <i class="fas fa-star"></i> ${guesser ? guesser.rating : 'N/A'}
                                </span>
                            </div>
                            <div style="display: flex; gap: 10px; margin-top: 10px;">
                                ${prediction.numbers.map(num => 
                                    `<span style="padding: 5px 15px; background: rgba(33,150,243,0.2); border-radius: 20px;">${num.toString().padStart(2, '0')}</span>`
                                ).join('')}
                            </div>
                        </div>
                    `;
                }).join('') :
                '<p style="text-align: center; color: #a0a0c0;">No predictions available yet.</p>'
            }
            <div style="margin-top: 20px; text-align: center;">
                <button onclick="this.closest('.modal').remove()" style="background: #f50057; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Helper functions
function formatTime(timeStr) {
    if (!timeStr) return '';
    if (timeStr.includes(':')) {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes.padStart(2, '0')} ${ampm}`;
    }
    return timeStr;
}

function getGameName(gameId) {
    const games = JSON.parse(localStorage.getItem('matkaGames')) || [];
    const game = games.find(g => g.id === gameId);
    return game ? game.name : `Game ${gameId}`;
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add ad placeholder styles
const adStyle = document.createElement('style');
adStyle.textContent = `
    .ad-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.05);
        color: #a0a0c0;
        font-style: italic;
    }
`;
document.head.appendChild(adStyle);
