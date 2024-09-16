import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { profileDataStructure } from "./profile.page";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import toast, { Toaster } from "react-hot-toast";
import EditIcon from '@mui/icons-material/Edit';
import InputBox from "../components/input.component";
import FaceIcon from '@mui/icons-material/Face';
import EmailIcon from '@mui/icons-material/Email';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LinkIcon from '@mui/icons-material/Link';
import { storeInSession } from "../common/session";

const EditProfile=()=>{

    let {userAuth, userAuth:{access_token}, setUserAuth}=useContext(UserContext);
    let bioLimit=150;
    let profileImgEle=useRef();
    let editProfileForm=useRef();

    const [profile, setProfile]=useState(profileDataStructure);
    const [loading, setLoading]=useState(true);
    const [charLeft, setCharLeft]=useState(bioLimit);
    const [updatedProfileImg, setUpdatedProfileImg]=useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false); // Add a state to manage form submission


    let {personal_info:{fullname, username: profile_username, profile_img, email, bio}, social_links}=profile;

    

    useEffect(()=>{
        if(access_token){
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {username: userAuth.username})
            .then(({data})=>{
                setProfile(data);
                setLoading(false)
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[access_token])

    const handleCharChange=(e)=>{
        setCharLeft(bioLimit - e.target.value.length)
    }

    const handleImgPreview=(e)=>{
        let img=e.target.files[0];
        profileImgEle.current.src=URL.createObjectURL(img);
        setUpdatedProfileImg(img);
    }

    const handleImgUpload=(e)=>{
        e.preventDefault();
        if(updatedProfileImg){
            let loadingToast=toast.loading("Uploading...")
            e.target.setAttribute("disabled",true);
            if(url){
                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img",{url},{
                    headers:{
                        'Authorization':`Bearer ${access_token}`
                    }
                })
                .then(({data})=>{
                    let newUserAuth={...userAuth, profile_img: data.profile_img}
                    storeInSession("user",JSON.stringify(newUserAuth));
                    setUserAuth(newUserAuth);
                    setUpdatedProfileImg(null);
                    toast.dismiss(loadingToast);
                    e.target.removeAttribute("disabled");
                    toast.success("Uploaded!!")
                })
                .catch(({response})=>{
                    toast.dismiss(loadingToast);
                    e.target.removeAttribute("disabled");
                    toast.error(response.data.error)
                })
            }
        }
    }

    // const handleSubmit=(e)=>{
    //     e.preventDefault();
    //     let form=new FormData(editProfileForm.current);
    //     let formData={};
    //     for (let [key,value] of form.entries()){
    //         formData[key]=value
    //     }
        
    //     let {username, bio, youtube, facebook, twitter, github, instagram, website}=formData;

    //     if(username.length < 3){
    //         return toast.error("Username should be atleast 3 letter long")
    //     }
    //     if(bio.length > bioLimit){
    //         return toast.error(`Bio should not be more that ${bioLimit}`)
    //     }

    //     let loadingToast = toast.loading("Updating...")
    //     e.target.setAttribute("disabled",true)

    //     axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile",{
    //         username, bio, social_links:{youtube, facebook, twitter, github, instagram, website}
    //     },{
    //         headers:{
    //             'Authorization':`Bearer ${access_token}`
    //         }
    //     })
    //     .then(({data})=>{
    //         if(userAuth.username!=data.username){
    //             let newUserAuth={...userAuth, username:data.username}
    //             storeInSession("user",JSON.stringify(newUserAuth));
    //             setUserAuth(newUserAuth);
    //         }

    //         toast.dismiss(loadingToast);
    //         e.target.removeAttribute("disabled")
    //         toast.success("Profile Updated")
    //     })
    //     .catch(({response})=>{
    //         toast.dismiss(loadingToast);
    //         e.target.removeAttribute("disabled")
    //         toast.error(response.data.error)
    //     })
    // }
    const handleSubmit = (e) => {
  e.preventDefault();
  
  if (isSubmitting) return; // Prevent multiple submissions
  setIsSubmitting(true); // Set loading state

  let form = new FormData(editProfileForm.current);
  let formData = {};
  for (let [key, value] of form.entries()) {
    formData[key] = value;
  }

  let { username, bio, youtube, facebook, twitter, github, instagram, website } = formData;

  if (username.length < 3) {
    setIsSubmitting(false);
    return toast.error("Username should be at least 3 letters long");
  }
  if (bio.length > bioLimit) {
    setIsSubmitting(false);
    return toast.error(`Bio should not be more than ${bioLimit}`);
  }

  let loadingToast = toast.loading("Updating...");

  axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile", {
    username, bio, social_links: { youtube, facebook, twitter, github, instagram, website }
  }, {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  })
  .then(({ data }) => {
    if (userAuth.username !== data.username) {
      let newUserAuth = { ...userAuth, username: data.username };
      storeInSession("user", JSON.stringify(newUserAuth));
      setUserAuth(newUserAuth);
    }
    
    toast.dismiss(loadingToast);
    toast.success("Profile Updated");
    setIsSubmitting(false); // Remove loading state
  })
  .catch(({ response }) => {
    toast.dismiss(loadingToast);
    toast.error(response.data.error);
    setIsSubmitting(false); // Remove loading state
  });
};


    return(
        <AnimationWrapper>
            {
                loading ? <Loader/> :
                <form ref={editProfileForm}>
                    <Toaster/>
                    <h1 className="max-md:hidden">Edit Profile</h1>

                    <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
                        <div className="max-lg:center mb-5">
                            <label htmlFor="uploadImg" id="profileImgLabel" className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden">
                                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                                    <EditIcon/>Edit Profile Image
                                </div>
                                <img src={profile_img} ref={profileImgEle}/>
                            </label>
                            <input type="file" id="uploadImg" accept=".jpeg, .jpg, .png" hidden onChange={handleImgPreview}/>

                            <button className="btn-light mt-5 max-lg:center lg:w-full px-10" onClick={handleImgUpload}>Upload</button>
                        </div>

                        <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                <div>
                                    <InputBox name="fullname" type="text" value={fullname} placeholder="Full Name" icon={FaceIcon} disable={true}/>
                                </div>

                                <div>
                                    <InputBox name="email" type="text" value={email} placeholder="Email" icon={EmailIcon} disable={true}/>
                                </div>
                            </div>

                            <InputBox type="text" name="username" value={profile_username} placeholder="Username" icon={AlternateEmailIcon}/>

                            <p className="text-dark-grey -mt-3">Username will be used to search for user and will be visible to everyone</p>

                            <textarea name="bio" maxLength={bioLimit} defaultValue={bio} className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5" placeholder="Enter Bio" onChange={handleCharChange}></textarea>

                            <p className="mt-1 text-dark-grey">{charLeft} characters left</p>

                            <p className="my-6 text-dark-grey">Add your social handles below</p>

                            <div className="md:grid md:grid-cols-2 gap-x-6">
                                {
                                    Object.keys(social_links).map((key, i) => {
                                        let link = social_links[key];
                                        return <InputBox key={i} name={key}
                                        type="text" value={link} placeholder="https://" 
                                        icon={LinkIcon}/>
                                    })
                                }
                            </div>

                            <button onClick={handleSubmit} className="btn-dark w-auto px-7" type="submit" disabled={isSubmitting}>{isSubmitting ? "Updating..." : "Update"}</button>
                        </div>  
                    </div>
                </form>
            }
        </AnimationWrapper>
    )
}

export default EditProfile;