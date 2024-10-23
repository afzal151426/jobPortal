import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectdb from "./utils/db.js";
import userRoutes from "./routes/user.routes.js"
dotenv.config({});

const app=express();
// app.get("/home",(req,res)=>{
// return res.status(200).json({
//     message:"i am coming from backened ",
//     success:true
// })
// })

//middleware 
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

const corsOptions={
    origin:'http//localhost:5173',
    Credentials:true
}
app.use(cors(corsOptions));




const PORT=process.env.PORT||3000;
//api
app.use("/api/v1/user",userRoutes);
// "http://localhost:8000/api/v1/user/register"
// "http://localhost:8000/api/v1/user/profile/update"
app.listen(PORT,()=>{
    connectdb();
    console.log(`server running at port ${PORT}`);
})
