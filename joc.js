window.onload = function(){
    const main = document.querySelector('main');
    
    const container = document.createElement('div');
    container.id = 'game-container';
    
    const playerDiv = document.createElement('div');
    playerDiv.id = 'player-side';
    const playerLabel = document.createElement('h2');
    playerLabel.textContent = 'Player';
    playerDiv.appendChild(playerLabel);
    
    const grid = document.createElement('div');
    grid.id="game_grid";
    
    for(let row = 1; row <= 10; row++){
        for(let col = 1; col <= 10; col++){
            const cell = document.createElement('div');
            cell.classList.add("cell", "player-cell");
            cell.id=`${row}_${col}`;
            grid.appendChild(cell);
        }
    }
    playerDiv.appendChild(grid);
    container.appendChild(playerDiv);
    
    const enemyDiv = document.createElement('div');
    enemyDiv.id = 'enemy-side';
    const enemyLabel = document.createElement('h2');
    enemyLabel.textContent = 'Computer';
    enemyDiv.appendChild(enemyLabel);
    
    const enemyGrid = document.createElement('div');
    enemyGrid.id="enemy_grid";
    
    for(let row = 1; row <= 10; row++){
        for(let col = 1; col <= 10; col++){
            const cell = document.createElement('div');
            cell.classList.add("cell", "enemy-cell");
            cell.id=`enemy_${row}_${col}`;
            enemyGrid.appendChild(cell);
        }
    }
    enemyDiv.appendChild(enemyGrid);
    container.appendChild(enemyDiv);
    
    main.appendChild(container);
    
    const statusDiv = document.createElement('div');
    statusDiv.id = 'status';
    statusDiv.textContent = 'Position your ships';
    main.appendChild(statusDiv);
    
    const playButton = document.createElement('button');
    playButton.textContent = 'Start Game';
    playButton.id = 'play-button';
    main.appendChild(playButton);
    
    const scoreDiv = document.createElement('div');
    scoreDiv.id = 'score-container';
    const scoreTitle = document.createElement('h3');
    scoreTitle.textContent = 'Match History';
    scoreDiv.appendChild(scoreTitle);
    const scoreList = document.createElement('div');
    scoreList.id = 'score-list';
    scoreDiv.appendChild(scoreList);
    main.appendChild(scoreDiv);
    
    loadScores();

    let gameActive = false;
    let playerTurn = true;
    let playerHits = [];
    let enemyHits = [];
    let computerTargetQueue = [];

function barca(x,y,o,l,id,isEnemy) { 
    this.x = x;
    this.y = y;
    this.orientare = o;
    this.lungime = l;
    this.idbarca = id;
    this.isEnemy = isEnemy || false;
    this.head = {x: this.x, y: this.y};
    this.hits = 0;
    this.destroyed = false;

    this.getCells = function() {
        let cells = [];
        for(let i = 0; i < this.lungime; i++) 
        {
            let row = this.x;
            let col = this.y;
            
            if(this.orientare === 'os') 
            {
                col = this.y + i;
            }
            else
                if(this.orientare === 'od') 
                {
                    col = this.y - i;
                }
                else
                    if(this.orientare === 'vs') 
                    {
                        row = this.x + i;
                    }
                    else 
                        if(this.orientare === 'vj')
                        {
                            row = this.x - i;
                        }
            
            cells.push({row, col});
        }
        return cells;
    }

    this.drawSelf = function() {
        for(let i = 0; i < this.lungime; i++) 
        {
            let row = this.x;
            let col = this.y;
            
            if(this.orientare === 'os') 
            {
                col = this.y + i;
            }
            else
                if(this.orientare === 'od') 
                {
                    col = this.y - i;
                }
                else
                    if(this.orientare === 'vs') 
                    {
                        row = this.x + i;
                    }
                    else 
                        if(this.orientare === 'vj')
                        {
                            row = this.x - i;
                        }
            
            const cellId = this.isEnemy ? `enemy_${row}_${col}` : `${row}_${col}`;
            const cell = document.getElementById(cellId);
            if(cell) 
            {
                cell.classList.add('barca');
                cell.dataset.barca = this.idbarca;
                
                if(row === this.head.x && col === this.head.y) 
                {
                    cell.classList.add('barca-head');
                }
            }
        }
    }
    
    this.clearSelf = function() {
        for(let i = 0; i < this.lungime; i++) 
        {
            let row = this.x;
            let col = this.y;
            
            if(this.orientare === 'os') 
            {
                col = this.y + i;
            }
            else
                if(this.orientare === 'od') 
                {
                    col = this.y - i;
                }
                else
                    if(this.orientare === 'vs') 
                    {
                        row = this.x + i;
                    }
                    else 
                        if(this.orientare === 'vj')
                        {
                            row = this.x - i;
                        }
        
            const cellId = this.isEnemy ? `enemy_${row}_${col}` : `${row}_${col}`;
            const cell = document.getElementById(cellId);
            if(cell) 
            {
                cell.classList.remove('barca');
                cell.classList.remove('barca-head');
                delete cell.dataset.barca;
            }
        }
    }
    
    this.isValidPosition = function() {
        for(let i = 0; i < this.lungime; i++) 
        {
            let row = this.x;
            let col = this.y;
            
            if(this.orientare === 'os') 
            {
                col = this.y + i;
            }
            else
                if(this.orientare === 'od') 
                {
                    col = this.y - i;
                }
                else
                    if(this.orientare === 'vs') 
                    {
                        row = this.x + i;
                    }
                    else 
                        if(this.orientare === 'vj')
                        {
                            row = this.x - i;
                        }
            
            if(row < 1 || row > 10 || col < 1 || col > 10) 
            {
                return false;
            }
            
            const cellId = this.isEnemy ? `enemy_${row}_${col}` : `${row}_${col}`;
            const cell = document.getElementById(cellId);
            if(cell && cell.dataset.barca && cell.dataset.barca != this.idbarca) 
            {
                return false;
            }
        }
        
        for(let i = 0; i < this.lungime; i++) 
        {
            let row = this.x;
            let col = this.y;
            
            if(this.orientare === 'os') 
            {
                col = this.y + i;
            }
            else
                if(this.orientare === 'od') 
                {
                    col = this.y - i;
                }
                else
                    if(this.orientare === 'vs') 
                    {
                        row = this.x + i;
                    }
                    else 
                        if(this.orientare === 'vj')
                        {
                            row = this.x - i;
                        }
            
            for(let dr = -1; dr <= 1; dr++) 
            {
                for(let dc = -1; dc <= 1; dc++) 
                {
                    if(dr === 0 && dc === 0) 
                    {
                        continue;
                    }
                    
                    let adjRow = row + dr;
                    let adjCol = col + dc;
                    
                    if(adjRow >= 1 && adjRow <= 10 && adjCol >= 1 && adjCol <= 10) 
                    {
                        const cellId = this.isEnemy ? `enemy_${adjRow}_${adjCol}` : `${adjRow}_${adjCol}`;
                        const adjCell = document.getElementById(cellId);
                        if(adjCell && adjCell.dataset.barca && adjCell.dataset.barca != this.idbarca) 
                        {
                            return false;
                        }
                    }
                }
            }
        }
        
        return true;
    }
    
    this.checkValidPositionAt = function(newX, newY) {
        for(let i = 0; i < this.lungime; i++) 
        {
            let row = newX;
            let col = newY;
            
            if(this.orientare === 'os') 
            {
                col = newY + i;
            }
            else
                if(this.orientare === 'od') 
                {
                    col = newY - i;
                }
                else
                    if(this.orientare === 'vs') 
                    {
                        row = newX + i;
                    }
                    else 
                        if(this.orientare === 'vj')
                        {
                            row = newX - i;
                        }
            
            if(row < 1 || row > 10 || col < 1 || col > 10) 
            {
                return false;
            }
            
            const cellId = this.isEnemy ? `enemy_${row}_${col}` : `${row}_${col}`;
            const cell = document.getElementById(cellId);
            if(cell && cell.dataset.barca && cell.dataset.barca != this.idbarca) 
            {
                return false;
            }
        }
        
        for(let i = 0; i < this.lungime; i++) 
        {
            let row = newX;
            let col = newY;
            
            if(this.orientare === 'os') 
            {
                col = newY + i;
            }
            else
                if(this.orientare === 'od') 
                {
                    col = newY - i;
                }
                else
                    if(this.orientare === 'vs') 
                    {
                        row = newX + i;
                    }
                    else 
                        if(this.orientare === 'vj')
                        {
                            row = newX - i;
                        }
            
            for(let dr = -1; dr <= 1; dr++) 
            {
                for(let dc = -1; dc <= 1; dc++) 
                {
                    if(dr === 0 && dc === 0) 
                    {
                        continue;
                    }
                    
                    let adjRow = row + dr;
                    let adjCol = col + dc;
                    
                    if(adjRow >= 1 && adjRow <= 10 && adjCol >= 1 && adjCol <= 10) 
                    {
                        const cellId = this.isEnemy ? `enemy_${adjRow}_${adjCol}` : `${adjRow}_${adjCol}`;
                        const adjCell = document.getElementById(cellId);
                        if(adjCell && adjCell.dataset.barca && adjCell.dataset.barca != this.idbarca) 
                        {
                            return false;
                        }
                    }
                }
            }
        }
        
        return true;
    }
    
    this.rotateSelf = function() {
        this.clearSelf();
        
        if(this.orientare === 'os') 
        {
            this.orientare = 'vs';
        }
        else 
            if(this.orientare === 'vs') 
            {
                this.orientare = 'od';
            }
            else 
                if(this.orientare === 'od') 
                {
                    this.orientare = 'vj';
                }
                else 
                    if(this.orientare === 'vj') 
                    {
                        this.orientare = 'os';
                    }
        
        if(this.isValidPosition()) 
        {
            this.drawSelf();
        } 
        else 
        {
            if(this.orientare === 'os') 
            {
                this.orientare = 'vj';
            }
            else 
                if(this.orientare === 'vs') 
                {
                    this.orientare = 'os';
                }
                else 
                    if(this.orientare === 'od') 
                    {
                        this.orientare = 'vs';
                    }
                    else 
                        if(this.orientare === 'vj') 
                        {
                            this.orientare = 'od';
                        }
            this.drawSelf();
        }
        
        this.head = {x: this.x, y: this.y};
    }
    
    this.moveTo = function(newX, newY) {
        let oldX = this.x;
        let oldY = this.y;
        
        this.clearSelf();
        this.x = newX;
        this.y = newY;
        this.head = {x: this.x, y: this.y};
        
        if(this.isValidPosition()) 
        {
            this.drawSelf();
            return true;
        } 
        else 
        {
            this.x = oldX;
            this.y = oldY;
            this.head = {x: this.x, y: this.y};
            this.drawSelf();
            return false;
        }
    }
}

var barcile = [];
var enemyBarcile = [];

fetch('barci.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(boatData => {
            let boat = new barca(boatData.x, boatData.y, boatData.orientare, boatData.lungime, boatData.id, false);
            barcile.push(boat);
            boat.drawSelf();
        });
    });

