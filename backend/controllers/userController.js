const uuidv4 = require('uuid');

class UserController {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async genUserID() {
        try {
            const userID = uuidv4();
            return userID;
        } catch (err) {
            console.error(`Error while generating userID `, err.message);
        }
    }

    async getUser(userID) {
        try {
            const user = await this.userModel.getUser(userID);
            return user;
        } catch (err) {
            console.error(`Error while getting user info `, err.message);
        }
    }

    async updateUser(userID, user) {
        try {
            const updatedUser = await this.userModel.updateUser(userID, user);
            return updatedUser;
        } catch (err) {
            console.error(`Error while updating user info `, err.message);
        }
    }
}