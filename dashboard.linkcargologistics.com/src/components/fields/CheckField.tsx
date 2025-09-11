'use client';
import React, { useEffect } from "react";
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
  handleChange?: (e:any,value: any,label:string) => void;
  amount?:any;
};

type FormData = {
  [key: string]: any;
};

const CheckField: React.FC<Props> = (props) => {
  const { amount, setInputs, label, id, extra, variant, state, disabled, name, defaultValue, handleChange } = props;
  const [checked, setChecked] = React.useState<boolean>(defaultValue === 141);
  const onChange: ChangeEventHandler = (e) => {
    if(handleChange){
      handleChange(e,amount,label||"")
    }
    const isChecked = e.target.checked;
    setChecked(isChecked);
    if (setInputs) {
      setInputs((prevFormData: any) => ({
        ...prevFormData,
        [e.target.name]: isChecked ? 141 : 142,        
      }));
    }
  };

  useEffect(() => {
    if (name) {
      setChecked(defaultValue === 141);
    }
  }, [defaultValue, name]);

  return (
    <div className={`mt-3 flex items-center ${extra}`}>
      <input
        checked={checked}
        name={name}
        onChange={onChange}
        disabled={disabled}
        type="checkbox"
        id={id || name}
        className={`mr-2 h-5 w-5 rounded border bg-white/0 p-3 text-sm outline-none duration-300 ${disabled === true
          ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
          : state === "error"
            ? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
            : state === "success"
              ? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
              : "border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white"
          }`}
      />
      <label
        htmlFor={id}
        className={`text-sm text-navy-700 dark:text-white ${variant === "auth" ? "font-medium" : "font-bold"}`}
      >
        {label}
      </label>
    </div>
  );
};

export default CheckField;
