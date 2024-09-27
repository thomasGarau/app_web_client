import React, { useEffect, useState } from 'react';

import VideoPlayer from './VideoPlayer'; // Assure-toi que ce chemin est correct
import PDFViewer from './PDFViewer';
import YouTubePlayer from './YoutubePlayer';
import { getRessourceById } from '../API/RessourceAPI';


const ResourceDisplay = ({ ressource = {} }) => {

    const [fileType, setFileType] = useState('');
    const [fileUrl, setFileUrl] = useState('');

    const fetchRessource = async (ressource) => {
        try {
            // Récupère le fichier en tant que Blob via l'API
            const data = await getRessourceById(ressource.id);
    
            // Si `data` est un Blob, on peut créer une URL
            if (data instanceof Blob || data instanceof File) {
                const fileUrl = URL.createObjectURL(data);
                setFileUrl(fileUrl);
            } else {
                throw new Error("La ressource récupérée n'est pas un Blob ou un File");
            }
    
            setFileType(ressource.type);
        } catch (error) {
            console.error("Erreur lors de la récupération des ressources :", error);
        }
    };
    

    useEffect(() => {
        if (ressource && ressource.id) {
            fetchRessource(ressource);
        } else {
            console.log("Ressource ID is undefined or ressource object is null");
        }
    }, [ressource]);


    return (
        <div>
            {fileType ? (
                fileType === 'pdf' ? (
                    <PDFViewer fileBlob={fileUrl} width="100%" height="600" />
                ) : fileType === 'video' ? (
                    fileUrl.includes('youtube.com') || fileUrl.includes('youtu.be') ? (
                        <YouTubePlayer videoId={new URL(fileUrl).searchParams.get('v') || fileUrl.split('/').pop()} />
                    ) : (
                        <VideoPlayer videoUrl={fileUrl} />
                    )
                ) : fileType === 'img' ? (
                    <img src={fileUrl} alt="Resource" style={{ maxWidth: '100%', maxHeight: 600 }} />
                ) : (
                    <a href={fileUrl} download>
                        Télécharger {fileUrl.split('/').pop()}
                    </a>
                )
            ) : (
                <p>Chargement de la ressource...</p>
            )}
        </div>
    );

};

export default ResourceDisplay;
