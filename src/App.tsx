import React, { useState, useCallback } from 'react';
import { useVendingMachine } from './hooks/useVendingMachine';
import MoneyButton from './components/MoneyButton';
import DrinkCan from './components/DrinkCan';
import DrinkSelector from './components/DrinkSelector';
import './App.css';
import './assets/assets.css';

export type Drink = { label: string, color: string };

const drinkTypes: Drink[] = [
  { label: 'Coke', color: '#e63946' },
  { label: 'Soda', color: '#a8dadc' },
  { label: 'Juice', color: '#fca311' },
];

function App() {
  const {
    balance,
    pityProgress,
    messages,
    isDrawing,
    addMessage,
    insertMoney,
    returnChange,
    drawOne,
    drawTen,
    miniDraw,
    purchaseGuaranteed,

    constants
  } = useVendingMachine();

  const [wonDrinks, setWonDrinks] = useState<Drink[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleDraw = useCallback((drawFunction: () => number) => {
    if (!selectedDrink) {
      addMessage('먼저 음료를 선택해주세요!');
      return;
    }

    setWonDrinks([]);
    triggerShake();
    setTimeout(() => {
      const winCount = drawFunction();
      if (winCount > 0) {
        const newDrinks: Drink[] = [];
        for (let i = 0; i < winCount; i++) {
          newDrinks.push(selectedDrink);
        }
        setWonDrinks(newDrinks);
      }
    }, 500);
  }, [selectedDrink, addMessage]);

  const resetDisplay = () => {
    setWonDrinks([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>룰렛형 음료수 자판기</h1>
      </header>
      <main className="main-container">
        <div className="vending-machine-area">
          <div className={`vending-machine-placeholder ${isShaking ? 'shake' : ''}`}>
             <div className="drink-display">
                {wonDrinks.length > 0 ? (
                  <div className="won-drinks-display" onClick={resetDisplay}>
                    <div className="won-drinks-grid">
                      {wonDrinks.map((drink, index) => (
                        <DrinkCan key={index} color={drink.color} label={drink.label} />
                      ))}
                    </div>
                    <p className="click-to-continue">결과를 클릭하여 계속 진행하세요</p>
                  </div>
                ) : (
                  <DrinkSelector 
                    drinks={drinkTypes} 
                    selectedDrink={selectedDrink} 
                    onSelect={setSelectedDrink} 
                  />
                )}
             </div>
          </div>
        </div>

        <div className="control-panel">
          <div className="status-display">
            <p>현재 금액: <span>{balance}원</span></p>
            <p>꽝 누적 금액: <span>{pityProgress}원 / {constants.PITY_THRESHOLD}원</span></p>
          </div>

          <div className="draw-buttons">
            <button onClick={() => handleDraw(drawOne)} disabled={isDrawing || balance < constants.BIG_DRAW_COST}>1회 뽑기 ({constants.BIG_DRAW_COST}원)</button>
            <button onClick={() => handleDraw(drawTen)} disabled={isDrawing || balance < constants.TEN_DRAW_COST}>10회 뽑기 ({constants.TEN_DRAW_COST}원)</button>
            <button onClick={() => handleDraw(miniDraw)} disabled={isDrawing || balance < constants.MINI_DRAW_COST}>미니 뽑기 ({constants.MINI_DRAW_COST}원)</button>
            <button onClick={() => handleDraw(purchaseGuaranteed)} disabled={isDrawing || balance < constants.GUARANTEED_PURCHASE_COST}>확정 구매 ({constants.GUARANTEED_PURCHASE_COST}원)</button>

          </div>

          <div className="money-insert-section">
            <p>돈 넣기:</p>
            <div className="money-insert-buttons">
              <MoneyButton amount={10} onClick={insertMoney} />
              <MoneyButton amount={50} onClick={insertMoney} />
              <MoneyButton amount={100} onClick={insertMoney} />
              <MoneyButton amount={500} onClick={insertMoney} />
              <MoneyButton amount={1000} onClick={insertMoney} />
              <MoneyButton amount={5000} onClick={insertMoney} />
            </div>
          </div>

          <div className="return-change-section">
            <button onClick={returnChange} disabled={isDrawing || balance === 0}>잔액 반환</button>
          </div>

           <div className="message-box">
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
