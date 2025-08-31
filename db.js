const  mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    email :{
        type : String,
        unique : true
    },
    password :{
        type : String    
    },
    firstName :{
        type : String,
    },
    lastName :{
        type : String,
    }

})

const adminSchema = new  Schema({
    email :{
        type : String,
        unique : true
    },
    password :{
        type : String    
    },
    firstName :{
        type : String,
    },
    lastName :{
        type : String,
    }

    
})


const courseSchema = new Schema({

    title : String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
    
})

const purchaseSchema = new Schema({

    userId: ObjectId,
    courseId: ObjectId
    
})


const userModel = new mongoose.model('user' ,userSchema)
const adminModel = new mongoose.model('admin' ,adminSchema)
const courseModel = new mongoose.model('course' ,courseSchema)
const purchaseModel = new mongoose.model('purchase' ,purchaseSchema)

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}