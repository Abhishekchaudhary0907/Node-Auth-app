import jwt from "jsonwebtoken";
export const IsAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log(token ? "token found" : "token not found");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "authentication failed",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded");
    req.user = decoded; // here we added a new property in req
    console.log(req.user);
    next();
  } catch (error) {
    console.log("Error from auth middle ware ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error AuthMiddleware",
    });
  }
};
