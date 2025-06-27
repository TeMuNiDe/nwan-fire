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
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`, // Default to closed state for transition
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    ...(!open && { // Adjust margin when drawer is collapsed
      marginLeft: theme.spacing(7), // Width of collapsed drawer
    }),
    ...(!isMobile && { // Apply margin for desktop view
      // This margin is now applied to the outermost Box
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

  const handleDrawerToggle = () => {
    setOpen(!open);
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
          ...(!isMobile && {
            margin: '100px',
          }),
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
              <Typography variant="h6" noWrap component="div">
                NWAN Fire App
              </Typography>
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
              borderRadius: theme.shape.borderRadius, // Card-like rounded corners
              backgroundColor: theme.palette.background.paper, // Card background
              position: 'relative', // Ensure it pushes content
            },
          }}
          variant="persistent" // Keep persistent to push content
          anchor="left"
          open={open}
          onClose={handleDrawerToggle}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerToggle}>
              {open ? (theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />) : <MenuIcon />}
            </IconButton>
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
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Main open={open} isMobile={isMobile}>
            <DrawerHeader /> {/* This pushes content below the AppBar */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/cashflow" element={<CashFlow />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Main>
          <Box sx={{ width: isMobile ? 0 : 300, flexShrink: 0, display: isMobile ? 'none' : 'block' }}>
            <Chat />
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default AppLayout;
