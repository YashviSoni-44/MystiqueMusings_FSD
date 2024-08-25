// import express from 'express'
// import mongoose from 'mongoose'
// import 'dotenv/config'
// import bcrypt from 'bcrypt'
// import {nanoid} from 'nanoid'
// import jwt from 'jsonwebtoken'
// import cors from 'cors'
// import admin from 'firebase-admin'
// import fs from 'fs'
// import path from 'path'
// // import serviceAccountKey from './mystiquemusings-450e4-firebase-adminsdk-oblpk-07b44aea23.json' assert {type:"json"}
// import {getAuth} from 'firebase-admin/auth'

// import User from './Schema/User.js'

// const serviceAccountKey = JSON.parse(
//   fs.readFileSync(path.resolve('./mystiquemusings-450e4-firebase-adminsdk-oblpk-07b44aea23.json'), 'utf8')
// );

// const server=express();
// let port = 5500;

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccountKey)
// })

// let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
// let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// mongoose.connect(process.env.DB_LOCATION,{
//     autoIndex:true
// })

// server.use(express.json())
// server.use(cors())

// const generateUploadUrl =async()=>{
//     const date =new Date();
//     const imageName=`${nanoid()}-${date.getTime().jpeg}`;
//     return await imageName
// }

// const formatDatatoSend = (user) =>{
//     const access_token = jwt.sign({ id:user._id }, process.env.SECRET_ACCESS_KEY)
//     return{
//         access_token,
//         profile_img: user.personal_info.profile_img,
//         username: user.personal_info.username,
//         fullname: user.personal_info.fullname
//     }
// }

// const generateUsername = async (email) =>{
//     let username=email.split("@")[0];
//     let isUsernameNotUnique = await User.exists({"personal_info.username":username}).then((result)=>result)
//     isUsernameNotUnique ? username += nanoid().substring(0, 5) : "";
//     return username
// }

// server.get("/get-upload-url",(req,res)=>{
//     generateUploadUrl()
// })

// server.post("/signup",(req,res)=>{
//     let {fullname, email, password}=req.body;
//     if(fullname.length<3){
//         return res.status(403).json({"error":"fullname must be atleast 3 letters long"})
//     }
//     if(!email.length){
//         return res.status(403).json({"error":"enter email"})
//     }
//     if(!emailRegex.test(email)){
//         return res.status(403).json({"error":"email is invalid"})
//     }
//     if(!passwordRegex.test(password)){
//         return res.status(403).json({"error":"password should be 6-20 char. long with a num, 1 lowercase and 1 uppercase letter"})
//     }

//     bcrypt.hash(password, 10, async (err,hashed_password)=>{
//         let username=await generateUsername(email);
//         let user = new User({
//             personal_info:{fullname, email, password:hashed_password, username}
//         })
//         user.save().then((u)=>{
//             return res.status(200).json(formatDatatoSend(u))
//         })
//         .catch(err=>{
//             if(err.code==11000){
//                 return res.status(500).json({"error":"email already exists"})
//             }
//             return res.status(500).json({"error":err.message})
//         })

//         console.log(hashed_password)
//     })
// })

// server.post("/signin",(req,res)=>{
//     let {email, password}=req.body;
//     User.findOne({ "personal_info.email":email })
//     .then((user)=>{
//         if (!user){
//             return res.status(403).json({"error":"Email not found"})
//         }

//         if(!user.google_auth){
//             bcrypt.compare(password, user.personal_info.password, (err, result)=>{
//                 if(err){
//                     return res.status(403).json({"error":"Error occured while login, please try again"});
//                 }

//                 if(!result){
//                     return res.status(403).json({"error":"Incorrect password"})
//                 }
//                 else{
//                     return res.status(200).json(formatDatatoSend(user))
//                 }
//             })
//         }
//         else{
//             return res.status(403).json({"error":"Account was created using Google. Try logging in with Google"})
//         }

//     })
//     .catch(err=>{
//         console.log(err);
//         return res.status(500).json({"error":err.message})
//     })
// })

// server.post("/google-auth", async (req,res) =>{
//     let {access_token} = req.body;
//     getAuth()

//     //verifying the access token
//     .verifyIdToken(access_token)
//     .then(async (decodedUser) =>{
//         let {email, name, picture} = decodedUser;

//         //enhancing the resolution of the profile picture
//         picture = picture.replace("s96-c","s384-c")

//         let user= await User.findOne({"personal_info.email":email}).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u) =>{
//             return u || null
//         })
//         .catch(err=>{
//             return res.status(500).json({"error":err.message})
//         })

