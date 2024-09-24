const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require("../models/models"); // Импортируйте вашу модель User
const ApiError = require("../errors/ApiError");
const FileService = require('./FileService');

const generateToken = (id, email, name, role) => {
    return jwt.sign(
        { id, email, name, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class UserService {
    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw ApiError.badRequest('User not found');
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            throw ApiError.badRequest('Wrong password');
        }
        const token = generateToken(user._id, user.email, user.name, user.role);
        return token;
    }

    async registration(email, password, name, role, avatar) {
        const candidate = await User.findOne({ email });
        if (candidate) {
            throw ApiError.badRequest(`User with email '${email}' already exists`);
        }
        const hashPassword = await bcrypt.hash(password, 10); // Используйте 10 для хеширования
        let avatarData;
        if (avatar) {
            avatarData = await FileService.saveFile(avatar);
        }
        const user = await User.create({
            email,
            password: hashPassword,
            name,
            role,
            avatar: avatarData?.fileName
        });
        const token = generateToken(user._id, user.email, user.name, user.role);
        return token;
    }

    async getAllUsers() {
        const users = await User.find({}, { password: 0, createdAt: 0, updatedAt: 0 });
        return users;
    }

    async editUser(token, name, avatar) {
        const candidate = jwt.decode(token);
        const user = await User.findById(candidate.id);
        if (!user) {
            throw ApiError.badRequest('User not found');
        }
        let avatarData;
        if (avatar) {
            if (user.avatar) {
                await FileService.deleteFile(user.avatar);
            }
            avatarData = await FileService.saveFile(avatar);
        }
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { name, avatar: avatarData?.fileName },
            { new: true }
        );
        return !!updatedUser;
    }

    async deleteAvatar(token) {
        const candidate = jwt.decode(token);
        const user = await User.findById(candidate.id);
        if (!user) {
            throw ApiError.badRequest('User not found');
        }
        await FileService.deleteFile(user.avatar);
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { avatar: null },
            { new: true }
        );
        return !!updatedUser;
    }

    async getCurrentUser(token) {
        const candidate = jwt.decode(token);
        const user = await User.findById(candidate.id, { password: 0, createdAt: 0, updatedAt: 0 });
        if (!user) {
            throw ApiError.badRequest('User not found');
        }
        return user;
    }
}

module.exports = new UserService();
