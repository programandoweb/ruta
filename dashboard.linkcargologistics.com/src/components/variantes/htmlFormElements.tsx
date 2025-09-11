/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve *  
 * ---------------------------------------------------
 */

import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { FiChevronDown } from 'react-icons/fi';



interface InputProps {
  id: string;
  name: string;
  label: string;
  inputs: any;
  setInputs: (inputs: any) => void;
  handleOnChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: Array<{ label: string; value: string }>;
  type?:any;
  group?:any;
  mask?: any;
  disabled?:boolean;
}

interface LiveFormattedInputProps {
  id: string;
  name: string;
  label: string;
  group: string;
  inputs?: any;
  setInputs: (inputs: any) => void;
  options?: Array<{ label: string; value: string }>;
  max?:number;
  min?:number;
  allowDecimals?:boolean;
  disabled?:boolean;
}

interface AutocompleteProps {
  indice?:any;
  id: string;
  name: string;
  label: string;
  group: string;
  inputs: any;
  setInputs: (inputs: any) => void;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  multiSelection?: boolean;
  disabled?:boolean;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  id,
  name,
  label,
  group,
  inputs,
  setInputs,
  options,
  placeholder = "Escribe para buscar...",
  multiSelection = false,
  disabled=false,
  indice
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Array<{ label: string; value: string }>>([]);

  useEffect(() => {
    if (!multiSelection && selectedItems.length > 0) {
      setInputValue(selectedItems[0]);
    }
  }, [selectedItems, multiSelection]);

