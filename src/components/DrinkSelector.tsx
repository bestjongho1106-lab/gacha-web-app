import React from 'react';
import { Drink } from '../App'; // Import type from App.tsx
import DrinkCan from './DrinkCan';
import './DrinkSelector.css';

interface DrinkSelectorProps {
  drinks: Drink[];
  selectedDrink: Drink | null;
  onSelect: (drink: Drink) => void;
}

const DrinkSelector: React.FC<DrinkSelectorProps> = ({ drinks, selectedDrink, onSelect }) => {
  return (
    <div className="drink-selector-container">
      <h3>음료를 선택하세요</h3>
      <div className="drink-options">
        {drinks.map((drink) => (
          <div 
            key={drink.label}
            className={`drink-option ${selectedDrink?.label === drink.label ? 'selected' : ''}`}
            onClick={() => onSelect(drink)}
          >
            <DrinkCan color={drink.color} label={drink.label} />
            <span>{drink.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrinkSelector;
