document.addEventListener('DOMContentLoaded', () => {
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
    timerElement.textContent = 'Time: 0s';

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
        
        gameBoard.appendChild(cardElement);
    });

    // Start the timer
    timer = setInterval(() => {
        seconds++;
        timerElement.textContent = `Time: ${seconds}s`;
    }, 1000);

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
});
