// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    initializeStorage();
    loadGames();
    loadPredictions();
    loadContactLinks();
    loadAds();
    updateLiveTimers();
    
    setInterval(updateLiveTimers, 30000);
    setInterval(loadPredictions, 60000);
});

// Initialize localStorage with 6 specific games
function initializeStorage() {
    // 6 Specific Games with single results
    if (!localStorage.getItem('matkaGames')) {
        const games = [
            { 
                id: 1, 
                name: 'FARIDABAD', 
                time: '17:15', 
                yesterday: 70, 
                today: 34, 
                results: [] 
            },
            { 
                id: 2, 
                name: 'GAZIABAD', 
                time: '21:15', 
                yesterday: 70, 
                today: null, 
                results: [] 
            },
            { 
                id: 3, 
                name: 'GALI', 
                time: '22:30', 
                yesterday: 20, 
                today: 18, 
                results: [] 
            },
            { 
                id: 4, 
                name: 'DESHWAR', 
                time: '16:45', 
                yesterday: 25, 
                today: 22, 
                results: [] 
            },
            { 
                id: 5, 
                name: 'GALI DUBAI', 
                time: '14:30', 
                yesterday: 30, 
                today: 28, 
                results: [] 
            },
            { 
                id: 6, 
                name: 'DESHWAR DUBAI', 
                time: '23:45', 
                yesterday: 35, 
                today: 32, 
                results: [] 
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

// Load games
function loadGames() {
    const games = JSON.parse(localStorage.getItem('matkaGames')) || [];
    
    games.forEach(game => {
        const resultElement = document.getElementById(`result-${game.id}`);
        const yesterdayElement = document.getElementById(`yesterday-${game.id}`);
        const todayElement = document.getElementById(`today-${game.id}`);
        const timeElement = document.getElementById(`time-${game.id}`);
        
        if (!resultElement || !yesterdayElement || !todayElement || !timeElement) return;
        
        // Update game time
        timeElement.textContent = formatTime(game.time);
        
        // Update yesterday
        if (game.yesterday !== null && game.yesterday !== undefined) {
            yesterdayElement.textContent = game.yesterday.toString().padStart(2, '0');
        }
        
        // Update today and result
        const today = new Date().toDateString();
        const todayResult = game.results.find(r => new Date(r.date).toDateString() === today);
        
        if (todayResult && todayResult.number !== undefined) {
            // Result exists
            todayElement.textContent = todayResult.number.toString().padStart(2, '0');
            todayElement.style.color = '#00e676';
            
            resultElement.textContent = todayResult.number.toString().padStart(2, '0');
            resultElement.className = 'single-result present';
        } else {
            // Check if game time has passed
            const now = new Date();
            const [hours, minutes] = game.time.split(':');
            const gameTime = new Date();
            gameTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            if (now > gameTime) {
                // Game time passed, no result
                todayElement.textContent = '--';
                todayElement.style.color = '#ff4081';
                
                resultElement.textContent = '--';
                resultElement.className = 'single-result absent';
            } else {
                // Game hasn't happened yet
                todayElement.textContent = 'UPCOMING';
                todayElement.style.color = '#ff9800';
                
                resultElement.textContent = 'UPCOMING';
                resultElement.className = 'single-result upcoming';
            }
        }
    });
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
        if (!timeElement) return;
        
        if (now < gameTime) {
            const diff = gameTime - now;
            const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
            const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (hoursLeft > 0) {
                timeElement.textContent = `${formatTime(game.time)} (in ${hoursLeft}h ${minutesLeft}m)`;
                timeElement.style.color = '#ffd600';
            } else if (minutesLeft > 0) {
                timeElement.textContent = `${formatTime(game.time)} (in ${minutesLeft}m)`;
                timeElement.style.color = '#ff9100';
            } else {
                timeElement.textContent = `${formatTime(game.time)} (Starting now)`;
                timeElement.style.color = '#00e676';
            }
        } else {
            const diff = now - gameTime;
            const minutesPassed = Math.floor(diff / (1000 * 60));
            
            if (minutesPassed < 5) {
                timeElement.textContent = `${formatTime(game.time)} (Result coming...)`;
                timeElement.style.color = '#ff4081';
            } else {
                timeElement.textContent = `${formatTime(game.time)} (Result declared)`;
                timeElement.style.color = '#00e676';
            }
        }
    });
}

// Refresh result for a specific game
function refreshResult(gameId) {
    const resultElement = document.getElementById(`result-${gameId}`);
    const todayElement = document.getElementById(`today-${gameId}`);
    
    if (!resultElement || !todayElement) return;
    
    // Show loading
    resultElement.textContent = '??';
    resultElement.className = 'single-result';
    resultElement.style.background = 'linear-gradient(45deg, #ff9800, #ff5722)';
    
    setTimeout(() => {
        const randomNumber = Math.floor(Math.random() * 100);
        
        // Update display
        resultElement.textContent = randomNumber.toString().padStart(2, '0');
        resultElement.className = 'single-result present';
        resultElement.style.background = '';
        
        // Update today element
        todayElement.textContent = randomNumber.toString().padStart(2, '0');
        todayElement.style.color = '#00e676';
        
        // Save to localStorage
        const games = JSON.parse(localStorage.getItem('matkaGames')) || [];
        const gameIndex = games.findIndex(g => g.id === gameId);
        
        if (gameIndex !== -1) {
            // Set yesterday to previous today
            if (games[gameIndex].today !== undefined && games[gameIndex].today !== null) {
                games[gameIndex].yesterday = games[gameIndex].today;
                document.getElementById(`yesterday-${gameId}`).textContent = 
                    games[gameIndex].yesterday.toString().padStart(2, '0');
            }
            
            // Set new today number
            games[gameIndex].today = randomNumber;
            
            // Add to results array
            const today = new Date().toISOString();
            const existingResultIndex = games[gameIndex].results.findIndex(
                r => new Date(r.date).toDateString() === new Date(today).toDateString()
            );
            
            if (existingResultIndex !== -1) {
                games[gameIndex].results[existingResultIndex] = {
                    date: today,
                    number: randomNumber
                };
            } else {
                games[gameIndex].results.push({
                    date: today,
                    number: randomNumber
                });
            }
            
            localStorage.setItem('matkaGames', JSON.stringify(games));
            
            showNotification(`${getGameName(gameId)} result updated: ${randomNumber.toString().padStart(2, '0')}!`, 'success');
        }
    }, 1000);
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