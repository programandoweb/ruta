import React, { useState } from "react";
import ModalComponent from "../modal/ModalComponent";
import ComponentMap from "./ComponentMap";

interface GoogleMapProps {
    placeholder?:string;
    label?:string;
    name?:string;
    inputs:any; // Define los datos que se manejarán en inputs
    setInputs?: (value: any) => void;
}

const GoogleMapBotton: React.FC<GoogleMapProps> = ({placeholder, label, name, inputs, setInputs }) => {
    
    const [modal, setModal] = useState<any>(false);

    const handleClick=()=>{
        return setModal(true)
    }

    const ResumeComponent=()=>{
        return  <ComponentMap/>
    }

    return (
    <div>
        {     
            modal&&(<ModalComponent component={ResumeComponent} modal={modal} onClose={() => setModal(false)} />)
        }  
        <label htmlFor={name} className={`ml-3 mb-2 text-sm text-navy-700 dark:text-white`}>
          {label}          
        </label>
        <div    onClick={handleClick}
                className={`
                            ${placeholder&&name&&inputs&&!inputs[name]?"bg-gray-200":"bg-gray-200"}
                            mt-1 w-full px-3 py-2 
                            border rounded-lg text-sm shadow-sm 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white
                        `}>
            {
                placeholder&&name&&inputs&&!inputs[name]?<div className="text-gray-200">
                    {placeholder}
                </div>:name&&inputs[name]?<div>{
                    inputs[name]
                }</div>:<div className="cursor-pointer">{placeholder}</div>
            }
        </div>      
    </div>
  );
};

export default GoogleMapBotton;
