// import React, { createContext, useState } from 'react';
// import MMname from '../imgs/mmname.png';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { alpha, AppBar, Box, Button, Container, IconButton, Switch, Toolbar, Typography } from '@mui/material';
// import { Link } from 'react-router-dom';
// import AnimationWrapper from '../common/page-animation';
// import defaultBanner from '../imgs/blog banner.png'

// const lightTheme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#C7C8CC',
//     },
//     secondary: {
//       main: '#436B5F',
//     },
//     background: {
//       default: '#FFFFFF',
//       paper: '#E3DFFD',
//     },
//     text: {
//       primary: '#000000',
//     },
//   },
// });

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#17153B',
//     },
//     secondary: {
//       main: '#E6D389',
//     },
//     background: {
//       default: '#121212',
//       paper: '#1D1D1D',
//     },
//     text: {
//       primary: '#FFFFFF',
//     },
//   },
// });

// const ThemeModeContext = createContext();

// const BlogEditor = () => {
//   const [themeMode, setThemeMode] = useState('dark');
//   const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;
//   const handleThemeChange = (event) => {
//     setThemeMode(event.target.checked ? 'dark' : 'light');
//   };

//   const handleBannerUpload = (e) =>{
//     let img=e.target.files[0];
//   }

//   return (
//     <>
//     <ThemeModeContext.Provider value={themeMode}>
//       <ThemeProvider theme={currentTheme}>
//         <AppBar
//           position="static"
//           sx={{ backgroundColor: currentTheme.palette.background.paper }}
//         >
//           <Container maxWidth="xl">
//             <Toolbar>
//               <IconButton
//                 href="/"
//                 sx={{
//                   mr: 1,
//                   p: 0, // Remove padding
//                   borderRadius: 'initial', // Remove border radius
//                   '&:hover': {
//                     backgroundColor: 'transparent', // Remove hover background
//                   },
//                 }}
//               >
//                 <Box
//                   component="img"
//                   src={MMname}
//                   sx={{
//                     width: 140,
//                     height: 80,
//                   }}
//                 />
//               </IconButton>

//               <Typography
//                 variant="h6"
//                 sx={{
//                   flexGrow: 1,
//                   color: currentTheme.palette.text.primary,
//                   display: { xs: 'none', md: 'block' }, // Only display on medium screens and up
//                   mx: 3,
//                   whiteSpace: 'nowrap',
//                   overflow: 'hidden',
//                   textOverflow: 'ellipsis',
//                 }}
//               >
//                 New Blog
//               </Typography>

//               <Box sx={{ display: 'flex', alignItems: 'center', position: 'fixed', right:'16px' }}>
//                 <Switch
//                   sx={{ ml: 1 }}
//                   checked={themeMode === 'dark'}
//                   onChange={handleThemeChange}
//                   color="default"
//                 />
//                 <Button
//                   component={Link}
//                   href="/editor"
//                   sx={(theme) => ({
//                     my: 2,
//                     color: theme.palette.text.primary,
//                     backgroundColor: theme.palette.primary.main,
//                     '&:hover': {
//                       backgroundColor: alpha(theme.palette.primary.main, 0.1),
//                     },
//                     margin: 1,
//                     textDecoration: 'none',
//                     borderRadius: '50px', // Oval shape
//                     padding: '8px 16px', // Same padding for consistent size
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px', // Space between icon and text
//                   })}
//                 >
//                   Publish
//                 </Button>
//                 <Button
//                   component={Link}
//                   href="/editor"
//                   sx={(theme) => ({
//                     my: 2,
//                     color: theme.palette.text.primary,
//                     backgroundColor: theme.palette.primary.main,
//                     '&:hover': {
//                       backgroundColor: alpha(theme.palette.primary.main, 0.1),
//                     },
//                     margin: 1,
//                     textDecoration: 'none',
//                     borderRadius: '50px', // Oval shape
//                     padding: '8px 16px', // Same padding for consistent size
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px', // Space between icon and text
//                   })}
//                 >
//                   Save Draft
//                 </Button>
//               </Box>
//             </Toolbar>
//           </Container>
//         </AppBar>
//       </ThemeProvider>
//     </ThemeModeContext.Provider>

//     <AnimationWrapper>
//         <section>
//             <div className='mx-auto max-w-[900px] w-full'>
//                 <div className='relative hover:opacity-80 aspect-video bg-white border-4 border-grey'>
//                     <label htmlFor='uploadBanner'>
//                         <img
//                             src={defaultBanner}
//                             className='z-20'

