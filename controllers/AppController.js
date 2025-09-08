import DBClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  static getStatus(req, res) {
    if (DBClient.isAlive() && redisClient.isAlive()) {
      res.status(200).json({ redis: true, db: true });
    }
  }

  static getStats(req, res) {
    const users = DBClient.nbUsers();
    const files = DBClient.nbFiles();
    res.status(200).json({ users, files });
  }
}

export default AppController;
