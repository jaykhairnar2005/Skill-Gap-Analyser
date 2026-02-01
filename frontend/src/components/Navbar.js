import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Menu,
    MenuItem,
    Avatar,
    IconButton,
} from '@mui/material';
import { School, Logout, Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onLogout, user }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        navigate('/profile');
        handleMenuClose();
    };

    const handleLogout = () => {
        onLogout();
        navigate('/login');
        handleMenuClose();
    };

    const avatarLetter = user?.firstName?.[0]?.toUpperCase() || 'U';

    return (
        <AppBar position="sticky" sx={{
            background: 'rgba(10, 25, 47, 0.85)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                    <School sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                        SkillGap Analyzer
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {user?.firstName} {user?.lastName}
                    </Typography>

                    <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                        <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', width: 36, height: 36 }}>
                            {avatarLetter}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleProfile} sx={{ display: 'flex', gap: 1 }}>
                            <Settings fontSize="small" />
                            <Typography>Profile Settings</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout} sx={{ display: 'flex', gap: 1 }}>
                            <Logout fontSize="small" />
                            <Typography>Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
