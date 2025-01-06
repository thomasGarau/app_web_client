import React, { useEffect, useState } from 'react';

import VideoPlayer from './VideoPlayer'; // Assure-toi que ce chemin est correct
import PDFViewer from './PDFViewer';
import YouTubePlayer from './YoutubePlayer';
import { getRessourceById } from '../API/RessourceAPI';
import { useSelector } from 'react-redux';


const ResourceDisplay = ({ ressource = {}, oldProg, onProgressUpdate, index }) => {

    const [fileType, setFileType] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const progression = useSelector((state) => state.progression.progressions[index] || oldProg);



    const fetchRessource = async (ressource) => {
        try {
            const data = await getRessourceById(ressource.id);
            console.log(data);
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
                    <PDFViewer
                        oldProg={oldProg}
                        index={index}
                        resourceId={ressource.id}
                        fileBlob={fileUrl}
                        onProgressUpdate={onProgressUpdate}
                        progression={progression}
                        width="100%"
                        height="600" />
                ) : fileType === 'video' ? (
                    fileUrl.includes('youtube.com') || fileUrl.includes('youtu.be') ? (
                        <YouTubePlayer videoId={new URL(fileUrl).searchParams.get('v') || fileUrl.split('/').pop()} />
                    ) : (
                        <VideoPlayer
                            videoUrl={fileUrl}
                            index={index}
                            resourceId={ressource.id}
                            progression={progression} 
                            oldProg={oldProg}/>
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
