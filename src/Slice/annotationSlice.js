import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    annotations: [],
    selectedAnnotation: null,
    loading: false,
    error: null
};

const annotationSlice = createSlice({
    name: 'annotations',
    initialState,
    reducers: {
        setAnnotations: (state, action) => {
            state.annotations = action.payload;
        },
        setSelectedAnnotation: (state, action) => {
            state.selectedAnnotation = action.payload;
        },
        addAnnotation: (state, action) => {
            const annotation = action.payload;
            state.annotations[annotation.id_annotation] = annotation;
        },
        updateAnnotationRedux: (state, action) => {
            const annotation = action.payload;
            if (state.annotations[annotation.id_annotation]) {
                state.annotations[annotation.id_annotation] = annotation;
            }
            state.selectedAnnotation = annotation;
        },
        deleteAnnotationRedux: (state, action) => {
            const id = action.payload;
            delete state.annotations[id];
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const {
    setAnnotations,
    setSelectedAnnotation,
    addAnnotation,
    updateAnnotationRedux,
    deleteAnnotationRedux,
    setLoading,
    setError
} = annotationSlice.actions;

export default annotationSlice.reducer;