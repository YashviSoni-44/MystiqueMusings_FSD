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
import Notification from './Schema/Notification.js';
import Comment from './Schema/Comment.js'
import { error } from 'console';

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

let passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

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
  if (!passwordRegex.test(password)) {
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
  let {title, des, banner, tags, content, draft, id}=req.body;
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
  let blog_id= id || title.replace(/[^a-zA-Z0-9]/g," ").replace(/\s+/g,"-").trim()+nanoid()
  
  if(id){
    Blog.findOneAndUpdate({blog_id}, {title, des, banner, content, tags, draft: draft ? draft : false})
    .then(()=>{
      return res.status(200).json({id:blog_id});
    })
    .catch(err=>{
      return res.status(500).json(err.message)
    })
  }
  else{
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
  }

  

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
  let { tag, author, query, page, limit, eliminate_blog }=req.body;
  let findQuery;
  
  if(tag){
    findQuery = {tags:tag, draft: false, blog_id:{$ne: eliminate_blog}}
  }
  else if(query){
    findQuery = {draft: false, title: new RegExp(query,"i")}//i means case sensitive
  }
  else if(author){
    findQuery = {author, draft:false}
  }

  let maxLimit = limit ? limit : 2;

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

server.post("/get-blog",(req,res)=>{
  let {blog_id, draft, mode}=req.body;
  let incrementVal= mode != "edit" ? 1 : 0;

  Blog.findOneAndUpdate({blog_id},{$inc:{"activity.total_reads":incrementVal}})
  .populate("author","personal_info.fullname personal_info.username personal_info.profile_img")
  .select("title des content banner activity publishedAt blog_id tags")
  .then(blog=>{
    User.findOneAndUpdate({"personal_info.username":blog.author.personal_info.username},{$inc:{"account_info.total_reads":incrementVal}})
    .catch(err=>{
      return res.status(500).json({error:err.message})
    })

    if(blog.draft && !draft){
      return res.status(500).json({error:"You cannot access draft blogs"})
    }

    return res.status(200).json({blog})
  })
  .catch(err=>{
    return res.status(500).json({error:err.message})
  })
})

server.post("/like-blog",verifyJWT,(req,res)=>{
  let user_id=req.user;
  let {_id, isLikedByUser} =req.body;
  let incrementVal= !isLikedByUser ? 1 : -1;

  Blog.findOneAndUpdate({_id},{$inc:{"activity.total_likes":incrementVal}})
  .then(blog=>{
    if(!isLikedByUser){
      let like = new Notification({
        type:"like",
        blog:_id,
        notification_for:blog.author,
        user:user_id
      })

      like.save().then(notification=>{
        return res.status(200).json({liked_by_user:true})
      })
    }
    else{
      Notification.findOneAndDelete({user:user_id, bog:_id, type:"like"})
      .then(data=>{
        return res.status(200).json({liked_by_user:false})
      })
      .catch(err=>{
        return res.status(500).json({error:err.message})
      })
    }
  })
})

server.post("/isliked-by-user", verifyJWT, (req,res)=>{
  let user_id=req.user;
  let {_id}=req.body;
  Notification.exists({user:user_id, type:"like", blog:_id})
  .then(result=>{
    return res.status(200).json({result})
  })
  .catch(err=>{
    return res.status(500).json({error:err.message})
  })
})

server.post("/add-comment",verifyJWT, (req,res)=>{
  let user_id=req.user;
  let {_id, comment, blog_author, replying_to} = req.body;
  if(!comment.length){
    return res.status(403).json({error:"Comments cannot be empty"});
  }
  //creating comment document
  let commentObj= {
    blog_id:_id, blog_author, comment, commented_by: user_id, 
  }

  if(replying_to){
    commentObj.parent=replying_to;
    commentObj.isReply=true;
  }

  new Comment(commentObj).save().then(async commentFile=>{
    let {comment, commentedAt, children} = commentFile;
    Blog.findOneAndUpdate({_id}, {$push:{"comments":commentFile._id}, $inc:{"activity.total_comments":1, "activity.total_parent_comments": replying_to ? 0 : 1}})
    .then(blog=>{console.log("new comment created")});

    let notificationObj={
      type: replying_to ? "reply" : "comment",
      blog: _id,
      notification_for: blog_author,
      user: user_id,
      comment: commentFile._id
    }

    if(replying_to){
      notificationObj.replied_on_comment = replying_to;

      await Comment.findOneAndUpdate({ _id:replying_to},{$push:{children: commentFile._id}})
      .then(replyingToCommentDoc=> {notificationObj.notification_for = replyingToCommentDoc.commented_by})
    }
    
    new Notification(notificationObj).save()
    .then(notification => console.log("new notification created"))

    return res.status(200).json({
      comment, commentedAt, _id:commentFile._id, user_id, children
    })
  })
})

server.post("/get-blog-comments",(req,res)=>{
  let {blog_id, skip}=req.body;
  let maxLimit=5;
  Comment.find({blog_id, isReply:false})
  .populate("commented_by", "personal_info.username personal_info.fullname personal_info.profile_img")
  .skip(skip)
  .limit(maxLimit)
  .sort({
    'commentedAt':-1
  })
  .then(comment=>{
    return res.status(200).json(comment)
  })
  .catch(err=>{
    console.log(err.message);
    return res.status(500).json({error:err.message})
  })
})

server.post("/get-replies",(req,res)=>{
  let {_id, skip}=req.body;
  let maxLimit=5;
  Comment.findOne({_id})
  .populate({
    path:"children",
    options:{
      limit:maxLimit,
      skip:skip,
      sort:{'commentedAt':-1}
    },
    populate:{
      path:'commented_by',
      select: "personal_info.profile_img personal_info.fullname personal_info.username"
    },
    select: "-blog_id -updatedAt"
  })
  .select("children")
  .then(doc=>{
    return res.status(200).json({replies: doc.children})
  })
  .catch(err=>{
    return res.status(500).json({error: err.message})
  })
})

const deleteComment=(_id)=>{
  Comment.findOneAndDelete({_id})
  .then(comment=>{
    if(comment.parent){
      Comment.findOneAndUpdate({_id:comment.parent},{$pull:{children:_id}})
      .then(data=>console.log('Comment delete from parent'))
      .catch(err=>{
        console.log(err)
      })
    }

    Notification.findOneAndDelete({comment:_id})
    .then(notification => console.log("comment notification deleted"))

    Notification.findOneAndDelete({reply:_id})
    .then(notification => console.log("reply notification deleted"))

    Blog.findOneAndUpdate({_id:comment.blog_id},{$pull:{comments:_id}, $inc:{"activity.total_comments": -1}, "activity.total_parent_comments": comment.parent ? 0 : -1})
    .then(blog => {
      if(comment.children.length){
        comment.children.map(replies => {
          deleteComment(replies) // recursion function to delete replies until the condition is true
        })
      }
    })
  })
  .catch(err=>{
    console.log(err.message)
  })
}

server.post("/delete-comment",verifyJWT,(req,res)=>{
  let user_id=req.user;
  let {_id}=req.body;
  Comment.findOne({_id})
  .then(comment=>{
    if(user_id == comment.commented_by || user_id == comment.blog_author){
      deleteComment(_id)
      return res.status(200).json({status:"done"})
    }
    else{
      return res.status(403).json({error:"You can't delete this comment"})
    }
  })
})

server.post("/change-password", verifyJWT, (req,res)=>{
  let {currentPassword, newPassword}=req.body;

  if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
      return res.status(403).json({error:"Password should be 6-20 characters long with at least one number, one lowercase, and one uppercase letter"})
  }

  User.findOne({_id:req.user})
  .then((user)=>{
    if(user.google_auth){
      return res.status(403).json({error:"You can't update your password since you signed in via Google"})
    }

    bcrypt.compare(currentPassword, user.personal_info.password, (err, result)=>{
      if(err){
        return res.status(500).json({error:"Some error occured while changing password. Please try again later"})
      }

      if(!result){
        return res.status(403).json({error:"Incorrect current password"})
      }

      bcrypt.hash(newPassword, 10, (err, hashed_password)=>{
        User.findOneAndUpdate({_id:req.user},{"personal_info.password":hashed_password})
        .then((u)=>{
          return res.status(200).json({status:"Passwrod changed"})
        })
        .catch(err=>{
          return res.status(50).json({error:"Some error occured while changing password. Please try again later"})
        })
      })
    })
  })
  .catch(err=>{
    console.log(err)
    return res.status(500).json({error:"User not found"})
  })
})

