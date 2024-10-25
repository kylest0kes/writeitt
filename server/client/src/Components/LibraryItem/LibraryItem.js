import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LibraryItem.scss';

const LibraryItem = ({ img, name, slug }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/stories/story/${slug}`);
  };


  return (
    <div className="library-item" onClick={handleClick}>
      <div className="library-item__icon-wrapper">
        {img ? (
          <img
            src={img}
            alt={name}
            className="library-item__icon"
          />
        ) : (
          <div className="library-item__icon-placeholder" />
        )}
      </div>
      <span className="library-item__text">{name}</span>
    </div>
  );
};

export default LibraryItem;
