import mongoose from 'mongoose'
const {Schema} = mongoose;

export const jobSchema = new Schema({
    title:{
        type:String,
        required:[true,'Job title is required'],
        trim:true
    },
    company:{
        type:String,
        required:[true,'Company name is required'],
        trim:true,
    },
    status:{
        type:String,
        enum:['Pending','Interview','Declined'],
        default:'Pending'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'Please provide user']
    }
},{timestamps:true})

export const Job = mongoose.model('Job',jobSchema);
