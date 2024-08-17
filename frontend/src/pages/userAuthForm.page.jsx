import React, { useContext, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import InputBox from '../components/input.component';
import FaceIcon from '@mui/icons-material/Face';
import EmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import googleIcon from '../imgs/google.png';
import back1 from '../imgs/bg1.jpg';
import back2 from '../imgs/bg2.jpg';
import AnimationWrapper from '../common/page-animation';
import { ThemeModeContext } from '../components/navbar.component';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { storeInSession } from '../common/session';
import { UserContext } from '../App';
import { authWithGoogle } from '../common/firebase';

const UserAuthForm = ({ type }) => {
    const authForm = useRef();
    const themeMode = useContext(ThemeModeContext);
    const { userAuth: { access_token }, setUserAuth } = useContext(UserContext);

    const userAuthThroughServer = (serverRoute, formData) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
            .then(({ data }) => {
                storeInSession("user", JSON.stringify(data));
                setUserAuth(data);
            })
            .catch((error) => {
                if (error.response) {
                    toast.error(error.response.data.error);
                } else if (error.request) {
                    toast.error("No response received from server");
                } else {
                    toast.error("Error occurred while setting up request");
                }
                console.log(error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let serverRoute = type === "sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

        let form = new FormData(authForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullname, email, password } = formData;

        if (fullname && fullname.length < 3) {
            return toast.error("Full name must be at least 3 letters long");
        }
        if (!email.length) {
            return toast.error("Enter email");
        }
        if (!emailRegex.test(email)) {
            return toast.error("Email is invalid");
        }
        if (!passwordRegex.test(password)) {
            return toast.error("Password should be 6-20 characters long with a number, lowercase and uppercase letter");
        }

        userAuthThroughServer(serverRoute, formData);
    };

    const handleGoogleAuth = (e) => {
        e.preventDefault();
        authWithGoogle()
            .then(user => {
                let serverRoute = "/google-auth";
                let formData = {
                    access_token: user.accessToken
                };
                userAuthThroughServer(serverRoute, formData);
            })
            .catch(err => {
                toast.error("Trouble logging in through Google");
                return console.log(err);
            });
    };

    return (
        access_token ?
            <Navigate to="/" /> :
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
                    <Toaster />
                    <form ref={authForm} className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
                        <h1 className="text-3xl font-gelasio capitalize text-center mb-16"
                            style={{ color: themeMode === 'dark' ? 'white' : 'black' }}>
                            {type === 'sign-in' ? 'Welcome Back' : 'Join us today'}
                        </h1>
                        {type !== 'sign-in' && (
                            <InputBox
                                name="fullname"
                                type="text"
                                placeholder="Full Name"
                                icon={FaceIcon}
                                style={{ color: themeMode === 'dark' ? 'white' : 'black' }}
                            />
                        )}
                        <InputBox
                            name="email"
                            type="email"
                            placeholder="Email"
                            icon={EmailIcon}
                            style={{ color: themeMode === 'dark' ? 'white' : 'black' }}
                        />
                        <InputBox
                            name="password"
                            type="password"
                            placeholder="Password"
                            icon={LockIcon}
                            style={{ color: themeMode === 'dark' ? 'white' : 'black' }}
                        />
                        <button
                            className={`btn-${themeMode} center mt-8 py-2 px-4 rounded-full text-xl`}
                            type="submit"
                            style={{
                                backgroundColor: themeMode === 'dark' ? '#333' : '#ddd',
                                color: themeMode === 'dark' ? 'white' : 'black'
                            }}
                        >
                            {type.replace('-', ' ')}
                        </button>

                        <div className="relative w-full flex items-center gap-2 my-6 uppercase font-bold"
                            style={{ opacity: '0.1', color: themeMode === 'dark' ? 'white' : 'black' }}>
                            <hr className="w-1/2"></hr>
                            <p>OR</p>
                            <hr className="w-1/2"></hr>
                        </div>

                        <button
                            className={`btn-${themeMode} flex items-center justify-center gap-4 w-[90%] center py-2 px-4 rounded-full text-xl`}
                            onClick={handleGoogleAuth}
                            style={{
                                backgroundColor: themeMode === 'dark' ? '#333' : '#ddd',
                                color: themeMode === 'dark' ? 'white' : 'black'
                            }}
                        >
                            <img src={googleIcon} className="w-5" alt="Google Icon" />
                            Continue with Google
                        </button>

                        {type === 'sign-in' ? (
                            <p className="mt-6 text-xl text-center"
                                style={{ color: themeMode === 'dark' ? 'white' : 'black' }}>
                                Don't have an account?
                                <Link to="/signup" className="underline text-xl ml-1">Join us today</Link>
                            </p>
                        ) : (
                            <p className="mt-6 text-xl text-center"
                                style={{ color: themeMode === 'dark' ? 'white' : 'black' }}>
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
