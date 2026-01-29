
import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [shouldReset, setShouldReset] = useState(false);

  const handleNumber = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setPrevValue(parseFloat(display));
    setOperator(op);
    setShouldReset(true);
  };

  const calculate = () => {
    if (!operator || prevValue === null) return;
    const current = parseFloat(display);
    let result = 0;
    switch (operator) {
      case '+': result = prevValue + current; break;
      case '-': result = prevValue - current; break;
      case '×': result = prevValue * current; break;
      case '÷': result = prevValue / current; break;
    }
    setDisplay(result.toString());
    setOperator(null);
    setPrevValue(null);
    setShouldReset(true);
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
  };

  return (
    <div className="h-full flex flex-col p-4 bg-zinc-900 text-white font-light">
      <div className="text-right text-4xl mb-6 overflow-hidden h-12 flex items-center justify-end font-normal">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2 flex-1">
        <CalcBtn label="C" onClick={clear} variant="secondary" />
        <CalcBtn label="+/-" onClick={() => {}} variant="secondary" />
        <CalcBtn label="%" onClick={() => {}} variant="secondary" />
        <CalcBtn label="÷" onClick={() => handleOperator('÷')} variant="accent" />
        
        <CalcBtn label="7" onClick={() => handleNumber('7')} />
        <CalcBtn label="8" onClick={() => handleNumber('8')} />
        <CalcBtn label="9" onClick={() => handleNumber('9')} />
        <CalcBtn label="×" onClick={() => handleOperator('×')} variant="accent" />
        
        <CalcBtn label="4" onClick={() => handleNumber('4')} />
        <CalcBtn label="5" onClick={() => handleNumber('5')} />
        <CalcBtn label="6" onClick={() => handleNumber('6')} />
        <CalcBtn label="-" onClick={() => handleOperator('-')} variant="accent" />
        
        <CalcBtn label="1" onClick={() => handleNumber('1')} />
        <CalcBtn label="2" onClick={() => handleNumber('2')} />
        <CalcBtn label="3" onClick={() => handleNumber('3')} />
        <CalcBtn label="+" onClick={() => handleOperator('+')} variant="accent" />
        
        <CalcBtn label="0" onClick={() => handleNumber('0')} className="col-span-2" />
        <CalcBtn label="." onClick={() => handleNumber('.')} />
        <CalcBtn label="=" onClick={calculate} variant="accent" />
      </div>
    </div>
  );
};

interface BtnProps {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'accent' | 'secondary';
  className?: string;
}

const CalcBtn: React.FC<BtnProps> = ({ label, onClick, variant = 'default', className = '' }) => {
  const base = "rounded-lg text-lg transition-colors flex items-center justify-center p-4 active:scale-95";
  const colors = {
    default: "bg-white/5 hover:bg-white/10",
    accent: "bg-blue-600 hover:bg-blue-500",
    secondary: "bg-white/10 hover:bg-white/20"
  };
  
  return (
    <button className={`${base} ${colors[variant]} ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Calculator;
