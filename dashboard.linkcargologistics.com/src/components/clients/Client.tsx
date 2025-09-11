import useFormData from "@/hooks/useFormDataNew";
import StringAndLabel from "../fields/StringAndLabel";
import { useDispatch, useSelector } from 'react-redux';
import { setTable } from '@/store/Slices/tableSlice';

interface Props {
    setTable?:any;
    table: any; // Consider refining the `any` type to a more specific type
}

let apirest:any;
let handleRequest:any;
let backend:any;

const ClientDetail=(props: Props)=>{
    const dispatch:any  =   useDispatch();
    const { table }     =   useSelector((select:any)=>select);
    apirest             =   useFormData(false, false, false);
    handleRequest =   apirest.handleRequest;
    backend       =   apirest.backend;
    const handleSubmit = () => {
        handleRequest(backend + location.pathname+"/cash-register/deleteRelationIdentification", "put", { ...props.table }).then((response:any)=>{
            if(response){
                const table_    =   {...table}
                //console.log(table_,response.table)
                //table_.order    =   response.order;
                dispatch(setTable(response.table))                
            }
        });
    };

    //console.log( props.table )

    return  <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-4 bg-lightPrimary p-2">
                <div>
                    <StringAndLabel label="Tipo de cliente">
                        {
                            props.table.client.user_type
                        }
                    </StringAndLabel>                    
                </div>
                <div>
                    <StringAndLabel label="Nombre">
                        {
                            props.table.client.name
                        }
                    </StringAndLabel>                    
                </div>
                <div>
                    <StringAndLabel label="Email">
                        {
                            props.table.client.email
                        }
                    </StringAndLabel>                    
                </div>                
                <div>
                    <StringAndLabel label="Tipo de documento">
                        {
                            props.table.client.identification_type
                        }
                    </StringAndLabel>                    
                </div> 
                <div>
                    <StringAndLabel label="Teléfono">
                        {
                            props.table.client.phone_number
                        }
                    </StringAndLabel>                    
                </div> 
                <div>
                    <button className="cursor-pointer flex justify-center items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" onClick={handleSubmit}>Cambiar facturación</button>
                </div>                
            </div>
}
export default ClientDetail;