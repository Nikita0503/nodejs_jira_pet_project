const ApiError = require('../errors/ApiError');
const UserService = require('../service/UserService')
const {validationResult} = require('express-validator');

class UserController {

    async login(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {email, password} = req.body;
            const token = await UserService.login(email, password);
            return res.json({token})
        } catch (e) {
            next(e);
        }
    }

    async registration(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {email, password, name, role} = req.body;
            const avatar = req.files?.avatar;
            const token = await UserService.registration(email, password, name, role, avatar);
            return res.json({token})
        } catch (e) {
            next(e);
        }
    }

    async getAllUsers(req, res, next){
        try{
            const users = await UserService.getAllUsers();
            return res.json({users})
        } catch (e) {
            next(e);
        }
    }

    async editUser(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const token = req.headers.authorization.split(' ')[1];
            const {name} = req.body;
            const avatar = req.files?.avatar;
            const isDone = await UserService.editUser(token, name, avatar);
            return res.json({updated: isDone})
        } catch (e) {
            next(e);
        }
    }

    async deleteAvatar(req, res, next){
        const token = req.headers.authorization.split(' ')[1];
        const isDone = await UserService.deleteAvatar(token)
        return res.json({updated: isDone})
    }
}

module.exports = new UserController();