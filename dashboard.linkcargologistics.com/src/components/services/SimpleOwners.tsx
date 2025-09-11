import { useEffect, useState } from "react";
import Card from "../card";
import InputField from "../fields/InputField";
import StringAndLabel from "../fields/StringAndLabel";
import { IoMdRefresh } from "react-icons/io";

interface Owner {
    borrower: any;
    data: any;
}

interface OwnersData {
    disabled?:boolean|undefined;
    tour_service_ids:any;
    name: string;
    label?: string;
    dataset: Owner;
    inputs?: any;
    setInputs?: React.Dispatch<React.SetStateAction<any>>;
}


const SimpleOwners    =   (props: OwnersData) => {
    
    const { name, label, dataset, inputs, setInputs, tour_service_ids, disabled } = props;
    const [input, setInput]         =   useState<any>(false);
    const [save, setSave]           =   useState<boolean>(false);
    const prefixed                  =   name

    useEffect(() => {                
        setInput(inputs[name]?inputs[name]:dataset)
    }, []);

    useEffect(() => {

        if(tour_service_ids.includes(label)&&setInputs){
            setInputs((prevFormData:any) => ({
                ...prevFormData,
                [name]: null,
            }));
        } 
        
    }, []);

    useEffect(() => {
        
        if(inputs.items){
            const result    =   inputs.items.find((search:any)=>{return search.item_type===name})
            if(!result)return;
            const insert    =   {
                cost_price:result.cost_price,
                sale_price:result.sale_price,
                [name]:result.service_id,
                label:result.item_type,
                owner_id:result.owner_id
            }
            setSave(true);
            setInput(insert)               
        }
    }, [inputs.items]);

    const handleSave=()=>{
        setSave(true)
        if (setInputs) {
            setInputs((prevFormData:any) => ({
                ...prevFormData,
                [name]: input,
            }));    
        }        
    }



    if(!tour_service_ids.includes(label)){
        return <></>
    }
    

    return (
        <div>
            <Card className="p-4" >
                <label className="font-bold mb-2 text-sm text-navy-700 dark:text-white relative ">
                    {label} {!disabled&&save&&(<><IoMdRefresh onClick={()=>{setSave(false)}} className="h-6 w-6 absolute right-2 top-0 cursor-pointer" /></>)}
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {
                        !save&&(
                            <>
                                <div className="mt-1">                                        
                                    <InputField
                                                    required={true}
                                                    prefixed={prefixed}
                                                    name="cost_price"
                                                    variant="autenticación"
                                                    extra="mb-0"
                                                    label="Precio Costo"
                                                    placeholder={"Precio Costo"}
                                                    id="cost_price"
                                                    type="number"
                                                    defaultValue={input?.cost_price}
                                                    setInputs={setInput}                                                                    
                                    />
                                </div>
                                <div className="mt-1">
                                    <InputField
                                                    required={true}
                                                    prefixed={prefixed}
                                                    name="sale_price"
                                                    variant="autenticación"
                                                    extra="mb-0"
                                                    label="Precio Venta"
                                                    placeholder={"Precio Venta"}
                                                    id="sale_price"
                                                    type="number"
                                                    defaultValue={input?.sale_price}
                                                    setInputs={setInput}                                                                    
                                    />
                                </div>
                            </>
                        )
                    }

                    {
                        save&&(
                            <>
                                <div className="mt-1">
                                    <StringAndLabel 
                                        className="text-brand-500" 
                                        label={"Precio Costo"}>
                                        {input?.cost_price}
                                    </StringAndLabel>
                                </div>
                                <div className="mt-1">
                                    <StringAndLabel
                                        className="text-brand-500" 
                                        label={"Precio Venta"}>
                                        {input?.sale_price}
                                    </StringAndLabel>
                                </div>
                            </>
                        )
                    }
                    
                </div>
                {
                    !save&&(
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                                <div onClick={handleSave} className=" cursor-pointer flex justify-center items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">Guardar</div>
                            </div>
                        </div> 
                    )
                }                            
            </Card>
        </div>
    );
};

export default SimpleOwners;
