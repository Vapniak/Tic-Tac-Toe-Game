enum Token{
    Empty = "",
    Cross = "X",
    Circle = "O"
}

class Cell{
    value: Token;
    color: string = "";

    constructor(value: Token = Token.Empty){
        this.value = value;
    }
}

class Player{
    name: string;
    token: Token;
    color: string;

    constructor(name: string, token: Token, colorClass: string){
        this.name = name;
        this.token = token;
        this.color = colorClass;
    }
}

class GameBoard{
    board: Cell[][];
    private size: number;

    constructor(size: number = 3){
        this.size = size;

        this.board = [];
        for(var i = 0; i < this.size; i++){
            this.board[i] = [];
            for(var j = 0; j < this.size; j++){
                this.board[i][j] = new Cell();
            }
        }
    }

    public placeToken(row: number, col: number, token: Token, color: string){
        this.board[row][col].value = token;
        this.board[row][col].color = color;
    }
}

class ScreenUpdater{
    private gameManager: GameManager;

    private boardDiv = document.getElementById("board");
    private turnDiv = document.getElementById("turn");

    constructor(gameManager: GameManager){
        this.gameManager = gameManager;

        this.boardDiv?.addEventListener("click", this.clickHandler);
    }

    public updateBoard(){
        this.boardDiv && (this.boardDiv.textContent = "");

        let board = this.gameManager.gameBoard.board; 
        board.forEach((cellRow, indexRow) => {
            cellRow.forEach((cell, indexCol) =>{
                const cellHTML = `
                <button data-row="${indexRow}" data-col="${indexCol}" class="bg-zinc-900 hover:bg-opacity-80 bg-opacity-50 ${cell.color}">
                    ${cell.value}
                </button>
                `;

                this.boardDiv && (this.boardDiv.innerHTML += cellHTML);
            });
        });
    }

    public updateTurn(){
        this.turnDiv && (this.turnDiv.textContent = "");
        let activePlayer = this.gameManager.activePlayer;

        this.turnDiv && (this.turnDiv.innerHTML = `
        <p><span class="${activePlayer.color}">${activePlayer.name}</span> turn...</p>
        `);
    }

    public displayWin(winner: Player){
        this.turnDiv && (this.turnDiv.innerHTML = `
        <p><span class="${winner.color}">${winner.name}</span> WINS!!!</p>
        `);
    }

    public displayDraw(){
        this.turnDiv && (this.turnDiv.innerHTML = `
        <p>DRAW</p>
        `);
    }

    private clickHandler(e: any){
        const selectedCol = e.target.dataset.col;
        const selectedRow = e.target.dataset.row;

        if(gameManager.gameBoard.board[selectedRow][selectedCol].value != Token.Empty) return;

        gameManager.playRound(selectedRow, selectedCol);
    }
}


class GameManager{
    gameBoard: GameBoard;
    screenUpdater: ScreenUpdater;

    isPlaying: boolean = true;

    players: Player[];
    activePlayer: Player;

    moveCount: number = 0;

    constructor(playerOneName: string = "Player One", playerTwoName: string = "Player Two"){
        this.gameBoard = new GameBoard(3);
        this.screenUpdater = new ScreenUpdater(this);

        this.players = [
            new Player(playerOneName, Token.Cross, "text-red-500"),
            new Player(playerTwoName, Token.Circle, "text-blue-500")
        ];

        this.activePlayer = this.players[0];

        this.screenUpdater.updateTurn();
        this.screenUpdater.updateBoard();
    }

    public playRound(row: number, col: number){
        if(!this.isPlaying) return;

        this.gameBoard.placeToken(row, col, this.activePlayer.token, this.activePlayer.color);
        this.moveCount++;
        
        let board = this.gameBoard.board;
        let n = board.length;
        
        //chekc col
        let s = this.activePlayer.token;
        for(var i = 0; i < n; i++){
            if(board[row][i].value != s){
                break;
            }
            if(i == n - 1)
            {
                this.win();
            }
        }
    
        //check row
        for(var i = 0; i < n; i++){
            if(board[i][col].value != s){
                break;
            }
            if(i == n - 1){
                this.win();
            }
        }
        
        if(row == col){
            for(var i = 0; i < n; i++){
                if(board[i][i].value != s){
                    break;
                }
                if(i == n - 1){
                    this.win();
                }
            }
        }
            
        if(row + col == n - 1){
            for(var i = 0; i < n; i++){
                if(board[(n - 1) - i][i].value != s){
                    break;
                }
                
                if(i == n - 1)
                {
                    this.win();
                }
            }
        }
        
        if(this.moveCount == (Math.pow(n, 2))){
            this.draw();
        }
        
        this.switchActivePlayer();
        this.screenUpdater.updateBoard();

        if(this.isPlaying)
            this.screenUpdater.updateTurn();
    }

    private win(){
        this.screenUpdater.displayWin(this.activePlayer);
        this.isPlaying = false;
    }

    private draw(){
        this.screenUpdater.displayDraw();
        this.isPlaying = false;
    }

    private switchActivePlayer(){
        this.activePlayer = this.activePlayer === this.players[0] ? this.players[1] : this.players[0]; 
    }
}

let gameManager = new GameManager();