const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
import { url, dbName, collectionName } from '../config.js';

class UserModel {
    constructor() {
        this.client = new MongoClient(url, { useUnifiedTopology: true });
        this.db = null;
        this.collection = null;
    }

    async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db(dbName);
            this.collection = this.db.collection(collectionName);
            console.log(`Connected to ${url}`);
        } catch (err) {
            console.error(`Error while connecting to ${url}`, err.message);
        }
    }

    async disconnect() {
        try {
            await this.client.close();
            console.log(`Disconnected from ${url}`);
        } catch (err) {
            console.error(`Error while disconnecting from ${url}`, err.message);
        }
    }

    async genUserID() {
        try {
            const userID = new ObjectID();
            return userID;
        } catch (err) {
            console.error(`Error while generating userID `, err.message);
        }
    }

    async getUser(userID) {
        try {
            const user = await this.collection.findOne({ _id: ObjectID(userID) });
            return user;
        } catch (err) {
            console.error(`Error while getting user info `, err.message);
        }
    }

    async updateUser(userID, user) {
        try {
            const updatedUser = await this.collection.updateOne({ _id: ObjectID(userID) }, { $set: user });
            return updatedUser;
        } catch (err) {
            console.error(`Error while updating user info `, err.message);
        }
    }
}