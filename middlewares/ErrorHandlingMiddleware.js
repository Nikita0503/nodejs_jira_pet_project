const ApiError = require('../errors/ApiError');

module.exports = function (err, req, res, next) {
    if(err instanceof ApiError){
        let message = {message: err.message};
        if(err.errors){
            message = {
                ...message,
                ...err.errors
            }
        }
        return res.status(err.status).json(message);
    }
    return res.status(500).json({message: 'Unknown error :('})
}