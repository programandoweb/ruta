'use client';
import useFormData from '@/hooks/useFormDataNew';
import { useEffect, useState } from 'react';
import StringAndLabel from '../fields/StringAndLabel';
import Card from '../card';
import { MdTableRestaurant } from "react-icons/md";
import Image from 'next/image';
import { IoMdClose } from "react-icons/io";
import { formatearMonto } from '@/utils/fuctions';
import Counter from "@/components/counter";
import { useDispatch, useSelector } from 'react-redux';
import { setDialogMessageConfirm , setShowModal } from "@/store/Slices/dialogMessagesSlice";
import { setStore } from "@/store/Slices/storeSlice";
import InputField from "@/components/fields/InputField";
import Cookies from 'js-cookie';
import { clearData, clearDataInputs } from "@/store/Slices/dataSlice";
import { useRouter } from 'next/navigation';
import FormClient from '../formClient';
import ClientDetail from '../clients/Client';
import { setTable } from '@/store/Slices/tableSlice';



const prefixed = 'tables'; // Adjust prefix to match migration
let getInit:any;
let router:any;

const ListOfActiveTables=()=>{
    router  =   useRouter();
    const dispatch:any                        =   useDispatch();
    const { confirm }                         =   useSelector((select:any)=>select.dialog);
    const { table }                           =   useSelector((select:any)=>select);
    const [inputs, setInputs]                 =   useState({notes:"",quantity:null,username:null,password:null,opening_balance:0,closing_balance:0});
    const [tables, setTables]                 =   useState([]);
    const [waiter	, setWaiter	]               =   useState([]);
    const [cashRegisters, setCashRegisters]   =   useState([]);
    const [cashRegister, setCashRegister]     =   useState(null);
    const [closeCashRegister, setCloseCashRegister]     =   useState(false);
    const [categories, setCategories]         =   useState([]);
    const [category, setCategory]             =   useState([]);
    const [category2, setCategory2]           =   useState(null);
    const formData                            =   useFormData(false, false, false);

    getInit = () => {
        formData.handleRequest(formData.backend + "/listOfActiveTables").then((response: any) => {
            if (response && response[prefixed]) {
                // Update form inputs with fetched data if it exists under the 'raw_material' prefix
                const result = response[prefixed].find((search: any) => search.id === table.id);
                if (result && result.order && result.order.items && result.order.items.map && table.label !== '') {
                    // Create a deep copy of the table object
                    const tableNew:any  =   {...table}
                    if(!tableNew.order){
                      tableNew.order    =   {
                        items:[]
                      }    
                    }
                    const tableCopy = JSON.parse(JSON.stringify(tableNew));
                    tableCopy.order = result.order;
                    dispatch(setTable(tableCopy));
                    //console.log(tableCopy.order.items, result.order.items)
                }
                setTables(response[prefixed]);
            }
            if (response && response.categories) {
                setCategories(response.categories);
            }

            if (response && response.totalization) {
              dispatch(setStore(response.totalization));
            }  
            
            if (response && response.cash_register) {
              setCashRegisters(response.cash_register)
            }
            
            if (response && response.waiter) {
              setWaiter(response.waiter)
            }
        });
    };
  

    useEffect(getInit,[])

    const handleAdd=(row:any)=>{
      formData.handleRequest(formData.backend + "/listOfActiveTables","post",{...row,table_id:table.id}).then((response: any) => {
        const table_  =   {...table}
        table_.order  =   response.order;
        dispatch(setTable(table_));        
        getInit()
      });
    }

    //console.log(table)

    let total=0;

    const handleCloseAccount=()=>{      
      dispatch(setDialogMessageConfirm({label:"¿Estás seguro de cerrar esta cuenta?",action:"print"}))
      dispatch(setShowModal(true))  
    }

    const handleCloseAccountConfirm=()=>{      
      if(confirm==="close"){
        formData.handleRequest(formData.backend + "/closeCashRegister","post",{notes:inputs.notes,email:inputs.username,password:inputs.password,opening_balance:inputs.opening_balance,closing_balance:inputs.closing_balance}).then((response: any) => {
          localStorage.removeItem('user');
          Cookies.remove('token');
          dispatch(setDialogMessageConfirm(null))
          dispatch(clearDataInputs());
          dispatch(clearData());          
          setTimeout(() => {
            router.replace(`/auth`);
          }, 1000);
          
        })           
      }else if(confirm==="print"){
        formData.handleRequest(formData.backend + "/closeAccount","post",{table_id:table.id}).then((response: any) => {
          getInit()
          dispatch(setTable({order:{items:[],client_id:null,order_number:null},label:"",id:"",cuenta:{}}));
          const printWindow:any = window.open(document.location.href.replace("3000","8000")+"/cash-register/income/"+response.id, '_blank');
          printWindow.addEventListener('load', () => {
            printWindow.print();
          });
          dispatch(setDialogMessageConfirm(null))
        });      
      }      
    }

    useEffect(handleCloseAccountConfirm,[confirm])

    const handleDispatch=(data:any,values:any)=>{
      const splits  =   data.split("____")
      formData.handleRequest(formData.backend + "/updateCount","post",{table_id:table.id,[splits[0]]:values,store_order_items_id:splits[1]}).then((response: any) => {
        if (response && response[prefixed]) {
          // Update form inputs with fetched data if it exists under the 'raw_material' prefix
          const result = response[prefixed].find((search: any) => search.id === table.id);
          if (result && result.order && result.order.items && result.order.items.map && table.label !== '') {
              // Create a deep copy of the table object
              const tableNew:any  =   {...table}
              if(!tableNew.order){
                tableNew.order    =   {
                  items:[]
                }    
              }
              const tableCopy = JSON.parse(JSON.stringify(tableNew));
              tableCopy.order.items = result.order.items;
              dispatch(setTable(tableCopy));
              //console.log(tableCopy.order.items, result.order.items)
          }
          setTables(response[prefixed]);
        }        

        if (response && response.totalization) {
          dispatch(setStore(response.totalization));
        }  

      });      
    }

    const handleOpenCashRegister=(row:any)=>{
      formData.handleRequest(formData.backend + "/openCashRegister","post",{cash_register_id:row.id,email:inputs.username,password:inputs.password,opening_balance:inputs.opening_balance,closing_balance:inputs.closing_balance}).then((response: any) => {
        setCashRegisters([]);
        setCashRegister(null);
        getInit();        
      })      
    }

    const handleAutorization=()=>{
      if(inputs.username&&inputs.password)handleOpenCashRegister(cashRegister)
    }

    const handleCloseCashRegister=()=>{
      dispatch(setDialogMessageConfirm({label:"¿Estás seguro de cerrar esta caja?",action:"close"}))
      dispatch(setShowModal(true))
      //if(inputs.username&&inputs.password)handleOpenCashRegister(cashRegister)       
    }

    if(closeCashRegister){
      return    <div className='mt-8'>
                  <StringAndLabel label='Autorización apertura de caja'>
                    <Card className='p-4'>
                      <div className="grid grid-cols-1 xl:grid-cols-5 gap-2 uppercase mt-4"> 
                        <InputField
                                      id="closing_balance"
                                      name="closing_balance"
                                      required={true}
                                      prefixed={prefixed}
                                      variant="autenticación"
                                      extra="mb-0"
                                      label={"Monto de cierre"}
                                      placeholder={"Monto de cierre"}                                    
                                      type="number"
                                      defaultValue={inputs?.closing_balance}
                                      setInputs={setInputs}                                                                    
                        />
                        <InputField
                                      id="notes"
                                      name="notes"
                                      prefixed={prefixed}
                                      variant="autenticación"
                                      extra="mb-0"
                                      label={"Observaciones"}
                                      placeholder={"Observaciones"}                                    
                                      type="text"
                                      defaultValue={inputs?.notes}
                                      setInputs={setInputs}                                                                    
                        />
                        <InputField
                                      id="username"
                                      name="username"
                                      required={true}
                                      prefixed={prefixed}
                                      variant="autenticación"
                                      extra="mb-0"
                                      label={"Nombre de usuario"}
                                      placeholder={"Nombre de usuario"}                                    
                                      type="text"
                                      defaultValue={inputs?.username}
                                      setInputs={setInputs}                                                                    
                        />
                        <InputField
                                      id="password"
                                      name="password"
                                      required={true}
                                      prefixed={prefixed}
                                      variant="autenticación"
                                      extra="mb-0"
                                      label={"Contraseña"}
                                      placeholder={"Contraseña"}                                    
                                      type="password"
                                      defaultValue={inputs?.password}
                                      setInputs={setInputs}                                                                    
                        />
                        <div className='pt-2'>
                          <button onClick={handleCloseCashRegister} className='flex items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200'>
                                Autorizar Cierre
                          </button>                      
                          <button onClick={()=>setCloseCashRegister(false)} className='mt-2 flex items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200'>
                                Volver pantalla anterior
                          </button>
                        </div>
                      </div>
                    </Card>
                  </StringAndLabel>
                </div>  
    }

    if(cashRegister){
      return    <div className='mt-8'>
                  <StringAndLabel label='Autorización apertura de caja'>
                    <Card className='p-4'>
                      <div className="grid grid-cols-1 xl:grid-cols-5 gap-2 uppercase mt-4"> 
                        <InputField
                                      id="opening_balance"
                                      name="opening_balance"
                                      required={true}
                                      prefixed={prefixed}
                                      variant="autenticación"
                                      extra="mb-0"
                                      label={"Monto de apertura"}
                                      placeholder={"Monto de apertura"}                                    
                                      type="number"
                                      defaultValue={inputs?.opening_balance}
                                      setInputs={setInputs}                                                                    
                        />
                        <InputField
                                      id="notes"
                                      name="notes"
                                      prefixed={prefixed}
                                      variant="autenticación"
                                      extra="mb-0"
                                      label={"Observaciones"}
                                      placeholder={"Observaciones"}                                    
                                      type="text"
                                      defaultValue={inputs?.notes}
                                      setInputs={setInputs}                                                                    
                        />
                        <InputField
                                      id="username"
                                      name="username"
                                      required={true}
                                      prefixed={prefixed}
                                      variant="autenticación"
                                      extra="mb-0"
                                      label={"Nombre de usuario"}
                                      placeholder={"Nombre de usuario"}                                    
                                      type="text"
                                      defaultValue={inputs?.username}
                                      setInputs={setInputs}                                                                    
                        />
                        <InputField
                                      id="password"
                                      name="password"
                                      required={true}
                                      prefixed={prefixed}
                                      variant="autenticación"
                                      extra="mb-0"
                                      label={"Contraseña"}
                                      placeholder={"Contraseña"}                                    
                                      type="password"
                                      defaultValue={inputs?.password}
                                      setInputs={setInputs}                                                                    
                        />
                        <div className='pt-8'>
                          <button onClick={handleAutorization} className='flex items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200'>
                                Autorizar Apertura
                          </button>                      
                        </div>
                      </div>
                    </Card>
                  </StringAndLabel>
                </div> 
    }

    if(cashRegisters.length>0){
      return  <div className='mt-8'>
                <StringAndLabel label='Cajas disponible'>
                    <div className={table.label!==''?"grid grid-cols-6 gap-2 uppercase mt-2":"grid grid-cols-1 gap-2 uppercase mt-2"}>
                      <div className={table.label!==''?'col-span-6':''}>
                        <div className="grid grid-cols-1 xl:grid-cols-8 gap-2 uppercase">
                          {
                            cashRegisters&&cashRegisters.map((row:any,key)=>{
                              return    <div key={key} onClick={()=>{setCashRegister(row)}}>
                                          <Card className='py-6 text-center cursor-pointer' variant={row.cuenta?"purple":undefined}>
                                            <div className='flex justify-center'>
                                              <MdTableRestaurant  className='h-6 w-6'/>
                                            </div>                                      
                                            {row.label}
                                          </Card>                                    
                                        </div>
                            })
                          }
                        </div>
                      </div>
                    </div>
                </StringAndLabel>                
              </div>
    }

    return    <div className='mt-8'>
                <StringAndLabel label='Mesas'>
                  <div className={table.label!==''?"grid grid-cols-6 gap-2 uppercase mt-2":"grid grid-cols-1 gap-2 uppercase mt-2"}>
                    <div className={table.label!==''?'col-span-6':''}>
                      <div className="grid grid-cols-1 xl:grid-cols-8 gap-2 uppercase">
                        {
                          table.label===''&&tables.map((row:any,key)=>{
                            return    <div key={key} onClick={()=>{dispatch(setTable(row))}}>
                                        <Card className='py-6 text-center cursor-pointer' variant={row.cuenta?"purple":undefined}>
                                          <div className='flex justify-center'>
                                            <MdTableRestaurant  className='h-6 w-6'/>
                                          </div>                                      
                                          {row.label}
                                        </Card>                                    
                                      </div>
                          })
                        }
                        <div onClick={()=>setCloseCashRegister(true)} className=' cursor-pointer flex justify-center items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200'>
                            <div className='text-white text-center w-[200px]'>Cierre de Caja</div>
                        </div>
                        {
                          table.label!==''&&category.length===0&&
                          categories.map((row:any,key)=>{
                            return  <div key={key} className='text-center cursor-pointer' onClick={()=>{setCategory(row.products); setCategory2(row.name)}}>
                                      <Card  className='py-6 px-6'>
                                        {
                                          row.name
                                        }
                                      </Card>
                                    </div>
                          })
                        }
                        {
                          table.label!==''&&category.length>0&&(
                            <div className='col-span-8 text-right' onClick={()=>{setCategory([]); setCategory2(null)}}>
                              <div className='flex items-center cursor-pointer'>
                                <IoMdClose  className='h-8 w-8'/> {category2}
                              </div>
                            </div>
                          )
                        }
                        {
                          table.label!==''&&category.length>0&&
                          category.map((row:any,key)=>{
                            return  <div key={key} className='text-center cursor-pointer' onClick={()=>handleAdd(row)}>
                                      <Card  className='p-2'>                                        
                                        <Image src={row.image} width={400} height={400} alt="Programandoweb"/>
                                        {
                                          row.name
                                        }
                                      </Card>
                                    </div>
                          })
                        }
                      </div>
                    </div>
                    {
                      table.label!==''&&(
                        <div className='col-span-6'>
                          <Card className='py-6 px-6 ' >
                            <div className='mb-8'>
                              <StringAndLabel label={'Datos de Facturación: ' +table?.order?.order_number}>
                                {
                                  table?.order?.client_id?<ClientDetail setTable={dispatch(setTable)} table={table.order}/>:<FormClient setTable={dispatch(setTable)} table={table} waiter={waiter}/>
                                }                                
                              </StringAndLabel>
                            </div>
                            <b className='text-lg'>{table.label}</b>                            
                            <div className='mt-2 mb-2'>
                              <div className="grid grid-cols-1 uppercase">
                                <table className='w-full'>
                                  <thead>
                                    <tr>
                                      <th className='text-left'>Producto</th>
                                      <th className='text-center w-[220px]'>Cantidad</th>
                                      <th className='text-right w-[120px]'>Total</th>                                      
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {
                                    table&&
                                    table.order&&
                                    table.order.items&&
                                    table.order.items.map((row:any,key:number)=>{
                                      total +=  parseFloat(row.amount) * parseInt(row.quantity)
                                      return  <tr key={key}>
                                                <td className='text-left'>
                                                  {
                                                    row.product.name
                                                  }
                                                </td>    
                                                <td className='text-center'>
                                                  <Counter                                    
                                                    min={0}
                                                    max={1000000}
                                                    name={"quantity____"+row.id}
                                                    defaultValue={inputs.quantity||row.quantity}
                                                    setValue={setInputs}
                                                    handleDispatch={handleDispatch}
                                                  />                                                  
                                                </td>    
                                                <td className='text-right'>
                                                  { formatearMonto(parseFloat(row.amount) * parseInt(inputs.quantity||row.quantity)) }
                                                </td>        
                                              </tr>
                                    })                                  
                                  }
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <td></td>
                                      <td className='text-right'>Total</td>
                                      <td className='text-right'>
                                        <b>{formatearMonto(total)}</b>
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                            <div className='flex'>
                              <div onClick={()=>dispatch(setTable({order:{items:[],client_id:null,order_number:null},label:"",id:"",cuenta:{}}))} className='cursor-pointer flex justify-center items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200'>Volver al menú principal</div>                             
                              {
                                /**
                                 * Queda pendiente 
                                 * Ocultar este botón si el cliente no ha sido cargado los datos de facturación
                                 * <div onClick={handleCloseAccount} className='cursor-pointer flex justify-center items-center mr-2 px-5 linear rounded-xl bg-navy-800 py-1 text-base font-medium text-white transition duration-200 hover:bg-navy-900 active:bg-navy-800 dark:bg-navy-800 dark:text-white dark:hover:bg-navy-300 dark:active:bg-navy-200'>Cerrar Cuenta</div>                             
                                 * */  
                              }
                            </div>
                            
                          </Card>
                        </div>
                      )
                    }
                  </div>
                  
                </StringAndLabel>
              </div>
}
export default ListOfActiveTables;