  useEffect(() => {
    if (inputs?.dataDinamic?.[group]?.[name]) {
      const initialValues = inputs.dataDinamic[group][name].split(",");
      setSelectedItems(initialValues);
    }
  }, [inputs, group, name]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filteredSuggestions = options.filter((option) =>
        option.label.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (value: string) => {
    if (multiSelection) {
      if (!selectedItems.includes(value)) {
        const updatedItems = [...selectedItems, value];
        setSelectedItems(updatedItems);
        setInputs((prevInputs: any) => ({
          ...prevInputs,
          dataDinamic: {
            ...prevInputs.dataDinamic,
            [group]: {
              ...prevInputs.dataDinamic[group],
              [name]: updatedItems.join(","),
            },
          },
        }));
      }
      setInputValue("");
    } else {
      setSelectedItems([value]);
      setInputValue(value);
      setInputs((prevInputs: any) => ({
        ...prevInputs,
        dataDinamic: {
          ...prevInputs.dataDinamic,
          [group]: {
            ...prevInputs.dataDinamic[group],
            [name]: value,
          },
        },
      }));
      setSuggestions([]);
    }
  };

  const handleTagRemove = (item: string) => {
    const updatedItems = selectedItems.filter((selected) => selected !== item);
    setSelectedItems(updatedItems);
    setInputs((prevInputs: any) => ({
      ...prevInputs,
      dataDinamic: {
        ...prevInputs.dataDinamic,
        [group]: {
          ...prevInputs.dataDinamic[group],
          [name]: updatedItems.join(","),
        },
      },
    }));
  };

  const handleBlur = () => {
    setTimeout(() => setSuggestions([]), 200);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </label>
      {
        !disabled&&(
          <input
            disabled={indice&&selectedItems.length>0?true:false}
            id={id}
            name={name}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="block w-full px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        )
      }
      
      {multiSelection && selectedItems.length > 0 && (
        <div className="flex flex-wrap mt-1">
          {selectedItems.map((item, index) => {
            const foundOption = options.find((search: any) => search.id === parseInt(item));

            return (
              <div
                key={index}
                className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1 m-1"
              >
                <span className="mr-1">
                  {foundOption ? foundOption.label : item}
                </span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleTagRemove(item)}
                    className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500"
                  >
                    &#10005;
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      {suggestions.length > 0 && (
        <ul className="max-h-40 overflow-y-auto border rounded-lg shadow-lg bg-white dark:bg-gray-800 mt-1">
          {suggestions.map((suggestion:any, index) => (
            <li
              key={index}
              onMouseDown={() => handleSuggestionClick(indice?suggestion[indice]:suggestion.label)}
              className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const Totalizer: React.FC<any> = ({ label, value }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </label>
      <div className="block w-full px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white">
        {value}
      </div>
    </div>
  );
};

let beforeValue:any = 0;

export const LiveFormattedInput: React.FC<LiveFormattedInputProps> = ({
  disabled,
  id,
  max = Infinity, // Valores predeterminados para evitar que la validación falle
  min = 0,
  name,
  label,
  group,
  inputs,
  setInputs,
  options = [],
  allowDecimals = false,
}) => {
  const [displayValue, setDisplayValue] = useState("");

  const formatValue = (value: string) => {
    // Eliminar caracteres no numéricos y ceros iniciales
    const numericValue = value.replace(/\D/g, "").replace(/^0+/, "");

    // Validar longitud
    if (numericValue.length < min || numericValue.length > max) {
      return ""; // Retornar vacío si no cumple con la longitud
    }

    if (!numericValue) return ""; // Si no hay números, retornar vacío

    // Formatear la parte entera con separadores de miles
    const formattedInteger = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedInteger;
  };

  useEffect(() => {
    // Formatear el valor inicial al cargar el componente
    const initialValue = inputs?.dataDinamic?.[group]?.[name] ?? "";
    const formattedInitialValue = initialValue
      ? formatValue(initialValue.replace(/\./g, ""))
      : "";
    setDisplayValue(formattedInitialValue);
  }, [inputs, group, name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Formatear el valor en tiempo real
    let formattedValue  =   formatValue(rawValue);    
    
    if (formattedValue === "") {
      formattedValue    =   formatValue(beforeValue);    
    }else{
      beforeValue       =   rawValue;
    }

    

    // Actualizar el valor mostrado y el estado principal
    setDisplayValue(formattedValue);

    if (formattedValue !== "") {
      setInputs((prevInputs: any) => ({
        ...prevInputs,
        dataDinamic: {
          ...prevInputs.dataDinamic,
          [group]: {
            ...prevInputs.dataDinamic[group],
            [name]: formattedValue.replace(/\./g, ""),
          },
        },
      }));
    }
  };

  return (
    <div className="relative space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-white">
        {label} {inputs?.dataDinamic?.[group]?.[`${name}_option`]}
      </label>
      <div className="relative flex items-center">
        <input
          disabled={disabled}
          id={id}
          name={name}
          value={displayValue}
          onChange={handleChange}
          placeholder={`Ingrese ${label}`}
          className="block w-full px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        {!disabled && options.length > 0 && (
          <select
            value={inputs?.dataDinamic?.[group]?.[`${name}_option`] || ""}
            className="absolute right-0 top-0 h-full px-2 border-l border-gray-300 bg-white text-sm rounded-r-lg focus:outline-none dark:bg-gray-800 dark:text-white"
            onChange={(e) => {
              const selectedText = e.target.options[e.target.selectedIndex].text;

              setInputs((prevInputs: any) => ({
                ...prevInputs,
                dataDinamic: {
                  ...prevInputs.dataDinamic,
                  [group]: {
                    ...prevInputs.dataDinamic[group],
                    [`${name}_option`]: selectedText,
                  },
                },
              }));
            }}
          >
            {
              !disabled&&(<option value="">Seleccione</option>)
            }
            
            {options.map((option, index) => (
              <option key={index} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};




export const MaskedInput: React.FC<InputProps> = ({
  id,
  name,
  label,
  group,
  inputs,
  mask,
  handleOnChange,
}) => {
  
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </label>
      <InputMask
        id={id}
        name={name}
        mask={mask}
        value={inputs?.dataDinamic?.[group]?.[name] ?? ""}
        onChange={handleOnChange}
        placeholder={`Ingrese ${label}`}
        className="block w-full px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />
    </div>
  );
};

export const Textarea: React.FC<InputProps> = ({ group, id, name, label, inputs, setInputs }) => {

  const handleOnChange=(e:any)=>{
    setInputs((prevFormData: any) => ({
      ...prevFormData,
      [e.target.name]:e.target.value,
    }));    
  } 

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        className="block w-full px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white"
        placeholder={`Ingrese ${label}`}
        defaultValue={inputs?.dataDinamic?.[group]?.[name] ?? ""}
        onChange={handleOnChange}
        rows={4} // Número de filas por defecto
      />
    </div>
  );
};

export const TextInput: React.FC<InputProps> = ({ disabled, group, id, name, label, inputs, handleOnChange, type }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </label>
      <input
        disabled={disabled}
        id={id}
        type={type||"text"}
        name={name}
        className="block w-full px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white"
        placeholder={`Ingrese ${label}`}
        defaultValue={inputs?.dataDinamic?.[group]?.[name] ?? ""}
        onChange={handleOnChange}
      />
    </div>
  );
};

export const SelectInput: React.FC<InputProps> = ({ group, id, name, label, inputs, handleOnChange, options = [] }) => {

  //console.log(inputs?.dataDinamic?.[group]?.[name] ?? "")

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </label>
      <select
        id={id}
        name={name}
        className="block w-full px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white"
        defaultValue={inputs?.dataDinamic?.[group]?.[name] ?? ""}
        onChange={handleOnChange}
      >
        <option value="">Seleccione {label}</option>
        {options&&options.map((option:any, index) => (
          <option key={index} value={option.label||option.id}>
            {option.label||option.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export const DateInput: React.FC<InputProps> = ({ group, id, name, label, inputs, handleOnChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </label>
      <input
        id={id}
        type="date"
        name={name}
        className="block w-full px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white"
        defaultValue={inputs?.dataDinamic?.[group]?.[name] ?? ""}
        onChange={handleOnChange}
      />
    </div>
  );
};

export const CheckboxInput: React.FC<InputProps> = ({ group, id, name, label, inputs, handleOnChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </label>
      <div className="flex items-center">
        <input
          id={id}
          type="checkbox"
          name={name}
          className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700"
          checked={inputs?.dataDinamic?.[group]?.[name] === true}          
          onChange={handleOnChange}
        />
      </div>
    </div>
  );
};

export const ErrorInput: React.FC<{ errors?: string; label?: string }> = ({ errors }) => {
  if (!errors) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-red-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10A8 8 0 110 10a8 8 0 0118 0zm-9-3a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 15z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-medium">
          {errors}
        </span>
      </div>
    </div>
  );
};

