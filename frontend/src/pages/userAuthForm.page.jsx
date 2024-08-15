// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import InputBox from '../components/input.component';
// import FaceIcon from '@mui/icons-material/Face';
// import EmailIcon from '@mui/icons-material/AlternateEmail';
// import LockIcon from '@mui/icons-material/Lock';
// import googleIcon from '../imgs/google.png';
// import back1 from '../imgs/bg1.jpg';
// import back2 from '../imgs/bg2.jpg';
// import AnimationWrapper from '../common/page-animation';
// import { ThemeModeContext } from '../components/navbar.component';

// const UserAuthForm = ({ type }) => {
//     const themeMode = useContext(ThemeModeContext);

//     return (
//         <AnimationWrapper keyValue={type}>
//             <section className="h-cover flex items-center justify-center"
//                 style={{ 
//                     backgroundImage: `url(${themeMode === 'dark' ? back1 : back2})`, 
//                     backgroundSize: 'cover', 
//                     backgroundPosition: 'center', 
//                     height: 'auto', 
//                     width: 'auto', 
//                     color: themeMode === 'dark' ? 'white' : 'black'
//                 }}
//             >
//                 <form className="w-[80%] max-w-[400px]">
//                     <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
//                         {type === 'sign-in' ? 'Welcome Back' : 'Join us today'}
//                     </h1>
//                     {type !== 'sign-in' && (
//                         <InputBox
//                             name="fullname"
//                             type="text"
//                             placeholder="Full Name"
//                             icon={FaceIcon}
//                         />
//                     )}
//                     <InputBox
//                         name="email"
//                         type="email"
//                         placeholder="Email"
//                         icon={EmailIcon}
//                     />
//                     <InputBox
//                         name="password"
//                         type="password"
//                         placeholder="Password"
//                         icon={LockIcon}
//                     />
//                     <button className="btn-dark center mt-14" type="submit">
//                         {type.replace('-', ' ')}
//                     </button>

//                     <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
//                         <hr className="w-1/2 border-black"></hr>
//                         <p>OR</p>
//                         <hr className="w-1/2 border-black"></hr>
//                     </div>

//                     <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
//                         <img src={googleIcon} className="w-5" alt="Google Icon" />
//                         Continue with Google
//                     </button>

//                     {type === 'sign-in' ? (
//                         <p className="mt-6 text-dark-grey text-xl text-center">
//                             Don't have an account? 
//                             <Link to="/signup" className="underline text-xl ml-1">Join us today</Link>
//                         </p>
//                     ) : (
//                         <p className="mt-6 text-dark-grey text-xl text-center">
//                             Already a member?
//                             <Link to="/signin" className="underline text-xl ml-1">Sign in here</Link>
//                         </p>
//                     )}
//                 </form>
//             </section>
//         </AnimationWrapper>
//     );
// };

// export default UserAuthForm;

import React, { useContext } from 'react';
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

const UserAuthForm = ({ type }) => {
    const themeMode = useContext(ThemeModeContext);

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
                <form className="w-[80%] max-w-[400px]">
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
