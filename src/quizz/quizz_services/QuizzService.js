export const addQuestion = (questions, setQuestions, quizId = null) => {
    setQuestions(prevQuestions => [
      ...prevQuestions,
      {
        id_question: questions.length,
        label: '',
        type: 'multiple',
        nombre_bonne_reponse: 0,
        ...(quizId && { id_quizz: parseInt(quizId) }), 
        reponses: [
          { contenu: "", est_bonne_reponse: 0 },
          { contenu: "", est_bonne_reponse: 0 },
          { contenu: "", est_bonne_reponse: 0 }
        ]
      }
    ]);
  };


export const addReponse = (selected, setSelected) => {
    const newReponses = [
      ...selected.reponses,
      { contenu: "", est_bonne_reponse: 0 }
    ];
    setSelected(prevSelected => ({
      ...prevSelected,
      reponses: newReponses
    }));
  };

export const changeQuestion = (selected, setSelected, setQuestions, showErrorPopover, question,) => {
    if (selected.nombre_bonne_reponse === 0) {
        showErrorPopover('Veuillez choisir au moins une bonne réponse.', 'radio1')
        return;
    }
    setQuestions(prevQuestions => {
        return prevQuestions.map(question => {
            if (question.id_question === selected.id_question) {
                return selected;
            }
            return question;
        });
    });

    setSelected(question);
};
  

export const removeReponse = (indexToRemove, selected, setSelected, delAnswer = null, setDelAnswer = null) => {
    const newReponses = [
      ...selected.reponses.slice(0, indexToRemove),
      ...selected.reponses.slice(indexToRemove + 1)
    ];
  
    if (delAnswer && setDelAnswer) {
      setDelAnswer(prevDelAnswer => [...prevDelAnswer, selected.reponses[indexToRemove]]);
    }
  
    setSelected(prevSelected => ({
      ...prevSelected,
      reponses: newReponses
    }));
  };


export const validateQuizz = async ({
    title,
    chapitre,
    questions,
    estNegatif,
    quizId = null,
    createQuizz = null,
    updateQuizz = null,
    navigate,
    showErrorPopover
  }) => {
    if (!/[a-zA-Z0-9]/.test(title)) {
      showErrorPopover('Veuillez saisir un titre valide pour le quizz.', 'title-input');
      return;
    }
  
    if (chapitre === '') {
      showErrorPopover('Veuillez choisir un chapitre.', 'select-chapitre' || 'label-chapitre');
      return;
    }
  
    try {
      if (quizId && updateQuizz) {

        await updateQuizz(parseInt(quizId), title, estNegatif ? "negatif" : "normal", chapitre.id_chapitre);
      } else if (createQuizz) {
        const questionsWithoutId = questions.map(({ id_question, ...rest }) => rest);
        await createQuizz(title, estNegatif ? "negatif" : "normal", chapitre.id_chapitre, questionsWithoutId);
      }
  
      navigate("/gestion_quizz");
    } catch (error) {
      console.error('Erreur lors de la validation du Quizz :', error);
      showErrorPopover(('Erreur lors de la validation du Quizz :', error), 'title-input');
    }
  };

  export const validateReponse = (prevSelected, indexReponse) => {
    const updatedAnswers = prevSelected.reponses.map((reponse, index) => {
        if (index === indexReponse) {
            return { ...reponse, est_bonne_reponse: reponse.est_bonne_reponse === 0 ? 1 : 0 };
        }
        return reponse;
    });
    const updatedNombreBonneReponse = updatedAnswers.reduce((total, answer) => total + answer.est_bonne_reponse, 0);
    return {
        ...prevSelected,
        reponses: updatedAnswers,
        nombre_bonne_reponse: updatedNombreBonneReponse
    };
};

export const typeChange = (setSelected, typeQuestion) => {
    setSelected((prevSelected) => {
        if (prevSelected) {
            return {
                ...prevSelected,
                type: typeQuestion,
                reponses: [...prevSelected.reponses]
            };
        }
        return prevSelected;
    });
};
  