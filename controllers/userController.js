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

    async registration(req, res, next){ //TODO: add avatar to User && check does role exist
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {email, password, name, role} = req.body;
            const token = await UserService.registration(email, password, name, role);
            return res.json({token})
        } catch (e) {
            next(e);
        }
    }

    async getAllUsers(req, res, next){
        try{
            const user = await UserService.getAllUsers();
            return res.json(user)
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();