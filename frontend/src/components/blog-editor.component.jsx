// import React, { useState, useEffect, useContext, useRef } from 'react';
// import axios from 'axios';
// import EditorJS from '@editorjs/editorjs';
// import { ThemeProvider, AppBar, Toolbar, Typography, Box, Button, IconButton, Container, Switch } from '@mui/material';
// import { createTheme, alpha } from '@mui/material/styles';
// import { Link } from 'react-router-dom';
// import MMname from '../imgs/mmname.png';
// import DefaultBanner from '../imgs/blog banner.png'; // Import the default banner image
// import AnimationWrapper from '../common/page-animation';
// import { EditorContext } from '../pages/editor.pages';
// import { tools } from './tools.component';
// import toast from 'react-hot-toast';

// const lightTheme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: { main: '#C7C8CC' },
//     secondary: { main: '#436B5F' },
//     background: { default: '#FFFFFF', paper: '#E3DFFD' },
//     text: { primary: '#000000' },
//   },
// });

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: { main: '#17153B' },
//     secondary: { main: '#E6D389' },
//     background: { default: '#121212', paper: '#1D1D1D' },
//     text: { primary: '#FFFFFF' },
//   },
// });

// const BlogEditor = () => {
//   const [themeMode, setThemeMode] = useState('dark');
//   const [bannerImage, setBannerImage] = useState(""); // Set the default banner image
//   const { blog, blog: { banner, context, tags, des }, setBlog, textEditor, setTextEditor} = useContext(EditorContext);
//   const { title } = blog;
//   const editorInstanceRef = useRef(null);
//   // const [textEditor, setTextEditor]=useState({isReady:false})

//   const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

//   useEffect(() => {
//     const initEditor = () => {
//       const textEditorElement = document.getElementById('textEditor');
//       if (textEditorElement) {
//         setTextEditor( new EditorJS({
//           holder: 'textEditorId',
//           data: '',
//           tools: tools,
//           placeholder: "Let's get started with blog content",
//         }));

//         editorInstanceRef.current = editor;
//         setTextEditor(editor);
//       }
//     };

//     initEditor();

//     return () => {
//       if (editorInstanceRef.current && typeof editorInstanceRef.current.destroy === 'function') {
//         editorInstanceRef.current.destroy();
//       }
//     };
//   }, [setTextEditor]);

//   useEffect(() => {
//     axios.get('http://localhost:5500/get-banner-image')
//       .then((response) => {
//         if (response.data && response.data.url) {
//           setBannerImage(`http://localhost:5500${response.data.url}`);
//         }
//       })
//       .catch((err) => console.error('Failed to fetch banner image:', err));
//   }, []);

//   const handleThemeChange = (event) => {
//     setThemeMode(event.target.checked ? 'dark' : 'light');
//   };

//   const handleBannerUpload = (e) => {
//     let img = e.target.files[0];
//     const formData = new FormData();
//     formData.append('banner', img);

//     axios.post('http://localhost:5500/upload-banner', formData)
//       .then((response) => {
//         if (response.data && response.data.uploadURL) {
//           const imageUrl = `http://localhost:5500${response.data.uploadURL}`;
//           setBannerImage(imageUrl);
//           setBlog((prev) => ({ ...prev, banner: imageUrl }));
//         }
//       })
//       .catch((err) => console.error('Failed to upload banner image:', err));
//   };

//   const handleTitleChange = (e) => {
//     let input = e.target;
//     input.style.height = 'auto';
//     input.style.height = input.scrollHeight + 'px';
//     setBlog((prev) => ({ ...prev, title: input.value }));
//   };

//   // const handlePublish = () => {
//   //   if (!banner.length) {
//   //     return toast.error("Upload a blog banner to publish it");
//   //   }
//   //   if (!title.length) {
//   //     return toast.error("Write blog title to publish it");
//   //   }
//   //   if(textEditor.isReady){
//   //     textEditor.save().then(data=>{
//   //       console.log(data)
//   //     })
//   //   }
//   // };
//   const handlePublish = () => {
//   if (!banner.length) {
//     toast.error("Upload a blog banner to publish it");
//   }
//   if (!title.length) {
//     toast.error("Write blog title to publish it");
//   }
//   if (textEditor.isReady) {
//     textEditor.save().then(data => {
//       console.log(data);
//       toast.success("Blog published successfully!");
//       // Optionally redirect or clear form
//     }).catch(err => {
//       toast.error("Failed to save content");
//       console.error(err);
//     });
//   } else {
//     toast.error("Editor is not ready");
//   }
// };

