import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import {nanoid} from 'nanoid'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import admin from 'firebase-admin'
import fs from 'fs'
import path from 'path'
// import serviceAccountKey from './mystiquemusings-450e4-firebase-adminsdk-oblpk-07b44aea23.json' assert {type:"json"}
import {getAuth} from 'firebase-admin/auth'

import User from './Schema/User.js'

const serviceAccountKey = JSON.parse(
  fs.readFileSync(path.resolve('./mystiquemusings-450e4-firebase-adminsdk-oblpk-07b44aea23.json'), 'utf8')
);

const server=express();
let port = 5500;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

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
            return res.status(403).json({"error":"Email not found"})
        }

        if(!user.google_auth){
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
        }
        else{
            return res.status(403).json({"error":"Account was created using Google. Try logging in with Google"})
        }

    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({"error":err.message})
    })
})

server.post("/google-auth", async (req,res) =>{
    let {access_token} = req.body;
    getAuth()

    //verifying the access token
    .verifyIdToken(access_token)
    .then(async (decodedUser) =>{
        let {email, name, picture} = decodedUser;

        //enhancing the resolution of the profile picture
        picture = picture.replace("s96-c","s384-c")

        let user= await User.findOne({"personal_info.email":email}).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u) =>{
            return u || null
        })
        .catch(err=>{
            return res.status(500).json({"error":err.message})
        })

        //login user
        if(user){
            if(!user.google_auth){
                return res.status(403).json({"error":"This email was signed up without Google. Please login with password to access the account"})
            }
        }

        //sign up
        else{
            let username= await generateUsername(email);
            user = new User({
                personal_info:{fullname: name, email, profile_img:picture, username},
                google_auth:true
            })

            await user.save().then((u)=>{
                user = u;
            })
            .catch(err=>{
                return res.status(500).json({"error":err.message})
            })
        }

        return res.status(200).json(formatDatatoSend(user))
    })
    .catch(err=>{
        return res.status(500).json({"error":"Failed to authenticate. Try with another Google account"})
    })
})

server.listen(port,()=>{
    console.log('listening on port -> '+port)
})