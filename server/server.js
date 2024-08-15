// import express from 'express';
// import mongoose from 'mongoose';
// import 'dotenv/config'
// import bcrypt from 'bcrypt'
// import {nanoid} from 'nanoid'

// import User from './Schema/User.js'

// const app=express();
// let port=5100;
// let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
// let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// app.use(express.json())

// mongoose.connect(process.env.DB_LOCATION,{
//     autoIndex:true
// })

// const generateUsername= async(email)=>{
//     let username=email.split("@")[0];
//     let isUsernameNotUnique=await User.exists({"personal_info.username":username}).then((result)=>result)
//     isUsernameNotUnique ? username += nanoid().substring(0,5) : "";
//     return username
// }

// app.post("/signup",(req,res)=>{
//     let {fullname,email,password}=req.body;
//     //validation of data
//     if(fullname.length<3){
//         return res.status(400).json({"error":"Fullname must be atleast 3 characters long"})
//     }
//     if(!email.length){
//         return res.status(400).json({"error":"Email is required"})
//     }
//     if(!emailRegex.test(email)){
//         return res.status(400).json({"error":"Email is invalid"})
//     }
//     if(!passwordRegex.test(password)){
//         return res.status(400).json({"error":"Password is invalid (required: length of 6 to 20 characters, numeric including, 1 uppercase and 1 lowercase)"})
//     }

//     bcrypt.hash(password,10,async(err,hashed_password)=>{
//         let username=await generateUsername(email);
//         let user=new User({
//             personal_info:{fullname,email,password:hashed_password,username}
//         })
//         user.save().then((u)=>{
//             return res.status(200).json({user:u})
//         })
//         .catch(err=>{
//             if(err.code==11000){
//                 return res.status(500).json({"error":"Email already exists"})
//             }
//             return res.status(500).json({"error":err.message})
//         })

//         console.log(hashed_password)
//     })

//     return res.status(200).json({"status":"okay"})
// })

// app.listen(port,()=>{
//     console.log(`server is running on port ${port}`);
// })

import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import bcrypt from 'bcrypt'

import User from './Schema/User.js'

const server=express();
let port = 5500;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

mongoose.connect(process.env.DB_LOCATION,{
    autoIndex:true
})

server.use(express.json())

server.post("/signup",(req,res)=>{
    let {fullname, email, password}=req.body;
    if(fullname.length<3){
        return res.status(403).json({"error":"fullname must be atleast 3 letters long"})
    }
    if(!email.length){
        return res.status(403).json({"error":"enter email"})
    }
    if(!emailRegex.test(email)){
        return res.status(403).json({"error":"email is invalid"})
    }
    if(!passwordRegex.test(password)){
        return res.status(403).json({"error":"password should be 6-20 char. long with a num, 1 lowercase and 1 uppercase letter"})
    }

    bcrypt.hash(password, 10, (err,hashed_password)=>{
        let username=email.split("@")[0]; 
        let user = new User({
            personal_info:{fullname, email, password:hashed_password, username}
        })
        user.save().then((u)=>{
            re