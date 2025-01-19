import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setProgressionVideo, setTime, incrementerPause } from '../Slice/videoSlice';
import { setProgression } from '../Slice/progressionSlice';
import { addCoursProgression } from '../API/RessourceAPI';

const VideoPlayer = ({ videoUrl, resourceId, index, progression, oldProg }) => {
    const videoRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [progressionValue, setProgressionValue] = useState(0);
    const dispatch = useDispatch();

    const calculateProgression = () => {
        const percentage = Math.round((currentTime / duration) * 100);
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        
        // Ne mettre à jour que si la nouvelle progression est supérieure à l'ancienne
        return Math.max(clampedPercentage, parseInt(oldProg, 10));
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
        
        setProgressionValue(parseInt(progression.progression, 10));
    }, [progression]);

    useEffect(() => {
        if (!isNaN(progressionValue)) {
            const newTime = progressionValue * duration / 100;
            // On ne met à jour que si la différence est supérieure à 1 seconde
            if (Math.abs(videoRef.current.currentTime - newTime) > 1) {
                videoRef.current.currentTime = newTime;
            }
        }
    }, [progressionValue, duration]);


    useEffect(() => {

        const clampedPercentage = calculateProgression();
        if (clampedPercentage > progressionValue) {
            dispatch(setTime(currentTime));
            dispatch(setProgression({ resourceId, clampedPercentage, index }));
            
            const updateProgression = async () => {
                try {
                    await addCoursProgression(resourceId, `${clampedPercentage}`);
                } catch (error) {
                    console.error('Error updating progression:', error);
                }
            };
            updateProgression();
        }

    }, [currentTime, duration, dispatch, progressionValue]);

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
