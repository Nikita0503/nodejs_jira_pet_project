const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require("../models/models");
const ApiError = require("../errors/ApiError");
const FileService = require('./FileService');

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

    async registration(email, password, name, role, avatar){
        const candidate = await User.findOne({where: {email}});
        if(candidate){
            throw ApiError.badRequest(`User with email '${email}' already exist`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        let avatarData;
        if(avatar){
            avatarData = await FileService.saveFile(avatar);
        }
        const user = await User.create({email, password: hashPassword, name, role, avatar: avatarData?.fileName});
        const token = generateToken(user.id, user.email, user.name, user.role);
        return token;
    }

    async getAllUsers(){
        const users = await User.findAll({attributes: {exclude: ['password', 'createdAt', 'updatedAt']}});
        return users;
    }

    async editUser(token, name, avatar){
        const candidate = jwt.decode(token);
        const user = await User.findOne({where: {id: candidate.id}});
        if(!user){
            throw ApiError.badRequest('User not found')
        }
        let avatarData;
        if(avatar){
            if(user.avatar){
                FileService.deleteFile(user.avatar);
            }
            avatarData = await FileService.saveFile(avatar);
        }
        const updatedUserId = await User.update({name, avatar: avatarData?.fileName}, {where: {id: user.id}});
        return !!updatedUserId;
    }

    async deleteAvatar(token){
        const candidate = jwt.decode(token);
        const user = await User.findOne({where: {id: candidate.id}});
        if(!user){
            throw ApiError.badRequest('User not found')
        }
        FileService.deleteFile(user.avatar);
        const updatedUserId = await User.update({avatar: null}, {where: {id: user.id}});
        return !!updatedUserId;
    }

    async getCurrentUser(token){
        const candidate = jwt.decode(token);
        const user = await User.findOne({attributes: {exclude: ['password', 'createdAt', 'updatedAt']}, where: {id: candidate.id}});
        if(!user){
            throw ApiError.badRequest('User not found')
        }
        return user;
    }
}

module.exports = new UserService();