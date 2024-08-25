import React, { createContext, useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import InputBase from '@mui/material/InputBase';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import MMname from '../imgs/mmname.png';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { Outlet, useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import { UserContext } from '../App';
import NotificationsIcon from '@mui/icons-material/Notifications';
import UserNavigationPanel from './user-navigation.component';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

const ThemeModeContext = createContext();

const pages = ['Media', 'Community', 'About Us', 'Newsletter'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginRight: 10,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#E3DFFD',
    },
    secondary: {
      main: '#436B5F',
    },
    success: {
      main: '#CFEE8E',
    },
    warning: {
      main: '#D2C98A',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    text: {
      primary: '#000000',
      secondary: '#000000',
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
    success: {
      main: '#914E56',
    },
    warning: {
      main: '#4D303F',
    },
    background: {
      default: '#121212',
      paper: '#1D1D1D',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
    },
  },
});

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [themeMode, setThemeMode] = useState('dark'); // default theme set to dark
  const [searchOpen, setSearchOpen] = useState(false); // state to control search visibility
  const [searchClose, setSearchClose] = useState(true); // state to control search icon visibility
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [userNavPanel, setUserNavPanel]=useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleThemeChange = (event) => {
    setThemeMode(event.target.checked ? 'dark' : 'light');
  };

  const handleSearchIconClick = () => {
    setSearchOpen(!searchOpen);
    setSearchClose(!searchClose);
  };

  const handleUserNavPanel = () =>{
    setUserNavPanel(currentVal => !currentVal);
  }

  const handleBlur = () =>{
    setTimeout(()=>{
      setUserNavPanel(false);
    },200);
  }

  let navigate=useNavigate();

  const handleSearch=(e)=>{
    let query =e.target.value;
    if(e.key=="Enter" && query.length){
      navigate(`/search/${query}`);
    }
  }

  const {userAuth, userAuth: {access_token, profile_img}} = useContext(UserContext)
  const isSmallScreen1 = useMediaQuery('(max-width:400px)');

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <IconButton
                href="/"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  mr: 1,
                  p: 0, // Remove padding
                  borderRadius: 'initial', // Remove border radius
                  '&:hover': {
                    backgroundColor: 'transparent', // Remove hover background
                  },
                }}
              >
                <Box
                  component="img"
                  src={MMname}
                  // sx={{
                  //   width: 140,
                  //   height: 80,
                  // }}
                  sx={{
                    width: isSmallScreen1 ? 100 : 140, // Adjust the width for small screens
                    height: isSmallScreen1 ? 60 : 80,  // Adjust the height for small screens
                  }}
                />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <IconButton
                href="/"
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  mr: 1,
                  p: 0, // Remove padding
                  borderRadius: 'initial', // Remove border radius
                  '&:hover': {
                    backgroundColor: 'transparent', // Remove hover background
                  },
                }}
              >
                <Box
                  component="img"
                  src={MMname}
                  // sx={{
                  //   width: 140,
                  //   height: 80,
                  // }}
                  sx={{
                    width: isSmallScreen1 ? 100 : 140, // Adjust the width for small screens
                    height: isSmallScreen1 ? 60 : 80,  // Adjust the height for small screens
                  }}
                />
              </IconButton>
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={(theme) => ({
                      my: 2,
                      color: theme.palette.text.primary, // Access theme's primary text color
                      display: 'block',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1), // Light background color on hover
                      },
                    })}
                  >
                    {page}
                  </Button>
                ))}
              </Box>


              {isSmallScreen ? (
                <React.Fragment>
                  {searchClose && (
                      <IconButton size="large" aria-label="search" color="inherit" onClick={handleSearchIconClick}>
                          <SearchIcon />
                      </IconButton>
                  )}
                  
                  {searchOpen && (
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Search>
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          placeholder="Search…"
                          onKeyDown={handleSearch}
                          inputProps={{ 'aria-label': 'search' }}
                        />
                      </Search>
                    </Box>
                  )}
                </React.Fragment>
              ) : (
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    onKeyDown={handleSearch}
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
              )}

              <Switch
                checked={themeMode === 'dark'}
                onChange={handleThemeChange}
                color="default"
              />

              {access_token ? (
              <>
                <Button
                  component={Link}
                  href="/editor"
                  sx={(theme) => ({
                    my: 2,
                    px:5,
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.background.paper,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                    margin: 1,
                    textDecoration: 'none',
                    borderRadius: '50px', // Oval shape
                    padding: '8px 16px', // Same padding for consistent size
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px', // Space between icon and text
                  })}
                >
                  <DriveFileRenameOutlineIcon />
                  Write
                </Button>

                <Link to="/dashboard/notification">
                  <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/40 ml-2'>
                    <NotificationsIcon className='text-4xl'/>
                  </button>
                </Link>

                <div className="relative mt-1 ml-2" onClick={handleUserNavPanel} onBlur={handleBlur}>
                  <button className="w-12 h-12 mt-1">
                    <img src={profile_img} className='w-12 h-12 object-cover rounded-full'/>
                  </button>

                  {userNavPanel ? <UserNavigationPanel/> : ""}
                </div>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/editor"
                  sx={(theme) => ({
                    my: 2,
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.background.paper,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                    margin: 1,
                    textDecoration: 'none',
                    borderRadius: '50px', // Oval shape
                    padding: '8px 16px', // Same padding for consistent size
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px', // Space between icon and text
                  })}
                >
                  <DriveFileRenameOutlineIcon />
                  Write
                </Button>

                <Button
                  component={Link}
                  href="/signin"
                  sx={(theme) => ({
                    my: 2,
                    color: theme.palette.primary.contrastText, // Text color for contrast
                    backgroundColor: theme.palette.primary.main, // Primary color from theme
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark, // Darker shade on hover
                    },
                    margin: 1,
                    textDecoration: 'none',
                    borderRadius: '50px', // Large value for oval shape
                    padding: '8px 16px', // Adjust padding for oval appearance
                  })}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  href="/signup"
                  sx={(theme) => ({
                    my: 2,
                    color: theme.palette.primary.contrastText, // Text color for contrast
                    backgroundColor: theme.palette.primary.main, // Secondary color from theme
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark, // Darker shade on hover
                    },
                    margin: 1,
                    textDecoration: 'none',
                    borderRadius: '50px', // Large value for oval shape
                    padding: '8px 16px', // Adjust padding for oval appearance
                    display: { xs: 'none', md: 'block' }, // Hide on smaller screens
                  })}
                >
                  Sign Up
                </Button>
              </>
            )}

            </Toolbar>
          </Container>
        </AppBar>
      </ThemeProvider>
      <Outlet />
    </ThemeModeContext.Provider>
  );
}

export { ThemeModeContext };
export default ResponsiveAppBar;
