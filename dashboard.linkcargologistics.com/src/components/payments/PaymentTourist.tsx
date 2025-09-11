'use client'
import { useEffect, useState } from 'react';
import Card from "@/components/card";
import InputField from "@/components/fields/InputField";
import SelectField from "@/components/fields/SelectField";
import { formatearMonto } from '@/utils/fuctions';
import useFormData from '@/hooks/useFormDataNew';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


interface PaymentOperatorProps {
    data:any;
    getInit?:any;
    total?:any;
    id?:any;
    dataset?:any[];
    prefixed?: string | undefined;
    method: any; // Ajusta el tipo según los datos reales
    statusList: string[]; // Ajusta el tipo según los datos reales
}

interface StateInputs {
    method?:any;    
    amount?:any;    
    amount2?:string;  
    tour_id?:number;  
}

let formData:any;

let router:any;

const PaymentOperator: React.FC<PaymentOperatorProps> = ({ statusList, prefixed , dataset, total , id , getInit , data, method}) => {

    router    =   useRouter();

    formData  =   useFormData(false, false, false);

    const [inputs,setInputs]        =   useState<StateInputs>({...data})
    const [current,setCurrent]      =   useState("")

    const formulaDS = (result: any, setCurrent: React.Dispatch<React.SetStateAction<string>>) => {
    
        /**valor representa la comisión valor=porcentaje */
        if (parseFloat(result.valor)>0) {
            return  parseFloat(inputs.amount) / parseFloat(result.description) + (parseFloat(inputs.amount) / parseFloat(result.description) * (parseFloat(result.description)/100));
        }else{
            return  parseFloat(inputs.amount) / parseFloat(result.description);
        }
        return 1;
    }
    
    const formulaBS = (result: any, setCurrent: React.Dispatch<React.SetStateAction<string>>) => {
        /**valor representa la comisión valor=porcentaje */
        if (parseFloat(result.valor)>0) {
            /**tarjeta de crédito y otro medios que cobran porcentaje */
            return  parseFloat(inputs.amount) + (parseFloat(inputs.amount) * (parseFloat(result.valor)/100))
        }else{
            return  parseFloat(inputs.amount);        
        } 
    }


    const handlePaid=()=>{
        formData.handleRequest(formData.backend + "/dashboard/order-paid","post",{...inputs,order_paid_id:id}).then((response: any) => {
            router.replace("/dashboard/tour-assignment/"+response.tour_assignment_creates.id+"?assignment_code="+response.tour_assignment_creates.code);            
            //getInit()            
        })
      }
    
    useEffect(() => {
        if (inputs.method && dataset) {
            const result = dataset.find((search: any) => search.id === parseInt(inputs.method));
            if (result&&result.description&&result.description==="1") {
                /**
                 * si se cumple esta condición quiere decir que ejecutamos formulaBS() porque son bolivianos
                */
                setCurrent(formatearMonto((formulaBS(result,setCurrent)||0))+" En BS")                    
            }else{
                setCurrent((formatearMonto(formulaDS(result,setCurrent) || 0))+" En DIVISA")
            }         
            
        }
    }, [inputs, dataset]);
    

    if (!data.file_payment_receipt) {
        return <div></div>
    }

    

    return (
        <Card className={"w-full pb-10 p-4 h-full"}>
            <div className="mt-2 text-center">
                Pendiente por pagar 
                <div><b>Bs. { formatearMonto(data.total_amount+data.total_extra) }</b></div>
            </div>
            <Link href={data.file_payment_receipt} target="_blank">
                <Image src={data.file_payment_receipt} width={400} height={400} alt="programandoweb"/>                    
            </Link>
            {data && (!data.paids || data.paids.length === 0) && (
                <>
                    <div>
                        <InputField
                            required={true}
                            prefixed={prefixed}
                            name="amount"
                            variant="autenticación"
                            extra="mb-0"
                            label={"Monto"}
                            placeholder={"Monto"}
                            id="amount"
                            type="text"
                            defaultValue={inputs?.amount}
                            setInputs={setInputs}                                                                    
                        />
                    </div>
                    <div className="mt-2">
                        <SelectField 
                            placeholder="Método de pago"
                            label="Método de pago"
                            defaultValue={inputs.method}
                            setInputs={setInputs}
                            options={method || []}
                            name="method"
                            variant="autenticación"
                            extra="mb-0"
                            id="method"
                        /> 
                    </div>
                    {data.amount > 0 && data.method && (
                        <button onClick={handlePaid} className="mt-3 flex items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                            Aceptar comprobante  
                        </button>
                    )}
                </>
            )}
            {
                inputs.method&&(
                    <div className="mt-2">
                        <SelectField
                            placeholder="Agregar al tour"
                            label="Agregar al tour"
                            defaultValue={inputs.tour_id}
                            setInputs={setInputs}
                            options={[...statusList,{ id: -1, value: -1, name: "Crear nuevo" }] || []}
                            name="tour_id"
                            variant="autenticación"
                            extra="mb-0"
                            id="tour_id"
                        />
                    </div>
                )
            }
            
            {
                inputs.amount > 0 && inputs.tour_id ? (
                    <button onClick={handlePaid} className="mt-3 flex align-middle justify-center text-center linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                        Agregar Pago
                    </button>
                ) : null
            }
        </Card>
    );
};

export default PaymentOperator;
