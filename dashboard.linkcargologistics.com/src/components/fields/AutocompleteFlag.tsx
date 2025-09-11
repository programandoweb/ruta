'use client';
import React, { useEffect, useState } from "react";
import { HTMLInputTypeAttribute } from "react";

type ChangeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;

type Props = {
  setInputs?: (value: any) => void;
  prefixed?: string;
  defaultValue?: any;
  name?: string;
  label?: string;
  id?: string;
  extra?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  variant?: string;
  state?: 'error' | 'success' | string;
  disabled?: boolean;
  min?: any;
  max?: any;
  handleDispatch?: ((name: string, value: string | boolean) => void) | undefined;
  suggestions: string[];
};

type FormData = {
  [key: string]: any;
};

const AutocompleteInputField: React.FC<Props> = (props) => {
  const { setInputs, label, id, extra, type, placeholder, variant, state, disabled, name, defaultValue, min, max, handleDispatch, suggestions } = props;
  const [value, setValue] = useState<FormData>({ [name || '']: defaultValue || '' });
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState(defaultValue || '');

  const onChange: ChangeEventHandler = (e) => {
    const inputValue = e.target.value;
    setUserInput(inputValue);

    const filtered = suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );

    setFilteredSuggestions(filtered);
    setShowSuggestions(true);

    if (setInputs) {
      setInputs((prevFormData: any) => ({
        ...prevFormData,
        [e.target.name]: inputValue,
      }));
      if (handleDispatch) {
        handleDispatch(e.target.name, inputValue);
      }
    }
  };

  const onClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setUserInput(e.currentTarget.innerText);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    if (setInputs) {
      setInputs((prevFormData: any) => ({
        ...prevFormData,
        [name || '']: e.currentTarget.innerText,
      }));
      if (handleDispatch) {
        handleDispatch(name || '', e.currentTarget.innerText);
      }
    }
  };

  useEffect(() => {
    if (name) {
      setValue((prevValue) => ({ ...prevValue, [name]: defaultValue }));
      setUserInput(defaultValue || '');
    }
  }, [defaultValue, name]);

  return (
    <div className={`${extra}`}>
      {label && label !== '' && (
        <label
          htmlFor={id}
          className={`ml-3 mb-2 text-sm text-navy-700 dark:text-white ${variant === "auth" ? "ml-1.5 font-medium" : " font-bold "}`}
        >
          {label}
        </label>
      )}
      <input
        min={min}
        max={max}
        value={userInput}
        name={name}
        onChange={onChange}
        disabled={disabled}
        type={type}
        id={id || name}
        placeholder={placeholder}
        className={` ${label && label !== "" ? "mt-2" : "mt-0"} flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none duration-300 ${
          disabled === true
            ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
            : state === "error"
            ? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
            : state === "success"
            ? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
            : "border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white"
        }`}
      />
      {showSuggestions && userInput && (
        <ul className="suggestions">
          {filteredSuggestions.length ? (
            filteredSuggestions.map((suggestion, index) => {
              return (
                <li key={index} onClick={onClick}>
                  {suggestion}
                </li>
              );
            })
          ) : (
            <li>No suggestions available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInputField;
