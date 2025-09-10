import dbClient from '../utils/db';

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
      res.status(200).json({ id, email });
    }
  }
}

export default UsersController;
