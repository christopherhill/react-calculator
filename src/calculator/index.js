import React, { useState, useEffect } from 'react'
import Decimal from 'decimal'
import './Calculator.css'

const keypad = [
  { type:'command', keyCode: 'Escape', display: 'AC', value: 'clear', className: 'ac' },
  { type:'command', keyCode: '_', display: '+/-', value: 'negated', className: 'negative' },
  { type:'command', keyCode: '%', display: '%', value: 'percent', className: 'percent' },
  { type: 'operator', keyCode: '/', display: <>&divide;</>, value: '/', className: 'divide' },
  { type: 'operator', keyCode: '*', display: <>&times;</>, value: '*', className: 'multiply' },
  { type: 'operator', keyCode: '-', display: '-', value: '-', className: 'minus' },
  { type: 'operator', keyCode: '+', display: '+', value: '+', className: 'plus' },
  { type: 'operator', keyCode: 'Enter', display: '=', value: '=', className: 'equals' },
  { type: 'digit', keyCode: '.', display: '.', value: '.', className: 'decimal' },
  { type: 'digit', keyCode: '0', display: '0', value: '0', className: 'zero' },
  { type: 'digit', keyCode: '1', display: '1', value: '1', className: 'one' },
  { type: 'digit', keyCode: '2', display: '2', value: '2', className: 'two' },
  { type: 'digit', keyCode: '3', display: '3', value: '3', className: 'three' },
  { type: 'digit', keyCode: '4', display: '4', value: '4', className: 'four' },
  { type: 'digit', keyCode: '5', display: '5', value: '5', className: 'five' },
  { type: 'digit', keyCode: '6', display: '6', value: '6', className: 'six' },
  { type: 'digit', keyCode: '7', display: '7', value: '7', className: 'seven' },
  { type: 'digit', keyCode: '8', display: '8', value: '8', className: 'eight' },
  { type: 'digit', keyCode: '9', display: '9', value: '9', className: 'nine' },
]

const operations = {
  '/': (prevValue, nextValue) => Decimal.div(prevValue, nextValue),
  '*': (prevValue, nextValue) => Decimal.mul(prevValue, nextValue),
  '+': (prevValue, nextValue) => Decimal.add(prevValue, nextValue),
  '-': (prevValue, nextValue) => Decimal.sub(prevValue, nextValue),
  '=': (prevValue, nextValue) => nextValue
}

const CalculatorKey = ({ className, onClick, value, display, type }) => {
  const handleClick = (e) => {
    e.preventDefault()
    onClick(value, type)
  }
  return <button className={`${className} ${type}`} onClick={handleClick}>
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

  const handleClick = (buttonValue, type) => {
    console.log({ type, buttonValue })
    if (type === 'operator') { // operand

      setCalculator({
        ...calculator,
        operator: buttonValue,
        value: parseFloat(displayValue), // move the display value to value as the left operator
        displayValue: '' // computer new value
      })
      if (buttonValue === '=') { handleCompute() }

    } else if (type === 'command') { // command

      if (buttonValue === 'clear') {
        clearAll()
      } else if (buttonValue === 'percent') {
        makePercent()
      } else if (buttonValue === 'negated') {
        makeNegated()
      }

    } else if (type === 'digit') { // digit

      if (buttonValue === '.' && displayValue.indexOf('.') >= 0) { return }
      const newDisplayValue = displayValue !== '0' ? displayValue + buttonValue : buttonValue
      setCalculator({
        ...calculator,
        displayValue: newDisplayValue,
      })
  
    }
  }

  const handleKeyDown = (e) => {
    e.preventDefault()
    // look up what to do
    const { key } = e
    const match = keypad.find((k) => k.keyCode === key)
    if (match) {
      handleClick(match.value, match.type)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown) // div must be in focus
    return () => window.removeEventListener('keydown', handleKeyDown)
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleKeyDown])

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
        type={key.type}
        className={key.className}
      />)
    }
  
  </div>
}

export default Calculator

