import React, { useState } from "react";
import { OnlinePaidInterface, MasterTablesDataset } from "@/data/interface";
import useFormData from "@/hooks/useFormDataNew";
import TextField from "@/components/fields/TextField";
import InputField from "@/components/fields/InputField";
import Upload from "@/components/uploads";



let handleRequest:any,
    backend:string;

const prefixed          =   "online_payment_method_id";
const defaultValue      =   {id:false,label:false,Nombre:false,value:"",description:"",bool_status:1,medida_id:1}

const OnlinePaidChildren: React.FC<MasterTablesDataset> =   (props) => {
    const {grupo, getInit, inputs, setInputs}    =   props;
    const formData                              =   useFormData(false, false, false);
    handleRequest                               =   formData.handleRequest;
    backend                                     =   formData.backend;  
    
    const onUpload=(name:string,url:string)=>{
        setInputs((prevFormData:any) => ({
            ...prevFormData,
            [name]: url,
        }));             
    }

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

    console.log(inputs)


    return (
        <div className="col-span-2"> 
            <div className="grid grid-cols-2">
                <div>
                    <InputField
                        prefixed={prefixed}
                        name="label"
                        variant="autenticación"
                        extra="mb-0"
                        label="Nombre"
                        placeholder="Ej: Pago por tranferencia bancaria, QR o línk de pagos"
                        id="label"
                        type="text"
                        defaultValue={inputs.label}
                        setInputs={setInputs}
                    />
                    <TextField
                        prefixed={prefixed}
                        name="value"
                        extra="mb-0"
                        label="Texto descriptivo para transacción"
                        placeholder="Ej: Para tranferencias indicar Nombres y Apellidos, Nro Documentos y Código tranferencia"
                        id="value"
                        defaultValue={inputs.value}
                        setInputs={setInputs}
                    />
                </div>
                <div>
                    <Upload onUpload={onUpload} name="description"/>                    
                </div>  
                <div className="mt-2">
                    <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-4">
                        <div onClick={()=>setInputs(defaultValue)} className="cursor-pointer flex justify-center items-center mr-2 p-3 linear rounded-xl bg-brand-200 py-1 text-base font-medium text-white transition duration-300 hover:bg-brand-400 active:bg-brand-400 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-100">Cerrar</div>
                        <div onClick={submit} className="cursor-pointer flex justify-center items-center mr-2 p-3 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-300 active:bg-brand-400 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">Guardar</div>                
                    </div>
                </div>          
            </div>
        </div>
    );
};

export default OnlinePaidChildren;
