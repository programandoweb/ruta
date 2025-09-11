import { useState, ChangeEvent } from 'react';

interface FormInputs {
  [key: string]: string | number | boolean; // Puedes ajustar los tipos según tus necesidades
}

const useFormInputs = (initialState: FormInputs = {}) => {

  const [inputs, setInputs]   =   useState<FormInputs>(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type }     =   e.target;
    setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value,
    }));
  };

  const resetForm = () => {
    setInputs(initialState);
  };

  return {
    inputs,
    handleChange,
    resetForm,
    setInputs
  };
  
};

export default useFormInputs;
