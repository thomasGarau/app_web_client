import React from 'react';

import VideoPlayer from './VideoPlayer'; // Assure-toi que ce chemin est correct
import PDFViewer from './PDFViewer';
import YouTubePlayer from './YoutubePlayer';


const ResourceDisplay = ({ ressource }) => {
    const { type, url } = ressource;

    return (
        <div>
            {type === 'pdf' ? (
                <PDFViewer fileUrl={url} width="100%" height="600" />
            ) : type === 'video' ? (
                // Vérifier si c'est une vidéo YouTube ou un fichier MP4
                url.includes('youtube.com') || url.includes('youtu.be') ? (
                    <YouTubePlayer videoId={new URL(url).searchParams.get('v') || url.split('/').pop()} />
                ) : (
                    <VideoPlayer videoUrl={url} />
                )
            ) : type === 'img' ? (
                <img src={url} alt="Resource" style={{ maxWidth: '100%', maxHeight: 600 }} />
            ) : (
                // Pour les fichiers qui ne peuvent pas être affichés, on les rend téléchargeables
                <a href={url} download>
                    Télécharger {url.split('/').pop()} {/* Affiche le nom du fichier */}
                </a>
            )}
        </div>
    );
};

export default ResourceDisplay;
