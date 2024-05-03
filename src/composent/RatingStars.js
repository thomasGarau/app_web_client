import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './RatingStars.css';

const RatingStars = () => {
  const [rating, setRating] = useState(0);  // État pour garder la trace de la note
  const [hover, setHover] = useState(0);    // État pour garder la trace de l'élément survolé

  return (
    <div className='rating-stars'>
      <h2>Notez ce quizz</h2>
      <div className='rating-starts-container'> {/* Ajouter une classe pour le style */}
      {[...Array(10)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? "star gold" : "star"}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <FaStar size={24} />
          </button>
        );
      })}
      </div>
     {/* <p>La note est : {rating}</p>
       Ici, vous pouvez ajouter le code pour envoyer la note à un serveur ou autre traitement */}
    </div>
  );
};

export default RatingStars;
