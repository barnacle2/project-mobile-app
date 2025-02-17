import { useState } from 'react';
import TodoList from "./components/TodoList";

function App() {
  const [count, setCount] = useState(0);

  // Calculator State
  const [numbers, setNumbers] = useState(['', '']); // Start with two empty inputs
  const [operator, setOperator] = useState('+');
  const [result, setResult] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);
  const [solutionHistory, setSolutionHistory] = useState([]);

  function handleIncrement() {
    setCount(count + 1);
  }

  function handleDecrement() {
    if (count > 0) {
      setCount(count - 1);
    }
  }

  function handleReset() {
    setCount(0);
  }

  // Calculator Functions
  const handleNumberChange = (index, value) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
  };

  const handleAddInput = () => {
    if (hasCalculated) {
      // If we have a previous calculation, add a new input for the next number
      setNumbers([...numbers, '']);
    } else {
      // If we're doing a fresh calculation with multiple numbers
      setNumbers([...numbers, '']);
    }
  };

  const handleRemoveInput = (index) => {
    if (numbers.length > 2) { // Keep at least 2 inputs
      const newNumbers = numbers.filter((_, i) => i !== index);
      setNumbers(newNumbers);
      if (index === numbers.length - 1) {
        setHasCalculated(false); // Reset calculated state if removing the last input
      }
    }
  };

  const handleCalculate = () => {
    if (numbers.some(num => num === '')) {
      setResult('Please fill all numbers');
      return;
    }

    const numberValues = numbers.map(num => parseFloat(num));
    let calculatedResult;
    let solutionStep = '';

    if (hasCalculated) {
      // If we already have a calculation, only use the previous result and the last number
      const prevResult = parseFloat(result);
      const lastNumber = numberValues[numberValues.length - 1];

      switch (operator) {
        case '+':
          calculatedResult = prevResult + lastNumber;
          solutionStep = `${prevResult} + ${lastNumber} = ${calculatedResult}`;
          break;
        case '-':
          calculatedResult = prevResult - lastNumber;
          solutionStep = `${prevResult} - ${lastNumber} = ${calculatedResult}`;
          break;
        case '*':
          calculatedResult = prevResult * lastNumber;
          solutionStep = `${prevResult} × ${lastNumber} = ${calculatedResult}`;
          break;
        case '/':
          if (lastNumber === 0) {
            setResult('Cannot divide by zero');
            return;
          }
          calculatedResult = prevResult / lastNumber;
          solutionStep = `${prevResult} ÷ ${lastNumber} = ${calculatedResult}`;
          break;
        default:
          setResult('Invalid operator');
          return;
      }
    } else {
      // Calculate all numbers together
      switch (operator) {
        case '+':
          calculatedResult = numberValues.reduce((acc, curr) => acc + curr, 0);
          solutionStep = numberValues.join(' + ') + ` = ${calculatedResult}`;
          break;
        case '-':
          calculatedResult = numberValues.reduce((acc, curr, idx) => 
            idx === 0 ? curr : acc - curr, 0);
          solutionStep = numberValues.join(' - ') + ` = ${calculatedResult}`;
          break;
        case '*':
          calculatedResult = numberValues.reduce((acc, curr) => acc * curr, 1);
          solutionStep = numberValues.join(' × ') + ` = ${calculatedResult}`;
          break;
        case '/':
          if (numberValues.includes(0)) {
            setResult('Cannot divide by zero');
            return;
          }
          calculatedResult = numberValues.reduce((acc, curr, idx) => 
            idx === 0 ? curr : acc / curr);
          solutionStep = numberValues.join(' ÷ ') + ` = ${calculatedResult}`;
          break;
        default:
          setResult('Invalid operator');
          return;
      }
      setHasCalculated(true);
    }

    setResult(calculatedResult.toString());
    setSolutionHistory(prev => [...prev, solutionStep]);
  };

  const handleClear = () => {
    setNumbers(['', '']);
    setOperator('+');
    setResult('');
    setHasCalculated(false);
    setSolutionHistory([]);
  };

  return (
    <div className="container">
      <div className="counter-section">
        <h2>Click Counter:</h2>
        <div className="counter">
          <h1>{count}</h1>
          <button onClick={handleIncrement}>Increment</button>
          <button onClick={handleDecrement}>Decrement</button>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>

      <div className="calculator-section">
        <h2>Calculator:</h2>
        <div className="calculator">
          <div className="calculator-inputs">
            {numbers.map((number, index) => (
              <div key={index} className="input-group">
                <input
                  type="number"
                  value={number}
                  onChange={(e) => handleNumberChange(index, e.target.value)}
                  placeholder={`Number ${index + 1}`}
                  className={hasCalculated && index < numbers.length - 1 ? 'calculated' : ''}
                  readOnly={hasCalculated && index < numbers.length - 1}
                />
                {numbers.length > 2 && (
                  <button 
                    className="remove-input" 
                    onClick={() => handleRemoveInput(index)}
                    disabled={hasCalculated && index < numbers.length - 1}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <select 
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
            >
              <option value="+">+</option>
              <option value="-">-</option>
              <option value="*">×</option>
              <option value="/">÷</option>
            </select>
          </div>
          <div className="calculator-controls">
            <button className="add-input" onClick={handleAddInput}>
              Add Input
            </button>
          </div>
          <div className="calculator-buttons">
            <button onClick={handleCalculate}>=</button>
            <button onClick={handleClear}>Clear</button>
          </div>
          <div className="calculator-result">
            Result: {result}
          </div>
          {solutionHistory.length > 0 && (
            <div className="calculator-solution-history">
              <h3>Calculation Steps:</h3>
              {solutionHistory.map((step, index) => (
                <div key={index} className="calculator-solution">
                  Step {index + 1}: {step}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <TodoList />    
      </div>
    </div>
  );
}

export default App;