//   return (
//     <ThemeProvider theme={currentTheme}>
//       <Box sx={{ backgroundColor: currentTheme.palette.background.default, minHeight: '100vh' }}>
//         <AppBar position="static" sx={{ backgroundColor: currentTheme.palette.background.paper }}>
//           <Container maxWidth="xl">
//             <Toolbar>
//               <IconButton href="/" sx={{ mr: 1, p: 0, borderRadius: 'initial', '&:hover': { backgroundColor: 'transparent' } }}>
//                 <Box component="img" src={MMname} sx={{ width: 140, height: 80 }} />
//               </IconButton>

//               <Typography variant="h6" sx={{ flexGrow: 1, color: currentTheme.palette.text.primary, display: { xs: 'none', md: 'block' }, mx: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                 {title.length ? title : "New Blog"}
//               </Typography>

//               <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
//                 <Switch sx={{ ml: 1 }} checked={themeMode === 'dark'} onChange={handleThemeChange} color="default" />
//                 {/* <Button  href="/editor" onClick={handlePublish} sx={(theme) => ({
//                   my: 2,
//                   color: theme.palette.text.primary,
//                   backgroundColor: theme.palette.primary.main,
//                   '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
//                   margin: 1,
//                   textDecoration: 'none',
//                   borderRadius: '50px',
//                   padding: '8px 16px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                 })}>Publish</Button> */}
//                 <Button
//   onClick={handlePublish} // Ensure this is onClick handler
//   sx={(theme) => ({
//     my: 2,
//     color: theme.palette.text.primary,
//     backgroundColor: theme.palette.primary.main,
//     '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
//     margin: 1,
//     textDecoration: 'none',
//     borderRadius: '50px',
//     padding: '8px 16px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//   })}
// >
//   Publish
// </Button>


//                 <Button component={Link} href="/editor" sx={(theme) => ({
//                   my: 2,
//                   color: theme.palette.text.primary,
//                   backgroundColor: theme.palette.primary.main,
//                   '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
//                   margin: 1,
//                   textDecoration: 'none',
//                   borderRadius: '50px',
//                   padding: '8px 16px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                 })}>Save Draft</Button>
//               </Box>
//             </Toolbar>
//           </Container>
//         </AppBar>

//         <AnimationWrapper>
//           <section>
//             <Box sx={{ backgroundColor: currentTheme.palette.background.default, color: currentTheme.palette.text.primary }}>
//               <div className='mx-auto max-w-[900px] w-full'>
//                 <div className='relative hover:opacity-80 aspect-video bg-white border-4 border-grey'>
//                   <label htmlFor='uploadBanner'>
//                     <img src={DefaultBanner} className='z-20' alt='Blog Banner' />
//                     <input id="uploadBanner" type="file" accept=".png, .jpg, .jpeg" hidden onChange={handleBannerUpload} />
//                   </label>
//                 </div>
//                 <textarea
//                   style={{ backgroundColor: currentTheme.palette.background.paper }}
//                   placeholder='Blog Title'
//                   className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40'
//                   onKeyDown={(e) => e.keyCode === 13 && e.preventDefault()}
//                   onChange={handleTitleChange}
//                   value={title}
//                 ></textarea>

//                 <hr className='w-full opacity-10 my-3' />

//                 <div id="textEditorId" className='font-gelasio'></div>

//               </div>
//             </Box>
//           </section>
//         </AnimationWrapper>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default BlogEditor;




// import React, { useState, useEffect, useContext, useRef } from 'react';
// import axios from 'axios';
// import EditorJS from '@editorjs/editorjs';
// import { ThemeProvider, AppBar, Toolbar, Typography, Box, Button, IconButton, Container, Switch } from '@mui/material';
// import { createTheme, alpha } from '@mui/material/styles';
// import { Link } from 'react-router-dom';
// import MMname from '../imgs/mmname.png';
// import AnimationWrapper from '../common/page-animation';
// import { EditorContext } from '../pages/editor.pages';
// import { tools } from './tools.component';
// import toast from 'react-hot-toast';
// import DefaultBanner from '../imgs/blog banner.png'

