import { useEffect, useState } from 'react';
import { GAME_STATES } from './constants';
import { Telegram } from './telegram';

const EMPTY_VALUE = '';
const WIN_VALUE = 'win';
const gameSquaresDefault = new Array(9).fill(null).map((x, i) => ({
  id: i + 1,
  value: EMPTY_VALUE,
  win: EMPTY_VALUE,
}));

const X_SYMBOL = '✕';
const O_SYMBOL = '◯';

const FIRST_PLAYER = 1;
const SECOND_PLAYER = 2;

const createTurnMessage = (player) => `Player ${player} turn`;

const checkIfBoardWin = (squares) => {
  const winningCombinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];

    const [x, y, z] = [
      squares[a - 1].value,
      squares[b - 1].value,
      squares[c - 1].value,
    ];

    if (x === y && y === z && x !== EMPTY_VALUE) {
      return {
        combination: [a, b, c],
        winner: x === X_SYMBOL ? FIRST_PLAYER : SECOND_PLAYER,
      };
    }
  }

  if (squares.every((square) => square.value !== EMPTY_VALUE)) {
    return {
      tie: true,
    };
  }
  return {};
};

export const useGame = () => {
  const [winCombination, setWinCombination] = useState(null);
  const [state, setState] = useState(GAME_STATES.FIRST_PLAYER_TURN);
  const [currentPlayer, setCurrentPlayer] = useState(FIRST_PLAYER);
  const [gameSquares, setGameSquares] = useState(gameSquaresDefault);
  const [message, setMessage] = useState(createTurnMessage(FIRST_PLAYER));

  const setSquare = (id, value) => {
    setGameSquares(
      gameSquares.map((square) =>
        square.id === id ? { ...square, value } : square,
      ),
    );
  };

  const restartGame = () => {
    setGameSquares(gameSquaresDefault);
    setState(GAME_STATES.FIRST_PLAYER_TURN);
    setCurrentPlayer(FIRST_PLAYER);
    setMessage(createTurnMessage(FIRST_PLAYER));
    setWinCombination(null)
    Telegram.reset();
  };

  const checkGameWinner = () => {
    const { winner, tie, combination } = checkIfBoardWin(gameSquares);
    if (winner && !tie) {
      setWinCombination(combination);
    }
    if (winner || tie) {
      setState(GAME_STATES.GAME_OVER);
    }

    return { winner, tie };
  };

  const handleSquareClick = (event, id) => {
    if (state === GAME_STATES.GAME_OVER) {
      return;
    }

    const { value } = gameSquares.find((square) => square.id === id);
    if (value) {
      return;
    }

    const symbol = currentPlayer === FIRST_PLAYER ? X_SYMBOL : O_SYMBOL;
    setSquare(id, symbol);
    setCurrentPlayer(
      currentPlayer === FIRST_PLAYER ? SECOND_PLAYER : FIRST_PLAYER,
    );
  };

  const highlightSquare = (id) => {
    setGameSquares((prev) =>
      prev.map((square) => {
        if (square.id === id) {
          return { ...square, win: WIN_VALUE };
        }
        return square;
      }),
    );
  };

  const highlightSquares = ([x, y, z]) => {
    highlightSquare(x);
    highlightSquare(y);
    highlightSquare(z);
  };

  useEffect(() => {
    const message = createTurnMessage(currentPlayer);
    setMessage(message);
    const { winner, tie } = checkGameWinner();
    if (winner) {
      setMessage(`Grate! Player ${winner} won`);
    }
    if (tie) {
      setMessage('Tie!!');
    }
  }, [currentPlayer]);

  useEffect(() => {
    if (state === GAME_STATES.GAME_OVER) {
      Telegram.restartButton();
      if (winCombination) {
        highlightSquares(winCombination);
      }
    }
  }, [state, winCombination]);

  useEffect(() => {
    restartGame();

    const handler = () => {
      Telegram.onMainButtonClick(() => {
        restartGame();
      });
    };
    Telegram.onMainButtonClick(handler);
    return () => {
      Telegram.offMainButtonClick(handler);
    };
  }, []);

  return { gameSquares, handleSquareClick, message, state, restartGame };
};
