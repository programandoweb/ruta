'use client'
import { useEffect, useState } from 'react';
import Card from "@/components/card";
import InputField from "@/components/fields/InputField";
import SelectField from "@/components/fields/SelectField";
import { formatearMonto } from '@/utils/fuctions';
import useFormData from '@/hooks/useFormDataNew';
import { useRouter } from 'next/navigation';
import { formatarFechaLaravel } from '@/utils/fuctions';
import Link from 'next/link';
import { FaFilePdf } from "react-icons/fa6";

interface PaymentOperatorProps {
    data?:any;
    data2?:any;
    redirect?:string|boolean|undefined;
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
    devolution?:number;
    saldo?:number;  
}

let formData:any;
let router:any;

const PaymentOperator: React.FC<PaymentOperatorProps> = ({ statusList, prefixed , dataset, data, data2, total , redirect}) => {
    router    =   useRouter();
    formData  =   useFormData(false, false, false);

    const [inputs,setInputs]        =   useState<StateInputs>({tour_id:data2.tour_id})
    const [current,setCurrent]                  =   useState("")
    const [currentAmount,setCurrentAmount]      =   useState(0)
    const [totalPaid,setotalPaid]   =   useState(0)
    const [select,setSelect]        =   useState({valor:0,description:0})

    const formulaDS = (result: any, setCurrent: React.Dispatch<React.SetStateAction<string>>) => {
    
        /**valor representa la comisión valor=porcentaje */
        if (parseFloat(result.valor)>0) {
            return  parseFloat(inputs.amount) / parseFloat(result.description) + (parseFloat(inputs.amount) / parseFloat(result.description) * (parseFloat(result.description)/100));
        }else{
            return  parseFloat(inputs.amount) / parseFloat(result.description);
        }        
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

        if(!inputs.tour_id){
            return;        
        }

        if(!inputs.method||inputs.method===""){
            inputs.method   =   151;
        }

        if(!inputs.amount||inputs.amount===""){
            inputs.amount       =   total-totalPaid;
        }

        inputs.devolution       =   inputs.amount - (data2.total_amount+data2.total_extra)-totalPaid
        inputs.saldo            =   (data2.total_amount+data2.total_extra)-totalPaid;

        const observation:any   =   {
            devolution:inputs.devolution,
            saldo:(data2.total_amount+data2.total_extra)-totalPaid,
            current,
            currentAmount,
            comission:select.valor,
            change_type:select.description,
            total_change_type:parseFloat(currentAmount.toString()) * select.description,
            total_paid:current+" "+currentAmount,
            method:select
        }

        formData.handleRequest(formData.backend + "/dashboard/order-paid","post",{...inputs,order_paid_id:data2.order_id_old,observation:observation}).then((response: any) => {
            if(redirect===true&&response&&response.tour_assignment_creates&&response.tour_assignment_creates.id){
                let ext=response.tour_assignment_creates.assignment_create_id;
                if(response.tour_assignment_creates.id&&!response.tour_assignment_creates.assignment_create_id){
                    ext=response.tour_assignment_creates.id;
                }
                router.replace("/dashboard/tour-assignment/"+ext+"?assignment_code="+response.tour_assignment_creates.code);
            }
            //getInit()      
        })
      }
    
    useEffect(() => {
        if (inputs.method && dataset) {
            const result = dataset.find((search: any) => search.id === parseInt(inputs.method));
            setSelect({...result,description:parseFloat(result.description)})
            if (result&&result.description&&result.description==="1") {
                /**
                 * si se cumple esta condición quiere decir que ejecutamos formulaBS() porque son bolivianos
                */
                setCurrent("BS ")
                setCurrentAmount((formulaBS(result,setCurrent)||0))                    
            }else{
                setCurrent("DIVISA ")
                setCurrentAmount((formatearMonto(formulaDS(result,setCurrent) || 0)))                    
            }         
            
        }
    }, [inputs, dataset]);
    
    
    useEffect(() => {
        if(data&&data.map&&data.length>0){
            let total_ = 0;
            data.map((row:any)=>{
                total_ += parseFloat(row.amount);
                return 
            })
            setotalPaid(total_)            
        }  
    }, [data]);

    return (
        <Card className={"w-full pb-10 p-4 h-full"}>
            <div className="mt-2 text-center">
                Monto total del tour
                <div><b>Bs. { formatearMonto((data2.total_amount+data2.total_extra)) }</b></div>
            </div>
            <div className="mt-2 text-center">
                Pendiente por pagar 
                <div><b>Bs. { formatearMonto((data2.total_amount+data2.total_extra)-totalPaid) }</b></div>
            </div>
            <div className="mt-2 text-center">
                {
                    data&&data.map&&data.map((row:any,key:number)=>{
                        return  <div key={key} className="grid grid-cols-3 md:grid-cols-2 gap-4 uppercase mt-4">
                                    <div className='text-left'>
                                        { formatarFechaLaravel(row.created_at) }                                                
                                    </div>
                                    <div className='text-right'>
                                        <b>Bs.{ formatearMonto(row.amount) } </b>
                                    </div>                                    
                                </div>
                    })
                }                
            </div>
            <>
                {
                    !data.file_payment_receipt&&(
                        <>
                            {
                                console.log(total)
                            }
                            {
                                (((data2.total_amount+data2.total_extra)-totalPaid)>0)&&(
                                    <>
                                        <div className="mt-2">
                                                        <SelectField
                                                            placeholder="Método de pago"
                                                            label="Método de pago"
                                                            defaultValue={inputs.method}
                                                            setInputs={setInputs} // Actualiza el campo 'method' de 'paid'
                                                            options={dataset}
                                                            name="method"
                                                            variant="autenticación"
                                                            extra="mb-0"
                                                            id="method"
                                                        />
                                                    </div>
                                                    {
                                                        inputs.method&&(
                                                            <div className="mt-2">
                                                                <InputField
                                                                    autocomplete={"off"}
                                                                    required={true}
                                                                    prefixed={prefixed}
                                                                    name="amount"
                                                                    variant="autenticación"
                                                                    extra="mb-0"
                                                                    label={"Monto en BS" }
                                                                    placeholder={"Monto en BS"}
                                                                    id="amount"
                                                                    type="number"
                                                                    max={(data2.total_amount+data2.total_extra)-totalPaid}
                                                                    defaultValue={inputs?.amount}
                                                                    setInputs={setInputs} // Actualiza el campo 'amount' de 'paid'
                                                                />
                                                            </div>
                                                        )  
                                                    }
                                                    {
                                                        inputs.method&&(
                                                            <>
                                                                <div className=" pl-2 mt-2 flex align-middle linear mt-2 w-full rounded-xl bg-red-100 py-[12px] text-base font-medium transition duration-200">
                                                                    Cambio  Bs.{   ((data2.total_amount+data2.total_extra)-totalPaid) - inputs.amount}
                                                                </div>
                                                                <div className=" pl-2 mt-2 flex align-middle linear mt-2 w-full rounded-xl bg-brand-50 py-[12px] text-base font-medium transition duration-200">
                                                                    {current} {currentAmount}
                                                                </div>
                                                                <div className=" pl-2 mt-2 flex align-middle linear mt-2 w-full rounded-xl bg-brand-50 py-[12px] text-base font-medium transition duration-200">
                                                                    <span className='mr-2'>Comisión:</span> <b> {formatearMonto(select.valor)}%</b>                                                               
                                                                </div>
                                                                <div className=" pl-2 mt-2 flex align-middle linear mt-2 w-full rounded-xl bg-brand-50 py-[12px] text-base font-medium transition duration-200">
                                                                    <span className='mr-2'>Tipo de cambio:</span> <b> {formatearMonto(select.description)} </b>                                                                
                                                                </div>
                                                                <div className=" pl-2 mt-2 flex align-middle linear mt-2 w-full rounded-xl bg-brand-50 py-[12px] text-base font-medium transition duration-200">
                                                                    <span className='mr-2'>Total con T/C:</span> <b> {formatearMonto( parseFloat(currentAmount.toString()) * select.description)} </b>                                                               
                                                                </div>
                                                                <div className=" pl-2 mt-2 flex align-middle linear mt-2 w-full rounded-xl bg-brand-50 py-[12px] text-base font-medium transition duration-200">
                                                                    <span className='mr-2'>Total a cobrar:</span> <b> {current} {currentAmount} </b>                                                               
                                                                </div>
                                                            </>
                                                        )  
                                                    }
                                                    {
                                                        data&&data.length===0&&inputs.method&&(
                                                            <div className="mt-2">
                                                                <SelectField
                                                                    placeholder="Agregar al tour"
                                                                    label="Agregar al tour"
                                                                    defaultValue={inputs.tour_id||data2.tour_id}
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
                                                    
                                                    <div className='flex'>
                                                        {
                                                            inputs.amount > 0 && (inputs.tour_id||data2.tour_id) || data.length>0? (
                                                                <button onClick={handlePaid} className="mt-3 mr-2 flex align-middle justify-center text-center linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                                                                    Agregar Pago
                                                                </button>
                                                            ) : null
                                                        }
                                                        <Link href={document.location.origin.replace("3000","8000")+"/api/v1/bookings/"+data2.order_number} className="mt-3 flex align-middle justify-center text-center linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                                                            <FaFilePdf className='h-6 w-6'/>
                                                        </Link>
                                                    </div>
                                                    
                                    
                                    </>
                                )
                            }

                        
                        </>
                    )
                }
            </>
                        
        </Card>
    );
};

export default PaymentOperator;
