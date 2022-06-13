import './App.css';
import { useGame } from './useGame';

const FIRST_PLAYER = 1;
const SECOND_PLAYER = 2;

export const GAME_STATES = {
  FIRST_PLAYER_TURN: 'firstPlayerTurn',
  SECOND_PLAYER_TURN: 'secondPlayerTurn',
  GAME_OVER: 'gameOver',
};

const getName = (player) => {
  return player.first_name || player.username;
};

const defaultGameSquares = new Array(9).fill(null).map((x, i) => ({
  id: i + 1,
  value: '',
  win: '',
}));

const getMessage = (game) => {
  if (!game) {
    return 'Game loading...';
  }
  const currentPlayer =
    game.currentPlayer === FIRST_PLAYER ? game.firstPlayer : game.secondPlayer;
  const oppositePlayer =
    game.currentPlayer === FIRST_PLAYER ? game.secondPlayer : game.firstPlayer;

  if (game.state === GAME_STATES.GAME_OVER) {
    const winner = game.winner;
    if (winner) {
      return `${getName(winner)} won!`;
    } else {
      return `It's a draw!`;
    }
  }

  if (game.you === currentPlayer.id.toString()) {
    return `It's your turn (${getName(currentPlayer)})`;
  } else {
    return `It' s your opponent turn (${getName(currentPlayer)})`;
  }
};

function App() {
  const { handleSquareClick, game } = useGame();

  const message = getMessage(game);
  const gameSquares = game?.gameSquares || defaultGameSquares;

  return (
    <div className="app">
      <h1>Tic Tac Toe</h1>
      <div className="description">
        It's a short description of playing tic tac toe
      </div>
      <div className="message">{message}</div>
      <div className="game">
        <div className="game-board">
          {gameSquares?.map((square) => (
            <div
              tabIndex="0"
              role="button"
              aria-label={`square-${square.id}`}
              key={square.id}
              onClick={(e) => handleSquareClick(e, square.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSquareClick(e, square.id);
                }
              }}
              className={`game-square ${square.win}`}
              data-id={square.id}
            >
              {square.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
