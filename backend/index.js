import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';


dotenv.config();
const app = express();
connectDB();

app.use(express.json({extended:true}));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/profile',profileRoutes);

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})