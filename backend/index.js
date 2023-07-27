import express from 'express';
import connectDB from './config/db.js';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/auth.js";
import {notFound,errorHandler} from './middleware/errorMiddleware.js';


dotenv.config();
const app = express();
connectDB();

app.use(express.json({extended:true}));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use('/api/auth',authRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})