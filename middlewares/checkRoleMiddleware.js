const ApiError = require("../errors/ApiError");
const jwt = require('jsonwebtoken');

module.exports = function(role){
    return function (req, res, next){
        if(req.method === 'OPTIONS'){
            next();
        }
        try {
            const token = req.headers.authorization.split(' ')[1];
            if(!token){
                return next(ApiError.unauthorized());
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log(decoded)
            if(decoded.role !== role){
                return next(ApiError.forbidden(`the ${decoded.role} role does not have access to this resource`));
            }
            req.user = decoded;
            next();
        } catch (e) {
            next(ApiError.unauthorized())
        }
    };
};