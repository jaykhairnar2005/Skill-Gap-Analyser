import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import { Visibility, VisibilityOff, School } from '@mui/icons-material'; // This import is unused here but typical
import axios from 'axios';

// ... theme definition ...


const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#64ffda', // Teal accent
            light: '#9effff',
            dark: '#14cba8',
            contrastText: '#0a192f',
        },
        secondary: {
            main: '#bd93f9', // Purple accent
            light: '#f1c4ff',
            dark: '#8a63c6',
        },
        background: {
            default: '#0a192f', // Deep navy
            paper: '#112240',
        },
        text: {
            primary: '#e6f1ff',
            secondary: '#8892b0',
        },
    },
    typography: {
        fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
        h1: { fontWeight: 700, fontSize: '3rem', letterSpacing: '-0.02em', color: '#e6f1ff' },
        h2: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.01em', color: '#e6f1ff' },
        h4: { fontWeight: 600, color: '#e6f1ff' },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '@keyframes gradient': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                '@keyframes float': {
                    '0%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                    '100%': { transform: 'translateY(0px)' },
                },
                '@keyframes shimmer': {
                    '0%': { backgroundPosition: '200% center' },
                    '100%': { backgroundPosition: '-200% center' },
                },
                '@keyframes fadeInUp': {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                '@keyframes wave': {
                    '0%': { transform: 'rotate(0deg)' },
                    '10%': { transform: 'rotate(14deg)' },
                    '20%': { transform: 'rotate(-8deg)' },
                    '30%': { transform: 'rotate(14deg)' },
                    '40%': { transform: 'rotate(-4deg)' },
                    '50%': { transform: 'rotate(10deg)' },
                    '60%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(0deg)' },
                },
                '@keyframes twinkle': {
                    '0%': { opacity: 0, transform: 'scale(0.5)' },
                    '50%': { opacity: 0.8, transform: 'scale(1.2)' },
                    '100%': { opacity: 0, transform: 'scale(0.5)' },
                },
                body: {
                    // Background handled by AnimatedBackground component
                    minHeight: '100vh',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 24px',
                    borderRadius: 8,
                    transition: 'all 0.3s ease',
                },
                contained: {
                    background: 'linear-gradient(45deg, #64ffda 30%, #53d3b4 90%)',
                    color: '#0a192f',
                    boxShadow: '0 3px 15px rgba(100, 255, 218, 0.3)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 5px 20px rgba(100, 255, 218, 0.4)',
                    },
                },
                outlined: {
                    borderColor: '#64ffda',
                    color: '#64ffda',
                    '&:hover': {
                        backgroundColor: 'rgba(100, 255, 218, 0.1)',
                        borderColor: '#64ffda',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(17, 34, 64, 0.75)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        borderColor: 'rgba(100, 255, 218, 0.5)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 0 0 2px rgba(100, 255, 218, 0.2)',
                        },
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    transition: 'all 0.3s',
                    '&.Mui-selected': {
                        color: '#64ffda',
                    },
                },
            },
        },
    },
});

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
        }
        setLoading(false);

        // 🛡️ Global 401 Handler
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    console.warn('⚠️ [App] Global 401 detected. Logging out.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsAuthenticated(false);
                    setUser(null);
                    // Optional: Window location reload if router navigation isn't available here easily
                    // window.location.href = '/login'; 
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const handleLogin = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</Box>;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AnimatedBackground />
            <Router>
                {isAuthenticated && <Navbar onLogout={handleLogout} user={user} />}
                <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
                    <Routes>
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
                        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage onLogin={handleLogin} />} />
                        <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />} />
                        <Route path="/profile" element={isAuthenticated ? <ProfilePage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
                        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                    </Routes>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default App;
