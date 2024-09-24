import React from 'react';

const YouTubePlayer = ({ videoId }) => {
    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
            <iframe
                width="100%"
                height="auto"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allowFullScreen
            />
        </div>
    );
};

export default YouTubePlayer;
