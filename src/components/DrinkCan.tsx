import React from 'react';
import '../assets/assets.css';

interface DrinkCanProps {
  color: string;
  label: string;
}

const DrinkCan: React.FC<DrinkCanProps> = ({ color, label }) => {
  return (
    <div className="drink-can">
      <div className="can-label" style={{ backgroundColor: color }}>
        {label}
      </div>
    </div>
  );
};

export default DrinkCan;
