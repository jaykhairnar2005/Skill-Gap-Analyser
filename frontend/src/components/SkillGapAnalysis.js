import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  LinearProgress,
  Chip,
  CircularProgress,
  Alert,
  TextField
} from '@mui/material';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function SkillGapAnalysis({
  resume,
  selectedJobRole,
  setSelectedJobRole,
  analysisResult,
  setAnalysisResult,
  setActiveTab
}) {
  const [domainData, setDomainData] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleName, setCustomRoleName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roadmapCreated, setRoadmapCreated] = useState(false);

  const fetchJobRoles = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/job-roles`);
      setDomainData(response.data);
    } catch (err) {
      setError('Failed to load job roles');
    }
  }, []);

  useEffect(() => {
    fetchJobRoles();
  }, [fetchJobRoles]);

  useEffect(() => {
    if (selectedDomain) {
      const domainObj = domainData.find(d => d.domain === selectedDomain);
      setAvailableRoles(domainObj ? domainObj.roles : []);
    } else {
      setAvailableRoles([]);
    }
  }, [selectedDomain, domainData]);

  const performAnalysis = async () => {
    if (!selectedJobRole && !customRoleName) {
      setError('Please select a job role or enter a custom one');
      return;
    }

    setLoading(true);
    setError('');
    setRoadmapCreated(false);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API_URL}/analysis/gap`,
        {
          jobRoleId: isCustomRole ? null : selectedJobRole,
          customRole: isCustomRole ? customRoleName : null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnalysisResult(response.data.analysis);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const createRoadmap = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.post(
        `${API_URL}/analysis/roadmap`,
        {
          missingSkills: analysisResult.missingSkills,
          durationWeeks: 4
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRoadmapCreated(true);
      alert(res.data.message || "Learning roadmap created!");

      if (setActiveTab) {
        setActiveTab("roadmap");
      }

    } catch (err) {
      console.error("Roadmap error:", err);
      alert(err.response?.data?.error || "Failed to create roadmap");
    }
  };

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Skill Gap Analysis
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Domain Selector */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Domain</InputLabel>
              <Select
                value={selectedDomain}
                onChange={(e) => {
                  setSelectedDomain(e.target.value);
                  setSelectedJobRole(''); // Reset role when domain changes
                  setIsCustomRole(false);
                }}
                label="Select Domain"
              >
                {domainData.map((d) => (
                  <MenuItem key={d.domain} value={d.domain}>
                    {d.domain}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Job Role Selector */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth disabled={!selectedDomain}>
              <InputLabel>Select Job Role</InputLabel>
              <Select
                value={isCustomRole ? 'other' : selectedJobRole}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'other') {
                    setIsCustomRole(true);
                    setSelectedJobRole('');
                    setCustomRoleName('');
                  } else {
                    setIsCustomRole(false);
                    setSelectedJobRole(val);
                  }
                }}
                label="Select Job Role"
              >
                {availableRoles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.title}
                  </MenuItem>
                ))}
                <MenuItem value="other" sx={{ fontStyle: 'italic', color: 'primary.main' }}>
                  + Other (Custom Role)
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Custom Role Input */}
          {isCustomRole && (
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Enter Job Role Title"
                value={customRoleName}
                onChange={(e) => setCustomRoleName(e.target.value)}
                variant="outlined"
                autoFocus
              />
            </Grid>
          )}

          <Grid item xs={12} md={isCustomRole ? 12 : 4}>
            <Button
              variant="contained"
              fullWidth
              onClick={performAnalysis}
              disabled={(!selectedJobRole && !customRoleName) || loading}
              sx={{ height: '56px' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze Gap'}
            </Button>
          </Grid>
        </Grid>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {analysisResult && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ mb: 3, p: 2.5, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Match Percentage
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={analysisResult.matchPercentage}
                    sx={{ height: 12, borderRadius: 6 }}
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {analysisResult.matchPercentage}%
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontWeight: 600, mb: 1.5 }}>
                <CheckCircleIcon sx={{ color: '#4CAF50', mr: 1 }} />
                Matched Skills ({analysisResult.matchedSkills.length})
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analysisResult.matchedSkills.map(skill => (
                  <Chip key={skill} label={skill} />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1.5 }}>
                <CancelIcon sx={{ color: '#F44336', mr: 1 }} />
                Missing Skills ({analysisResult.missingSkills.length})
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analysisResult.missingSkills.map(skill => (
                  <Chip key={skill} label={skill} />
                ))}
              </Box>
            </Box>

            {analysisResult.missingSkills.length > 0 && !roadmapCreated && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={createRoadmap}
                >
                  Create Learning Roadmap
                </Button>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
