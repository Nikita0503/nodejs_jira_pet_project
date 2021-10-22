const ApiError = require("../errors/ApiError");
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next){
    console.log(req.headers.authorization)
    if(req.method === 'OPTIONS'){
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return next(ApiError.unauthorized());
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (e) {
        next(ApiError.unauthorized())
    }
}