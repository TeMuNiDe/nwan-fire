import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  CssBaseline,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled, useTheme } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import your main page components
import Dashboard from './Dashboard';
import CashFlow from './CashFlow';
import Budget from './Budget';
import Settings from './Settings';
import Chat from './Chat'; // Chat is a persistent component

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile' })(
  ({ theme, open, isMobile }) => ({
    flexGrow: 1,
    padding: theme.spacing(isMobile ? 1 : 3), // Responsive padding
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: isMobile ? 0 : (open ? drawerWidth : theme.spacing(7)), // Adjust margin based on mobile and drawer state
    ...(!isMobile && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && { // Adjust width and margin when drawer is collapsed
    width: `calc(100% - ${theme.spacing(7)}px)`,
    marginLeft: `${theme.spacing(7)}px`,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile); // Drawer open by default on desktop
  const [isChatOpen, setIsChatOpen] = useState(true); // State for chat visibility

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const menuItems = [
    { text: 'Dashboard', path: '/' },
    { text: 'Cash Flow', path: '/cashflow' },
    { text: 'Budget', path: '/budget' },
    { text: 'Settings', path: '/settings' },
  ];

  return (
    <Router>
      <Box
        sx={{
          display: 'flex',
          // Removed fixed margin for non-mobile
        }}
      >
        <CssBaseline />
        {/* AppBar for mobile view */}
        {isMobile && (
          <AppBarStyled position="fixed" open={open}>
            <Toolbar>
              {!open && ( // Show menu icon only when drawer is closed on mobile
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerToggle}
                  edge="start"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                NWAN Fire App
              </Typography>
              <IconButton
                color="inherit"
                aria-label="toggle chat"
                onClick={handleChatToggle}
              >
                <ChatIcon />
              </IconButton>
            </Toolbar>
          </AppBarStyled>
        )}

        {/* Floating button for desktop when drawer is closed */}
        {!isMobile && !open && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{
              position: 'fixed',
              top: theme.spacing(2),
              left: theme.spacing(2),
              zIndex: theme.zIndex.drawer + 1, // Ensure it's above other content
              backgroundColor: theme.palette.primary.main, // Example background
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              color: theme.palette.primary.contrastText,
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Drawer
          sx={{
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: open ? drawerWidth : theme.spacing(7), // Adjust width based on open state
              boxSizing: 'border-box',
              overflowX: 'hidden', // Hide content when collapsed
              transition: theme.transitions.create('width', { // Animate width
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              boxShadow: theme.shadows[4], // Card-like shadow
              backgroundColor: theme.palette.background.paper, // Card background
              position: 'fixed', // Ensure it pushes content
            },
          }}
          variant={isMobile ? "temporary" : "persistent"} // Change variant based on mobile
          anchor="left"
          open={open}
          onClose={handleDrawerToggle}
        >
          <DrawerHeader>
            {isMobile && <IconButton onClick={handleDrawerToggle}>
              {open ? (theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />) : <MenuIcon />}
            </IconButton>}
          </DrawerHeader>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} component={Link} to={item.path} onClick={isMobile ? handleDrawerToggle : null} disablePadding>
                <ListItemButton>
                  {open && <ListItemText primary={item.text} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Box sx={{ display: 'flex', flexGrow: 1,right:'350px' }}>
          <Main open={open} isMobile={isMobile}>
            <DrawerHeader /> {/* This pushes content below the AppBar */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/cashflow" element={<CashFlow />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Main>
          {/* Render Chat component as a sidebar on desktop, or as an overlay on mobile */}
          {!isMobile && (
            <Box sx={{ width: isChatOpen ? 350 : 0, flexShrink: 0, transition: 'width 0.3s' }}>
              <Chat isOpen={true} onClose={handleChatToggle} isMobile={isMobile} />
            </Box>
          )}
          {isMobile && <Chat isOpen={isChatOpen} onClose={handleChatToggle} isMobile={isMobile} />}
        </Box>
      </Box>
    </Router>
  );
}

export default AppLayout;
