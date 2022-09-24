import { useState, ChangeEvent } from "react";

export type useInputReturn = [
  string,
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => void,
  () => void
];

export function useInput(defaultValue?: string): useInputReturn {
  const [inputData, setInputData] = useState(defaultValue ?? "");

  const inputHandler = (input: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
    if (typeof input === "string") {
      setInputData(input);
    } else {
      setInputData(input.target.value);
    }
  };

  const clearInput = () => setInputData("");

  return [inputData, inputHandler, clearInput];
}
