const ApiError = require('../errors/ApiError');
const UserService = require('../service/UserService')
const {validationResult} = require('express-validator');

class UserController {
    async login(req, res){
        return res.json({'message': 'login'})
    }

    async registration(req, res, next){ //TODO: add avatar to User && check does role exist
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest("Invalid data", errors))
            }
            const {email, password, name, role} = req.body;
            const user = await UserService.registration(email, toString(password), name, role);
            return res.json(user)
        } catch (e) {
            next(e);
        }
        
    }
}

module.exports = new UserController();