var barcaSelectata = null;

function clearPreview() {
    document.querySelectorAll('.preview-valid, .preview-invalid').forEach(cell => {
        cell.classList.remove('preview-valid', 'preview-invalid');
    });
}

function showPreview(barca, newX, newY) {
    clearPreview();
    let isValid = barca.checkValidPositionAt(newX, newY);
    
    for(let i = 0; i < barca.lungime; i++) 
    {
        let row = newX;
        let col = newY;
        
        if(barca.orientare === 'os') 
        {
            col = newY + i;
        }
        else 
            if(barca.orientare === 'od') 
            {
                col = newY - i;
            }
            else 
                if(barca.orientare === 'vs') 
                {
                    row = newX + i;
                }
                else 
                    if(barca.orientare === 'vj')
                    {
                        row = newX - i;
                    }
        
        const cell = document.getElementById(`${row}_${col}`);
        if(cell && !cell.dataset.barca) 
        {
            cell.classList.add(isValid ? 'preview-valid' : 'preview-invalid');
        }
    }
}

function generateEnemyBoard() {
    enemyBarcile.forEach(b => b.clearSelf());
    enemyBarcile = [];
    
    const boatLengths = [5, 4, 3, 3, 2];
    const orientations = ['os', 'od', 'vs', 'vj'];
    
    for(let i = 0; i < boatLengths.length; i++) 
    {
        let placed = false;
        let attempts = 0;
        
        while(!placed && attempts < 1000) 
        {
            let randomX = Math.floor(Math.random() * 10) + 1;
            let randomY = Math.floor(Math.random() * 10) + 1;
            let randomOrientation = orientations[Math.floor(Math.random() * orientations.length)];
            
            let testBoat = new barca(randomX, randomY, randomOrientation, boatLengths[i], i + 1, true);
            
            if(testBoat.isValidPosition()) 
            {
                testBoat.drawSelf();
                enemyBarcile.push(testBoat);
                placed = true;
            }
            
            attempts++;
        }
    }
}

