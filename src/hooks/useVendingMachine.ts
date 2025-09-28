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

  const addMessage = useCallback((msg: string) => {
    setMessages(prev => [msg, ...prev.slice(0, 4)]);
  }, []);

  const insertMoney = (amount: number) => {
    setBalance(prev => prev + amount);
    addMessage(`${amount}원이 투입되었습니다.`);
  };

  const returnChange = () => {
    if (balance > 0) {
      addMessage(`${balance}원이 반환되었습니다.`);
      setBalance(0);
    } else {
      addMessage('반환할 금액이 없습니다.');
    }
  };

  const performDraw = (cost: number, chance: number): boolean => {
    if (balance < cost) {
      addMessage(`금액이 부족합니다. ${cost}원이 필요합니다.`);
      return false;
    }

    setBalance(prev => prev - cost);

    if (Math.random() < chance) { // Lucky Win
      addMessage(`🎉 축하합니다! 음료수에 당첨되었습니다! 🎉`);
      // If pity threshold is reached, a lucky win still consumes one pity charge.
      // Otherwise, a lucky win resets the progress.
      if (pityProgress >= PITY_THRESHOLD) {
        setPityProgress(prev => prev - PITY_THRESHOLD);
      } else {
        setPityProgress(0);
      }
      return true;
    } else { // Loss
      addMessage("아쉽지만... 꽝입니다. 😢");
      const newPityProgress = pityProgress + cost;

      // Check if the loss triggers a pity win
      if (newPityProgress >= PITY_THRESHOLD) {
        addMessage('천장 도달! 음료수가 나옵니다!');
        setPityProgress(newPityProgress - PITY_THRESHOLD);
        return true; // A pity win is still a win
      } else {
        setPityProgress(newPityProgress);
        return false;
      }
    }
  };

  const drawOne = (): number => {
    addMessage(`${BIG_DRAW_COST}원을 사용하여 뽑기를 진행합니다...`);
    return performDraw(BIG_DRAW_COST, BIG_DRAW_CHANCE) ? 1 : 0;
  };

  const drawTen = (): number => {
    if (balance < TEN_DRAW_COST) {
      addMessage(`금액이 부족합니다. ${TEN_DRAW_COST}원이 필요합니다.`);
      return 0;
    }
    addMessage(`--- 10연차 뽑기를 시작합니다! ---`);
    let totalWins = 0;
    for (let i = 0; i < 10; i++) {
        if(performDraw(BIG_DRAW_COST, BIG_DRAW_CHANCE)) {
            totalWins++;
        }
    }
    addMessage(`--- 10연차 결과: 총 ${totalWins}개 당첨! ---`);
    return totalWins;
  };

  const miniDraw = (): number => {
    addMessage(`${MINI_DRAW_COST}원을 사용하여 미니 뽑기를 진행합니다...`);
    return performDraw(MINI_DRAW_COST, MINI_DRAW_CHANCE) ? 1 : 0;
  };

  const purchaseGuaranteed = (): number => {
    if (balance < GUARANTEED_PURCHASE_COST) {
      addMessage(`금액이 부족합니다. ${GUARANTEED_PURCHASE_COST}원이 필요합니다.`);
      return 0;
    }
    setBalance(prev => prev - GUARANTEED_PURCHASE_COST);
    addMessage(`✨ ${GUARANTEED_PURCHASE_COST}원을 사용하여 확정 음료를 구매합니다. ✨`);
    return 1;
  };

  const pityDraw = (): number => {
    if (pityProgress < PITY_THRESHOLD) {
        addMessage('천장 조건 미달입니다.');
        return 0;
    }
    addMessage('천장 도달! 무료 확정 뽑기를 진행합니다!');
    setPityProgress(prev => prev - PITY_THRESHOLD);
    return 1;
  }

  return {
    balance,
    pityProgress,
    messages,
    addMessage, // <-- Export this function
    insertMoney,
    returnChange,
    drawOne,
    drawTen,
    miniDraw,
    purchaseGuaranteed,
    pityDraw,
    constants: {
        BIG_DRAW_COST,
        TEN_DRAW_COST,
        MINI_DRAW_COST,
        PITY_THRESHOLD,
        GUARANTEED_PURCHASE_COST
    }
  };
};
