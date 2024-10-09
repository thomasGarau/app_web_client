import React, { useEffect, useRef } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useDispatch } from 'react-redux';
import { incrementerScroll, setProgression } from '../Slice/pdfViewerSlice';

import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';


const PDFViewer = ({ fileBlob }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const viewerRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const viewerContainer = viewerRef.current;
        if (viewerContainer) {
            const checkScrollElement = () => {
                const scrollElement = viewerContainer.querySelector('.rpv-core__inner-pages');
                
                if (scrollElement) {
                    const handleScroll = (event) => {
                        console.log('scroll');
                        dispatch(incrementerScroll());
                        
                        const scrollPosition = scrollElement.scrollTop;
                        const totalHeight = scrollElement.scrollHeight;
                        const prog = (scrollPosition / (totalHeight - scrollElement.clientHeight)) * 100;
                        dispatch(setProgression(prog));
                    };

                    scrollElement.addEventListener('scroll', handleScroll);

                    return () => {
                        scrollElement.removeEventListener('scroll', handleScroll);
                    };
                }

                setTimeout(checkScrollElement, 100);
            };

            checkScrollElement();
        }
    }, [dispatch]);

    return (
        <div ref={viewerRef} style={{ height: '750px', overflowY: 'scroll' }}>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer 
                    fileUrl={fileBlob} // Utiliser l'URL Blob
                    plugins={[defaultLayoutPluginInstance]}
                />
            </Worker>
        </div>
    );
};

export default PDFViewer;