//         //login user
//         if(user){
//             if(!user.google_auth){
//                 return res.status(403).json({"error":"This email was signed up without Google. Please login with password to access the account"})
//             }
//         }

//         //sign up
//         else{
//             let username= await generateUsername(email);
//             user = new User({
//                 personal_info:{fullname: name, email, profile_img:picture, username},
//                 google_auth:true
//             })

//             await user.save().then((u)=>{
//                 user = u;
//             })
//             .catch(err=>{
//                 return res.status(500).json({"error":err.message})
//             })
//         }

//         return res.status(200).json(formatDatatoSend(user))
//     })
//     .catch(err=>{
//         return res.status(500).json({"error":"Failed to authenticate. Try with another Google account"})
//     })
// })

// server.listen(port,()=>{
//     console.log('listening on port -> '+port)
// })


// import express from 'express';
// import mongoose from 'mongoose';
// import 'dotenv/config';
// import bcrypt from 'bcrypt';
// import { nanoid } from 'nanoid';
// import jwt from 'jsonwebtoken';
// import cors from 'cors';
// import admin from 'firebase-admin';
// import fs from 'fs';
// import path from 'path';
// import multer from 'multer';
// import { fileURLToPath } from 'url';

// // Manually define __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const serviceAccountKey = JSON.parse(
//   fs.readFileSync(path.resolve(__dirname, './mystiquemusings-450e4-firebase-adminsdk-oblpk-07b44aea23.json'), 'utf8')
// );

// const server = express();
// let port = 5500;

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccountKey),
// });

// mongoose.connect(process.env.DB_LOCATION, { autoIndex: true });

// server.use(express.json());
// server.use(cors());

// // Serve static files from the uploads folder
// server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, 'uploads/'));
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${nanoid()}-${Date.now()}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// const generateUploadUrl = async (filename) => {
//   const imageUrl = `/uploads/${filename}`;

//   // Write image URL to banner_img.json
//   const bannerFilePath = path.join(__dirname, 'banner_img.json');
//   const data = { url: imageUrl };

//   return new Promise((resolve, reject) => {
//     fs.writeFile(bannerFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
//       if (err) reject(err);
//       else resolve(imageUrl);
//     });
//   });
// };

// // Endpoint to handle the file upload and URL generation
// server.post('/upload-banner', upload.single('banner'), (req, res) => {
//   const { file } = req;
//   if (!file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   generateUploadUrl(file.filename)
//     .then((url) => res.status(200).json({ uploadURL: url }))
//     .catch((err) => {
//       console.error(err.message);
//       res.status(500).json({ error: err.message });
//     });
// });

// // Endpoint to fetch the stored banner image URL
// server.get('/get-banner-image', (req, res) => {
//   const bannerFilePath = path.join(__dirname, 'banner_img.json');
  
//   fs.readFile(bannerFilePath, 'utf8', (err, data) => {
//     if (err || !data) {
//       return res.status(500).json({ error: 'Failed to read banner image' });
//     }
    
//     const bannerData = JSON.parse(data || '{}');
//     res.status(200).json(bannerData);
//   });
// });

// // Endpoint to handle the file upload for editor images
// server.post('/upload-image', upload.single('image'), (req, res) => {
//   const { file } = req;
//   if (!file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   generateUploadUrl(file.filename)
//     .then((url) => res.status(200).json({ uploadURL: url }))
//     .catch((err) => {
//       console.error(err.message);
//       res.status(500).json({ error: err.message });
//     });
// });


// server.listen(port, () => {
//   console.log('Listening on port -> ' + port);
// });


import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { getAuth } from 'firebase-admin/auth';
import User from './Schema/User.js';
import Blog from "./Schema/Blog.js";

// Manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountKey = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './mystiquemusings-450e4-firebase-adminsdk-oblpk-07b44aea23.json'), 'utf8')
);

const server = express();
let port = 5500;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

mongoose.connect(process.env.DB_LOCATION, { autoIndex: true });

server.use(express.json());
server.use(cors());

// Serve static files from the uploads folder
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${nanoid()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

const generateUploadUrl = async (filename) => {
  const imageUrl = `/uploads/${filename}`;

  // Write image URL to banner_img.json
  const bannerFilePath = path.join(__dirname, 'banner_img.json');
  const data = { url: imageUrl };

  return new Promise((resolve, reject) => {
    fs.writeFile(bannerFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) reject(err);
      else resolve(imageUrl);
    });
  });
};

const formatDatatoSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

