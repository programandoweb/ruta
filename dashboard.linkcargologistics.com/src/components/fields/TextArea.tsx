import React, { useEffect, useRef } from "react";

type ChangeEventHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => void;

type Props = {
  autocomplete?: string;
  required?: boolean;
  setInputs?: (value: any) => void;
  prefixed?: string; // por consistencia con InputField, aunque no se usa aquí directamente
  defaultValue?: any;
  name?: string;
  label?: string;
  id?: string;
  extra?: string;
  placeholder?: string;
  variant?: string;
  state?: "error" | "success" | string;
  disabled?: boolean;
  length?: number; // límite de caracteres
  rows?: number;   // alto por defecto
  handleDispatch?: ((name: string, value: string | boolean) => void) | undefined;
};

type FormData = {
  [key: string]: any;
};

const TextArea: React.FC<Props> = (props) => {
  const {
    setInputs,
    label,
    id,
    extra,
    placeholder,
    variant,
    state,
    disabled,
    name,
    defaultValue,
    length,
    rows = 4,
    handleDispatch,
    required = false,
    autocomplete = "off",
  } = props;

  const [value, setValue] = React.useState<FormData>({ [name || ""]: defaultValue || "" });
  const [remainingChars, setRemainingChars] = React.useState(length);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const onChange: ChangeEventHandler = (e) => {
    const { selectionStart, selectionEnd, value: inputValue } = e.target;

    if (setInputs) {
      setInputs((prevFormData: any) => ({
        ...prevFormData,
        [e.target.name]: inputValue,
      }));
      if (handleDispatch) {
        handleDispatch(e.target.name, inputValue);
      }
    }

    setValue({ ...value, [name || ""]: inputValue });

    if (length) {
      setRemainingChars(length - inputValue.length);
    }

    if (areaRef.current && selectionStart !== null && selectionEnd !== null) {
      setTimeout(() => {
        areaRef.current?.setSelectionRange(selectionStart, selectionEnd);
      }, 0);
    }
  };

  useEffect(() => {
    if (name) {
      setValue((prev) => ({ ...prev, [name]: defaultValue || "" }));
      if (length) {
        const initial = (defaultValue?.length ?? 0);
        setRemainingChars(length - initial);
      }
    }
  }, [defaultValue, name, length]);

  return (
    <div className={`${extra || ""}`}>
      {label && label !== "" && (
        <label
          htmlFor={id || name}
          className={`ml-3 mb-1 text-sm text-navy-700 dark:text-white ${
            variant === "auth" ? "ml-1.5 font-medium" : " font-bold "
          }`}
        >
          {label}
          {required && <span className="ml-2 text-red-500">*</span>}
        </label>
      )}

      <textarea
        autoComplete={autocomplete}
        required={required}
        maxLength={length}
        value={value[name || ""] || ""}
        name={name}
        onChange={onChange}
        disabled={disabled}
        id={id || name}
        placeholder={placeholder}
        ref={areaRef}
        rows={rows}
        className={`${
          label && label !== "" ? "mt-1" : "mt-0"
        } flex w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none duration-300
           ${disabled
             ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
             : state === "error"
             ? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
             : state === "success"
             ? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
             : "border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white"
           } resize-y`}
      />

      {length && (
        <p className="text-xs text-gray-500 mt-1">
          {remainingChars} caracteres restantes
        </p>
      )}
    </div>
  );
};

export default TextArea;