// const lightTheme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: { main: '#C7C8CC' },
//     secondary: { main: '#436B5F' },
//     background: { default: '#FFFFFF', paper: '#E3DFFD' },
//     text: { primary: '#000000' },
//   },
// });

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: { main: '#17153B' },
//     secondary: { main: '#E6D389' },
//     background: { default: '#121212', paper: '#1D1D1D' },
//     text: { primary: '#FFFFFF' },
//   },
// });

// const BlogEditor = () => {
//   const [themeMode, setThemeMode] = useState('dark');
//   const [bannerImage, setBannerImage] = useState('');
//   const { blog, blog:{banner, context, tags, des}, setBlog, textEditor, setTextEditor } = useContext(EditorContext);
//   const { title } = blog;
//   const editorInstanceRef = useRef(null);

//   const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

//   useEffect(() => {
//     const initEditor = () => {
//       const textEditorElement = document.getElementById('textEditor');
//       if (textEditorElement) {
//         const editor = new EditorJS({
//           holderId: 'textEditor',
//           data: '',
//           tools: tools,
//           placeholder: "Let's get started with blog content",
//         });

//         editorInstanceRef.current = editor;
//         setTextEditor(editor);
//       }
//     };

//     initEditor();

//     return () => {
//       if (editorInstanceRef.current && typeof editorInstanceRef.current.destroy === 'function') {
//         editorInstanceRef.current.destroy();
//       }
//     };
//   }, [setTextEditor]);

//   useEffect(() => {
//     axios.get('http://localhost:5500/get-banner-image')
//       .then((response) => {
//         if (response.data && response.data.url) {
//           setBannerImage(`http://localhost:5500${response.data.url}`);
//         } else {
//           setBannerImage('path/to/default/banner.png');
//         }
//       })
//       .catch((err) => console.error('Failed to fetch banner image:', err));
//   }, []);

//   const handleThemeChange = (event) => {
//     setThemeMode(event.target.checked ? 'dark' : 'light');
//   };

//   const handleBannerUpload = (e) => {
//     let img = e.target.files[0];
//     const formData = new FormData();
//     formData.append('banner', img);

//     axios.post('http://localhost:5500/upload-banner', formData)
//       .then((response) => {
//         if (response.data && response.data.uploadURL) {
//           const imageUrl = `http://localhost:5500${response.data.uploadURL}`;
//           setBannerImage(imageUrl);
//           setBlog((prev) => ({ ...prev, banner: imageUrl }));
//         }
//       })
//       .catch((err) => console.error('Failed to upload banner image:', err));
//   };

//   const handleTitleChange = (e) => {
//     let input = e.target;
//     input.style.height = 'auto';
//     input.style.height = input.scrollHeight + 'px';
//     setBlog((prev) => ({ ...prev, title: input.value }));
//   };

//   const handlePublish = () => {
//     if (!banner.length) {
//       return toast.error("Upload a blog banner to publish it");
//     }
//     if (!title.length) {
//       return toast.error("Write blog title to publish it");
//     }
//     // Add more logic for publishing
//   };

//   return (
//     <ThemeProvider theme={currentTheme}>
//       <Box sx={{ backgroundColor: currentTheme.palette.background.default, minHeight: '100vh' }}>
//         <AppBar position="static" sx={{ backgroundColor: currentTheme.palette.background.paper }}>
//           <Container maxWidth="xl">
//             <Toolbar>
//               <IconButton href="/" sx={{ mr: 1, p: 0, borderRadius: 'initial', '&:hover': { backgroundColor: 'transparent' } }}>
//                 <Box component="img" src={MMname} sx={{ width: 140, height: 80 }} />
//               </IconButton>

//               <Typography variant="h6" sx={{ flexGrow: 1, color: currentTheme.palette.text.primary, display: { xs: 'none', md: 'block' }, mx: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                 {title.length ? title : "New Blog"}
//               </Typography>

//               <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
//                 <Switch sx={{ ml: 1 }} checked={themeMode === 'dark'} onChange={handleThemeChange} color="default" />
//                 <Button component={Link} href="/editor" onClick={handlePublish} sx={(theme) => ({
//                   my: 2,
//                   color: theme.palette.text.primary,
//                   backgroundColor: theme.palette.primary.main,
//                   '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
//                   margin: 1,
//                   textDecoration: 'none',
//                   borderRadius: '50px',
//                   padding: '8px 16px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                 })}>Publish</Button>

