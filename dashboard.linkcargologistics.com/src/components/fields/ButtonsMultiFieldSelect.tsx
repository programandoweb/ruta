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
  options: { value: string }[];
};

type FormData = {
  [key: string]: any;
};

const ButtonsMultiFieldSelect: React.FC<Props> = (props) => {
  const { setInputs, label, id, extra, options, variant, name, defaultValue } = props;
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  useEffect(() => {
    if (defaultValue && name && selectedOptions.length === 0) {
      if (typeof defaultValue === 'string') {
        setSelectedOptions(defaultValue.split(',')); // Divide la cadena en un array usando la coma como separador
      } else {
        setSelectedOptions(defaultValue);
      }
    }
  }, [defaultValue, name]);
  

  const handleButtonClick = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };
  
  useEffect(()=>{
    if (setInputs&&name&&selectedOptions&&selectedOptions.join) {
      const selectedValues = selectedOptions.join(','); // Genera la lista de botones activos separados por coma
      setInputs((prevFormData: any) => ({
        ...prevFormData,
        [name]: selectedValues,
      }));
    }
  },[selectedOptions])
  

  return (
    <div className={`${extra}`}>
      <label
        htmlFor={id}
        className={`ml-3 mb-3 text-sm text-navy-700 dark:text-white ${variant === "auth" ? "ml-1.5 font-medium" : " font-bold "}`}
      >
        {label}
      </label>
      <div className="flex">
        {options && options.map && options.map((row, key) => (
          <div
            key={key}
            className={`cursor-pointer flex items-center px-3 linear rounded-xl py-1 text-base font-medium transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 mr-1 ${
              selectedOptions.includes(row.value) ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
            onClick={() => handleButtonClick(row.value)}
          >
            {row.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ButtonsMultiFieldSelect;
