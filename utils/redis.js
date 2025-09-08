import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.log(`Error on client: ${error}`);
    });
  }

  async isAlive() {
    try {
      await this.client.connect();
      console.log('Connected to Redis');
      return true;
    } catch (err) {
      console.error('Error connecting:', err);
      return false;
    }
  }

  async get(key) {
    const value = await this.client.get(key);
    return value;
  }

  async set(key, value, duration) {
    await this.client.set(key, value);
    await this.client.expire(key, duration);
  }

  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
