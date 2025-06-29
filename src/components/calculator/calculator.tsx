'use client';

import { useCalculator } from '@/hooks/use-calculator';
import CalculatorButton from './button';
import Display from './display';
import { Atom, Delete, Divide, Equal, Minus, Percent, Plus, SquareRadical, X } from 'lucide-react';

const Calculator = () => {
  const {
    displayValue,
    history,
    mode,
    isScientific,
    input,
    clear,
    backspace,
    calculate,
    toggleSign,
    toggleRadDeg,
    toggleScientificMode,
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,
  } = useCalculator();

  const sciFunctions = [
    { label: '(', func: '(' }, { label: ')', func: ')' }, { label: 'x!', func: '!' }, { label: 'x²', func: ' ^ 2' }, { label: 'xʸ', func: ' ^ ' },
    { label: <SquareRadical size={24} />, func: 'sqrt(' }, { label: 'ln', func: 'ln(' }, { label: 'log', func: 'log(' }, { label: 'sin', func: 'sin(' }, { label: 'cos', func: 'cos(' },
    { label: 'tan', func: 'tan(' }, { label: 'e', func: 'e' }, { label: 'π', func: 'pi' },
  ];
  const memFunctions = [
    { label: 'M+', action: memoryAdd }, { label: 'M-', action: memorySubtract },
    { label: 'MR', action: memoryRecall }, { label: 'MC', action: memoryClear },
  ];

  return (
    <div className={`w-full max-w-sm sm:max-w-md ${isScientific ? 'md:max-w-4xl' : 'md:max-w-md'} mx-auto p-4 sm:p-5 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl shadow-2xl shadow-primary/10 transition-all duration-300`}>
      <Display value={displayValue} history={history} mode={mode} isScientific={isScientific} />
      
      <div className="flex gap-4 mt-4">
        {isScientific && (
          <div className="flex-grow-[2] basis-0 hidden md:flex flex-col gap-2">
            <div className="grid grid-cols-5 gap-2">
              {sciFunctions.slice(0, 5).map(({label, func}) => (
                <CalculatorButton key={func} variant="function" size="default" className="w-auto h-12 text-lg" onClick={() => input(func)}>{label}</CalculatorButton>
              ))}
            </div>
             <div className="grid grid-cols-5 gap-2">
              {sciFunctions.slice(5, 10).map(({label, func}) => (
                <CalculatorButton key={func} variant="function" size="default" className="w-auto h-12 text-lg" onClick={() => input(func)}>{label}</CalculatorButton>
              ))}
            </div>
             <div className="grid grid-cols-5 gap-2">
               {sciFunctions.slice(10).map(({label, func}) => (
                <CalculatorButton key={func} variant="function" size="default" className="w-auto h-12 text-lg" onClick={() => input(func)}>{label}</CalculatorButton>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {memFunctions.map(({label, action}) => (
                <CalculatorButton key={label} variant="toggle" size="default" className="w-auto h-12 text-lg" onClick={action}>{label}</CalculatorButton>
              ))}
              <CalculatorButton variant="toggle" size="default" className="w-auto h-12 text-lg" onClick={toggleRadDeg}>
                {mode}
              </CalculatorButton>
            </div>
          </div>
        )}

        <div className="flex-grow-[1] basis-0 grid grid-cols-4 gap-2">
          {/* Scientific Functions for smaller screens */}
          {isScientific && (
            <div className="col-span-4 grid grid-cols-5 gap-2 md:hidden">
              {sciFunctions.map(({label, func}) => (
                <CalculatorButton key={func} variant="function" size="default" className="w-auto h-12 text-sm" onClick={() => input(func)}>{label}</CalculatorButton>
              ))}
              {memFunctions.map(({label, action}) => (
                <CalculatorButton key={label} variant="toggle" size="default" className="w-auto h-12 text-sm" onClick={action}>{label}</CalculatorButton>
              ))}
              <CalculatorButton variant="toggle" size="default" className="w-auto h-12 text-sm" onClick={toggleRadDeg}>
                {mode}
              </CalculatorButton>
            </div>
          )}

          <CalculatorButton variant="toggle" onClick={clear}>AC</CalculatorButton>
          <CalculatorButton variant="toggle" onClick={toggleSign}>+/-</CalculatorButton>
          <CalculatorButton variant="toggle" onClick={() => input('%')}><Percent size={24}/></CalculatorButton>
          <CalculatorButton variant="operator" onClick={() => input(' / ')}><Divide size={24}/></CalculatorButton>

          <CalculatorButton onClick={() => input('7')}>7</CalculatorButton>
          <CalculatorButton onClick={() => input('8')}>8</CalculatorButton>
          <CalculatorButton onClick={() => input('9')}>9</CalculatorButton>
          <CalculatorButton variant="operator" onClick={() => input(' * ')}><X size={24}/></CalculatorButton>
          
          <CalculatorButton onClick={() => input('4')}>4</CalculatorButton>
          <CalculatorButton onClick={() => input('5')}>5</CalculatorButton>
          <CalculatorButton onClick={() => input('6')}>6</CalculatorButton>
          <CalculatorButton variant="operator" onClick={() => input(' - ')}><Minus size={24}/></CalculatorButton>

          <CalculatorButton onClick={() => input('1')}>1</CalculatorButton>
          <CalculatorButton onClick={() => input('2')}>2</CalculatorButton>
          <CalculatorButton onClick={() => input('3')}>3</CalculatorButton>
          <CalculatorButton variant="operator" onClick={() => input(' + ')}><Plus size={24}/></CalculatorButton>

          <CalculatorButton onClick={toggleScientificMode} variant="toggle"><Atom size={20} className="mx-auto" /></CalculatorButton>
          <CalculatorButton onClick={() => input('0')}>0</CalculatorButton>
          <CalculatorButton onClick={() => input('.')}>.</CalculatorButton>
          <CalculatorButton variant="operator" onClick={calculate}><Equal size={24}/></CalculatorButton>
          
          <CalculatorButton variant="toggle" size="wide" className="h-12" onClick={backspace}><Delete/></CalculatorButton>
          <CalculatorButton variant="toggle" size="wide" className="h-12 col-span-2" onClick={() => input('00')}>00</CalculatorButton>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
