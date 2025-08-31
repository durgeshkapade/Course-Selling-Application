const {Router} = require('express');
const courseRouter = Router();
const {purchaseModel , courseModel} = require('../db');

courseRouter.post('/purchase',(req,res)=>{
    res.send("want to purchase Course")
})

courseRouter.get('/preview',(req,res)=>{
    res.send("All Course")
})

module.exports = {
    courseRouter :courseRouter 
}