const {Router}  = require('express');
const userRouter = Router();
const {userModel,purchaseModel , courseModel} = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {userMiddleware} = require('../middleware/user')
require('dotenv').config({ quiet: true });




userRouter.post('/signup',async (req,res)=>{
    try{

        const { email , password ,firstName ,lastName }= req.body;

        if(!email || !password || !firstName || !lastName){
            res.json({
                message : "Enter All Field"
            })
        }
        
        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.status(400).json({
                message : "User Already Exits"
            })
        }

        const hashPassword = await bcrypt.hash(password ,10);
        if(!hashPassword){
            return res.status(400).json({
                message:"Password hashing failed",
            });
        }
        
        const user = await userModel.create({
            email  ,
            password : hashPassword ,
            firstName ,
            lastName 
        })

        return res.status(200).json({
            message : "User Created Successfully",
            data : user
        })

    }catch(err){
        return res.status(500).json({
            message:"Internal server error SignUp"
        })
    }

})


userRouter.post('/signin',async (req,res)=>{

    try{

        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "Please enter All details carefully"
            })
        }

        

        let user = await userModel.findOne({email});

        if(!user){
            return res.status(401).json({
                success : false,
                message :"User Does not Exist"
            })
        }

        const payload = {
            id : user._id,
            email : user.email
        }

        if(await bcrypt.compare(password , user.password)){

            const token = jwt.sign(payload , process.env.JWT_USER_SECRET);

            user.password = undefined

            return res.status(200).json({
                success : true,
                user,
                token,
                message : "user Login successfully"
            })


        }else{
            return res.status(400).json({
                success : false,
                message :"Password is Incorrect .."
            })
        }


    }catch(err){
        return res.status(500).json({
            message:"Internal server error signin"
        })
    }

})


userRouter.get('/purchases',userMiddleware ,  async(req,res)=>{

    try{

        const userId = req.userId;

        const purchases = await  purchaseModel.find({
            userId
        })

        // 1 way = Both are , but only diff is here we not use map [ extract ids and then find course form ids array]

        // const ids = [];
        // for(let i=0;i<purchases.length ; i++){
        //     ids.push(purchases[i].courseId)
        // }

        // const courseData = await  courseModel.find({
        //     _id : { $in : ids}
        // }) 

        // 2 way

        const courseData = await courseModel.find({
            _id : { $in : purchases.map(x => x.courseId)}
        }) 



        

        return res.status(200).json({
            message : "All Purchases Course",
            purchases,
            courseData
        })


    }catch(err){
        return res.status(404).json({
            message : "Internal Server Error"
        })

    }


})


module.exports = {
    userRouter : userRouter
}