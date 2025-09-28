import { useState, useCallback } from 'react';

// --- Constants ---
const BIG_DRAW_COST = 100;
const BIG_DRAW_CHANCE = 0.077;
const MINI_DRAW_COST = 10;
const MINI_DRAW_CHANCE = 0.008;
const TEN_DRAW_COST = 1000;
const PITY_THRESHOLD = 2000;
const GUARANTEED_PURCHASE_COST = 2000;

export const useVendingMachine = () => {
  const [balance, setBalance] = useState(0);
  const [pityProgress, setPityProgress] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const addMessage = useCallback((msg: string) => {
    setMessages(prev => [msg, ...prev.slice(0, 4)]);
  }, []);

  const insertMoney = (amount: number) => {
    setBalance(prev => prev + amount);
    addMessage(`${amount}원이 투입되었습니다.`);
  };

  const returnChange = () => {
    if (isDrawing) return;
    if (balance > 0) {
      addMessage(`${balance}원이 반환되었습니다.`);
      setBalance(0);
    } else {
      addMessage('반환할 금액이 없습니다.');
    }
  };

  const performDraw = (cost: number, chance: number): boolean => {
    const wasLuckyWin = Math.random() < chance;
    let wasPityWin = false;

    setBalance(prev => prev - cost);

    setPityProgress(prevPity => {
        if (wasLuckyWin) {
            addMessage(`🎉 축하합니다! 음료수에 당첨되었습니다! 🎉`);
            if (prevPity >= PITY_THRESHOLD) {
                return prevPity - PITY_THRESHOLD;
            } else {
                return 0;
            }
        } else { // Loss
            addMessage("아쉽지만... 꽝입니다. 😢");
            const newPity = prevPity + cost;
            if (newPity >= PITY_THRESHOLD) {
                addMessage('천장 도달! 음료수가 나옵니다!');
                wasPityWin = true;
                return newPity - PITY_THRESHOLD;
            } else {
                return newPity;
            }
        }
    });

    return wasLuckyWin || wasPityWin;
  };

  const drawOne = (): number => {
    if (isDrawing) return 0;
    if (balance < BIG_DRAW_COST) {
      addMessage(`금액이 부족합니다. ${BIG_DRAW_COST}원이 필요합니다.`);
      return 0;
    }
    setIsDrawing(true);
    addMessage(`${BIG_DRAW_COST}원을 사용하여 뽑기를 진행합니다...`);
    const wins = performDraw(BIG_DRAW_COST, BIG_DRAW_CHANCE) ? 1 : 0;
    setTimeout(() => setIsDrawing(false), 100);
    return wins;
  };

  const drawTen = (): number => {
    if (isDrawing) return 0;
    if (balance < TEN_DRAW_COST) {
      addMessage(`금액이 부족합니다. ${TEN_DRAW_COST}원이 필요합니다.`);
      return 0;
    }
    setIsDrawing(true);
    addMessage(`--- 10연차 뽑기를 시작합니다! ---`);
    
    let wins = 0;
    let currentPity = pityProgress;
    
    for (let i = 0; i < 10; i++) {
        if (Math.random() < BIG_DRAW_CHANCE) {
            addMessage(`🎉 (10연차) 축하합니다! 🎉`);
            wins++;
            if (currentPity >= PITY_THRESHOLD) {
                currentPity -= PITY_THRESHOLD;
            } else {
                currentPity = 0;
            }
        } else {
            addMessage(`(10연차) 아쉽지만... 꽝. 😢`);
            currentPity += BIG_DRAW_COST;
            if (currentPity >= PITY_THRESHOLD) {
                addMessage('(10연차) 천장 도달! ✨');
                wins++;
                currentPity -= PITY_THRESHOLD;
            }
        }
    }

    setBalance(prev => prev - TEN_DRAW_COST);
    setPityProgress(currentPity);

    addMessage(`--- 10연차 결과: 총 ${wins}개 당첨! ---`);
    setTimeout(() => setIsDrawing(false), 100);
    return wins;
  };

  const miniDraw = (): number => {
    if (isDrawing) return 0;
    if (balance < MINI_DRAW_COST) {
      addMessage(`금액이 부족합니다. ${MINI_DRAW_COST}원이 필요합니다.`);
      return 0;
    }
    setIsDrawing(true);
    addMessage(`${MINI_DRAW_COST}원을 사용하여 미니 뽑기를 진행합니다...`);
    const wins = performDraw(MINI_DRAW_COST, MINI_DRAW_CHANCE) ? 1 : 0;
    setTimeout(() => setIsDrawing(false), 100);
    return wins;
  };

  const purchaseGuaranteed = (): number => {
    if (isDrawing) return 0;
    if (balance < GUARANTEED_PURCHASE_COST) {
      addMessage(`금액이 부족합니다. ${GUARANTEED_PURCHASE_COST}원이 필요합니다.`);
      return 0;
    }
    setIsDrawing(true);
    setBalance(prev => prev - GUARANTEED_PURCHASE_COST);
    addMessage(`✨ ${GUARANTEED_PURCHASE_COST}원을 사용하여 확정 음료를 구매합니다. ✨`);
    setTimeout(() => setIsDrawing(false), 100);
    return 1;
  };



  return {
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

    constants: {
        BIG_DRAW_COST,
        TEN_DRAW_COST,
        MINI_DRAW_COST,
        PITY_THRESHOLD,
        GUARANTEED_PURCHASE_COST
    }
  };
};