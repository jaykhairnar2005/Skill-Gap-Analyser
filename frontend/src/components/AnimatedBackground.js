import React, { useMemo } from 'react';
import { Box } from '@mui/material';

const AnimatedBackground = () => {
    // Generate constant stars to avoid re-renders causing flickering positions
    const stars = useMemo(() => {
        return [...Array(60)].map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 1 + 'px',
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 5}s`
        }));
    }, []);

    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            overflow: 'hidden',
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)', // Deep space base
        }}>
            {/* Twinkling Stars */}
            {stars.map((star) => (
                <Box
                    key={star.id}
                    sx={{
                        position: 'absolute',
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                        opacity: 0, // Start invisible
                        animation: `twinkle ${star.animationDuration} ease-in-out infinite ${star.animationDelay}`,
                        boxShadow: '0 0 2px rgba(255, 255, 255, 0.8)'
                    }}
                />
            ))}

            {/* Floating Nebula Blobs */}
            {/* Teal Nebula */}
            <Box sx={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '50vw',
                height: '50vw',
                background: 'radial-gradient(circle, rgba(100, 255, 218, 0.08) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(60px)',
                borderRadius: '50%',
                animation: 'float 20s ease-in-out infinite alternate',
            }} />

            {/* Purple Nebula */}
            <Box sx={{
                position: 'absolute',
                bottom: '-10%',
                right: '-10%',
                width: '50vw',
                height: '50vw',
                background: 'radial-gradient(circle, rgba(189, 147, 249, 0.08) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(60px)',
                borderRadius: '50%',
                animation: 'float 25s ease-in-out infinite alternate-reverse',
            }} />

            {/* Blue Accent Nebula */}
            <Box sx={{
                position: 'absolute',
                top: '40%',
                left: '40%',
                width: '40vw',
                height: '40vw',
                background: 'radial-gradient(circle, rgba(66, 165, 245, 0.05) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(80px)',
                borderRadius: '50%',
                animation: 'float 30s ease-in-out infinite 5s alternate',
            }} />
        </Box>
    );
};

export default AnimatedBackground;
