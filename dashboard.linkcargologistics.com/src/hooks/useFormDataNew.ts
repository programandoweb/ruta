'use client'
import { useSelector,useDispatch } from "react-redux";
import { setError } from "@/store/Slices/errorSlice";
import { setDialogMessage , setShowModal , setDialogList } from "@/store/Slices/dialogMessagesSlice";
import { setData, setDataTable, setInputs , clearDataInputs , clearData} from "@/store/Slices/dataSlice";
import { useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { handleCloseLoading,handleOpenLoading } from "@/store/Slices/loadingSlice";
//import { usePathname } from 'next/navigation'

/**
 * Contract
 */
interface FormInputs {
  [key: string]: string | number | boolean; // Puedes ajustar los tipos según tus necesidades
}
let defaultEndPoint =   typeof window !== 'undefined' ? window.location.origin : '/';
const pathname      =   typeof window !== 'undefined' ? window.location.pathname : '/';
const search        =   typeof window !== 'undefined' ? window.location.search : '/';
const user          =   typeof window !== 'undefined' ? localStorage.getItem("user") : null; // Parse user as object (assuming it's JSON)

interface RootState {
  data: {
    dataInputs: any; // Replace with the actual type of form data
  };
}

const useFormData = (
  endPoint?: string | undefined | false,
  autoload?: boolean,
  prefixed?: string | undefined | false,
  skipLoading?: boolean | undefined | false,
) => {
  /**
   * armo el endpoint del backend
   */
  if(defaultEndPoint.includes("localhost")){
    defaultEndPoint = defaultEndPoint.replace("localhost:"+process.env.NEXT_PUBLIC_PORT_FRONT,"localhost:"+process.env.NEXT_PUBLIC_PORT)
  }

  if(process.env.NEXT_PUBLIC_BACKEND_URL){
    defaultEndPoint = process.env.NEXT_PUBLIC_BACKEND_URL;
  }

  const [dataset,setDataset]  =   useState(null)
  const router      =     useRouter();
  let backend       =     (endPoint || defaultEndPoint + process.env.NEXT_PUBLIC_VERSION) ;
  const formData    =     useSelector<RootState>(state => state.data.dataInputs);
  const dispatch    =     useDispatch();
  const [input, setInput]           =   useState<FormInputs>({});
  /**
   * generador de respuestas negativas o errores (404)
  */

  const errorResponse=(error:any)=>{
    dispatch(setError(error))
  }

  const redirectLogin=(message:string)=>{
    localStorage.removeItem('user');
    Cookies.remove('token');
    setTimeout(() => {
      router.replace(`/auth`);       
      dispatch(setDialogMessage(message))  
    }, 1000);    
  }

  const errorDialog=(message:string,list:any)=>{

    /**
     * Eliminar sesión si el error es de login
     */
    
    if(message==='Route [login] not defined.'){
      /*
      localStorage.removeItem('user');
      Cookies.remove('token');
      router.replace(`/auth`);       
      dispatch(setDialogMessage("No está autorizado para estar aquí.<div>Debe iniciar sesión</div>"))
      */
      redirectLogin("No está autorizado para estar aquí.<div>Debe iniciar sesión</div>")
      return dispatch(setShowModal(true))
    }

    dispatch(setDialogMessage(message))
    dispatch(setShowModal(true))
    dispatch(setDialogList(list||[]))
  }

  const handleSubmit=(e:any)=>{
    e.preventDefault()
    const inputs:any                      =   input;
    const method: "get" | "post" | "put" | "delete" =   inputs&&inputs?.id?"put":"post";
    handleRequest(backend+(window.location.pathname),method,inputs,false)    
  }


  const getUserLocalStore = async () => {
    const userStr = localStorage.getItem('user');
    if (typeof userStr === 'string') {
      try {
        const { token } = JSON.parse(userStr);
        return token || false;
      } catch {
        return false;
      }
    }
    return false;
  };
  

  /**
   * procesamiento de solicitudes
   */
  const handleRequest = async (
    url: string = backend,
    method: "get" | "post" | "put" | "delete" = 'get',
    body: object | undefined= {},
    isFileUpload: boolean = false
  ) => {
    try {

      if(!skipLoading)dispatch(handleOpenLoading());
      dispatch(clearDataInputs())
      dispatch(clearData())       

      if(typeof window === 'undefined'){
        return;
      }

      const parsedUser    =   user ? JSON.parse(user) : null; // Parse user if available
      let   token         =   parsedUser?.token; // Access token from parsed user object (adjust based on your user structure)

      /*Segunda verificación*/
      const userSecondary =   localStorage.getItem("user");
      if(!token&&userSecondary){
        token=JSON.parse(userSecondary).token||null
      }

      token = await getUserLocalStore();

      const headers       =   new Headers({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '', // Add Bearer token if available
      });

      //return console.log(method,headers,body,formData)
      const options = {
        method,
        headers,
        body: method!=='get'&&body ? JSON.stringify(body) : undefined, // Include body only if it exists
      };  
     
      const response = await fetch(url, options);

      if (!response.ok) {
        const dataResponse = await response.json();
        return errorDialog(dataResponse.message,dataResponse.errors||[])
        //throw new Error(`Error fetching data: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('Content-Type'); // Get Content-Type header
      dispatch(handleCloseLoading());
      if (contentType && contentType.includes('application/json')) {
        try {
          const dataResponse = await response.json();
          // Process JSON data
          if(dataResponse.status===200||dataResponse.status===201)
          {     
            
            setDataset(dataResponse.data);

            if (  dataResponse.data&& typeof dataResponse.data === "object") 
            {                  
              Object.entries(dataResponse.data).map((row)=>{
                const dataRow : any = row[1]||{};
                if(dataRow?.current_page){
                  return dispatch(setDataTable(dataRow))                     
                }
                
                if(dataRow&&dataRow.id){
                  dispatch(setInputs(dataRow))
                }

                dispatch(setData(dataRow))
                
              })            
            }
            dispatch(handleCloseLoading());
            return dataResponse.data;
          }
          
        } catch (error) {
          dispatch(handleCloseLoading());
          errorResponse(error)
          console.error('Error parsing JSON:', error);          
        }
      } else {
        dispatch(handleCloseLoading());
        errorResponse('Non-JSON response received')
        console.log('Non-JSON response received:', await response.text()); 
      }

    } catch (error:any) {
      dispatch(handleCloseLoading());
      if(error&&error.includes&&error.includes("NetworkError when attempting to fetch")){
        //redirectLogin("Tenemos problemas técnicos en el backend.<div>Debe iniciar sesión</div>")
      }else{
        errorResponse("error de petición: TypeError: NetworkError when attempting to fetch resource.")
      }            
      //redirectLogin("Tenemos problemas técnicos en el backend.<div>Debe iniciar sesión</div>")
      console.log('Error:', error);      
    }
    dispatch(handleCloseLoading());
  };

  const autoDispatch=()=>{
    handleRequest(backend+pathname+search);
  }

  const onUpload = ( name:any, value:any) => {
    setInput((prevFormData:any) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  

  return {
    dataset:dataset,
    onUpload:onUpload,
    inputs:input, 
    setInputs:setInput,
    autoDispatch:autoDispatch,
    search:search,
    pathname:pathname,
    handleRequest:handleRequest,
    backend:backend,
    handleSubmit:handleSubmit,
    endPoint: endPoint || defaultEndPoint,
    autoload: autoload || false,
    prefixed: prefixed || '',
  };
};

export default useFormData;
