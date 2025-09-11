import { setOpenDrawer } from "@/store/Slices/dialogMessagesSlice";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { useDispatch } from "react-redux";


interface ButtonSaleProps {
    data?: any;
}

const ButtonSale =  (props:any)  =>{
    
    const { data }:ButtonSaleProps    =   props;
    
    const dispatch  = useDispatch();
    
    const handleOpenModal=()=>{
        if(!data?.id)return;
        dispatch(setOpenDrawer({direction:"left",open:true}))        
    }   

    if(!data?.id)return;

    return  <div className="h-15">
                <div onClick={handleOpenModal} className="cursor-pointer rounded-full p-3 flex items-center linear bg-brand-500 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                    <MdOutlineAddShoppingCart className="h-7 w-7" /> 
                </div>
            </div>
}
export default ButtonSale;