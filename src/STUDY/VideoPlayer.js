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
        if (progressionValue > oldProg) {
            const percentage = Math.round((currentTime / duration) * 100);
            const clampedPercentage = Math.max(0, Math.min(100, percentage))
            return clampedPercentage;
        }
        return progression.progression;

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
    }, [progression.progression]);

    useEffect(() => {
        if (!isNaN(progressionValue)) {
            videoRef.current.currentTime = progressionValue * duration / 100;
        }
    }, [progressionValue, duration]);


    useEffect(() => {

        const clampedPercentage = calculateProgression();
        dispatch(setTime(currentTime));
        dispatch(setProgression({ resourceId, clampedPercentage, index }));
        const updateProgression = async () => {
            if (progressionValue > oldProg) {
                try {
                    console.log('Updating progression:', progressionValue);
                    await addCoursProgression(resourceId, `${progressionValue}`);
                } catch (error) {
                    console.error('Error updating progression:', error);
                }
            }
        };

        updateProgression();

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
