import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Represents a Redis client.
 */
class RedisClient {
  /**
   * Creates a new RedisClient instance.
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
    this.getAsync = promisify(this.client.GET).bind(this.client);
    this.setexAsync = promisify(this.client.SETEX).bind(this.client);
    this.delAsync = promisify(this.client.DEL).bind(this.client);
  }

  /**
   * Checks if this client's connection to the Redis server is active.
   * @returns {boolean}
   */
  isAlive() {
    return this.isClientConnected;
  }
 

  /**
   * async functions
   */ 
  async get(key) {
  return this.getAsync(key);
  }

  async set(key, value, duration) {
  await this.setexAsync(key, duration, value);
  }

  async del(key) {
  await this.delAsync(key);
  }

}

export const redisClient = new RedisClient();
export default redisClient;
