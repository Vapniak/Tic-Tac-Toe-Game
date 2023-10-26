var Token;
(function (Token) {
    Token["Empty"] = "";
    Token["Cross"] = "X";
    Token["Circle"] = "O";
})(Token || (Token = {}));
var Cell = /** @class */ (function () {
    function Cell(value) {
        if (value === void 0) { value = Token.Empty; }
        this.color = "";
        this.value = value;
    }
    return Cell;
}());
var Player = /** @class */ (function () {
    function Player(name, token, colorClass) {
        this.name = name;
        this.token = token;
        this.color = colorClass;
    }
    return Player;
}());
var GameBoard = /** @class */ (function () {
    function GameBoard(size) {
        if (size === void 0) { size = 3; }
        this.size = size;
        this.board = [];
        for (var i = 0; i < this.size; i++) {
            this.board[i] = [];
            for (var j = 0; j < this.size; j++) {
                this.board[i][j] = new Cell();
            }
        }
    }
    GameBoard.prototype.placeToken = function (row, col, token, color) {
        this.board[row][col].value = token;
        this.board[row][col].color = color;
    };
    return GameBoard;
}());
var ScreenUpdater = /** @class */ (function () {
    function ScreenUpdater(gameManager) {
        var _a;
        this.boardDiv = document.getElementById("board");
        this.turnDiv = document.getElementById("turn");
        this.gameManager = gameManager;
        (_a = this.boardDiv) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.clickHandler);
    }
    ScreenUpdater.prototype.updateBoard = function () {
        var _this = this;
        this.boardDiv && (this.boardDiv.textContent = "");
        var board = this.gameManager.gameBoard.board;
        board.forEach(function (cellRow, indexRow) {
            cellRow.forEach(function (cell, indexCol) {
                var cellHTML = "\n                <button data-row=\"".concat(indexRow, "\" data-col=\"").concat(indexCol, "\" class=\"bg-zinc-900 hover:bg-opacity-80 bg-opacity-50 ").concat(cell.color, "\">\n                    ").concat(cell.value, "\n                </button>\n                ");
                _this.boardDiv && (_this.boardDiv.innerHTML += cellHTML);
            });
        });
    };
    ScreenUpdater.prototype.updateTurn = function () {
        this.turnDiv && (this.turnDiv.textContent = "");
        var activePlayer = this.gameManager.activePlayer;
        this.turnDiv && (this.turnDiv.innerHTML = "\n        <p><span class=\"".concat(activePlayer.color, "\">").concat(activePlayer.name, "</span> turn...</p>\n        "));
    };
    ScreenUpdater.prototype.displayWin = function (winner) {
        this.turnDiv && (this.turnDiv.innerHTML = "\n        <p><span class=\"".concat(winner.color, "\">").concat(winner.name, "</span> WINS!!!</p>\n        "));
    };
    ScreenUpdater.prototype.displayDraw = function () {
        this.turnDiv && (this.turnDiv.innerHTML = "\n        <p>DRAW</p>\n        ");
    };
    ScreenUpdater.prototype.clickHandler = function (e) {
        var selectedCol = e.target.dataset.col;
        var selectedRow = e.target.dataset.row;
        if (gameManager.gameBoard.board[selectedRow][selectedCol].value != Token.Empty)
            return;
        gameManager.playRound(selectedRow, selectedCol);
    };
    return ScreenUpdater;
}());
var GameManager = /** @class */ (function () {
    function GameManager(playerOneName, playerTwoName) {
        if (playerOneName === void 0) { playerOneName = "Player One"; }
        if (playerTwoName === void 0) { playerTwoName = "Player Two"; }
        this.isPlaying = true;
        this.moveCount = 0;
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
    GameManager.prototype.playRound = function (row, col) {
        if (!this.isPlaying)
            return;
        this.gameBoard.placeToken(row, col, this.activePlayer.token, this.activePlayer.color);
        this.moveCount++;
        var board = this.gameBoard.board;
        var n = board.length;
        //chekc col
        var s = this.activePlayer.token;
        for (var i = 0; i < n; i++) {
            if (board[row][i].value != s) {
                break;
            }
            if (i == n - 1) {
                this.win();
            }
        }
        //check row
        for (var i = 0; i < n; i++) {
            if (board[i][col].value != s) {
                break;
            }
            if (i == n - 1) {
                this.win();
            }
        }
        if (row == col) {
            for (var i = 0; i < n; i++) {
                if (board[i][i].value != s) {
                    break;
                }
                if (i == n - 1) {
                    this.win();
                }
            }
        }
        if (row + col == n - 1) {
            for (var i = 0; i < n; i++) {
                if (board[(n - 1) - i][i].value != s) {
                    break;
                }
                if (i == n - 1) {
                    this.win();
                }
            }
        }
        if (this.moveCount == (Math.pow(n, 2))) {
            this.draw();
        }
        this.switchActivePlayer();
        this.screenUpdater.updateBoard();
        if (this.isPlaying)
            this.screenUpdater.updateTurn();
    };
    GameManager.prototype.win = function () {
        this.screenUpdater.displayWin(this.activePlayer);
        this.isPlaying = false;
    };
    GameManager.prototype.draw = function () {
        this.screenUpdater.displayDraw();
        this.isPlaying = false;
    };
    GameManager.prototype.switchActivePlayer = function () {
        this.activePlayer = this.activePlayer === this.players[0] ? this.players[1] : this.players[0];
    };
    return GameManager;
}());
var gameManager = new GameManager();
