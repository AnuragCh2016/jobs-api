import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes';
import errors from '../errors/index.js';

export const authenticateMiddleware = async (req,res,next) => {
    const {authorization} = req.headers;
    // console.log(authorization);
    if(!(authorization) || !authorization.startsWith('Bearer ')){
        throw new errors.UnauthenticatedError(`Not authorized to access this route`);
        // res.status(StatusCodes.UNAUTHORIZED).json({msg: "Not authorized to access this route"});

    }
    const token = authorization.split(' ')[1];
    if(!token){
        throw new errors.UnauthenticatedError(`Not authorized to access this route`);
        // res.status(StatusCodes.UNAUTHORIZED).json({msg: "Not authorized to access this route"});
    } else {
        const data = jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(!data){
            throw new errors.UnauthenticatedError(`Not authorized access this path`);
            // res.status(StatusCodes.UNAUTHORIZED).json({msg: "Not authorized to access this route"});
        } else {
            req.data = data;
            // console.log(req.data);
            next();
        }
    }
}