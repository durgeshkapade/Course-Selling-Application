const jwt  = require('jsonwebtoken');
require('dotenv').config({ quiet: true });

function adminMiddleware(req , res, next){

    const token = req.headers.token;

    const decode  = jwt.verify(token , process.env.JWT_ADMIN_SECRET);

    if(decode){

        req.userId = decode.id;

        // console.log(decode);
        // console.log(decode.id);
        // console.log(req.userId);
        
        next();

    }else{
        return res.status(403).json({
            message : "You are not signed In"
        })
    }

}


module.exports = {
    adminMiddleware  : adminMiddleware
}