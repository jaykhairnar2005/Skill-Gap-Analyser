import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Grid,
    Button,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { CheckCircle, Schedule } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function SkillExtraction({ resume, resumes }) {
    const [selectedResumeId, setSelectedResumeId] = useState(resume?.id);

    const currentResume = resumes.find(r => r.id === selectedResumeId) || resume;
    const skills = currentResume?.extractedSkills || [];

    const skillCategories = {
        programming: ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust'],
        frontend: ['React', 'Vue', 'Angular', 'HTML', 'CSS'],
        backend: ['Node.js', 'Express', 'Django', 'Flask', 'Spring'],
        database: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'SQL'],
        devops: ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'AWS'],
        tools: ['Git', 'Linux', 'GitHub', 'GitLab'],
    };

    const getCategoryColor = (skill) => {
        for (const [category, skillList] of Object.entries(skillCategories)) {
            if (skillList.some(s => skill.toLowerCase().includes(s.toLowerCase()))) {
                const colors = {
                    programming: '#FF6B6B',
                    frontend: '#4ECDC4',
                    backend: '#45B7D1',
                    database: '#FFA07A',
                    devops: '#98D8C8',
                    tools: '#F7DC6F',
                };
                return colors[category];
            }
        }
        return '#9B9B9B';
    };

    return (
        <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Extracted Skills
                </Typography>

                {resumes.length > 1 && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Resume</InputLabel>
                        <Select
                            value={selectedResumeId}
                            onChange={(e) => setSelectedResumeId(e.target.value)}
                            label="Select Resume"
                        >
                            {resumes.map((r) => (
                                <MenuItem key={r.id} value={r.id}>
                                    {r.fileName} - {new Date(r.uploadDate).toLocaleDateString()}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {skills.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Schedule sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            No skills extracted yet. Upload a resume to get started!
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                Found {skills.length} skills
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {skills.map((skill) => (
                                    <Chip
                                        key={skill}
                                        label={skill}
                                        sx={{
                                            backgroundColor: getCategoryColor(skill),
                                            color: 'white',
                                            fontWeight: 500,
                                            fontSize: '0.85rem',
                                        }}
                                        icon={<CheckCircle sx={{ color: 'white' }} />}
                                    />
                                ))}
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            📋 Skill Categories:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {Object.entries(skillCategories).map(([category, items]) => {
                                const matchedSkills = skills.filter(s =>
                                    items.some(item => s.toLowerCase().includes(item.toLowerCase()))
                                ).length;
                                return (
                                    <Chip
                                        key={category}
                                        label={`${category}: ${matchedSkills}/${items.length}`}
                                        size="small"
                                        variant="outlined"
                                    />
                                );
                            })}
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
