import React from 'react';

const Loading = ({ size = 'medium', color = '#2d5a3d' }) => {
  const sizeClasses = {
    small: 'loading-small',
    medium: 'loading-medium',
    large: 'loading-large'
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]}`}>
      <div 
        className="spinner" 
        style={{ borderTopColor: color }}
      />
    </div>
  );
};

export default Loading;
