import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req,res,next)=>{
    let token = req.cookies.jwt;
    if(token){
        try{
            const decoded = jwt.verify(token,process.env.JWT);
            req.user = await User.findById(decoded.userId);
            next();
        }
        catch(e){
            console.log(e.message);
            res.status(404);
            throw new Error('Not authorized , token failed');
        }
    }
    else{
        res.status(401);
        throw new Error('Not authorized , no token');
    }
}