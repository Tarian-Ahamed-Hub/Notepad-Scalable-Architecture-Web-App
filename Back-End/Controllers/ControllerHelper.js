module.exports.dbHandler = async(req,res,fn,next ) =>{
  try {

    return await fn();

  } catch (err) { 

    // Unique constraint failed
    if (err.code === "P2002") {
      return res.status(409).json({
        status: 409,
        message: "Data Exists",
      });
    }

    // Record not found
    if (err.code === "P2025") {
      return res.status(404).json({
        status: 404,
        message: "Data not found",
      });
    }

    // Foreign key constraint 
    if (err.code === "P2003") {
      return res.status(400).json({
        status: 400,
        message: "Invalid reference",
      });
    }

    // Invalid value 
    if (err.code === "P2006") {
      return res.status(400).json({
        status: 400,
        message: "Invalid value for field",
      });
    }

  
    if (err.code === "P2024") {
      return res.status(504).json({
        status: 504,
        message: "Database connection timeout",
      });
    }

    return res.status(500).json({
      status: 500,
      message: err.message || "Internal server error",
    });
  }
};