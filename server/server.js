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
import {nanoid} from 'nanoid'
import jwt from 'jsonwebtoken'
import cors from 'cors'

import User from './Schema/User.js'

const server=express();
let port = 5500;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

mongoose.connect(process.env.DB_LOCATION,{
    autoIndex:true
})

server.use(express.json())
server.use(cors())

const formatDatatoSend = (user) =>{
    const access_token = jwt.sign({ id:user._id }, process.env.SECRET_ACCESS_KEY)
    return{
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}

const generateUsername = async (email) =>{
    let username=email.split("@")[0];
    let isUsernameNotUnique = await User.exists({"personal_info.username":username}).then((result)=>result)
    isUsernameNotUnique ? username += nanoid().substring(0, 5) : "";
    return username
}

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

    bcrypt.hash(password, 10, async (err,hashed_password)=>{
        let username=await generateUsername(email);
        let user = new User({
            personal_info:{fullname, email, password:hashed_password, username}
        })
        user.save().then((u)=>{
            return res.status(200).json(formatDatatoSend(u))
        })
        .catch(err=>{
            if(err.code==11000){
                return res.status(500).json({"error":"email already exists"})
            }
            return res.status(500).json({"error":err.message})
        })

        console.log(hashed_password)
    })
})

server.post("/signin",(req,res)=>{
    let {email, password}=req.body;
    User.findOne({ "personal_info.email":email })
    .then((user)=>{
        if (!user){
            return res.status(403).json({"error":"email not found"})
        }

        bcrypt.compare(password, user.personal_info.password, (err, result)=>{
            if(err){
                return res.status(403).json({"error":"Error occured while login, please try again"});
            }

            if(!result){
                return res.status(403).json({"error":"Incorrect password"})
            }
            else{
                return res.status(200).json(formatDatatoSend(user))
            }
        })
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({"error":err.message})
    })
})

server.listen(port,()=>{
    console.log('listening on port -> '+port)
})