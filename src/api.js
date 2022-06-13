import { SERVER_URL } from './constants';

const get = async (...params) => fetch(...params).then((x) => x.json());
const post = async (...params) => fetch(...params).then((x) => x.json());

export class Api {
  static async game({ gameId, secret, userId }) {
    const data = await get(
      `${SERVER_URL}/games/${gameId}?playerId=${userId}&secret=${secret}`,
    );
    return data;
  }

  static async move({ squareId, gameId, secret, userId }) {
    const data = await post(
      `${SERVER_URL}/move/${gameId}?squareId=${squareId}&secret=${secret}&playerId=${userId}`,
      {
        method: 'POST',
      },
    );
    return data;
  }

  static async restartGame({ gameId, secret, userId }) {
    const data = await post(
      `${SERVER_URL}/restart_game/${gameId}?secret=${secret}&playerId=${userId}`,
      {
        method: 'POST',
      },
    );
    return data;
  }
}
