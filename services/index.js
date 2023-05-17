import MongoLib from "../lib/db.js";

class MongoService {
  constructor(collection) {
    this.collection = collection;
    this.mongoDB = new MongoLib();
  }

  async get(query) {
    const result = await this.mongoDB.get(this.collection, query);
    return result;
  }

  async getAll(query) {
    return await this.mongoDB.getAll(this.collection, query);
  }

  async create(data) {
    return this.mongoDB.create(this.collection, data);
  }

  async createMany(data) {
    return this.mongoDB.createMany(this.collection, data);
  }

  async update(query, data) {
    return this.mongoDB.update(this.collection, query, data);
  }

  async delete(query) {
    return this.mongoDB.delete(this.collection, query);
  }
}

export default MongoService;