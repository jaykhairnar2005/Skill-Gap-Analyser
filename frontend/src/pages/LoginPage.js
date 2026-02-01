import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Card,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, School } from '@mui/icons-material';
import axios from 'axios';

export default function LoginPage({ onLogin }) {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // ✅ RELATIVE PATH — PROXY HANDLES BACKEND
            const response = await axios.post('/api/auth/login', {
                email,
                password,
            });

            onLogin(response.data.token, response.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(
                err.response?.data?.error ||
                'Login failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                // Background handled by Global Theme
                py: 4
            }}
        >
            <Container maxWidth="sm">
                <Card sx={{ p: 4, borderRadius: 3 }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <School sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                            SkillGap
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            AI-Powered Career Development Platform
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleLogin}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
                    >
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                            size="small"
                            disabled={loading}
                        />

                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                            size="small"
                            disabled={loading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ py: 1.5, fontWeight: 600 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                    </Box>

                    <Typography sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600 }}
                        >
                            Sign up here
                        </Link>
                    </Typography>
                </Card>
            </Container>
        </Box>
    );
}