server.post("/update-profile-img",verifyJWT, (req,res)=>{
  let url=req.body;
  User.findOneAndUpdate({_id:req.user},{"personal_info.profile_img":url})
  .then(()=>{
    return res.status(200).json({profile_img:url})
  })
  .catch(err=>{
    return res.status(500).json({error:err.message})
  })
})

server.post("/update-profile",verifyJWT,(req,res)=>{
  let {username, bio, social_links}=req.body;
  let bioLimit=150;

  if(username.length<3){
    return res.status(403).json({error:"Username should be atleast 3 letters long"})
  }
  if(bio.length > bioLimit){
    return res.status(403).json({error:`Bio should not be more than ${bioLimit}`})
  }

  let social_linksArr=Object.keys(social_links);

  try{
    for(let i=0; i< social_linksArr.length; i++){
      if(social_links[social_linksArr[i]].length){
        let hostname=new URL(social_links[social_linksArr[i]]).hostname;

        if(!hostname.includes(`${social_linksArr[i]}.com`) && social_linksArr[i] != 'website'){
          return res.status(403).json({error:`${social_linksArr[i]} link is invalid`})
        }
      }
    }
  }
  catch(err){
    return res.status(500).json({error:"You must provide full social links with http(s)"})
  }

  let updateObj={
    "personal_info.username":username,
    "personal_info.bio":bio,
    social_links
  }

  User.findOneAndUpdate({_id: req.user}, updateObj, {
    runValidators:true
  })
  .then(()=>{
    return res.status(200).json({username})
  })
  .catch(err=>{
    if(err.code == 11000){
      return res.status(409).json({error:"Username is already taken"})
    }
    return res.status(500).json({error:err.message})
  })
})

server.listen(port, () => {
  console.log('Listening on port -> ' + port);
});
