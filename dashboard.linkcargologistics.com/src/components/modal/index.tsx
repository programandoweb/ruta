'use client'
import React, { useEffect} from 'react';
import ReactModal from 'react-modal';
import './index.css';
import { useSelector, useDispatch } from 'react-redux';
import {setShowModal , setOpenSC, setAcceptModal, setDialogMessageConfirm} from '@/store/Slices/dialogMessagesSlice';
import ThemeProvider from '@/providers/ThemeProvider';
import Cart from '@/components/shoppincart/Cart';
import Logo from '@/components/logo';
import useFormDataNew from "@/hooks/useFormDataNew";



let dispatch:any;

const customStyles = {
  content: {
    outline: 'none',
    /* Si deseas agregar un estilo personalizado, puedes hacerlo aquí */
    /* outline: '2px solid red', */
  },
};

const ListArray: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
};

const ListObject: React.FC<{ data: Record<string, any> }> = ({ data }) => {
  
  if(Object.entries(data)&&Object.entries(data).length===0)return<></>;
  return (
    <ul >
      {Object.entries(data).map(([key, value]) => (
        <li key={key}>
          <span>{key}: </span>
          <span><b>{value}</b></span>
        </li>
      ))}
    </ul>
  );
};

const Modal: React.FC = () => {
  dispatch    =   useDispatch();
  const {open, message, list, accept, openSC , size, title, confirm }  =   useSelector((select:any)=>select.dialog)||{};
  const { handleRequest , backend , search}   =   useFormDataNew(false, false, false);    
  
  useEffect(() => {
    
    const element = document.getElementById('__next');
    if (element) {
      ReactModal.setAppElement(element);
    } 

  }, []);

  const handleCloseModal = () => {
    dispatch(setShowModal(false));
    dispatch(setOpenSC(null));    
  };

  const handleConfirm=()=>{
    dispatch(setShowModal(false));
    dispatch(setDialogMessageConfirm(confirm.action))
  }

  const handleDelete=()=>{
    handleCloseModal();
    dispatch(setAcceptModal(null))
    handleRequest( backend + document.location.pathname+"/"+accept.id+ search, "delete" ).then(response=>{
      handleCloseModal();
    });
  }

  const className = "container-modal " + (  typeof size==='string'?size:" ")

  return (
            <ThemeProvider>
              <div>
                <ReactModal
                  style={customStyles}
                  isOpen={open?true:false}
                  onRequestClose={handleCloseModal}
                  shouldCloseOnOverlayClick={true}
                  className={className}
                  overlayClassName="overlay"
                  contentLabel="Example Modal"
                >
                  <div className='content'>
                    <div className='content-component'>
                      <div className='text-center flex justify-center items-center mb-3'>
                        <Logo/>                        
                      </div>                      
                      {
                        title!==''&&(
                          <div>
                            <div dangerouslySetInnerHTML={{ __html: title }} />                        
                          </div>
                        )
                      } 
                      {
                        confirm&&(
                          <div>
                            <div dangerouslySetInnerHTML={{ __html: confirm.label }} />                        
                          </div>
                        )
                      } 
                      {
                        message!==''&&(
                          <div>
                            <div dangerouslySetInnerHTML={{ __html: message }} />                        
                          </div>
                        )
                      }                      
                      {
                        openSC&&<Cart/>
                      }
                      {list && Array.isArray(list) && <ListArray data={list} />}
                      { 
                        list && 
                        typeof list === "object" && 
                        Object.entries(list)&&
                        Object.entries(list).length>0&&
                        <ListObject data={list} />
                      }
                      
                    </div>
                    <div className=' text-base bottom'>
                      {
                        accept&&(
                          <button type='button' className='mr-2 rounded-xl bg-brand-500 py-[0.5rem] px-[1rem] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200' onClick={handleDelete}>
                            Aceptar
                          </button>
                        )
                      }
                      {
                        confirm&&(
                          <button type='button' className='mr-2 rounded-xl bg-brand-500 py-[0.5rem] px-[1rem] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200' onClick={handleConfirm}>
                            Si estoy seguro
                          </button>
                        )
                      }
                      <button type='button' className='rounded-xl bg-gray-500 py-[0.5rem] px-[1rem] text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-600 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 dark:active:bg-gray-600' onClick={handleCloseModal}>Cancelar</button>
                    </div>
                  </div>
                </ReactModal>
              </div>
            </ThemeProvider>
  );
};

export default Modal;
