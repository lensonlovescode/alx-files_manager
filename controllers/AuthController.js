import { v4 as uudv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const authorization = req.get('Authorization');
    if (!authorization) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const base64Credentials = authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');

    if (dbClient.authorize(email, password)) {
      const Token = uudv4();
      const key = `auth_${Token}`;
      const userID = await dbClient.getID(email, password);
      if (userID === null) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      await redisClient.set(key, userID.toString(), 86400);
      res.status(200).json({ token: Token });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

  static async getDisconnect(req, res) {
    const token = req.get('X-Token');
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const key = `auth_${token}`;
    const userID = await redisClient.get(key);
    if (userID === null) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await redisClient.del(key);
    res.status(204).send();
  }
}

export default AuthController;
