import { useEffect, useState } from 'react';
import './ui/Calc.css';
import CalcButton from './ui/CalcButton';
import CalcButton2 from './ui/CalcButton2';

export default function Calc() {
  const [expression, setExpession] = useState("25 - 14 =");
  const [display, setDisplay] = useState("0");
  const [displayFontSize, setDisplayFontSize] = useState(36);

  const [acc, setAcc] = useState(null);                 
  const [op, setOp] = useState(null);                 
  const [awaitingSecond, setAwaitingSecond] = useState(false);
  const [lastOp, setLastOp] = useState(null);        
  const [lastArg, setLastArg] = useState(null);       

  useEffect(() => {
    if (display.length > 8) {
      setDisplayFontSize(36 - 2.5 * (display.length - 8));
    } else {
      setDisplayFontSize(36);
    }
  }, [display]);

  const toNumber = (s) => {
    const v = parseFloat(s.replace(',', '.'));
    return Number.isFinite(v) ? v : 0;
  };

  const format = (num) => {
    if (!Number.isFinite(num)) return "Ошибка";
    const n = Number(num);
    const rounded = Number.parseFloat(n.toPrecision(12));
    let s = String(rounded);
    if (s.includes('e')) return s; 
    if (s.indexOf('.') >= 0) {
      s = s.replace(/\.?0+$/, ''); 
    }
    return s;
  };

  const compute = (a, b, operator) => {
    switch (operator) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? Infinity : a / b;
      default: return b;
    }
  };

  const onDotClick = (dotSymbol) => {
    if (awaitingSecond) {
      setDisplay("0" + dotSymbol);
      setAwaitingSecond(false);
      return;
    }
    if (!display.includes(dotSymbol)) {
      setDisplay(display + dotSymbol);
    }
  };

  const onBackspaceClick = () => {
    if (awaitingSecond) return; 
    let res = (display.length > 1
      ? display.substring(0, display.length - 1)
      : "0");
    setDisplay(res === '-' ? "0" : res);
  };

  const onDigitClick = (digit) => {
    let res = display;

    if (awaitingSecond) {
      res = "";
      setAwaitingSecond(false);
    } else if (res === "0") {
      res = "";
    }

    if (res.length > 14) return;
    res += digit;
    setDisplay(res);
  };

  const clearAll = () => {
    setDisplay("0");
    setExpession("");
    setAcc(null);
    setOp(null);
    setAwaitingSecond(false);
    setLastOp(null);
    setLastArg(null);
  };

  const onCE = () => {
    setDisplay("0");
    if (!op) setExpession(""); 
  };

  const setOperator = (symbol) => {
    const current = toNumber(display);

    if (acc === null) {
      setAcc(current);
      setExpession(`${format(current)} ${symbol}`);
      setAwaitingSecond(true);
    } else if (!awaitingSecond) {
      const res = compute(acc, current, op ?? symbol);
      setAcc(res);
      setDisplay(format(res));
      setExpession(`${format(res)} ${symbol}`);
      setAwaitingSecond(true);
    } else {
      setExpession(`${format(acc)} ${symbol}`);
    }

    setOp(symbol);
    setLastOp(null);
    setLastArg(null);
  };

  const onEquals = () => {
    if (op) {
      const a = acc ?? 0;
      const b = awaitingSecond ? (lastArg ?? a) : toNumber(display);
      const res = compute(a, b, op);

      setDisplay(format(res));
      setExpession(`${format(a)} ${op} ${format(b)} =`);

      setAcc(res);
      setAwaitingSecond(true);      
      setLastOp(op);
      setLastArg(b);
      setOp(null);                   
    } else if (lastOp != null && lastArg != null) {
      const a = toNumber(display);
      const b = lastArg;
      const res = compute(a, b, lastOp);

      setDisplay(format(res));
      setExpession(`${format(a)} ${lastOp} ${format(b)} =`);
      setAcc(res);
      setAwaitingSecond(true);
    }
  };

  const onPercent = () => {
    const current = toNumber(display);
    if (op && acc !== null) {
      const p = (acc * current) / 100;
      setDisplay(format(p));
      setAwaitingSecond(false);
    } else {
      setDisplay(format(current / 100));
    }
  };

  const onReciprocal = () => {
    const x = toNumber(display);
    if (x === 0) {
      setDisplay("Ошибка");
      return;
    }
    setDisplay(format(1 / x));
    if (!op) setExpession(`1/(${format(x)})`);
  };

  const onSquare = () => {
    const x = toNumber(display);
    const r = x * x;
    setDisplay(format(r));
    if (!op) setExpession(`sqr(${format(x)})`);
  };

  const onSqrt = () => {
    const x = toNumber(display);
    if (x < 0) {
      setDisplay("Ошибка");
      return;
    }
    const r = Math.sqrt(x);
    setDisplay(format(r));
    if (!op) setExpession(`√(${format(x)})`);
  };

  const buttonObjects = [
    [
      { face: "%",  type: "func",  action: onPercent },
      { face: "CE", type: "func",  action: onCE },
      { face: "C",  type: "func",  action: _ => clearAll() },
      { face: "⌫",  type: "func",  action: onBackspaceClick },
    ],
    [
      { face: "1/x", type: "func", action: onReciprocal },
      { face: "x²",  type: "func", action: onSquare },
      { face: "√x",  type: "func", action: onSqrt },
      { face: "÷",   type: "func", action: () => setOperator('÷') },
    ],
    [
      { face: "7",  type: "digit", action: onDigitClick },
      { face: "8",  type: "digit", action: onDigitClick },
      { face: "9",  type: "digit", action: onDigitClick },
      { face: "×",  type: "func",  action: () => setOperator('×') },
    ],
    [
      { face: "4",  type: "digit", action: onDigitClick },
      { face: "5",  type: "digit", action: onDigitClick },
      { face: "6",  type: "digit", action: onDigitClick },
      { face: "−",  type: "func",  action: () => setOperator('−') },
    ],
    [
      { face: "1",  type: "digit", action: onDigitClick },
      { face: "2",  type: "digit", action: onDigitClick },
      { face: "3",  type: "digit", action: onDigitClick },
      { face: "+",  type: "func",  action: () => setOperator('+') },
    ],
    [
      {
        face: "±",
        type: "digit",
        action: _ => {
          if (awaitingSecond) return;
          if (display === "0") return;
          setDisplay(display.startsWith('-') ? display.substring(1) : "-" + display);
        }
      },
      { face: "0",  type: "digit", action: onDigitClick },
      { face: ".",  type: "digit", action: onDotClick },
      { face: "=",  type: "func",  action: onEquals },
    ],
  ];

  return (
    <div className="calc">
      <div className='calc-expression'>{expression}</div>
      <div className='calc-display' style={{ fontSize: displayFontSize }}>{display}</div>
      {buttonObjects.map((row, index) => (
        <div key={index} className="calc-row">
          {row.map(obj => <CalcButton2 key={obj.face} buttonObject={obj} />)}
        </div>
      ))}
    </div>
  );
}
