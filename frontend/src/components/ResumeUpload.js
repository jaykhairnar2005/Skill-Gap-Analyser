import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Alert,
} from '@mui/material';
import { CloudUpload, CheckCircle } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ResumeUpload({ onUpload }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError('Please upload a PDF file');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('You are not logged in. Please reload or login again.');
                setLoading(false);
                return;
            }

            const res = await axios.post(
                `${API_URL}/resumes/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess('Resume uploaded successfully');
            onUpload(res.data.resume);
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Upload Your Resume
                </Typography>

                <Box
                    sx={{
                        border: '2px dashed #1976D2',
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <input
                        type="file"
                        accept=".pdf"
                        id="resume"
                        hidden
                        onChange={handleFileChange}
                    />
                    <label htmlFor="resume">
                        <CloudUpload sx={{ fontSize: 40 }} />
                        <Typography>Click to upload PDF</Typography>
                    </label>

                    {loading && <CircularProgress sx={{ mt: 2 }} />}
                </Box>

                {success && (
                    <Alert severity="success" icon={<CheckCircle />} sx={{ mt: 2 }}>
                        {success}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