function saveScore(winner) {
    let scores = JSON.parse(localStorage.getItem('battleshipScores')) || [];
    let playerWins = scores.filter(s => s === 'Player').length;
    let computerWins = scores.filter(s => s === 'Computer').length;
    
    if(winner === 'Player') 
    {
        playerWins++;
    }
    else 
    {
        computerWins++;
    }
    
    scores.push(winner);
    localStorage.setItem('battleshipScores', JSON.stringify(scores));
    
    scoreList.textContent = `${playerWins} - ${computerWins}`;
}

function loadScores() {
    let scores = JSON.parse(localStorage.getItem('battleshipScores')) || [];
    let playerWins = scores.filter(s => s === 'Player').length;
    let computerWins = scores.filter(s => s === 'Computer').length;
    
    scoreList.textContent = `${playerWins} - ${computerWins}`;
    
    const style = window.getComputedStyle(scoreDiv);
    if(style.display === 'none') 
    {
        scoreDiv.style.display = 'block';
    }
}

function checkWin() {
    let playerDestroyed = barcile.filter(b => b.destroyed).length;
    let enemyDestroyed = enemyBarcile.filter(b => b.destroyed).length;
    
    if(enemyDestroyed === 5) 
    {
        statusDiv.textContent = 'Game Over - Player wins';
        gameActive = false;
        saveScore('Player');
        return true;
    }
    
    if(playerDestroyed === 5) 
    {
        statusDiv.textContent = 'Game Over - Computer wins';
        gameActive = false;
        saveScore('Computer');
        return true;
    }
    
    return false;
}

