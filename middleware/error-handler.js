//https://stackoverflow.com/a/64507978
//above link tells us that with ES6, we cannot yet import directories
import errors from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

// console.log(errors)
const { CustomAPIError } = errors;

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };

//   if (err instanceof CustomAPIError) {
//     return res.status(err.statusCode).json({ msg: err.message });
//   }
  
if(err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors).map((el) => el.message).join(', ');
    customError.statusCode = 400;
}
if(err.name === 'CastError'){
    
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
}
if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value for ${Object.keys(err.keyValue)} field, please enter different value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
//   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};

export default errorHandlerMiddleware;
