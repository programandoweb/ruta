import React, { useState, useEffect } from 'react';
import './Autocomplete.css'; // Import the CSS file for styling if needed
import Link from 'next/link';
import { MdAddCircle } from "react-icons/md";

interface Suggestion {
  id: number;
  label: string;
}

interface AutocompleteProps {
  add?:string;
  defaultValue?: string|null;
  multiSelection?: boolean;
  placeholder?: string;
  name: string;
  options: Suggestion[];
  label?: string;
  id?: string;
  extra?: string;
  variant?: string;
  state?: 'error' | 'success' | string;
  setInputs?: any; // Define setInputs as optional
  handleDispatch?: ((name: string, value: string | boolean, values?: any) => void) | undefined;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  name,
  setInputs, // Destructure setInputs from props
  options,
  label,
  id,
  extra,
  variant,
  state,
  placeholder,
  defaultValue,
  handleDispatch,
  multiSelection = false,
  add,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    if (!multiSelection && selectedItems.length > 0) {
      setInputValue(selectedItems[0]);
    }
  }, [selectedItems, multiSelection]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.length > 0 && options && options.length > 0) {
      const filteredSuggestions = options.filter((suggestion) =>
        suggestion.label.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(
        filteredSuggestions.length > 0
          ? filteredSuggestions
          : [{ id: 0, label: 'No matches found' }]
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (value: string,values:any) => {
    if (!multiSelection) {
      if (handleDispatch && selectedItems) {
        //handleDispatch(name, [...selectedItems, value].join(','), values);
        handleDispatch(name, [value].join(','), values);
      }
      setInputValue(value);
      setSuggestions([]);
    } else {
      if (!selectedItems.includes(value)) {
        if (handleDispatch && selectedItems) {
          handleDispatch(name, [...selectedItems, value].join(','));
        }
        setSelectedItems([...selectedItems, value]);
        setInputValue('');
        setSuggestions([]);
      }
    }
  };

  const handleTagRemove = (item: string) => {
    const updatedItems = selectedItems.filter((selected) => selected !== item);
    setSelectedItems(updatedItems);
    if (handleDispatch) {
      handleDispatch(name, updatedItems.join(','));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!multiSelection) {
      return;
    }

    if (event.key === 'Enter' && inputValue && !selectedItems.includes(inputValue)) {
      if (handleDispatch && selectedItems) {
        handleDispatch(name, [...selectedItems, inputValue].join(','));
      }
      setSelectedItems([...selectedItems, inputValue]);
      setInputValue('');
      event.preventDefault();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setSuggestions([]);
    }, 200);
  };

  const handleFocus = () => {
    if (options && options.length > 0) {
      setSuggestions(options);
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (setInputs) {
      //console.log(name)
      setInputs((prevInputs: any) => ({
        ...prevInputs,
        [name]: selectedItems.join(',')
      }));
    }
  }, [selectedItems, setInputs, name]);

  useEffect(() => {
    if (defaultValue && selectedItems.length === 0) {
      setSelectedItems(defaultValue.split(',') || []);
    }
  }, [defaultValue]);

  return (
    <div className={`${extra}`}>
      {label && label !== '' && (
          <label
            htmlFor={id}
            className={`flex items-center ml-3 mb-2 text-sm text-navy-700 dark:text-white ${
              variant === 'auth' ? 'ml-1.5 font-medium' : ' font-bold '
            }`}
          >
            {label} 
            {add && (
              <Link href={add}>
                <MdAddCircle className='h-5 w-5 ml-1' />
              </Link>
            )}
          </label>
      )}

      <input
        autoComplete='off'
        placeholder={placeholder}
        type="text"
        value={inputValue}
        onFocus={handleFocus}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        aria-autocomplete="list"
        aria-controls="autocomplete-list"
        aria-expanded={suggestions.length > 0}
        id={id}
        className={` ${
          label && label !== ''
            ? 'mt-2'
            : 'mt-0'
        } flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none duration-300 ${
          state === 'error'
            ? 'border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400'
            : state === 'success'
            ? 'border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400'
            : 'border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white'
        }`}
      />
      {multiSelection && (
        <div className="flex flex-wrap mt-1">
          {selectedItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-l-lg px-3 py-1 m-1"
            >
              <span className="mr-1">{item}</span>
              {multiSelection && (
                <button
                  type="button"
                  onClick={() => handleTagRemove(item)}
                  className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500"
                >
                  &#10005;
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="relative ">
        {suggestions.length > 0 && (
          <ul
            id="autocomplete-list"
            className=" max-h-40 overflow-y-auto suggestions-list absolute z-10 mt-1 w-full bg-white/0 border border-gray-300 dark:border-white/10 rounded-xl shadow-lg"
          >
            {suggestions.map((suggestion:any,key) => (
              <li
                key={key}
                onMouseDown={() => handleSuggestionClick(suggestion.label,suggestion.value)}
                role="option"
                aria-selected={inputValue === suggestion.label}
                className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {suggestion.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Autocomplete;
