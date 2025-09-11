import { MongoClient } from 'mongodb';
import crypto from 'crypto';

class DBClient {
  constructor() {
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_PORT = process.env.DB_PORT || 27017;
    const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
    this.client = new MongoClient(`mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);
  }

  isAlive() {
    try {
      this.client.connect();
      console.log('Connected to MongoDB');
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async nbUsers() {
    const db = this.client.db();
    const collection = db.collection('users');
    return collection.countDocuments();
  }

  async nbFiles() {
    const db = this.client.db();
    const collection = db.collection('files');
    return collection.countDocuments();
  }

  async userExists(email) {
    const db = this.client.db();
    const collection = db.collection('users');
    const cursor = collection.find({ email });
    const docs = await cursor.toArray();
    for (const doc of docs) {
      if (doc.email === email) {
        return true;
      }
    }
    return false;
  }

  async createUser(email, password) {
    const db = this.client.db();
    const collection = db.collection('users');
    const hash = crypto.createHash('sha1');
    hash.update(password);
    const hashedpwd = hash.digest('hex');
    const result = await collection.insertOne({ email, password: hashedpwd });
    if (result) {
      return result.insertedId;
    }
  }

  async authorize(email, password) {
    const db = this.client.db();
    const collection = db.collection('users');
    const cursor = collection.find({});
    const docs = await cursor.toArray();
    const hashedpwd = crypto.createHash('sha1').update(password).digest('hex');
    for (const doc of docs) {
      if (doc.email === email && doc.password === hashedpwd) {
        return true;
      }
    }
    return false;
  }

  async getEmail(email, password) {
    const db = this.client.db();
    const collection = db.collection('users');
    const cursor = collection.find({});
    const docs = await cursor.toArray();
    const hashedpwd = crypto.createHash('sha1').update(password).digest('hex');
    for (const doc of docs) {
      if (doc.email === email && doc.password === hashedpwd) {
        return doc._id;
      }
    }
    return null;
  }

  async getID(email, password) {
    const db = this.client.db();
    const collection = db.collection('users');
    const cursor = collection.find({});
    const docs = await cursor.toArray();
    const hashedpwd = crypto.createHash('sha1').update(password).digest('hex');
    for (const doc of docs) {
      if (doc.email === email && doc.password === hashedpwd) {
        return doc._id;
      }
    }
    return null;
  }

  async getCredentialsByID(userID) {
    const db = this.client.db();
    const collection = db.collection('users');
    const cursor = collection.find();
    const docs = await cursor.toArray();
    for (const doc of docs) {
      if (doc._id.toString() === userID) {
        return doc.email;
      }
    }
    return null;
  }
}

const dbClient = new DBClient();
export default dbClient;
