import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext(null);

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
    const [allSelectedAnswers, setSelectedAnswers] = useState([]);


    const handleSelectAnswer = (answerId, questionType) => {
        setSelectedAnswers(prev => {
            if (questionType === 'multi') {
                return prev.includes(answerId) ? prev.filter(id_question => id_question !== answerId) : [...prev, answerId];
            } else {
                return prev.includes(answerId) ? [] : [...prev, answerId];
            }
        });
        
    };
    const resetSelectedAnswers = () => {
        setSelectedAnswers([]);
    };

    return (
        <QuizContext.Provider value={{ allSelectedAnswers, handleSelectAnswer, resetSelectedAnswers }}>
            {children}
        </QuizContext.Provider>
    );
};


