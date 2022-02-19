import React from "react";
import { ACTIONS } from "./App";

export default function EvaluateButton({ className, dispatch, evaluate }) {
  return (
    <button
      className={className}
      onClick={() =>
        dispatch({ type: ACTIONS.EVALUATE, payload: { evaluate } })
      }
    >
      {evaluate}
    </button>
  );
}
