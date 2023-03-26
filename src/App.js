import './styles.css';
import React, { useReducer } from 'react'
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS={
  ENTER_DIGITS : 'enter-digits',
  CHOOSE_OPERATION : 'choose-operation',
  CLEAR : 'clear',
  DELETE_DIGITS : 'delete-digits',
  EVALUATE : 'evaluate'
}

function reducer(state, {type, payload}){
  switch(type){

    case ACTIONS.ENTER_DIGITS:
      if( state.overwrite === true){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
//       if (payload.digit === "." && state.currentOperand.includes(".")) {
//         return state
//       }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      };
    
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null)
        return state;
      
      if(state.previousOperand == null)
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      if(state.currentOperand == null)
        return {
          ...state,
          operation: payload.operation
        }
      
      return {
        ...state,
        previousOperand: compute(state),
        currentOperand: null,
        operation: payload.operation
      }
    
    case ACTIONS.CLEAR:
      return {};
    
    case ACTIONS.DELETE_DIGITS:
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }
    
    case ACTIONS.EVALUATE:
      if( state.operation == null || state.previousOperand == null || state.currentOperand == null)
        return state
      
      return {
        ...state,
        currentOperand: compute(state),
        previousOperand: null,
        operation: null,
        overwrite: true
      }
    
    default:
      return state;

  }
}

function compute({previousOperand, currentOperand, operation}){
  let res = ""
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return ""
  switch(operation){
    case "+":
      res =  prev + curr;
      break;

    case "*":
      res = prev * curr;
      break;
    
    case "-":
      res = prev - curr;
      break;

    case "÷":
      res = prev/curr;
      break;

    default:
      res = "";
  }
  return res.toString();
}


function App() {

  const [{previousOperand, currentOperand, operation}, dispatch] = useReducer(reducer, {});

  return (
    // <Calculator />
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-operand'>{previousOperand} {operation}</div>
        <div className='current-operand'>{currentOperand}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGITS})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch}  />
      <DigitButton digit="1" dispatch={dispatch}  />
      <DigitButton digit="2" dispatch={dispatch}  />
      <DigitButton digit="3" dispatch={dispatch}  />
      <OperationButton operation="*" dispatch={dispatch}  />
      <DigitButton digit="4" dispatch={dispatch}  />
      <DigitButton digit="5" dispatch={dispatch}  />
      <DigitButton digit="6" dispatch={dispatch}  />
      <OperationButton operation="+" dispatch={dispatch}  />
      <DigitButton digit="7" dispatch={dispatch}  />
      <DigitButton digit="8" dispatch={dispatch}  />
      <DigitButton digit="9" dispatch={dispatch}  />
      <OperationButton operation="-" dispatch={dispatch}  />
      <DigitButton digit="." dispatch={dispatch}  />
      <DigitButton digit="0" dispatch={dispatch}  />
      <button onClick={() => dispatch({type: ACTIONS.EVALUATE})} className='span-two'>=</button>
    </div>
  );
}

export default App;
