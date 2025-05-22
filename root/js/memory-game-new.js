// Memory Game with Difficulty Levels
// Global variables
let gameTimer;
let timeLeft;
let gameActive = false;
let currentDifficulty = {
    name: 'normal',
    timeLimit: 120,
    pairs: 6
};

// Function to format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Initialize the game with difficulty settings
window.initializeMemoryGame = function(settings) {
    // Store current difficulty settings
    currentDifficulty = settings;
    
    // Reset game state
    if (gameTimer) {
        clearInterval(gameTimer);
    }
    
    // Check if we should show difficulty selector (for PC)
    if (!settings || settings.showSelector) {
        showDifficultySelector();
    } else {
        // Initialize the game directly
        initGame();
    }
};

// Show difficulty selector UI
function showDifficultySelector() {
    // Clear existing game container if it exists
    const existingContainer = document.getElementById('memory-game-container');
    if (existingContainer) {
        document.body.removeChild(existingContainer);
    }
    
    // Create selector container
    const selectorContainer = document.createElement('div');
    selectorContainer.id = 'difficulty-selector-container';
    selectorContainer.style.position = 'fixed';
    selectorContainer.style.top = '0';
    selectorContainer.style.left = '0';
    selectorContainer.style.width = '100%';
    selectorContainer.style.height = '100%';
    selectorContainer.style.backgroundColor = 'rgba(0,0,0,0.9)';
    selectorContainer.style.display = 'flex';
    selectorContainer.style.justifyContent = 'center';
    selectorContainer.style.alignItems = 'center';
    selectorContainer.style.zIndex = '1000';
    selectorContainer.style.flexDirection = 'column';
    selectorContainer.style.color = 'white';
    selectorContainer.style.fontFamily = '"Kanit", sans-serif';
    
    // Create title
    const title = document.createElement('h2');
    title.textContent = 'เลือกระดับความยาก';
    title.style.marginBottom = '30px';
    title.style.fontSize = '28px';
    title.style.color = 'white';
    title.style.textAlign = 'center';
    
    // Create difficulty options container
    const optionsContainer = document.createElement('div');
    optionsContainer.style.display = 'flex';
    optionsContainer.style.flexDirection = 'row';
    optionsContainer.style.justifyContent = 'center';
    optionsContainer.style.flexWrap = 'wrap';
    optionsContainer.style.gap = '20px';
    optionsContainer.style.maxWidth = '800px';
    optionsContainer.style.padding = '0 20px';
    
    // Difficulty options
    const difficulties = [
        { name: 'easy', label: 'ง่าย', timeLimit: 180, pairs: 4, color: '#4CAF50' },
        { name: 'normal', label: 'ปานกลาง', timeLimit: 120, pairs: 6, color: '#FF9800' },
        { name: 'hard', label: 'ยาก', timeLimit: 90, pairs: 8, color: '#F44336' }
    ];
    
    // Create each difficulty option
    difficulties.forEach(diff => {
        const option = document.createElement('div');
        option.className = 'difficulty-option';
        option.style.backgroundColor = diff.color;
        option.style.padding = '20px 30px';
        option.style.borderRadius = '10px';
        option.style.cursor = 'pointer';
        option.style.textAlign = 'center';
        option.style.minWidth = '180px';
        option.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        option.style.transition = 'transform 0.2s, box-shadow 0.2s';
        
        const diffTitle = document.createElement('h3');
        diffTitle.textContent = diff.label;
        diffTitle.style.margin = '0 0 10px 0';
        diffTitle.style.fontSize = '22px';
        
        const diffDetails = document.createElement('div');
        diffDetails.style.fontSize = '14px';
        diffDetails.innerHTML = `เวลา: ${Math.floor(diff.timeLimit / 60)}:${(diff.timeLimit % 60).toString().padStart(2, '0')}<br>จำนวนคู่: ${diff.pairs}`;
        
        option.appendChild(diffTitle);
        option.appendChild(diffDetails);
        
        // Hover effects
        option.addEventListener('mouseover', () => {
            option.style.transform = 'translateY(-5px)';
            option.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        });
        
        option.addEventListener('mouseout', () => {
            option.style.transform = 'translateY(0)';
            option.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        });
        
        // Click handler
        option.addEventListener('click', () => {
            document.body.removeChild(selectorContainer);
            currentDifficulty = diff;
            initGame();
        });
        
        optionsContainer.appendChild(option);
    });
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '36px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '30px';
    closeButton.style.width = '40px';
    closeButton.style.height = '40px';
    closeButton.style.borderRadius = '50%';
    closeButton.style.display = 'flex';
    closeButton.style.justifyContent = 'center';
    closeButton.style.alignItems = 'center';
    closeButton.style.transition = 'all 0.3s';
    
    closeButton.addEventListener('mouseover', () => {
        closeButton.style.background = 'rgba(255,255,255,0.2)';
    });
    
    closeButton.addEventListener('mouseout', () => {
        closeButton.style.background = 'none';
    });
    
    closeButton.addEventListener('click', () => {
        document.body.removeChild(selectorContainer);
    });
    
    // Add elements to container
    selectorContainer.appendChild(title);
    selectorContainer.appendChild(optionsContainer);
    selectorContainer.appendChild(closeButton);
    
    // Add responsive styles
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .difficulty-option {
                padding: 15px 20px;
                min-width: 150px;
            }
        }
        
        @media (max-width: 480px) {
            .difficulty-option {
                padding: 12px 15px;
                min-width: 120px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to document
    document.body.appendChild(selectorContainer);
}

// Main game initialization
function initGame() {
    // Clear existing game container if it exists
    const existingContainer = document.getElementById('memory-game-container');
    if (existingContainer) {
        document.body.removeChild(existingContainer);
    }
    
    // Load CSS file if not already loaded
    if (!document.querySelector('link[href="/css/memory-game.css"]')) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = '/css/memory-game.css';
        document.head.appendChild(cssLink);
    }
    
    // Create game container
    const gameContainer = document.createElement('div');
    gameContainer.id = 'memory-game-container';
    
    // Create game board
    const gameBoard = document.createElement('div');
    gameBoard.id = 'memory-game';
    
    // Create game header
    const gameHeader = document.createElement('div');
    gameHeader.className = 'game-header';
    
    // Moves counter
    const movesElement = document.createElement('div');
    movesElement.id = 'moves';
    movesElement.textContent = 'การเคลื่อนไหว: 0';
    
    // Timer
    const timerElement = document.createElement('div');
    timerElement.id = 'timer';
    timerElement.textContent = 'เวลา: 0:00';
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.className = 'close-button';
    
    closeButton.addEventListener('click', () => {
        document.body.removeChild(gameContainer);
        clearInterval(gameTimer);
        gameActive = false;
    });
    
    // Add elements to header
    gameHeader.appendChild(movesElement);
    gameHeader.appendChild(timerElement);
    
    // Add elements to container
    gameContainer.appendChild(gameHeader);
    gameContainer.appendChild(gameBoard);
    gameContainer.appendChild(closeButton);
    document.body.appendChild(gameContainer);
    
    // Start the game
    startGame(gameBoard, movesElement, timerElement);
}

