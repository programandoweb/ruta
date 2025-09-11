import { MdArrowBackIos } from "react-icons/md";
import { MdDataSaverOff } from "react-icons/md";
import { MdPrint } from "react-icons/md";
import { useRouter } from 'next/navigation';

type Props = {
    back?:boolean|undefined;
    save?:boolean|undefined;
    print?:boolean|undefined;    
  };

const BtnBack=(props: Props)=>{
    
    const router = useRouter()

    const { back, save , print } = props;
    
    const handleHistoryBack=(e:any)=>{
        e.preventDefault();
        //console.log(window.history)
        router.back()
    }
    return (
        <div className="w-full h-full text-end flex justify-end">
            {
                back&&(
                    <button onClick={handleHistoryBack} className="flex items-center mr-2 px-5 linear rounded-xl bg-gray-400 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                        <MdArrowBackIos className="mr-1" /> Volver atrás
                    </button>
                )
            }
            {
                save&&(
                    <button
                        type="submit"
                        className="flex items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                    >
                        <MdDataSaverOff className="mr-1" /> Guardar
                    </button>
                )
            }
            {
                print&&(
                    <button
                        className="flex items-center px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                    >
                        <MdPrint className="mr-1" /> Imprimir
                    </button>
                )
            }
          
        </div>
      );
      
}
export default BtnBack;