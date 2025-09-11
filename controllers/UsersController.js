import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
    }
    if (await dbClient.userExists(email)) {
      res.status(400).json({ error: 'Already exists' });
    } else {
      const id = await dbClient.createUser(email, password);
      res.status(201).json({ id, email });
    }
  }

  static async getMe(req, res) {
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
    const email = await dbClient.getCredentialsByID(userID);
    res.status(200).json({ id: userID, email });
  }
}

export default UsersController;
