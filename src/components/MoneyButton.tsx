import React from 'react';
import '../assets/assets.css';

interface MoneyButtonProps {
  amount: 10 | 50 | 100 | 500 | 1000 | 5000 | 10000;
  onClick: (amount: number) => void;
}

const MoneyButton: React.FC<MoneyButtonProps> = ({ amount, onClick }) => {
  const isCoin = amount < 1000;
  const type = isCoin ? 'coin' : 'bill';
  const className = `currency-item ${type} ${type}-${amount}`;

  return (
    <div className={className} onClick={() => onClick(amount)}>
      {amount}원
    </div>
  );
};

export default MoneyButton;
