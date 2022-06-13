import { useEffect, useRef, useState } from 'react';
import { GAME_STATES } from './constants';
import { Telegram } from './telegram';
import { Api } from './api';

export const useGame = () => {
  const [game, setGame] = useState(null);
  const params = useRef({});

  useEffect(() => {
    const interval = setInterval(async () => {
      if (params.current.gameId) {
        const { game } = await Api.game({ ...params.current });
        if (
          game.wantRestart.length === 0 ||
          game.state !== GAME_STATES.GAME_OVER
        ) {
          Telegram.reset();
        }
        setGame(game);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const currentGameId = searchParams.get('id');
    const secret = searchParams.get('secret');
    const userId = Telegram.getUser()?.id?.toString?.();
    params.current.secret = secret;
    params.current.userId = userId;
    params.current.gameId = currentGameId;

    Api.game({ gameId: currentGameId, secret, userId }).then((x) => {
      setGame(x?.game);
    });
  }, []);

  const handleSquareClick = async (event, id) => {
    const { game } = await Api.move({
      squareId: id,
      gameId: params.current.gameId,
      secret: params.current.secret,
      userId: params.current.userId,
    });

    setGame(game);
  };

  useEffect(() => {
    const handler = () => {
      Telegram.onMainButtonClick(async () => {
        const { game } = await Api.restartGame({ ...params.current });
        if (
          game.wantRestart.includes(params.current.userId) &&
          game.wantRestart.length === 1
        ) {
          Telegram.showProgressButton();
        }
        setGame(game);
      });
    };
    Telegram.onMainButtonClick(handler);
    return () => {
      Telegram.offMainButtonClick(handler);
    };
  }, []);

  useEffect(() => {
    if (game?.state === GAME_STATES.GAME_OVER) {
      Telegram.restartButton();
    }
  }, [game]);

  return {
    handleSquareClick,
    game,
  };
};