//                 <Button component={Link} href="/editor" sx={(theme) => ({
//                   my: 2,
//                   color: theme.palette.text.primary,
//                   backgroundColor: theme.palette.primary.main,
//                   '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
//                   margin: 1,
//                   textDecoration: 'none',
//                   borderRadius: '50px',
//                   padding: '8px 16px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                 })}>Save Draft</Button>
//               </Box>
//             </Toolbar>
//           </Container>
//         </AppBar>

//         <AnimationWrapper>
//           <section>
//             <Box sx={{ backgroundColor: currentTheme.palette.background.default, color: currentTheme.palette.text.primary }}>
//               <div className='mx-auto max-w-[900px] w-full'>
//                 <div className='relative hover:opacity-80 aspect-video bg-white border-4 border-grey'>
//                   <label htmlFor='uploadBanner'>
//                     <img src={bannerImage} className='z-20' alt='Blog Banner' />
//                     <input id="uploadBanner" type="file" accept=".png, .jpg, .jpeg" hidden onChange={handleBannerUpload} />
//                   </label>
//                 </div>
//                 <textarea
//                   style={{ backgroundColor: currentTheme.palette.background.paper }}
//                   placeholder='Blog Title'
//                   className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40'
//                   onKeyDown={(e) => e.keyCode === 13 && e.preventDefault()}
//                   onChange={handleTitleChange}
//                   value={title}
//                 ></textarea>

//                 <hr className='w-full opacity-10 my-3' />

//                 <div id="textEditor" className='font-gelasio'></div>

//               </div>
//             </Box>
//           </section>
//         </AnimationWrapper>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default BlogEditor;



import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import EditorJS from '@editorjs/editorjs';
import { ThemeProvider, AppBar, Toolbar, Typography, Box, Button, IconButton, Container, Switch } from '@mui/material';
import { createTheme, alpha } from '@mui/material/styles';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MMname from '../imgs/mmname.png';
import AnimationWrapper from '../common/page-animation';
import { EditorContext } from '../pages/editor.pages';
import { tools } from './tools.component';
import toast from 'react-hot-toast';
import DefaultBanner from '../imgs/blog banner.png'; // Imported Default Banner
import { UserContext } from '../App';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#C7C8CC' },
    secondary: { main: '#436B5F' },
    background: { default: '#FFFFFF', paper: '#E3DFFD' },
    text: { primary: '#000000' },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#17153B' },
    secondary: { main: '#E6D389' },
    background: { default: '#121212', paper: '#1D1D1D' },
    text: { primary: '#FFFFFF' },
  },
});

