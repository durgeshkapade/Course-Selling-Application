const { Router } = require("express");
const adminRouter = Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { adminModel, courseModel } = require("../db");
const {adminMiddleware} = require('../middleware/admin');


adminRouter.post("/signup", async function(req, res) {

    try{

        const { email , password ,firstName ,lastName }= req.body;

        if(!email || !password || !firstName || !lastName){
            res.json({
                message : "Enter All Field"
            })
        }
        
        const existingUser = await adminModel.findOne({email})

        if(existingUser){
            return res.status(400).json({
                message : "Admin Already Exits"
            })
        }

        const hashPassword = await bcrypt.hash(password ,10);
        if(!hashPassword){
            return res.status(400).json({
                message:"Password hashing failed",
            });
        }
        
        const admin = await adminModel.create({
            email  ,
            password : hashPassword ,
            firstName ,
            lastName 
        })

        return res.status(200).json({
            message : "Admin Created Successfully",
            data : admin
        })

    }catch(err){
        return res.status(500).json({
            message:"Internal server error SignUp"
        })
    }
   
    
})

adminRouter.post("/signin", async function(req, res) {

    try{

        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "Please enter All details carefully"
            })
        }

        let admin = await adminModel.findOne({email});

        if(!admin){
            return res.status(401).json({
                success : false,
                message :"Admin Does not Exist"
            })
        }

        const payload = {
            id : admin._id,
            email : admin.email
        }

        if(await bcrypt.compare(password , admin.password)){

            const token = jwt.sign(payload , process.env.JWT_ADMIN_SECRET);

            admin.password = undefined

            return res.status(200).json({
                success : true,
                admin,
                token,
                message : "Admin Login successfully"
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




adminRouter.post("/course", adminMiddleware ,async function(req, res) {

    const adminId = req.userId;

    const { title, description,price,imageUrl } = req.body;

    const course = await courseModel.create({
        title ,
        description,
        price,
        imageUrl,
        creatorId : adminId
    })

    return res.status(200).json({
        message : "Course Created",
        courseId : course._id
    })
    
})

adminRouter.put("/course", adminMiddleware , async function(req, res) {

    const adminId = req.userId;

    const { title, description,price,imageUrl ,courseId} = req.body;

    const course = await courseModel.updateOne({
        _id : courseId ,
        creatorId : adminId
    },{
        title : title,
        description : description,
        price : price,
        imageUrl : imageUrl,
    })

    
    if(course.modifiedCount == 0 ){
        return res.status(200).json({
            message : "You are not creator of that course , so can't update it"
        })
    }

    return res.status(200).json({
        message : "Course Updated Successfully",
        course,
        courseId : course._id
    })
    
})

adminRouter.get("/course/bulk",adminMiddleware , async function(req, res) {

     const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId : adminId
    })

    return res.status(200).json({
        message : "This is all Courses",
        courses
    })
    
})

module.exports = {
    adminRouter: adminRouter
}