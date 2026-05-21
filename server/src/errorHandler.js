
class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true; 
    }
  }


  const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
  

  const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message    = err.message    || "Internal server error";
  
   
    if (err.code === 11000) {
      statusCode = 409;
      const field = Object.keys(err.keyValue)[0];
      message = `${field} already exists`;
    }
  
  
    if (err.name === "ValidationError") {
      statusCode = 400;
      message = Object.values(err.errors).map((e) => e.message).join(", ");
    }
  

    if (err.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token";
    }
  
    if (err.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expired";
    }
  
    // Build response — include stack trace only in development
    const response = { success: false, message };
    if (process.env.NODE_ENV === "development") {
      response.stack = err.stack;
    }
  
    res.status(statusCode).json(response);
  };
  
  export { AppError, asyncHandler, errorHandler };