import React, { useEffect, useRef, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import debounce from 'lodash/debounce';

import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { addCoursProgression } from '../API/RessourceAPI';
import { setProgression } from '../Slice/progressionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { set } from 'lodash';

const PDFViewer = ({ fileBlob, resourceId, oldProg, onProgressUpdate, index }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const viewerRef = useRef(null);
    const progression = useSelector((state) => state.progression.progressions[index] || oldProg);


    const dispatch = useDispatch();

    useEffect(() => {
        let timeoutId;
        
        const setInitialScroll = () => {
            const viewerContainer = viewerRef.current;
            if (!viewerContainer) {
                timeoutId = setTimeout(setInitialScroll, 100);
                return;
            }
    
            const scrollElement = viewerContainer.querySelector('.rpv-core__inner-pages');
            if (!scrollElement || !scrollElement.scrollHeight || scrollElement.scrollHeight <= 0) {
                timeoutId = setTimeout(setInitialScroll, 100);
                return;
            }
    
            const visibleHeight = scrollElement.clientHeight;
            const totalScrollHeight = scrollElement.scrollHeight - visibleHeight;
            const initialScroll = (progression.progression / 100) * totalScrollHeight;
            scrollElement.scrollTop = initialScroll;
        };
    
        setInitialScroll();
    
        // Cleanup timeout on unmount
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);



    useEffect(() => {
        const viewerContainer = viewerRef.current;
        if (!viewerContainer) return;

        const handleScroll = debounce((scrollElement) => {
            const visibleHeight = scrollElement.clientHeight;
            const totalScrollHeight = scrollElement.scrollHeight - visibleHeight;
            const currentScroll = scrollElement.scrollTop;
            const percentage = Math.round((currentScroll / totalScrollHeight) * 100);
            const clampedPercentage = Math.max(0, Math.min(100, percentage));
            dispatch(setProgression({ resourceId, clampedPercentage, index }));
        }, 100);

        const checkScrollElement = () => {
            const scrollElement = viewerContainer.querySelector('.rpv-core__inner-pages');
            if (!scrollElement) {
                setTimeout(checkScrollElement, 100);
                return;
            }

            const scrollHandler = () => handleScroll(scrollElement);
            scrollElement.addEventListener('scroll', scrollHandler);
            scrollHandler();

            return () => {
                scrollElement.removeEventListener('scroll', scrollHandler);
                handleScroll.cancel();
            };
        };

        const cleanup = checkScrollElement();
        return () => cleanup && cleanup();
    }, [resourceId, oldProg, onProgressUpdate]);

    useEffect(() => {
        const updateProgression = async () => {
            if (progression.progression > oldProg) {
                try {
                    console.log('Updating progression:', progression.progression);
                    await addCoursProgression(resourceId, `${progression.progression}`);
                } catch (error) {
                    console.error('Error updating progression:', error);
                }
            }
        };

        updateProgression();
    }, [progression, resourceId, oldProg]);

    return (
        <div ref={viewerRef} style={{ height: '750px', overflowY: 'scroll' }}>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer
                    fileUrl={fileBlob}
                    plugins={[defaultLayoutPluginInstance]}
                />
            </Worker>
        </div>
    );
};

export default PDFViewer;
