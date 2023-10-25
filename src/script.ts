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

    public updateScreen(){
        this.boardDiv && (this.boardDiv.textContent = "");
        this.turnDiv && (this.turnDiv.textContent = "");

        let activePlayer = this.gameManager.activePlayer;

        this.turnDiv && (this.turnDiv.innerHTML = `
        <p><span class="${activePlayer.color}">${activePlayer.name}</span> turn...</p>
        `);

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

    public win(winner: Player){
        this.turnDiv && (this.turnDiv.innerHTML = `
        <p><span class="${winner.color}">${winner.name}</span> WINS!!!</p>
        `);
    }

    public draw(){
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

    playing: boolean = true;

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

        this.screenUpdater.updateScreen();
    }

    public playRound(row: number, col: number){
        if(!this.playing) return;

        this.gameBoard.placeToken(row, col, this.activePlayer.token, this.activePlayer.color);
        this.moveCount++;
        
        let board = this.gameBoard.board;
        let n = board.length;
        
        //chekc col
        let s = this.activePlayer.token;
        for(var i = 0; i < n; i++){
            if(board[i][row].value != s)
            break;
        if(i == n - 1)
        {
            console.log("Win for " + s)
        }
    }
    
    //check row
    for(var i = 0; i < n; i++){
        if(board[col][i].value != s){
            break;
        }
        if(i == n - 1){
            this.win();
            return;
        }
    }
    
    if(row == col){
        for(var i = 0; i < n; i++){
            if(board[i][i].value != s){
                break;
            }
                if(i == n - 1){
                    this.win();
                    return;
                }
            }
        }
        
        if(row + col == n - 1){
            for(var i = 0; i < n; i++){
                if(board[i][(n - 1) - i].value != s){
                    break;
                }
                
                if(i == n - 1)
                {
                    this.win();
                    return;
                }
            }
        }
        
        if(this.moveCount == (Math.pow(n, 2))){
            this.draw();
            return;
        }
        
        this.switchActivePlayer();
        this.screenUpdater.updateScreen();
    }

    private win(){
        this.screenUpdater.win(this.activePlayer);
        this.playing = false;
    }

    private draw(){
        this.screenUpdater.draw();
        this.playing = false;
    }

    private switchActivePlayer(){
        this.activePlayer = this.activePlayer === this.players[0] ? this.players[1] : this.players[0]; 
    }
}

let gameManager = new GameManager();