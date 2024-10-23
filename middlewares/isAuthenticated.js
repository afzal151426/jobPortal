import jwt from "jsonwebtoken"

const isAuthenticated=async (req,res,next)=>{
try {
    const token=req.cookie.token;
    if(!token){
        return res.status(401).jason({
            message:"unauthorised user",
            success:"false"
        })
    }

    const decode=await jwt.verify(token,pocess.env.SECRET_KEY);
    if(!decode){
        return res.status(401).json({
            message:"invalid token",
            success:"false"
        })
    }
    req.id=decode.userId;
    //if everything is checked at middleware then it will send control onto the next step 
    next();
} catch (error) {
    console.log(error);
    
}

}
export default isAuthenticated;