const BlogEditor = () => {
  const [themeMode, setThemeMode] = useState('dark');
  const [bannerImage, setBannerImage] = useState(DefaultBanner); // Set Default Banner initially
  const { blog, blog:{banner, content, tags, des}, setBlog,textEditor,setTextEditor, setEditorState} = useContext(EditorContext);
  const { title } = blog;
  const editorInstanceRef = useRef(null);

  let {userAuth:{access_token}}=useContext(UserContext)
  let navigate=useNavigate();
  let {blog_id}=useParams()

  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

  // useEffect(() => {
  //   const initEditor = () => {
  //     const textEditorElement = document.getElementById('textEditor');
  //     if (textEditorElement) {
  //       const editor = new EditorJS({
  //         holderId: 'textEditor',
  //         data: blog.content,
  //         tools: tools,
  //         placeholder: "Let's get started with blog content",
  //       });

  //       editorInstanceRef.current = editor;
  //       setTextEditor(editor);
  //     }
  //   };

  //   initEditor();

  //   return () => {
  //     if (editorInstanceRef.current && typeof editorInstanceRef.current.destroy === 'function') {
  //       editorInstanceRef.current.destroy();
  //     }
  //   };
  // }, [setTextEditor]);
  useEffect(() => {
      if (!textEditor.isReady) {
        setTextEditor(new EditorJS({
          holderId: 'textEditor',
          data: Array.isArray(content) ? content[0] : content,
          tools: tools,
          placeholder: "Let's get started with blog content",
        }))
      }
    },[]);

  useEffect(() => {
    // Only fetch new banner image if the current banner image is still the default
    if (bannerImage === DefaultBanner) {
      axios.get('http://localhost:5500/get-banner-image')
        .then((response) => {
          if (response.data && response.data.url) {
            const imageUrl = `http://localhost:5500${response.data.url}`;
            setBannerImage(imageUrl);
          }
        })
        .catch((err) => console.error('Failed to fetch banner image:', err));
    }
  }, [bannerImage]);

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
          const imageUrl = `http://localhost:5500${response.data.uploadURL}`;
          setBannerImage(imageUrl);
          setBlog((prev) => ({ ...prev, banner: imageUrl }));
        }
      })
      .catch((err) => console.error('Failed to upload banner image:', err));
  };

  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
    setBlog((prev) => ({ ...prev, title: input.value }));
  };

  const handlePublish = () => {
    // Check if banner is present
    if (!blog.banner.length) {
      return toast.error("Upload a blog banner to publish it");
    }
    // Check if title is present
    if (!blog.title.length) {
      return toast.error("Write blog title to publish it");
    }  

    if(textEditor.isReady){
      textEditor.save().then(data=>{
        if(data.blocks.length){
          setBlog({...blog,content:data})
          setEditorState("publish")
          toast.success("Blog published successfully!"); // Example success message
        }
        else{
          return toast.error("Enter blog content to publish it")
        }
      })
      .catch((err)=>{
        console.log(err)
      })
    }
  };
  const handleSaveDraft=(e)=>{
    if(e.target.className.includes("disable")){
      return;
    }
    if(!title.length){
      return toast.error("Write blog title before saving as a draft")
    }

    let loadingToast = toast.loading("Saving draft...")
    e.target.classList.add("disable")

    if(textEditor.isReady){
      textEditor.save().then(content=>{

        let blogObj = {
          title, banner, des, content, tags, draft:true
        }
        
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {...blogObj, id:blog_id}, {
          headers:{'Authorization':`Bearer ${access_token}`}
        })
        .then(()=>{
          e.target.classList.remove("disable")
          toast.dismiss(loadingToast);
          toast.success("Saved Draft 👍")

          setTimeout(()=>{
            navigate("/")
          },500);
        })
        .catch(({response})=>{
          e.target.classList.remove("disable")
          toast.dismiss(loadingToast)
          return toast.error(response.data.error)
        })
      })
    }
    
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <Box sx={{ backgroundColor: currentTheme.palette.background.default, minHeight: '100vh' }}>
        <AppBar position="static" sx={{ backgroundColor: currentTheme.palette.background.paper }}>
          <Container maxWidth="xl">
            <Toolbar>
              <IconButton href="/" sx={{ mr: 1, p: 0, borderRadius: 'initial', '&:hover': { backgroundColor: 'transparent' } }}>
                <Box component="img" src={MMname} sx={{ width: 140, height: 80 }} />
              </IconButton>

              <Typography variant="h6" sx={{ flexGrow: 1, color: currentTheme.palette.text.primary, display: { xs: 'none', md: 'block' }, mx: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {title.length ? title : "New Blog"}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                <Switch sx={{ ml: 1 }} checked={themeMode === 'dark'} onChange={handleThemeChange} color="default" />
                <Button component={Link} href="/editor" onClick={handlePublish} sx={(theme) => ({
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

                <Button component={Link} href="/editor" onClick={handleSaveDraft} sx={(theme) => ({
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
            <Box sx={{ backgroundColor: currentTheme.palette.background.default, color: currentTheme.palette.text.primary }}>
              <div className='mx-auto max-w-[900px] w-full'>
                <div className='relative hover:opacity-80 aspect-video bg-white border-4 border-grey'>
                  <label htmlFor='uploadBanner'>
                    <img src={bannerImage} className='z-20' alt='Blog Banner' />
                    <input id="uploadBanner" type="file" accept=".png, .jpg, .jpeg" hidden onChange={handleBannerUpload} />
                  </label>
                </div>
                <textarea
                  defaultValue={title}
                  style={{ backgroundColor: currentTheme.palette.background.paper }}
                  placeholder='Blog Title'
                  className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40'
                  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                  onChange={handleTitleChange}
                  value={title}
                ></textarea>

                <hr className='w-full opacity-10 my-3' />

                <div id="textEditor" className='font-gelasio'></div>

              </div>
            </Box>
          </section>
        </AnimationWrapper>
      </Box>
    </ThemeProvider>
  );
};

export default BlogEditor;
