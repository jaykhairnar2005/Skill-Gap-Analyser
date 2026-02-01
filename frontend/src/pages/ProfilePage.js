import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar
} from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    experienceLevel: '',
    targetRole: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ GET PROFILE
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(
        `${API_URL}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProfile({
        firstName: response.data.first_name || '',
        lastName: response.data.last_name || '',
        phone: response.data.phone || '',
        bio: response.data.bio || '',
        experienceLevel: response.data.experience_level || '',
        targetRole: response.data.target_role || '',
      });

      setMessage('');
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATE PROFILE
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `${API_URL}/auth/profile`,
        profile,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Update error:', error);
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
      <Grid container spacing={4}>
        {/* Left Column: Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', py: 4, height: '100%' }}>
            <CardContent>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 0 20px rgba(100, 255, 218, 0.4)'
                }}
              >
                {profile.firstName?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {profile.targetRole || 'Aspiring Professional'}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ bgcolor: 'rgba(100, 255, 218, 0.1)', color: 'primary.main', px: 2, py: 0.5, borderRadius: 4 }}>
                  {profile.experienceLevel ? profile.experienceLevel.toUpperCase() : 'NO LEVEL SET'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Edit Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>
                  Edit Profile
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleUpdate}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Target Job Role"
                      value={profile.targetRole}
                      onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                      fullWidth
                      placeholder="e.g. Software Engineer"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Experience Level</InputLabel>
                      <Select
                        value={profile.experienceLevel}
                        label="Experience Level"
                        onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
                      >
                        <MenuItem value=""><em>Select Level</em></MenuItem>
                        <MenuItem value="beginner">Beginner (0-2 years)</MenuItem>
                        <MenuItem value="intermediate">Intermediate (3-5 years)</MenuItem>
                        <MenuItem value="advanced">Advanced (5+ years)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Professional Bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Tell us about your career goals..."
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                {message && (
                  <Typography
                    sx={{
                      mt: 3,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: message.includes('success') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                      color: message.includes('success') ? '#4caf50' : '#f44336',
                      textAlign: 'center'
                    }}
                  >
                    {message}
                  </Typography>
                )}

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={saving}
                    sx={{ minWidth: 150 }}
                  >
                    {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
