// Global variable to store current difficulty settings
let currentDifficulty = {
    pairs: 6,
    timeLimit: 120
};

// Function to format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Function to start the memory game with specified settings
function startMemoryGame(pairs, timeLimit) {
    // Store the current difficulty settings
    currentDifficulty = {
        pairs: pairs,
        timeLimit: timeLimit
    };
    
    // Initialize the game
    initializeGame();
}

// Make the function globally accessible
window.startMemoryGame = startMemoryGame;

// Function to initialize the game
function initializeGame() {
    const gameContainer = document.createElement('div');
    gameContainer.id = 'memory-game-container';
    gameContainer.style.display = 'none';
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '0';
    gameContainer.style.left = '0';
    gameContainer.style.width = '100%';
    gameContainer.style.height = '100%';
    gameContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
    gameContainer.style.display = 'flex';
    gameContainer.style.justifyContent = 'center';
    gameContainer.style.alignItems = 'center';
    gameContainer.style.zIndex = '1000';
    gameContainer.style.flexDirection = 'column';
    gameContainer.style.color = 'white';

    const gameBoard = document.createElement('div');
    gameBoard.id = 'memory-game';
    gameBoard.style.display = 'grid';
    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
    gameBoard.style.gap = '10px';
    gameBoard.style.padding = '20px';
    gameBoard.style.maxWidth = '500px';
    gameBoard.style.margin = '0 auto';

    const gameHeader = document.createElement('div');
    gameHeader.style.display = 'flex';
    gameHeader.style.justifyContent = 'space-between';
    gameHeader.style.width = '100%';
    gameHeader.style.maxWidth = '500px';
    gameHeader.style.marginBottom = '20px';
    gameHeader.style.color = 'white';

    const movesElement = document.createElement('div');
    movesElement.id = 'moves';
    movesElement.textContent = 'Moves: 0';

    const timerElement = document.createElement('div');
    timerElement.id = 'timer';
    timerElement.style.display = 'flex';
    timerElement.style.alignItems = 'center';
    timerElement.style.justifyContent = 'center';
    timerElement.style.padding = '5px 10px';
    timerElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    timerElement.style.borderRadius = '5px';
    timerElement.style.fontWeight = 'bold';
    
    // Add clock icon
    const clockIcon = document.createElement('span');
    clockIcon.innerHTML = '⏱️';
    clockIcon.style.marginRight = '5px';
    clockIcon.style.fontSize = '16px';
    timerElement.appendChild(clockIcon);
    
    const timeText = document.createElement('span');
    timeText.textContent = formatTime(currentDifficulty.timeLimit);
    timerElement.appendChild(timeText);

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';

    closeButton.addEventListener('click', () => {
        document.body.removeChild(gameContainer);
        clearInterval(timer);
    });

    gameHeader.appendChild(movesElement);
    gameHeader.appendChild(timerElement);
    gameContainer.appendChild(gameHeader);
    gameContainer.appendChild(gameBoard);
    gameContainer.appendChild(closeButton);

    // Card images - we'll select based on difficulty
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

    // Duplicate the images to create pairs
    const cards = [...cardImages, ...cardImages];
    
    // Shuffle the cards
    cards.sort(() => Math.random() - 0.5);

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let seconds = 0;
    let timer;

    // Clear existing cards
    gameBoard.innerHTML = '';
    
    // Update moves counter
    moves = 0;
    movesElement.textContent = `Moves: ${moves}`;
    
    // Create cards
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.index = index;
        
        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face');
        frontFace.style.background = '#6b5b95';
        frontFace.style.borderRadius = '5px';
        frontFace.style.display = 'flex';
        frontFace.style.justifyContent = 'center';
        frontFace.style.alignItems = 'center';
        frontFace.style.fontSize = '24px';
        frontFace.style.color = 'white';
        frontFace.textContent = '?';
        
        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        backFace.style.background = 'white';
        backFace.style.borderRadius = '5px';
        backFace.style.backgroundSize = 'cover';
        backFace.style.backgroundPosition = 'center';
        backFace.style.backgroundImage = `url(${card})`;
        
        cardElement.appendChild(frontFace);
        cardElement.appendChild(backFace);
        
        cardElement.addEventListener('click', flipCard);
        
        // Update timer - use countdown based on timeLimit
        seconds = currentDifficulty.timeLimit;
        const timeText = timerElement.querySelector('span:last-child');
        timeText.textContent = formatTime(seconds);
        
        // Add timer color change effect as time decreases
        timer = setInterval(() => {
            seconds--;
            timeText.textContent = formatTime(seconds);
            
            // Change timer color based on remaining time
            if (seconds < 10) {
                timerElement.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
                timerElement.style.animation = 'pulse 1s infinite';
            } else if (seconds < 30) {
                timerElement.style.backgroundColor = 'rgba(255, 165, 0, 0.5)';
            }
            
            // Check if time is up
            if (seconds <= 0) {
                clearInterval(timer);
                // Show game over message
                const gameOver = document.createElement('div');
                gameOver.style.position = 'absolute';
                gameOver.style.top = '50%';
                gameOver.style.left = '50%';
                gameOver.style.transform = 'translate(-50%, -50%)';
                gameOver.style.background = 'rgba(0, 0, 0, 0.9)';
                gameOver.style.color = 'white';
                gameOver.style.padding = '20px';
                gameOver.style.borderRadius = '10px';
                gameOver.style.textAlign = 'center';
                gameOver.style.zIndex = '2000';
                gameOver.style.fontSize = '24px';
                gameOver.innerHTML = '<p>หมดเวลา!</p><p>คุณจับคู่ได้ ' + document.querySelectorAll('.memory-card.flip').length/2 + ' คู่</p>';
                gameContainer.appendChild(gameOver);
                
                // Add try again button
                const tryAgainBtn = document.createElement('button');
                tryAgainBtn.textContent = 'เล่นอีกครั้ง';
                tryAgainBtn.style.padding = '10px 20px';
                tryAgainBtn.style.marginTop = '20px';
                tryAgainBtn.style.background = '#4CAF50';
                tryAgainBtn.style.color = 'white';
                tryAgainBtn.style.border = 'none';
                tryAgainBtn.style.borderRadius = '5px';
                tryAgainBtn.style.cursor = 'pointer';
                tryAgainBtn.addEventListener('click', () => {
                    document.body.removeChild(gameContainer);
                    initializeGame();
                });
                gameOver.appendChild(tryAgainBtn);
                
                // Lock the board
                lockBoard = true;
            }
        }, 1000);

        gameBoard.appendChild(cardElement);
    });

    function flipCard() {
        if (lockBoard) return;
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
        } else {
            unflipCards();
        }
        
        // Update moves
        moves++;
        movesElement.textContent = `Moves: ${moves}`;
        
        // Check if all cards are matched
        checkWin();
    }
    
    function checkWin() {
        // Check if all cards are flipped
        const flippedCards = document.querySelectorAll('.memory-card.flip');
        if (flippedCards.length === cards.length) {
            // Stop the timer
            clearInterval(timer);
            
            // Calculate time used
            const timeUsed = currentDifficulty.timeLimit - seconds;
            const timeUsedFormatted = formatTime(timeUsed);
            
            // Create win message with Thai text
            const winMessage = document.createElement('div');
            winMessage.style.position = 'absolute';
            winMessage.style.top = '50%';
            winMessage.style.left = '50%';
            winMessage.style.transform = 'translate(-50%, -50%)';
            winMessage.style.background = 'rgba(0, 0, 0, 0.9)';
            winMessage.style.color = 'white';
            winMessage.style.padding = '30px';
            winMessage.style.borderRadius = '15px';
            winMessage.style.textAlign = 'center';
            winMessage.style.zIndex = '2000';
            winMessage.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.5)';
            winMessage.style.fontFamily = "'Kanit', sans-serif";
            
            // Add confetti animation
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.top = '0';
            confetti.style.left = '0';
            confetti.style.width = '100%';
            confetti.style.height = '100%';
            confetti.style.overflow = 'hidden';
            confetti.style.zIndex = '1900';
            
            // Create 50 confetti pieces
            for (let i = 0; i < 50; i++) {
                const piece = document.createElement('div');
                piece.style.position = 'absolute';
                piece.style.width = '10px';
                piece.style.height = '10px';
                piece.style.backgroundColor = getRandomColor();
                piece.style.top = '-10px';
                piece.style.left = Math.random() * 100 + '%';
                piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                piece.style.animation = `fall ${Math.random() * 3 + 2}s linear infinite`;
                piece.style.animationDelay = Math.random() * 5 + 's';
                confetti.appendChild(piece);
            }
            
            gameContainer.appendChild(confetti);
            
            // Add animation keyframes for confetti
            const styleSheet = document.createElement('style');
            styleSheet.textContent = `
                @keyframes fall {
                    0% { transform: translateY(-10px) rotate(0deg); }
                    100% { transform: translateY(${window.innerHeight}px) rotate(360deg); }
                }
            `;
            document.head.appendChild(styleSheet);
            
            winMessage.innerHTML = `<h2>ยินดีด้วย!</h2>
                <p>คุณจับคู่ได้สำเร็จแล้ว</p>
                <p>จำนวนครั้งที่เล่น: ${moves} ครั้ง</p>
                <p>เวลาที่ใช้: ${timeUsedFormatted}</p>`;
            
            // Add play again button
            const playAgainButton = document.createElement('button');
            playAgainButton.textContent = 'เล่นอีกครั้ง';
            playAgainButton.style.padding = '12px 25px';
            playAgainButton.style.marginTop = '20px';
            playAgainButton.style.marginRight = '10px';
            playAgainButton.style.background = '#4CAF50';
            playAgainButton.style.color = 'white';
            playAgainButton.style.border = 'none';
            playAgainButton.style.borderRadius = '5px';
            playAgainButton.style.cursor = 'pointer';
            playAgainButton.style.fontSize = '16px';
            playAgainButton.style.fontFamily = "'Kanit', sans-serif";
            playAgainButton.addEventListener('click', () => {
                document.body.removeChild(gameContainer);
                initializeGame();
            });
            
            // Add close button
            const closeButton = document.createElement('button');
            closeButton.textContent = 'กลับหน้าหลัก';
            closeButton.style.padding = '12px 25px';
            closeButton.style.marginTop = '20px';
            closeButton.style.background = '#f44336';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '5px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.fontSize = '16px';
            closeButton.style.fontFamily = "'Kanit', sans-serif";
            closeButton.addEventListener('click', () => {
                document.body.removeChild(gameContainer);
            });
            
            const buttonContainer = document.createElement('div');
            buttonContainer.appendChild(playAgainButton);
            buttonContainer.appendChild(closeButton);
            winMessage.appendChild(buttonContainer);
            gameContainer.appendChild(winMessage);
            
            // Lock the board
            lockBoard = true;
        }
    }
    
    // Helper function to get random color for confetti
    function getRandomColor() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#ff0088'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }
    
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            
            resetBoard();
        }, 1500);
    }
    
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    function checkWin() {
        const allCards = document.querySelectorAll('.memory-card');
        const matchedCards = document.querySelectorAll('.memory-card.flip');
        
        if (allCards.length === matchedCards.length) {
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
                // You can add score saving logic here
            }, 500);
        }
    }
    
    // Add the game container to the document
    document.body.appendChild(gameContainer);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .memory-card {
            position: relative;
            width: 100%;
            aspect-ratio: 1;
            transform-style: preserve-3d;
            transition: transform 0.5s;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .memory-card.flip {
            transform: rotateY(180deg);
        }
        
        .front-face,
        .back-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
        }
        
        .front-face {
            background: #6b5b95;
            color: white;
            font-size: 24px;
            transform: rotateY(0deg);
        }
        
        .back-face {
            background: white;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            transform: rotateY(180deg);
        }
        
        @media (max-width: 768px) {
            .memory-card {
                width: calc((100vw - 80px) / 4);
                height: calc((100vw - 80px) / 4);
            }
            
            .front-face,
            .back-face {
                font-size: 18px;
            }
            
            #moves, #timer {
                font-size: 14px;
            }
        }
        
        @media (min-width: 769px) {
            .memory-card {
                width: 100px;
                height: 100px;
            }
        }
    `;
    
    // Add pulse animation for timer
    style.textContent += `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    
    // Add the styles to the document
    document.head.appendChild(style);
    
    // Prevent zooming on double-tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Prevent scrolling when touching the game
    gameContainer.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // Force viewport update on orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.content = viewport.content;
            }
        }, 100);
    });
} // End of initializeGame function

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for the back button if it exists
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = '/activity.html';
        });
    }
});
