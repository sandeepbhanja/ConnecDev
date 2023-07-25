import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');
    }
    catch(e){
        console.log('error connecting to DB ' + e);
        process.exit(1);
    }
}

export default connectDB;
