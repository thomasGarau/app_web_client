import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setProgressionVideo, setTime, incrementerPause } from '../Slice/videoSlice';

const VideoPlayer = ({ videoUrl }) => {
    const videoRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const dispatch = useDispatch();

    const calculateProgression = (currentTime, duration) => {
        if (duration === 0) return 0; 
        return (currentTime / duration) * 100;
    };

    const handleTimeUpdate = () => {
        const time = videoRef.current.currentTime;
        setCurrentTime(time);
        console.log(`Temps actuel : ${time} secondes`);
    };

    const handleLoadedMetadata = () => {
        const videoDuration = videoRef.current.duration;
        setDuration(videoDuration);
        console.log(`Durée totale : ${videoDuration} secondes`);
    };

    const handlePause = () => {
        dispatch(incrementerPause());
        console.log('La vidéo a été mise sur pause.');
    };

    useEffect(() => {
        const progression = calculateProgression(currentTime, duration);

        dispatch(setTime(currentTime));
        dispatch(setProgressionVideo(progression));

    }, [currentTime, duration, dispatch]);

    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
            <video
                ref={videoRef}
                width="100%"
                height="auto"
                controls
                style={{ border: '1px solid #ccc' }}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata} 
                onPause={handlePause}
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
