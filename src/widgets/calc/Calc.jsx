import { useEffect, useState } from 'react';
import './ui/Calc.css';
import CalcButton from './ui/CalcButton';
import CalcButton2 from './ui/CalcButton2';

export default function Calc() {
    const [expression, setExpession] = useState("25 - 14 =");
    const [display, setDisplay] = useState("0");
    const [displayFontSize, setDisplayFontSize] = useState(36);

    useEffect(() => {
        if(display.length > 8) {
            setDisplayFontSize(36 - 2.5 * (display.length - 8));
        }
        else {
            setDisplayFontSize(36);
        }
    }, [display]);

    // const onButtonClick = (face) => {
    //     if(face.charAt(0) == '_' && "0123456789".indexOf(face.substring(1)) > -1) {
    //         onDigitClick(face.substring(1));
    //     }
    //     else switch(face) {
    //         case "C": onClearClick(); break;
    //         case "⌫": onBackspaceClick(); break;
    //         case "_±": onPmClick(); break;
    //         case "_.": onDotClick(face.substring(1)); break;
    //     }
    // };
    const onDotClick = (dotSymbol) => {
        if(!display.includes(dotSymbol)) {
            setDisplay(display + dotSymbol);
        }
    }
    const onBackspaceClick = () => {
        let res = (display.length > 1
            ? display.substring(0, display.length - 1)
            : "0");
        setDisplay(res === '-' ? "0" : res);
    };
    const onDigitClick = (digit) => {
        let res = display;
        if(res === "0") {
            res = "";
        }
        if(res.length > 14) return;        
        res += digit;
        setDisplay(res);
    }

    
    const buttonObjects = [
        [ 
            {face: "%",  type: "func", action: () => {}},
            {face: "CE", type: "func", action: () => {}},
            {face: "C",  type: "func", action: _ => {setDisplay("0"); setExpession("");}},
            {face: "⌫", type: "func", action: onBackspaceClick},
        ],
        [ 
            {face: "1/x", type: "func", action: () => {}},
            {face: "x²",  type: "func", action: () => {}},
            {face: "√x",  type: "func", action: () => {}},
            {face: "÷",   type: "func", action: () => {}},
        ],
        [ 
            {face: "7",  type: "digit", action: onDigitClick},
            {face: "8",  type: "digit", action: onDigitClick},
            {face: "9",  type: "digit", action: onDigitClick},
            {face: "×",  type: "func", action: () => {}},
        ],
        [ 
            {face: "4",  type: "digit", action: onDigitClick},
            {face: "5", type:  "digit", action: onDigitClick},
            {face: "6",  type: "digit", action: onDigitClick},
            {face: "−", type: "func", action: () => {}},
        ],
        [ 
            {face: "1",  type: "digit", action: onDigitClick},
            {face: "2",  type: "digit", action: onDigitClick},
            {face: "3",  type: "digit", action: onDigitClick},
            {face: "+", type: "func", action: () => {}},
        ],
        [ 
            {face: "±",  type: "digit", action: _ => {if(display === "0") return; setDisplay(display.startsWith('-') ? display.substring(1) : "-" + display);}},
            {face: "0",  type: "digit", action: onDigitClick},
            {face: ".",  type: "digit", action: onDotClick},
            {face: "=", type: "func", action: () => {}},
        ],        
    ];

    return <div className="calc">
        <div className='calc-expression'>{expression}</div>
        <div className='calc-display' style={{fontSize: displayFontSize}}>{display}</div>
        {buttonObjects.map((row, index) => <div key={index} className="calc-row">
            {row.map(obj => <CalcButton2 key={obj.face} buttonObject={obj} />)}
        </div>)}
    </div>;

    // return <div className="calc">
    //     <div className='calc-expression'>{expression}</div>
    //     <div className='calc-display' style={{fontSize: displayFontSize}}>{display}</div>
    //     {buttons.map((row, index) => <div key={index} className="calc-row">
    //         {row.map(face => <CalcButton face={face} key={face} onClick={onButtonClick} />)}
    //     </div>)}
    // </div>;
}