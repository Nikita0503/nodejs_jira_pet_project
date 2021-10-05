const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require("../models/models");
const ApiError = require("../errors/ApiError");

const generateToken = (id, email, name, role) => {
    return jwt.sign(
        {id, email, name, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserService {
    async login(email, password){
        const user = await User.findOne({where: {email}});
        if(!user){
            throw ApiError.badRequest('User not found')
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if(!comparePassword){
            throw ApiError.badRequest('Wrong password')
        }
        const token = generateToken(user.id, user.email, user.name, user.role);
        return token;
    }

    async registration(email, password, name, role){
        const candidate = await User.findOne({where: {email}});
        if(candidate){
            throw ApiError.internal(`User with email '${email}' already exist`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await User.create({email, password: hashPassword, name, role});
        const token = generateToken(user.id, user.email, user.name, user.role);
        return token;
    }

    async getAllUsers(){
        const users = await User.findAll();
        return users;
    }
}

module.exports = new UserService();