const generateUsername = async (email) => {
  let username = email.split('@')[0];
  let isUsernameNotUnique = await User.exists({ 'personal_info.username': username }).then((result) => result);
  isUsernameNotUnique ? (username += nanoid().substring(0, 5)) : '';
  return username;
};

// Endpoint to handle signup
server.post('/signup', (req, res) => {
  let { fullname, email, password } = req.body;
  if (fullname.length < 3) {
    return res.status(403).json({ error: 'Fullname must be at least 3 letters long' });
  }
  if (!email.length) {
    return res.status(403).json({ error: 'Enter email' });
  }
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(403).json({ error: 'Email is invalid' });
  }
  if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password)) {
    return res.status(403).json({
      error: 'Password should be 6-20 characters long with at least one number, one lowercase, and one uppercase letter',
    });
  }

  bcrypt.hash(password, 10, async (err, hashed_password) => {
    let username = await generateUsername(email);
    let user = new User({
      personal_info: { fullname, email, password: hashed_password, username },
    });
    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDatatoSend(u));
      })
      .catch((err) => {
        if (err.code == 11000) {
          return res.status(500).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      });
  });
});

// Endpoint to handle signin
server.post('/signin', (req, res) => {
  let { email, password } = req.body;
  User.findOne({ 'personal_info.email': email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({ error: 'Email not found' });
      }

      if (!user.google_auth) {
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
          if (err) {
            return res.status(403).json({ error: 'Error occurred while login, please try again' });
          }

          if (!result) {
            return res.status(403).json({ error: 'Incorrect password' });
          } else {
            return res.status(200).json(formatDatatoSend(user));
          }
        });
      } else {
        return res.status(403).json({ error: 'Account was created using Google. Try logging in with Google' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// Endpoint to handle Google authentication
server.post('/google-auth', async (req, res) => {
  let { access_token } = req.body;
  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;

      // Enhancing the resolution of the profile picture
      picture = picture.replace('s96-c', 's384-c');

      let user = await User.findOne({ 'personal_info.email': email })
        .select('personal_info.fullname personal_info.username personal_info.profile_img google_auth')
        .then((u) => u || null)
        .catch((err) => res.status(500).json({ error: err.message }));

      // Login user
      if (user) {
        if (!user.google_auth) {
          return res.status(403).json({ error: 'This email was signed up without Google. Please login with password to access the account' });
        }
      }

      // Sign up
      else {
        let username = await generateUsername(email);
        user = new User({
          personal_info: { fullname: name, email, profile_img: picture, username },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => res.status(500).json({ error: err.message }));
      }

      return res.status(200).json(formatDatatoSend(user));
    })
    .catch(() => res.status(500).json({ error: 'Failed to authenticate. Try with another Google account' }));
});

// Endpoint to handle the file upload and URL generation
server.post('/upload-banner', upload.single('banner'), (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  generateUploadUrl(file.filename)
    .then((url) => res.status(200).json({ uploadURL: url }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Endpoint to fetch the stored banner image URL
server.get('/get-banner-image', (req, res) => {
  const bannerFilePath = path.join(__dirname, 'banner_img.json');

  fs.readFile(bannerFilePath, 'utf8', (err, data) => {
    if (err || !data) {
      return res.status(500).json({ error: 'Failed to read banner image' });
    }

    const bannerData = JSON.parse(data || '{}');
    res.status(200).json(bannerData);
  });
});

// Endpoint to handle the file upload for editor images
server.post('/upload-image', upload.single('image'), (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  generateUploadUrl(file.filename)
    .then((url) => res.status(200).json({ uploadURL: url }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

const verifyJWT=(req,res,next)=>{
  const authHeader=req.headers['authorization'];
  const token= authHeader && authHeader.split(" ")[1];
  if(token==null){
    return res.status(401).json({error:"no access token"})
  }

  jwt.verify(token,process.env.SECRET_ACCESS_KEY, (err, user)=>{
    if(err){
      return res.status(401).json({error:"Access token is invalid"})
    }
    req.user=user.id
    next()
  })
}

server.post("/create-blog",verifyJWT,(req,res)=>{
  let authorId = req.user;
  let {title, des, banner, tags, content, draft}=req.body;
  if(!title.length){
    return res.status(403).json({error:"You must provide a title"})
  }
  if(!draft){
    if(!des.length || des.length>200){
      return res.status(403).json({error:"You must provide blog description user 200 characters"})
    }
    if(!banner.length){
      return res.status(403).json({error:"You must provide blog banner to publish it"})
    }
    if(!content.blocks.length){
      return res.status(403).json({error:"There must be some blog content to publish it"})
    }
    if(!tags.length || tags.length>10){
      return res.status(403).json({error:"Provide tags in order to publish the blog"})
    }
  }

  tags=tags.map(tag=>tag.toLowerCase());
  //replacing special char. with spaces and spaces with hyphen
  let blog_id=title.replace(/[^a-zA-Z0-9]/g," ").replace(/\s+/g,"-").trim()+nanoid()
  
  let blog = new Blog({
    title, des, banner, content, tags, author: authorId, blog_id, draft:Boolean(draft)
  })

  blog.save().then(blog=>{
    let incrementVal = draft ? 0 : 1;
    User.findOneAndUpdate({_id:authorId},{$inc:{"account_info.total_posts":incrementVal}, $push:{"blogs":blog._id}})
    .then(user=>{
      return res.status(200).json({id:blog.blog_id})
    })
    .catch(err=>{
      return res.status(500).json({error:"Failed to update total posts number"})
    })
  })
  .catch(err=>{
    return res.status(500).json({error:err.message})
  })

})

server.post('/latest-blogs',(req,res)=>{
  let {page}= req.body;
  let maxLimit=5;

  Blog.find({draft:false})
  .populate("author","personal_info.profile_img personal_info_username personal_info.fullname -_id")
  .sort({"publishedAt":-1})
  .select("blog_id title des banner activity tags publishedAt -_id")
  .skip((page-1)*maxLimit)// to skip the number of pages and direct to the specific page
  .limit(maxLimit)
  .then(blogs=>{
    return res.status(200).json({blogs})
  })
  .catch(err=>{
    return res.status(500).json({error:err.message})
  })
})

server.get('/trending-blogs',(req,res)=>{
  Blog.find({draft:false})
  .populate("author","personal_info.profile_img personal_info_username personal_info.fullname -_id")
  .sort({"activity.total_read":-1, "activity.total_likes":-1, "publishedAt":-1})
  .select("blog_id title publishedAt -_id")
  .limit(5)
  .then(blogs=>{
    return res.status(200).json({blogs})
  })
  .catch(err=>{
    return res.status(500).json({error:err.message})
  })
})

server.post("/all-latest-blogs-count",(req,res)=>{
  Blog.countDocuments({draft:false})
  .then(count=>{
    return res.status(200).json({totalDocs: count})
  })
  .catch(err=>{
    console.log(err.message);
    return res.status(500).json({error:err.message})
  })
})

server.post("/search-blogs",(req,res)=>{
  let { tag, author, query, page }=req.body;
  let findQuery;
  
  if(tag){
    findQuery = {tags:tag, draft: false}
  }
  else if(query){
    findQuery = {draft: false, title: new RegExp(query,"i")}//i means case sensitive
  }
  else if(author){
    findQuery = {author, draft:false}
  }

  let maxLimit = 2;

  Blog.find(findQuery)
  .populate("author","personal_info.profile_img personal_info_username personal_info.fullname -_id")
  .sort({"publishedAt":-1})
  .select("blog_id title des banner activity tags publishedAt -_id")
  .skip((page-1)*maxLimit)
  .limit(maxLimit)
  .then(blogs=>{
    return res.status(200).json({blogs})
  })
  .catch(err=>{
    return res.status(500).json({error:err.message})
  })
})

server.post("/search-blogs-count",(req,res)=>{
  let {tag, author, query}=req.body;
  let findQuery;

  if(tag){
    findQuery = {tags:tag, draft: false}
  }
  else if(query){
    findQuery = {draft: false, title: new RegExp(query,"i")}//i means case sensitive
  }
  else if(author){
    findQuery = {author, draft:false}
  }

  Blog.countDocuments(findQuery)
  .then(count=>{
    return res.status(200).json({totalDocs:count})
  })
  .catch(err=>{
    console.log(err.message)
    return res.status(500).json({error:err.message})
  })
})

server.post("/search-users",(req,res)=>{
  let {query} = req.body;
  User.find({"personal_info.username": new RegExp(query,'i')})
  .limit(50)
  .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
  .then(users=>{
    return res.status(200).json({users})
  })
  .catch(err=>{
    return res.status(500).json({error:err.message})
  })
})

server.post("/get-profile",(req,res)=>{
  let {username}=req.body;
  User.findOne({"personal_info.username":username})
  .select("-personal_info.password -google_auth -updatedAt -blogs")
  .then(user=>{
    return res.status(200).json(user)
  })
  .catch(err=>{
    console.log(err)
    return res.status(500).json({error:err.message})
  })
})

server.listen(port, () => {
  console.log('Listening on port -> ' + port);
});
