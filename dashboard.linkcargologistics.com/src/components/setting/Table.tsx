import React, { useEffect, useState } from "react";
import { SettingTablesProps } from "@/data/interface";
import ColumnsTable from "../tables/TableMaster";
import InputField from '@/components/fields/InputField';
import useFormData from "@/hooks/useFormDataNew";
import CheckField from "../fields/CheckField";
import Upload from "../uploads";
import { useSelector, useDispatch } from 'react-redux';
import { setOpenSC } from '@/store/Slices/dialogMessagesSlice';
import SelectField from "../fields/SelectField";

let handleRequest:any,
    backend:string;

const defaultValue  =   {id:false,label:false,Nombre:false,value:"",description:"",bool_status:1,medida_id:1,options:""}

const SettingTables: React.FC<SettingTablesProps> = ({ dataset, getInit, prefixed , extra , extra2, extra3, extra4, extra5, extra6, extra7, grupo, skipAdd}) => {
  const dispatch            =   useDispatch();
  const reload              =   useSelector((state: any) => state.dialog.openSC);
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

  const onUpload=(name:string,url:string)=>{
    setInputs((prevFormData:any) => ({
        ...prevFormData,
        [name]: url,
    }));             
  }

  useEffect(()=>{
    if(reload){
      setInputs(defaultValue)
      dispatch(setOpenSC(null))
    }
  },[reload])

  return (
    <div>
      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-4">
        <div className="col-span-2 md:col-span-2 md:border-spacing-2">
          <ColumnsTable skipAdd={skipAdd} grupo={grupo} dataset={dataset} setOpen={setInputs} />          
        </div>          
        {
          inputs&&inputs.Nombre&&(
          <div className="col-span-1 md:col-span-2 md:border-spacing-2 border-l-indigo-100 border-l-2 pl-3">
            <InputField
              prefixed={prefixed}
              name="label"
              variant="autenticación"
              extra="mb-0"
              label="Nombre"
              placeholder="Nombre"
              id="label"
              type="text"
              defaultValue={inputs.label||inputs.Nombre}
              setInputs={setInputs}
            />
            {
              extra&&(
                <>
                  <InputField
                    prefixed={prefixed}
                    name="value"
                    variant="autenticación"
                    extra="mb-0"
                    label="Porcentaje"
                    placeholder="Porcentaje"
                    id="value"
                    type="text"
                    defaultValue={inputs.value}
                    setInputs={setInputs}
                  />
                  <InputField
                    prefixed={prefixed}
                    name="description"
                    variant="autenticación"
                    extra="mb-0"
                    label="Tipo de cambio"
                    placeholder="Tipo de cambio"
                    id="description"
                    type="text"
                    defaultValue={inputs.description}
                    setInputs={setInputs}
                  />
                  <CheckField
                    prefixed={prefixed}
                    name="medida_id"
                    variant="autenticación"
                    extra="mb-0"
                    label="Depósito en cuenta"
                    placeholder="Depósito en cuenta"
                    id="medida_id"
                    type="checkbox"
                    defaultValue={inputs.medida_id}
                    setInputs={setInputs}
                  />                
                </>
              )
            }
            {
              extra2&&(
                <>
                  <InputField
                    prefixed={prefixed}
                    name="value"
                    variant="autenticación"
                    extra="mb-0"
                    label="Siglas"
                    placeholder="Siglas"
                    id="value"
                    type="text"
                    defaultValue={inputs.value}
                    setInputs={setInputs}
                  />                   
                </>
              )
            }
            {
              extra3&&(
                <>
                  <InputField
                    prefixed={prefixed}
                    name="description"
                    variant="autenticación"
                    extra="mb-0"
                    label="Descripción"
                    placeholder="Descripción"
                    id="description"
                    type="text"
                    defaultValue={inputs.description}
                    setInputs={setInputs}
                  />
                  <InputField
                    prefixed={prefixed}
                    name="value"
                    variant="autenticación"
                    extra="mb-0"
                    label="Valor"
                    placeholder="Valor"
                    id="value"
                    type="text"
                    defaultValue={inputs.value}
                    setInputs={setInputs}
                  />                   
                </>
              )
            }

            {
              extra4&&(
                <>
                  <InputField
                    prefixed={prefixed}
                    name="description"
                    variant="autenticación"
                    extra="mb-0"
                    label="Descripción"
                    placeholder="Descripción"
                    id="description"
                    type="text"
                    defaultValue={inputs.description}
                    setInputs={setInputs}
                  />
                </>                 
              )
            }

            {
              extra5&&(
                <>
                  <Upload defaultValue={inputs.description} onUpload={onUpload} name="description"/>                    
                </>                 
              )
            }

            {
              extra6&&(
                <>                
                  <SelectField
                                id={"medida_id"}
                                name={"medida_id"}
                                label={"Grupo Características"}
                                defaultValue={inputs.medida_id}
                                setInputs={setInputs}
                                options={extra6}                                
                                variant="autenticación"
                                extra="mb-0"                                
                            />                  
                </>                 
              )
            }

            {
              extra7 && (
                <>                
                  <SelectField
                    id={"description"}
                    name={"description"}
                    label={"Tipo"}
                    defaultValue={inputs.description}
                    setInputs={setInputs}
                    options={[
                      { label: "Archivo", value: "file" },
                      { label: "Botón de Radio", value: "radio" },
                      { label: "Casilla de Verificación", value: "checkbox" },
                      { label: "Color", value: "color" },
                      { label: "Contraseña", value: "password" },
                      { label: "Correo Electrónico", value: "email" },
                      { label: "Fecha", value: "date" },
                      { label: "Hora", value: "time" },
                      { label: "Número", value: "number" },
                      { label: "Rango", value: "range" },
                      { label: "Selección", value: "select" },
                      { label: "Teléfono", value: "tel" },
                      { label: "Texto", value: "text" },
                      { label: "URL", value: "url" },
                    ]}
                    variant="autenticación"
                    extra="mb-0"
                  />
                  <SelectField
                    id={"options"}
                    name={"options"}
                    label={"Dataset"}
                    defaultValue={inputs.options}
                    setInputs={setInputs}
                    options={extra7||[]}
                    variant="autenticación"
                    extra="mb-0"
                  />
                </>                 
              )
            }



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
