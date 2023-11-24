import jwt from "jsonwebtoken";
const {JWT_SECRET} = process.env;
import {HttpError} from "../helpers/index.js";
import User from "../models/User.js";

const authenticate = async(req, res, next)=>{
    const {authorization} = req.headers;
        if(!authorization){
            throw HttpError(401, "Authorization header not found");
        }
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer"){
       return next(HttpError(401))
    }
    try {
        const {id} = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if(!user || !user.token || user.token !== token ) {
            throw HttpError(401, "user not found");
        }
        req.user = user;
        next();
    } catch (error) {
        throw HttpError(401, error.message);
    }
}

export default authenticate; 