// Start the game with the specified container and elements
function startGame(gameBoard, movesElement, timerElement) {
    // Available card images
    const allCardImages = [
        '/img/memory/1.jpg',
        '/img/memory/2.jpg',
        '/img/memory/3.jpg',
        '/img/memory/4.jpg',
        '/img/memory/5.jpg',
        '/img/memory/6.jpg',
        '/img/memory/7.jpg',
        '/img/memory/8.jpg',
        '/img/memory/9.jpg',
        '/img/memory/10.jpg',
    ];
    
    // Select card images based on difficulty
    const cardImages = allCardImages.slice(0, currentDifficulty.pairs);
    
    // Duplicate the images to create pairs and shuffle
    const cards = [...cardImages, ...cardImages];
    cards.sort(() => Math.random() - 0.5);
    
    // Game state
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matchedPairs = 0;
    
    // Clear existing cards
    gameBoard.innerHTML = '';
    
    // Update moves counter
    movesElement.textContent = `การเคลื่อนไหว: ${moves}`;
    
    // Create cards
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        
        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face');
        frontFace.textContent = '?';
        
        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        backFace.style.backgroundImage = `url(${card})`;
        
        cardElement.appendChild(frontFace);
        cardElement.appendChild(backFace);
        
        cardElement.addEventListener('click', flipCard);
        
        gameBoard.appendChild(cardElement);
    });
    
    // Start the game timer
    timeLeft = currentDifficulty.timeLimit;
    timerElement.textContent = `เวลา: ${formatTime(timeLeft)}`;
    
    // Clear any existing timer
    if (gameTimer) {
        clearInterval(gameTimer);
    }
    
    // Start the countdown
    gameTimer = setInterval(updateTimer, 1000);
    gameActive = true;
    
    function updateTimer() {
        timeLeft--;
        timerElement.textContent = `เวลา: ${formatTime(timeLeft)}`;
        
        // Check if time's up
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            gameActive = false;
            setTimeout(() => {
                alert('เวลาเสร็จสิ้น! คุณแพ้แล้ว!');
            }, 500);
        }
    }
    
    function flipCard() {
        if (lockBoard || !gameActive) return;
        if (this === firstCard) return;
        
        this.classList.add('flip');
        
        if (!hasFlippedCard) {
            // First click
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second click
        secondCard = this;
        checkForMatch();
    }
    
    function checkForMatch() {
        const isMatch = firstCard.querySelector('.back-face').style.backgroundImage === 
                      secondCard.querySelector('.back-face').style.backgroundImage;
        
        if (isMatch) {
            disableCards();
            checkWin();
        } else {
            unflipCards();
        }
        
        // Update moves
        moves++;
        movesElement.textContent = `การเคลื่อนไหว: ${moves}`;
    }
    
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        matchedPairs++;
        resetBoard();
    }
    
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            
            resetBoard();
        }, 1000);
    }
    
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    function checkWin() {
        if (matchedPairs === currentDifficulty.pairs) {
            clearInterval(gameTimer);
            gameActive = false;
            
            // Calculate score based on time and moves
            const timeBonus = Math.max(0, Math.floor(timeLeft / 10));
            const moveBonus = Math.max(0, 50 - moves);
            const difficultyMultiplier = {
                'easy': 1,
                'normal': 1.5,
                'hard': 2
            }[currentDifficulty.name] || 1;
            
            const score = Math.max(10, (timeBonus + moveBonus) * difficultyMultiplier);
            
            setTimeout(() => {
                alert(`ยินดีด้วย! คุณชนะใน ${moves} ครั้ง ใช้เวลา ${formatTime(currentDifficulty.timeLimit - timeLeft)}!\n\nคะแนนที่ได้: ${Math.round(score)}`);
            }, 500);
        }
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // You can add any initialization code here if needed
});
