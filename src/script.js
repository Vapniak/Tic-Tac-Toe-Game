const gameContainer = document.getElementById("game-container");

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeToken = (row, column, player) => {
    const isAvailable = board[row][column].getValue() === 0;
    console.log(isAvailable);
    if (!isAvailable) return;

    board[row][column].addMark(player);
  };

  const printBoard = () => {
    board.map((row) =>
      row.map((cell) => {
        gameContainer.innerHTML += cell.getElement();
      })
    );
  };

  return {
    getBoard,
    placeToken,
    printBoard,
  };
}

function Cell() {
  let value = "A";

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  const getElement = () => `
    <div class="flex justify-center flex-wrap content-center hover:bg-slate-700 cursor-pointer">
      <p class="text-9xl">${value}</p>
    </div>
  `;

  return {
    addToken,
    getValue,
    getElement,
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
  };

  const playRound = (row, column) => {
    board.placeToken(row, column, getActivePlayer().token);

    //check if won

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController();
