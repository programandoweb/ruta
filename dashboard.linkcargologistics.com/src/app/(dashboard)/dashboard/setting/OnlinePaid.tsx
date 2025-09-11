import React, { useState } from "react";
import { SettingTablesProps } from "@/data/interface";
import ColumnsTable from "@/components/tables/TableMaster";
import InputField from '@/components/fields/InputField';
import useFormData from "@/hooks/useFormDataNew";
import SelectField from "@/components/fields/SelectField";
import CheckField from "@/components/fields/CheckField";
import OnlinePaidChildren from "./OnlinePaidChildren";

let handleRequest:any,
    backend:string;

const defaultValue  =   {id:false,label:false,Nombre:false,value:"",description:"",bool_status:1,medida_id:1}

const SettingTables: React.FC<SettingTablesProps> = ({ dataset, getInit, grupo}) => {
  const [inputs,setInputs]  =   useState(defaultValue);

  const formData    =   useFormData(false, false, false);
  handleRequest     =   formData.handleRequest;
  backend           =   formData.backend;  

  const submit=()=>{
    handleRequest(backend + location.pathname,(inputs.id)?"put":"post",{...inputs,grupo:grupo}).then((response: any) => {
      if (response && getInit) {
        getInit()
        setInputs(defaultValue)
      }      
    });
  }

  const handleDelete=()=>{
    handleRequest(backend + location.pathname,"delete",{...inputs}).then((response: any) => {
      if (response && getInit) {
        getInit()
        setInputs(defaultValue)
      }      
    });
  }

  return (
    <div>
      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-1 md:col-span-1 md:border-spacing-2">
          <ColumnsTable grupo={grupo} dataset={dataset} setOpen={setInputs} />          
        </div>          
        {
          inputs&&inputs.Nombre&&(
          <div className="col-span-1 md:col-span-2 md:border-spacing-2 border-l-indigo-100 border-l-2 pl-3">
            
            <OnlinePaidChildren inputs={inputs} setInputs={setInputs} grupo={grupo} dataset={dataset} getInit={getInit}/>

            <div className="mt-2">
              <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-4">
                <div onClick={()=>setInputs(defaultValue)} className="cursor-pointer flex justify-center items-center mr-2 p-3 linear rounded-xl bg-brand-200 py-1 text-base font-medium text-white transition duration-300 hover:bg-brand-400 active:bg-brand-400 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-100">Cerrar</div>
                <div onClick={submit} className="cursor-pointer flex justify-center items-center mr-2 p-3 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-300 active:bg-brand-400 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">Guardar</div>
                <div onClick={handleDelete} className="cursor-pointer flex justify-center items-center mr-2 p-3 linear rounded-xl bg-red-700 py-1 text-base font-medium text-white transition duration-200 hover:bg-red-500 active:bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-400">
                   {inputs.bool_status===1?"Desactivar":"Activar"}
                </div>
              </div>
            </div>
          </div>      
          )
        }
            
      </div>
    </div>
  );
};

export default SettingTables;
