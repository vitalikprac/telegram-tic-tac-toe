import './App.css';
import { useGame } from './useGame';

function App() {
  const { gameSquares, handleSquareClick, message, state } = useGame();

  return (
    <div className="app">
      <h1>Tic Tac Toe</h1>
      <div className="description">
        It's a short description of playing tic tac toe
      </div>
      <div className="message">{message}</div>
      <div className="game">
        <div className="game-board">
          {gameSquares.map((square) => (
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
