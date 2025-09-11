// hooks/useModalState.tsx
import { useState } from 'react';
import ReactModal from 'react-modal';
import Logo from '@/components/logo';
import { IoMdClose } from "react-icons/io";
import { MdOutlineSave } from "react-icons/md";

const useModalState             =   () => {
  const [open, setOpen]         =   useState(false);  
  
  const openModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);  
  };

  const size    =   "  ";

  return { size, open, openModal, handleCloseModal };
};

export default useModalState;


const customStyles = {
    content: {
      outline: 'none',
      /* Si deseas agregar un estilo personalizado, puedes hacerlo aquí */
      /* outline: '2px solid red', */
    },
};

// Define la interfaz para las props del componente
interface ModalHookProps {
    open: boolean;
    handleCloseModal: () => void;
    size?: string;
    component?: any;
}

export const ModalHook: React.FC<ModalHookProps> = ({ size, open, handleCloseModal , component}) => {
    const className = "container-modal " + (  typeof size==='string'?size:" ") 
    return <ReactModal  style={customStyles}
                        isOpen={open?true:false}
                        onRequestClose={handleCloseModal}
                        shouldCloseOnOverlayClick={true}
                        overlayClassName="overlay"
                        contentLabel="Example Modal"
                    >
                        <div className='h-[85vh] overflow-hidden'>
                            <div className='h-[10vh] relative'>
                                <div className="absolute right-3 top-3 w-10 flex">
                                  {
                                    /*<MdOutlineSave title="Guardar" className='h-8 w-8 cursor-pointer' onClick={handleCloseModal}/>*/                                    
                                  }
                                  
                                  <IoMdClose title="Cerrar" className='h-8 w-8 cursor-pointer' onClick={handleCloseModal}/>
                                </div>
                                <div className='text-center flex justify-center items-center mb-3'>
                                    <Logo/>                        
                                </div>                                                  
                                <div className='h-[90vh] overflow-auto'>
                                    {component}
                                </div>                                
                            </div>                            
                        </div>
                    </ReactModal>
}
