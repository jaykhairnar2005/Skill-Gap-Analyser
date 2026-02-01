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
    IconButton,
    Grid
} from '@mui/material';
import { Visibility, VisibilityOff, School } from '@mui/icons-material';
import axios from 'axios';

export default function RegisterPage({ onLogin }) {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // ✅ USE RELATIVE PATH (PROXY WILL HANDLE BACKEND)
            const response = await axios.post('/api/auth/register', {
                firstName,
                lastName,
                email,
                password,
            });

            onLogin(response.data.token, response.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(
                err.response?.data?.error ||
                'Registration failed. Please try again.'
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <Card sx={{ p: 4, borderRadius: 3 }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <School sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}
                        >
                            SkillGap
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Create your account
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleRegister}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    fullWidth
                                    required
                                    size="small"
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    fullWidth
                                    size="small"
                                    disabled={loading}
                                />
                            </Grid>
                        </Grid>

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

                        <TextField
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            required
                            size="small"
                            disabled={loading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            edge="end"
                                            size="small"
                                        >
                                            {showConfirmPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
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
                            {loading ? <CircularProgress size={24} /> : 'Create Account'}
                        </Button>
                    </Box>

                    <Typography
                        sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}
                    >
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            style={{
                                color: '#667eea',
                                textDecoration: 'none',
                                fontWeight: 600,
                            }}
                        >
                            Login here
                        </Link>
                    </Typography>
                </Card>
            </Container>
        </Box>
    );
}
