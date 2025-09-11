'use client';
import React, { useEffect, useState } from "react";

type ChangeEventHandler = (event: React.ChangeEvent<HTMLSelectElement>) => void;

type Props = {
  setInputs?: (value: any) => void;
  prefixed?: string;
  defaultValue?: any;
  name?: string;
  label?: string;
  id?: string;
  extra?: string;
  placeholder?: any;
  variant?: string;
  state?: 'error' | 'success' | string;
  disabled?: boolean;
  required?: boolean; // Nueva propiedad opcional para requerir el campo
  options: any; // Array de opciones para el select
};

type FormData = {
  [key: string]: any;
};

const SelectField: React.FC<Props> = (props) => {
  const { label, id, extra, variant, state, disabled, name, defaultValue, options, setInputs, required } = props;

  const [value, setValue] = useState<FormData>({ [name || '']: defaultValue || '' });

  const onChange: ChangeEventHandler = (e) => {
    if (setInputs) {
      setInputs((prevFormData: any) => ({
        ...prevFormData,
        [e.target.name]: e.target.value,
      }));
    }
  };

  useEffect(() => {
    if (defaultValue && name) {
      setValue((prevValue) => ({ ...prevValue, [name]: defaultValue }));
    }
  }, [defaultValue, name]);

  return (
    <div className={`${extra}`}>
      {label && (
        <label
          htmlFor={id}
          className={`ml-3 mb-1 text-sm text-navy-700 dark:text-white ${variant === "auth" ? "ml-1.5 font-medium" : " font-bold "}`}
        >
          {label}
          {required && <span className="ml-2 text-red-500">*</span>} {/* Mostrar asterisco si es requerido */}
        </label>
      )}
      <select
        value={value[name || '']}
        name={name}
        onChange={onChange}
        disabled={disabled}
        id={id || name}
        required={required} // Aquí agregamos la propiedad required de manera opcional
        className={`mt-1 flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none duration-300 
          ${disabled
            ? "border-none bg-gray-100 dark:bg-white/5 dark:placeholder:text-[rgba(255,255,255,0.15)]"
            : state === "error"
              ? "border-red-500 text-red-500 placeholder:text-red-500 dark:border-red-400 dark:text-red-400 dark:placeholder:text-red-400"
              : state === "success"
                ? "border-green-500 text-green-500 placeholder:text-green-500 dark:border-green-400 dark:text-green-400 dark:placeholder:text-green-400"
                : "border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white"
          }`}
      >
        <option value="">
          Seleccione
        </option>
        {options &&
          options.map &&
          options.map((option: any, index: string) => (
            <option key={index} value={option.id || option.value}>
              {option.label || option.name}
            </option>
          ))}
      </select>
    </div>
  );
}

export default SelectField;
