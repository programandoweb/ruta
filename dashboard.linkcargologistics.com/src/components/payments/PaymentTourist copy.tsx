import { useState } from 'react';
import Card from "@/components/card";
import InputField from "@/components/fields/InputField";
import SelectField from "@/components/fields/SelectField";
import StringAndLabel from "@/components/fields/StringAndLabel";
import Image from "next/image";
import Link from "next/link";

// Interfaces
interface PaidState {
    amount: number;
    method: any;
    tour_id: number;
    status_order_paid_id: any; // Asegúrate de incluir este campo en PaidState si es necesario
}

interface PaymentTouristProps {
    prefixed?: string | undefined;
    paid: PaidState;
    setPaid: any;
    handlePaid: () => void;
    method: any; // Ajusta según los datos reales
    statusList: string[]; // Ajusta según los datos reales
    data: any;
}

const PaymentTourist: React.FC<PaymentTouristProps> = ({ paid, setPaid, handlePaid, method, statusList, prefixed, data }) => {
    console.log(data.file_payment_receipt)
    return (
        <>
            {data && data.file_payment_receipt&& data.file_payment_receipt!=''&& (
                <div>
                    <Card className={"w-full pb-10 p-4 h-full"}>
                        <StringAndLabel label="Comprobante de pago">
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
                                            defaultValue={paid?.amount}
                                            setInputs={setPaid}                                                                    
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <SelectField 
                                            placeholder="Método de pago"
                                            label="Método de pago"
                                            defaultValue={paid.method}
                                            setInputs={setPaid}
                                            options={method || []}
                                            name="method"
                                            variant="autenticación"
                                            extra="mb-0"
                                            id="method"
                                        /> 
                                    </div>
                                    <div className="mt-2">
                                        <SelectField 
                                            placeholder="Aprobación"
                                            label="Aprobación"
                                            defaultValue={paid.status_order_paid_id}
                                            setInputs={setPaid}
                                            options={statusList || []}
                                            name="status_order_paid_id"
                                            variant="autenticación"
                                            extra="mb-0"
                                            id="status_order_paid_id"
                                        /> 
                                    </div>
                                    {paid.amount > 0 && paid.method && (
                                        <button onClick={handlePaid} className="mt-3 flex items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                                            Aceptar comprobante  
                                        </button>
                                    )}
                                </>
                            )}
                        </StringAndLabel>
                    </Card>
                </div>
            )}
        </>
    );
};

export default PaymentTourist;