function computerTurn() {
    if(!gameActive || playerTurn) 
    {
        return;
    }
    
    statusDiv.textContent = 'Computer turn';
    
    setTimeout(() => {
        let targetRow, targetCol;
        let foundTarget = false;
        
        if(computerTargetQueue.length > 0) 
        {
            let target = computerTargetQueue.shift();
            targetRow = target.row;
            targetCol = target.col;
            foundTarget = true;
        } 
        else 
        {
            let attempts = 0;
            while(attempts < 100) 
            {
                targetRow = Math.floor(Math.random() * 10) + 1;
                targetCol = Math.floor(Math.random() * 10) + 1;
                
                let alreadyHit = playerHits.some(h => h.row === targetRow && h.col === targetCol);
                
                if(!alreadyHit) 
                {
                    foundTarget = true;
                    break;
                }
                attempts++;
            }
        }
        
        if(!foundTarget) 
        {
            playerTurn = true;
            statusDiv.textContent = 'Player turn';
            return;
        }
        
        let cell = document.getElementById(`${targetRow}_${targetCol}`);
        
        playerHits.push({row: targetRow, col: targetCol});
        
        let hitBoat = barcile.find(b => {
            let cells = b.getCells();
            return cells.some(c => c.row === targetRow && c.col === targetCol);
        });
        
        if(hitBoat) 
        {
            cell.classList.add('hit');
            cell.textContent = 'X';
            hitBoat.hits++;
            
            if(hitBoat.hits === hitBoat.lungime) 
            {
                hitBoat.destroyed = true;
                let cells = hitBoat.getCells();
                cells.forEach(c => {
                    let destroyedCell = document.getElementById(`${c.row}_${c.col}`);
                    destroyedCell.classList.add('destroyed');
                });
                computerTargetQueue = [];
            } 
            else 
            {
                let neighbors = [
                    {row: targetRow - 1, col: targetCol},
                    {row: targetRow + 1, col: targetCol},
                    {row: targetRow, col: targetCol - 1},
                    {row: targetRow, col: targetCol + 1}
                ];
                
                neighbors.forEach(n => {
                    if(n.row >= 1 && n.row <= 10 && n.col >= 1 && n.col <= 10) 
                    {
                        let alreadyHit = playerHits.some(h => h.row === n.row && h.col === n.col);
                        let alreadyQueued = computerTargetQueue.some(t => t.row === n.row && t.col === n.col);
                        if(!alreadyHit && !alreadyQueued) 
                        {
                            computerTargetQueue.push(n);
                        }
                    }
                });
            }
            
            if(!checkWin()) 
            {
                setTimeout(computerTurn, 800);
            }
        } 
        else 
        {
            cell.classList.add('miss');
            statusDiv.textContent = 'Player turn';
            playerTurn = true;
        }
    }, 800);
}

