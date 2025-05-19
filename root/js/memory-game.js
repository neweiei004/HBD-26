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

    // Card images - replace with your own image paths
    const cardImages = [
        '/img/memory/1.jpg',
        '/img/memory/2.jpg',
        '/img/memory/3.jpg',
        '/img/memory/4.jpg',
        '/img/memory/5.jpg',
        '/img/memory/6.jpg',
    ];

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
    
    function checkWin() {
        const allCards = document.querySelectorAll('.memory-card');
        const matchedCards = document.querySelectorAll('.memory-card.flip');
        
        if (allCards.length === matchedCards.length) {
            clearInterval(timer);
            setTimeout(() => {
                alert(`Congratulations! You won in ${moves} moves and ${seconds} seconds!`);
                // Add points to user's account
                // You can implement this part based on your needs
            }, 500);
        }
    }
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .memory-card {
            width: 100px;
            height: 100px;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.5s;
            cursor: pointer;
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
        }
        
        .back-face {
            transform: rotateY(180deg);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(gameContainer);
});
