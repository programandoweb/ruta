'use client'

import useFormData from "@/hooks/useFormDataNew";

const DeployBtn=()=>{
    
    const formData: any = useFormData(false, false, false);

    const handleDeploy=()=>{
        formData.handleRequest(formData.backend + "/dashboard/deploy").then((response: any) => {
            if (response) {
              console.log(response)
            }
          });
    }

    return  <div className="mt-2">
                <div onClick={ handleDeploy } className="cursor-pointer flex justify-center items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                    Desplegar Next
                </div>              
            </div>
}
export default DeployBtn;