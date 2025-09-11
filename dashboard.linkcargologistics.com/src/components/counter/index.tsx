'use client';
import React, { useEffect, useState } from 'react';
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdRemoveCircleOutline } from "react-icons/io";

type CounterProps = {
  max: number;
  min: number;
  name:string;
  defaultValue?:any;
  setValue:(checked: any) => void;
  handleDispatch?: ((name:string,value:string|boolean|number) => void) | undefined
};

const Counter: React.FC<CounterProps> = ({ max, min, setValue, name, handleDispatch, defaultValue }) => {
  const [count, setCount] = useState(defaultValue||min);

  const increment = () => {
    if (count < max) {
        const sum   =   count + 1;
        setCount(sum);
        setValue((prevValue:any) => ({ ...prevValue, [name]: sum }));
        if(handleDispatch)handleDispatch(name,sum);
    }
  };

  const decrement = () => {
    if (count > min) {
        const sum   =   count - 1;
        setCount(sum);
        setValue((prevValue:any) => ({ ...prevValue, [name]: sum }));
        if(handleDispatch)handleDispatch(name,sum);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        onClick={decrement}
        className="text-xl p-2 bg-gray-200 rounded-full hover:bg-gray-300"
      >
        <IoMdRemoveCircleOutline className='h-6 w-6'/>
      </div>
      <span className="mx-4 text-xl">{count}</span>
      <div
        onClick={increment}
        className="text-xl p-2 bg-gray-200 rounded-full hover:bg-gray-300"
      >
        <IoMdAddCircleOutline className='h-6 w-6'/>
      </div>
    </div>
  );
};

export default Counter;