//                         />
//                         <input
//                             id="uploadBanner"
//                             type="file"
//                             accept=".png, .jpg, .jpeg"
//                             hidden
//                             onChange={handleBannerUpload}
//                         />
//                     </label>
//                 </div>
//             </div>
//         </section>
//     </AnimationWrapper>
//     </>
//   );
// };

// export default BlogEditor;
import React, { useState, useEffect, useContext } from 'react';
import MMname from '../imgs/mmname.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { alpha, AppBar, Box, Button, Container, IconButton, Switch, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import AnimationWrapper from '../common/page-animation';
import axios from 'axios';
import { EditorContext } from '../pages/editor.pages';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#C7C8CC',
    },
    secondary: {
      main: '#436B5F',
    },
    background: {
      default: '#FFFFFF',
      paper: '#E3DFFD',
    },
    text: {
      primary: '#000000',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#17153B',
    },
    secondary: {
      main: '#E6D389',
    },
    background: {
      default: '#121212',
      paper: '#1D1D1D',
    },
    text: {
      primary: '#FFFFFF',
    },
  },
});

const BlogEditor = () => {
  const [themeMode, setThemeMode] = useState('dark');
  const [bannerImage, setBannerImage] = useState('');

  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

  let {blog:{title, banner, content, tags, des}, setBlog}=useContext(EditorContext);

  useEffect(() => {
    // Fetch the banner image from the server
    axios.get('http://localhost:5500/get-banner-image')
      .then((response) => {
        if (response.data && response.data.url) {
          setBannerImage(`http://localhost:5500${response.data.url}`);
        } else {
          setBannerImage('path/to/default/banner.png'); // Fallback to default if no image
        }
      })
      .catch((err) => console.error('Failed to fetch banner image:', err));
  }, []);

  const handleThemeChange = (event) => {
    setThemeMode(event.target.checked ? 'dark' : 'light');
  };

  const handleBannerUpload = (e) => {
    let img = e.target.files[0];

    const formData = new FormData();
    formData.append('banner', img);

    axios.post('http://localhost:5500/upload-banner', formData)
      .then((response) => {
        if (response.data && response.data.uploadURL) {
          setBannerImage(`http://localhost:5500${response.data.uploadURL}`);
        }
      })
      .catch((err) => console.error('Failed to upload banner image:', err));
  };

  const handleTitleKeyDown =(e)=>{
    if(e.keyCode==13){//enter key
      e.preventDefault();
    }
  }

  const handleTitleChange=(e)=>{
    let input = e.target;
    input.style.height='auto';
    input.style.height=input.scrollHeight+"px";

    setBlog({...blog})
  }

  return (
    <>
      <ThemeProvider theme={currentTheme}>
        <AppBar position="static" sx={{ backgroundColor: currentTheme.palette.background.paper }}>
          <Container maxWidth="xl">
            <Toolbar>
              <IconButton href="/" sx={{ mr: 1, p: 0, borderRadius: 'initial', '&:hover': { backgroundColor: 'transparent' } }}>
                <Box component="img" src={MMname} sx={{ width: 140, height: 80 }} />
              </IconButton>

              <Typography variant="h6" sx={{ flexGrow: 1, color: currentTheme.palette.text.primary, display: { xs: 'none', md: 'block' }, mx: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                New Blog
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', position: 'fixed', right:'16px' }}>
                <Switch sx={{ ml: 1 }} checked={themeMode === 'dark'} onChange={handleThemeChange} color="default" />
                <Button component={Link} href="/editor" sx={(theme) => ({
                  my: 2,
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                  margin: 1,
                  textDecoration: 'none',
                  borderRadius: '50px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                })}>Publish</Button>
                <Button component={Link} href="/editor" sx={(theme) => ({
                  my: 2,
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                  margin: 1,
                  textDecoration: 'none',
                  borderRadius: '50px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                })}>Save Draft</Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <AnimationWrapper>
          <section>
            <div className='mx-auto max-w-[900px] w-full'>
              <div className='relative hover:opacity-80 aspect-video bg-white border-4 border-grey'>
                <label htmlFor='uploadBanner'>
                  <img src={bannerImage} className='z-20' alt='Blog Banner' />
                  <input id="uploadBanner" type="file" accept=".png, .jpg, .jpeg" hidden onChange={handleBannerUpload} />
                </label>
              </div>
              <textarea
                placeholder='Blog Title'
                className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40'
                onKeyDown={handleTitleKeyDown}
                onChange={handleTitleChange}
              ></textarea>
            </div>
          </section>
        </AnimationWrapper>
      </ThemeProvider>
    </>
  );
};

export default BlogEditor;