function handleEnemyCellClick(e) {
    if(!gameActive || !playerTurn) 
    {
        return;
    }
    if(!e.target.classList.contains('enemy-cell')) 
    {
        return;
    }
    
    let cellId = e.target.id.replace('enemy_', '');
    let [row, col] = cellId.split('_').map(Number);
    
    let alreadyHit = enemyHits.some(h => h.row === row && h.col === col);
    if(alreadyHit) 
    {
        return;
    }
    
    enemyHits.push({row, col});
    
    let hitBoat = enemyBarcile.find(b => {
        let cells = b.getCells();
        return cells.some(c => c.row === row && c.col === col);
    });
    
    if(hitBoat) 
    {
        e.target.classList.add('hit');
        e.target.textContent = 'X';
        hitBoat.hits++;
        
        if(hitBoat.hits === hitBoat.lungime) 
        {
            hitBoat.destroyed = true;
            let cells = hitBoat.getCells();
            cells.forEach(c => {
                let destroyedCell = document.getElementById(`enemy_${c.row}_${c.col}`);
                destroyedCell.classList.add('destroyed');
            });
        }
        
        if(!checkWin()) 
        {
            statusDiv.textContent = 'Player turn';
        }
    } 
    else 
    {
        e.target.classList.add('miss');
        statusDiv.textContent = 'Computer turn';
        playerTurn = false;
        setTimeout(computerTurn, 1000);
    }
}

playButton.addEventListener('click', function() {
    generateEnemyBoard();
    enemyDiv.style.display = 'block';
    playButton.disabled = true;
    gameActive = true;
    playerTurn = true;
    statusDiv.textContent = 'Player turn';
    
    document.querySelectorAll('.enemy-cell').forEach(cell => {
        cell.addEventListener('click', handleEnemyCellClick);
    });
});

document.addEventListener('mousedown', function(e) {
    if(gameActive) 
    {
        return;
    }
    if(e.target.classList.contains('cell') && e.target.dataset.barca && e.target.classList.contains('barca-head') && !e.target.id.startsWith('enemy_')) 
    {
        e.preventDefault();
        barcaSelectata = barcile.find(b => b.idbarca == e.target.dataset.barca);
    }
});

document.addEventListener('mousemove', function(e) {
    if(gameActive) 
    {
        return;
    }
    if(barcaSelectata && e.target.classList.contains('cell') && !e.target.id.startsWith('enemy_')) 
    {
        let cellId = e.target.id;
        let [previewX, previewY] = cellId.split('_').map(Number);
        showPreview(barcaSelectata, previewX, previewY);
    }
});

document.addEventListener('mouseup', function(e) {
    if(gameActive) 
    {
        return;
    }
    if(barcaSelectata) 
    {
        clearPreview();
        
        if(e.target.classList.contains('cell') && !e.target.id.startsWith('enemy_')) 
        {
            let cellId = e.target.id;
            let [endX, endY] = cellId.split('_').map(Number);
            barcaSelectata.moveTo(endX, endY);
        }
        barcaSelectata = null;
    }
});

document.addEventListener('click', function(e) {
    if(gameActive) 
    {
        return;
    }
    if(e.target.classList.contains('cell') && e.target.dataset.barca && e.target.classList.contains('barca-head') && !e.target.id.startsWith('enemy_')) 
    {
        let barcaId = e.target.dataset.barca;
        let barca = barcile.find(b => b.idbarca == barcaId);
        barca.rotateSelf();
    }
});

}