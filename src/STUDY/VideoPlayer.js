import React from 'react';

const VideoPlayer = ({ videoUrl }) => {
    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
            <video
                width="100%"
                height="auto"
                controls
                style={{ border: '1px solid #ccc' }}
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
