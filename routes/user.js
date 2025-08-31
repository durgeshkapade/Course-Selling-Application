const {Router}  = require('express');
const {userModel,purchaseModel , courseModel} = require('../db');
const userRouter = Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


userRouter.post('/signUp',async (req,res)=>{
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


userRouter.post('/signIn',async (req,res)=>{

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

            const token = jwt.sign(payload , process.env.JWT_SECRET);

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
  

userRouter.get('/purchases',(req,res)=>{
    res.send("Hello");
})


module.exports = {
    userRouter : userRouter
}