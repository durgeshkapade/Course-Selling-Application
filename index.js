const express = require('express');
const jwt  = require('jsonwebtoken');
const { courseRouter } = require('./routes/course');
const { userRouter } = require('./routes/user');
const {adminRouter} = require('./routes/admin')
const mongoose = require('mongoose');
require('dotenv').config({ quiet: true });

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/course', courseRouter);


const connectDb = async ()=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connect");

    app.listen(3000,()=>{
        console.log("Server Start");
    })
}


connectDb();

