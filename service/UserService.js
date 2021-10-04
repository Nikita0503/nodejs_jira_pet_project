const { User } = require("../models/models");
const bcrypt = require('bcrypt');
const ApiError = require("../errors/ApiError");

class UserService {
    async registration(email, password, name, role){
        const candidate = await User.findOne({where: {email}});
        if(candidate){
            throw ApiError.internal(`User with email '${email}' exist`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await User.create({email, password: hashPassword, name, role});
        return user;
    }
}

module.exports = new UserService();