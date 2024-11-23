import React, { useCallback, useState } from 'react';
import AddAnnotationModal from "./AddAnnotationModal";
import AnnotationDrawer from "./AnnotationDrawer";
import FabAnnotationDrawer from "./FabAnnotationDrawer";
import Annotation from './Annotation';
import { useSelector } from 'react-redux';

export default function AnnotationQuiz({ quizId, questionId }) {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openAddAnnotation, setOpenAddAnnotation] = useState(false);
    const selectedAnnotation = useSelector(state => state.annotation.selectedAnnotation);

    const handleDrawerOpen = useCallback(() => {
        setDrawerOpen(true);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setDrawerOpen(false);
    }, [drawerOpen]);

    const addAnnotation = () => {
        handleDrawerClose();
        setOpenAddAnnotation(true);
    };

    return (
        <>
            <AnnotationDrawer
                parentType="AnnotationQuiz"
                open={drawerOpen}
                onClose={handleDrawerClose}
                addAnnotation={addAnnotation}
                resourceId={quizId} />
            <AddAnnotationModal open={openAddAnnotation} handleClose={() => setOpenAddAnnotation(false)} resourceId={questionId} parentType="AnnotationQuiz" />
            <FabAnnotationDrawer handleDrawerOpen={handleDrawerOpen} />
            {selectedAnnotation && (<Annotation />)}
        </>
    )
}