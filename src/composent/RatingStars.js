import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './RatingStars.css';
import { EnvoyerNoteQuizz, getLastNoteQuizz } from './QuestionAPI';

const RatingStars = ({ quizId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    const fetchLastRating = async () => {
      try {
        const lastRating = await getLastNoteQuizz(quizId);
        if (lastRating !== undefined && lastRating !== null) {
          setRating(lastRating.note);
        }
      } catch (error) {
        console.error('Failed to fetch the last rating:', error);
      }
    };

    fetchLastRating();
  }, [quizId]);

  const handleRating = (newRating) => {
    setRating(newRating);
    EnvoyerNoteQuizz(quizId, newRating);
  };

  return (
    <div className='rating-stars'>
      <h2>Notez ce quizz</h2>
      <div className='rating-stars-container'>
        {[...Array(10)].map((star, index) => {
          index += 1;
          return (
            <button
              type="button"
              key={index}
              className={index <= (hover || rating) ? "star gold" : "star"}
              onClick={() => handleRating(index)}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(rating)}
            >
              <FaStar size={32} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RatingStars;
