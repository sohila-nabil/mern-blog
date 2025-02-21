import errorHandler from "./errorHandler.js";
import jwt from "jsonwebtoken";
const verifyUser = (req, res, next) => {
  try {
    const {token} = req.cookies;
    if (!token) {
      return next(errorHandler(401, "Unauthorized"));
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return next(errorHandler(401, "Unauthorized"));
    }
    req.user = decode;
    next();
  } catch (error) {
    next(error);
  }
};

export default verifyUser;
