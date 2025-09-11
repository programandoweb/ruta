'use client'
import React from "react";
import useFormData from "@/hooks/useFormDataNew";
import BtnBack from "@/components/buttom/BtnBack";

const SettingProductos = () => {

    const formData    =   useFormData(false, false, false);
    
    const handleCreateDB=(type:string)=>{
        formData.handleRequest(formData.backend + location.pathname+"/products_fake/"+type,"post",{}).then((response: any) => {
            if (response) {
                console.log(response)
            }      
        });
    }

    return (
      <div>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
                <button onClick={()=>handleCreateDB("food")} className={`px-4 h-full rounded-md text-center bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`}>
                    Datos Prueba Food
                </button>        
            </div>
            <div>
                <button onClick={()=>handleCreateDB("outfits")} className={`px-4 h-full  rounded-md text-center bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`}>
                    Datos Prueba Store Outfits
                </button>        
            </div>
            <div>
                <button onClick={()=>handleCreateDB("products")} className={`px-4 h-full  rounded-md text-center bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`}>
                    Datos Prueba Store Products
                </button>        
            </div>
            
        </div>
      </div>
    );
  };
  
  export default SettingProductos;
  