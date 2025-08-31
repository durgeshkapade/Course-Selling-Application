const jwt  = require('jsonwebtoken');
require('dotenv').config();

function userMiddleware(req , res, next){

    const token = req.headers.token;

    const decode  = jwt.verify(token , JWT_USER_SECRET);

    if(decode){

        req.userId = decode.id;
        next();

    }else{
        return res.status(403).json({
            message : "You are not signed In"
        })
    }

}


module.exports = {
    userMiddleware  : userMiddleware
}