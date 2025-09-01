const {Router} = require('express');
const courseRouter = Router();
const {purchaseModel , courseModel} = require('../db');
const { userMiddleware } = require('../middleware/user');

courseRouter.post('/purchase', userMiddleware , async (req,res)=>{

    try{

        const userId = req.userId;
        const courseId = req.body.courseId;

        // before we check user already purchase or not
        const alreadyPurchase = await purchaseModel.findOne({
            userId : userId,
            courseId : courseId
        })

        if(alreadyPurchase){
            return res.status(200).json({
                message : "You Already Purchase This Course"
            })
        }

        await purchaseModel.create({
            userId,
            courseId
        })

        return res.status(200).json({
            message : "Purchase Course Successfully"
        })

    }catch(err){
        return res.status(404).json({
            message : "Internal Server error"
        })

    }
    
})

courseRouter.get('/preview',async (req,res)=>{

    try{

        const courses = await courseModel.find({})


        return res.status(200).json({
            message : "Here is all Courses",
            courses
        })

    }catch(err){
        return res.status(404).json({
            message : "Internal Server error"
        })
 
    }
    
})

module.exports = {
    courseRouter :courseRouter 
}