import React, { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import InputBox from '../components/input.component';
import FaceIcon from '@mui/icons-material/Face';
import EmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import googleIcon from '../imgs/google.png';
import back1 from '../imgs/bg1.jpg';
import back2 from '../imgs/bg2.jpg';
import AnimationWrapper from '../common/page-animation';
import { ThemeModeContext } from '../components/navbar.component';
import {Toaster, toast} from 'react-hot-toast';
import axios from 'axios';

const UserAuthForm = ({ type }) => {

    const userAuthThroughServer = (serverRoute,formData) =>{
        
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        .then(({ data }) =>{
            console.log(data)
        })
        .catch(({ reponse }) => {
            toast.error(reponse.data.error)
        })
    }

    const authForm = useRef();
    const themeMode = useContext(ThemeModeContext);
    
    const handleSubmit = (e) => {
        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
        
        // Gather form data
        let form = new FormData(authForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let {fullname, email, password}=formData;

        //form validation
        if(fullname){
            if(fullname.length<3){
                return toast.error("fullname must be atleast 3 letters long")
            }
        }
        if(!email.length){
            return toast.error("enter email")
        }
        if(!emailRegex.test(email)){
            return toast.error("email is invalid")
        }
        if(!passwordRegex.test(password)){
            return toast.error("password should be 6-20 char. long with a num, 1 lowercase and 1 uppercase letter")
        }

        userAuthThroughServer(serverRoute,formData);
    };

    return (
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center"
                style={{ 
                    backgroundImage: `url(${themeMode === 'dark' ? back1 : back2})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    height: 'auto', 
                    width: 'auto', 
                    color: themeMode === 'dark' ? 'white' : 'black'
                }}
            >
                <Toaster/>
                <form ref={authForm} className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type === 'sign-in' ? 'Welcome Back' : 'Join us today'}
                    </h1>
                    {type !== 'sign-in' && (
                        <InputBox
                            name="fullname"
                            type="text"
                            placeholder="Full Name"
                            icon={FaceIcon}
                        />
                    )}
                    <InputBox
                        name="email"
                        type="email"
                        placeholder="Email"
                        icon={EmailIcon}
                    />
                    <InputBox
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon={LockIcon}
                    />
                    <button className="btn-dark center mt-14" type="submit">
                        {type.replace('-', ' ')}
                    </button>

                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black"></hr>
                        <p>OR</p>
                        <hr className="w-1/2 border-black"></hr>
                    </div>

                    <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                        <img src={googleIcon} className="w-5" alt="Google Icon" />
                        Continue with Google
                    </button>

                    {type === 'sign-in' ? (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Don't have an account? 
                            <Link to="/signup" className="underline text-xl ml-1">Join us today</Link>
                        </p>
                    ) : (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Already a member?
                            <Link to="/signin" className="underline text-xl ml-1">Sign in here</Link>
                        </p>
                    )}
                </form>
            </section>
        </AnimationWrapper>
    );
};

export default UserAuthForm;
