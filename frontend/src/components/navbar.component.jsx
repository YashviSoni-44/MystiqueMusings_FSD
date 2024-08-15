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
import { Outlet } from 'react-router-dom';
import { Link } from '@mui/material';

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
      main: '#2F2A35',
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
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [themeMode, setThemeMode] = useState('dark'); // default theme set to dark
  const [searchOpen, setSearchOpen] = useState(false); // state to control search visibility
  const [searchClose, setSearchClose] = useState(true); // state to control search icon visibility
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleThemeChange = (event) => {
    setThemeMode(event.target.checked ? 'dark' : 'light');
  };

  const handleSearchIconClick = () => {
    setSearchOpen(!searchOpen);
    setSearchClose(!searchClose);
  };

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
                  sx={{
                    width: 140,
                    height: 80,
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
                  sx={{
                    width: 140,
                    height: 80,
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
                    sx={{ my: 2, color: 'white', display: 'block' }}
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
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
              )}

              <Switch
                checked={themeMode === 'dark'}
                onChange={handleThemeChange}
                color="default"
              />

              <Link className="btn-light py-2" style={{margin:5, textDecoration: "none"}} href="/signin">
                Sign In
              </Link>
              <Link className="btn-light py-2 hidden md:block" style={{margin:5, textDecoration: "none"}} href="/signup">
                Sign Up
              </Link>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              
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
