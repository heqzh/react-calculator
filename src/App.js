// Component
import DigitButton from "./DigitButton";
import EvaluateButton from "./EvaluateButton";
import OperationButton from "./OperationButton";
// Reducer
import { useReducer } from "react";
import "./App.css";
import "./styles.css";

// function reducer(state, action) {}

const DEFAULT_STATE = {
  currentOperand: null,
  previousOperand: null,
  operation: null,
  overwrite: false,
};

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand === null) return;
  const [integer, decimal] = operand.split(".");
  if (!decimal) return INTEGER_FORMATTER.format(integer);
  return INTEGER_FORMATTER.format(integer) + "." + decimal;
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === null && state.previousOperand === null) {
        return state;
      }
      if (state.currentOperand === null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOperand === null) {
        return {
          ...state,
          currentOperand: null,
          previousOperand: state.currentOperand,
          operation: payload.operation,
        };
      }
      return {
        ...state,
        currentOperand: null,
        previousOperand: evaluate(state),
        operation: payload.operation,
      };
    case ACTIONS.CLEAR:
      return { ...DEFAULT_STATE };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) return { ...DEFAULT_STATE };
      if (state.currentOperand?.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      if (state.currentOperand) {
        let updated = state.currentOperand.slice(0, -1);
        return {
          ...state,
          currentOperand: updated,
        };
      }
    case ACTIONS.EVALUATE:
      if (
        state.currentOperand === null ||
        state.previousOperand === null ||
        state.operation === null
      )
        return state;
      return {
        ...state,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null,
        overwrite: true,
      };
    default:
      return;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const previous = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(previous) || isNaN(current)) return "";
  let computation;
  switch (operation) {
    case "+":
      computation = previous + current;
      break;
    case "-":
      computation = previous - current;
      break;
    case "*":
      computation = previous * current;
      break;
    case "÷":
      computation = previous / current;
      break;
  }
  return computation.toString();
}

function App() {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(state.previousOperand)} {state.operation}
        </div>
        <div className="current-operand">
          {formatOperand(state.currentOperand)}
        </div>
      </div>
      <button
        className="span-two"
        onClick={() => {
          dispatch({ type: ACTIONS.CLEAR });
        }}
      >
        AC
      </button>
      <button
        onClick={() => {
          dispatch({ type: ACTIONS.DELETE_DIGIT });
        }}
      >
        DEL
      </button>
      <OperationButton operation={"÷"} dispatch={dispatch} />
      <DigitButton digit={"1"} dispatch={dispatch}></DigitButton>
      <DigitButton digit={"2"} dispatch={dispatch}></DigitButton>
      <DigitButton digit={"3"} dispatch={dispatch}></DigitButton>
      <OperationButton operation={"*"} dispatch={dispatch} />
      <DigitButton digit={"4"} dispatch={dispatch}></DigitButton>
      <DigitButton digit={"5"} dispatch={dispatch}></DigitButton>
      <DigitButton digit={"6"} dispatch={dispatch}></DigitButton>
      <OperationButton operation={"+"} dispatch={dispatch} />
      <DigitButton digit={"7"} dispatch={dispatch}></DigitButton>
      <DigitButton digit={"8"} dispatch={dispatch}></DigitButton>
      <DigitButton digit={"9"} dispatch={dispatch}></DigitButton>
      <OperationButton operation={"-"} dispatch={dispatch} />
      <DigitButton digit={"."} dispatch={dispatch}></DigitButton>
      <DigitButton digit={"0"} dispatch={dispatch}></DigitButton>
      <EvaluateButton className="span-two" evaluate={"="} dispatch={dispatch} />
    </div>
  );
}

export default App;
