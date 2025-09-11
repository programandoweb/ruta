'use client'
import UploadBtn from "@/components/buttom/UploadBtn";
import useFormData from "@/hooks/useFormDataNew";
import { useEffect, useState } from "react";

const send_to_endpoint="/upload";

let formData:any;
const prefixed="logo";

const ComponentLogoPage=()=>{

    formData  = useFormData(false,false,false);

    const [inputs,setInputs]    = useState({id:0,logo:""})

    const onSubmit = () => {
      // Send data using the useFormData hook
      formData.handleRequest(
          formData.backend + location.pathname,
          'post',
          { ...inputs }
        )
        .then((response: any) => {
          console.log(response)
          if (response && response[prefixed]) {
                        
          }
        });
    };

    useEffect(()=>{
      if(inputs.logo){
        onSubmit()
        console.log(inputs.logo)
      }
    },[inputs.logo])
    
   
    return  <UploadBtn  send_to_endpoint={send_to_endpoint}     
                        preview={true} 
                        className="mb-1 mr-1 w-full" 
                        size="large" 
                        label="Avatar" 
                        name="logo" 
                        defaultValue={inputs.logo} 
                        setFormData={setInputs} />
}
export default ComponentLogoPage;