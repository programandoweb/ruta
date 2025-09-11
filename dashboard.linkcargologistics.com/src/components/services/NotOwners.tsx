import { useEffect, useState } from "react";
import Card from "../card";
import SelectField from "../fields/SelectField";
import InputField from "../fields/InputField";
import StringAndLabel from "../fields/StringAndLabel";
import { IoMdRefresh } from "react-icons/io";

interface OwnersData {
    disabled?:boolean|undefined;
    variant?:string;
    tour_service_ids:any;
    name: string;
    label?: string;
    dataset: any;
    inputs?: any;
    setInputs?: React.Dispatch<React.SetStateAction<any>>;
}

interface Property {
    id: number;
    transport_type: string;
    borrower_id: number;
    title: string;
    plate: string;
    color: string;
    model: string;
    cost_price: number;
    sale_price: number;
    bool_status_id: number | null;
    created_at: string;
    updated_at: string;
}

let values:any      =   {};

const NotOwners     =   (props: OwnersData) => {
    
    const { name, label, dataset, inputs, setInputs, tour_service_ids, variant, disabled } = props;
    const [data, setData]           =   useState<any>();
    const [select, setSelect]       =   useState<any>({});
    const [input, setInput]         =   useState<any>(false);
    const [save, setSave]           =   useState<boolean>(false);
    const [title, setTitle]         =   useState<string>("");

    const prefixed                  =   name

    useEffect(() => {
        if(dataset){
            setData(dataset);
        }        
    }, [dataset]);

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


    useEffect(() => {
        
        if (input[name]) {
            const result    =   dataset.find((search:any)=>search.value===parseInt(input[name]));
            if (    input[name] && 
                    dataset &&
                    result
                ) { 
                const insert    =   {
                    cost_price:result.cost_price,
                    sale_price:result.sale_price,                 
                }
                setInput((prevFormData:any) => ({
                    ...prevFormData,
                    ...insert
                })); 
                setTitle(result.name)                        
                setSelect(result);                    
            }else{
                setSelect({});
            }            
        }
        
    }, [input[name], dataset, name]);

    const handleSave=()=>{
        setSave(true)

        if (setInputs) {
            values    =    {...select,...input}
            setInputs((prevFormData:any) => ({
                ...prevFormData,
                [name]: values,
            }));    
        }        
    }


    if(!tour_service_ids.includes(label)){
        return <></>
    }

    return (
        
        <div>
            <Card className="p-4" variant={variant||input[name]?"brand":false}>
                {
                    !save&&(
                        <SelectField
                                    label={label}
                                    defaultValue={input[name]}
                                    setInputs={setInput}
                                    options={data}
                                    name={name}
                                    variant="autenticación"
                                    extra="mb-0"
                                    id={name}
                        />           
                    )
                }
                {
                    !disabled&&save&&(
                        <label className="font-bold text-white mb-2 text-sm text-navy-700 dark:text-white  ">
                            {title} <IoMdRefresh onClick={()=>{setSave(false)}} className="h-6 w-6 absolute right-2 top-0 cursor-pointer" />
                        </label>
                    )
                }                
                {
                    input[name]&&(
                    <div className="">
                        <div className="grid grid-cols-2 gap-2">
                            {
                                    !save?(<>
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
                                                                    defaultValue={select.cost_price}
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
                                                                    defaultValue={select.sale_price}
                                                                    setInputs={setInput}                                                                    
                                                    />
                                                </div>
                                    </>):<>
                                        <div className="col-span-2 ">
                                            <label className="font-bold mb-2 text-white text-sm text-navy-700 dark:text-white relative ">
                                                {label}
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-1">
                                                <StringAndLabel 
                                                    className="text-white" 
                                                    label={"Precio Costo"}>
                                                    {input.cost_price}
                                                </StringAndLabel>
                                            </div>
                                            <div className="mt-1">
                                                <StringAndLabel
                                                    className="text-white" 
                                                    label={"Precio Venta"}>
                                                    {input.sale_price}
                                                </StringAndLabel>
                                            </div>
                                        </div>   
                                    </>
                            }
                            
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {
                                !save&&(
                                    <div>
                                        <div onClick={handleSave} className=" cursor-pointer flex justify-center items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">Guardar</div>
                                    </div>
                                )
                            }                            
                        </div>
                    </div>        
                    )
                }                
            </Card>
        </div>
    );
};

export default NotOwners;
