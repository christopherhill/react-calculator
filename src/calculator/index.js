import React, { useState, useEffect } from 'react'
import './Calculator.css'

const keypad = [
  { keyCode: 'Escape', display: 'AC', value: 'clear', className: 'ac control' },
  { keyCode: '_', display: '+/-', value: 'negated', className: 'negative control' },
  { keyCode: '%', display: '%', value: 'percent', className: 'percent control' },
  { keyCode: '/', display: <>&divide;</>, value: '/', className: 'divide operator' },
  { keyCode: '*', display: <>&times;</>, value: '*', className: 'multiply operator' },
  { keyCode: '-', display: '-', value: '-', className: 'minus operator' },
  { keyCode: '+', display: '+', value: '+', className: 'plus operator' },
  { keyCode: 'Enter', display: '=', value: '=', className: 'equals operator' },
  { keyCode: '.', display: '.', value: '.', className: 'decimal number' },
  { keyCode: '0', display: '0', value: '0', className: 'zero number' },
  { keyCode: '1', display: '1', value: '1', className: 'one number' },
  { keyCode: '2', display: '2', value: '2', className: 'two number' },
  { keyCode: '3', display: '3', value: '3', className: 'three number' },
  { keyCode: '4', display: '4', value: '4', className: 'four number' },
  { keyCode: '5', display: '5', value: '5', className: 'five number' },
  { keyCode: '6', display: '6', value: '6', className: 'six number' },
  { keyCode: '7', display: '7', value: '7', className: 'seven number' },
  { keyCode: '8', display: '8', value: '8', className: 'eight number' },
  { keyCode: '9', display: '9', value: '9', className: 'nine number' },
]

const operations = {
  '/': (prevValue, nextValue) => prevValue / nextValue,
  '*': (prevValue, nextValue) => prevValue * nextValue,
  '+': (prevValue, nextValue) => prevValue + nextValue,
  '-': (prevValue, nextValue) => prevValue - nextValue,
  '=': (prevValue, nextValue) => nextValue
}

const operationTypes = Object.keys(operations)

const commandTypes = ['clear', 'percent', 'negated']

const CalculatorKey = ({ className, onClick, value, display }) => {
  const handleClick = (e) => {
    e.preventDefault()
    onClick(value)
  }
  return <button className={className} onClick={handleClick}>
    {display}
  </button>
}

const Calculator = () => {

  const initialState = {
    displayValue: '0',
    value: 0,
    operator: null,
  }

  const [calculator, setCalculator] = useState(initialState)

  const clearAll = () => {
    setCalculator(initialState)
  }

  const makePercent = () => {
    const { displayValue } = calculator
    const percentage = parseFloat(displayValue) / 100
    setCalculator({
      ...calculator,
      displayValue: percentage
    })
  }

  const makeNegated = () => {
    const { displayValue } = calculator
    const negated = (parseFloat(displayValue)) * -1
    setCalculator({
      ...calculator,
      displayValue: negated
    })
  }

  // todo: remove waitingForOperand (not needed)
  const {
    displayValue, // string
    value, // float
    operator, // string
  } = calculator


  const handleCompute = () => {
    const { operator, displayValue, value } = calculator
    const currentValue = value || 0
    const inputValue = parseFloat(displayValue)
    console.log({ value, operator})
    const newValue = operations[operator](currentValue, inputValue)
    setCalculator({
      ...calculator,
      displayValue: String(newValue),
      value: newValue
    })

  }

  const handleClick = (buttonType) => {
    if (operationTypes.indexOf(buttonType) >= 0) { // operand

      setCalculator({
        ...calculator,
        operator: buttonType,
        // waitingForOperand: false,
        value: parseFloat(displayValue), // move the display value to value as the left operator
        displayValue: '' // computer new value
      })
      if (buttonType === '=') { handleCompute() }

    } else if (commandTypes.indexOf(buttonType) >= 0) { // command

      if (buttonType === 'clear') {
        clearAll()
      } else if (buttonType === 'percent') {
        makePercent()
      } else if (buttonType === 'negated') {
        makeNegated()
      }

    } else { // digit
      
      const newDisplayValue = displayValue !== '0' ? displayValue + buttonType : buttonType
      setCalculator({
        ...calculator,
        displayValue: newDisplayValue,
      })
  
    }
  }

  const handleKeyDown = (e) => {
    // look up what to do
    const { key } = e
    console.log({ key })
    const match = keypad.find((k) => k.keyCode === key)
    if (match) {
      console.log(match.value)
      handleClick(match.value)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown) // div must be in focus
    return () => window.removeEventListener('keydown', handleKeyDown)
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleKeyDown])

  console.log({ displayValue, value, operator })

  return <div className="calculator-container">

    <div className="results">
      {/* this has to do with setting displayValue to '' above */}
      {displayValue !== '' ? displayValue : String(value)}
    </div>

    {keypad.map(key =>
      <CalculatorKey
        key={key.value}
        keyCode={key.keyCode}
        display={key.display}
        value={key.value}
        onClick={handleClick}
        className={key.className}
      />)
    }
  
  </div>
}

export default Calculator

