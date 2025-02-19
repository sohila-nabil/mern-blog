import User from "../models/userModel.js"

const signup = async(req,res,next)=>{
    const { username, password, email } = req.body;
    try {
        
    } catch (error) {
        next(error)
    }
}