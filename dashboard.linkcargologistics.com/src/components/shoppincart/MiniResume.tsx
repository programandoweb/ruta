'use client'
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setValue, setDescribe, setTotal, setPrice, setSubTotal } from '@/store/Slices/shoppingCartSlice';
import Card from '../card';
import { formatearMonto } from '@/utils/fuctions';

let dispatch:any;
const prefixed:string   = 'tour';

const MiniResume=()=>{
    dispatch                    =   useDispatch();
    const formInputs            =   useSelector((state: any) => state.shoppingCart.items);
    const data:any              =   useSelector((state: any) => state.shoppingCart.describe);
    const total:number          =   useSelector((state: any) => state.shoppingCart.total);
    const subtotal:number       =   useSelector((state: any) => state.shoppingCart.subtotal);
    const price:number          =   useSelector((state: any) => state.shoppingCart.price);

    const [tickets,setTickets]          =   useState([]);
    const [hotels,setHotels]            =   useState([]);
    const [services,setServices]        =   useState([]);
    const [accesories,setAccesories]    =   useState([]);
    

    const setPrecioHere=(price:number)=>{
        dispatch(setPrice(price))
    }

    useEffect(()=>{
        const getStorage = localStorage.getItem(prefixed);
        if (getStorage) {
            const parsedState   =   JSON.parse(getStorage);
            dispatch(setValue(parsedState))            
        }
        const getStorage2 = localStorage.getItem("tour_data");
        if (getStorage2) {
            const parsedState   =   JSON.parse(getStorage2);
            setPrecioHere(parseFloat(parsedState.unit_price))
            dispatch(setDescribe(parsedState))            
        }                
    },[])

    
    useEffect(()=>{
        let unit_price  =   parseFloat(formInputs.peoples||1) * price;
        if(formInputs&&formInputs.is_private&&data.total_price){
            unit_price  =   parseFloat(data.total_price);
        }else{
            unit_price  =   parseFloat(formInputs.peoples||1) * parseFloat(data.unit_price);
        }
        setPrecioHere(unit_price)
    },[data,formInputs])

    
    useEffect(()=>{
        dispatch(setSubTotal(price))
        //console.log(formInputs.peoples)
    },[formInputs,price])

    useEffect(()=>{
        /*
        if(formInputs&&formInputs.nationality&&formInputs.nationality==='Bolivia'){

        }else{

        }
        */
        const getStorage = localStorage.getItem(prefixed);
        if (getStorage) {
            let tickets_:any  =   [];
            let sum_total:number  =   0;
            const parsedState   =   JSON.parse(getStorage);
            if(parsedState&&parsedState.tickets){
                //const labels   =   parsedState;
                Object.entries(parsedState.tickets).map((row:any,key:number)=>{
                    if(row[1]===141){
                        tickets_.push({price:parsedState.tickets__values[row[0]],label:parsedState.tickets__labels[row[0]]})
                        sum_total+=parseFloat(parsedState.tickets__values[row[0]]);
                    }                                        
                })                
            }   
            
            let hotels_:any  =   [];            
            if(parsedState&&parsedState.hotels){
                Object.entries(parsedState.hotels).map((row:any,key:number)=>{
                    if(row[1]===141&&row[0].split("_").length>2){
                        hotels_.push({price:parsedState.hotels__values[row[0]],label:parsedState.hotels__labels[row[0]]})
                        sum_total+=parseFloat(parsedState.hotels__values[row[0]]);
                    }                                        
                })                
            }   

            let accesories_:any  =   [];            
            if(parsedState&&parsedState.accesories){
                Object.entries(parsedState.accesories).map((row:any,key:number)=>{
                    if(row[1]===141){
                        accesories_.push({price:parsedState.accesories__values[row[0]],label:parsedState.accesories__labels[row[0]]})
                        sum_total+=parseFloat(parsedState.accesories__values[row[0]])||0;
                    }                                        
                })                
            }   

            let services_:any  =   [];            
            if(parsedState&&parsedState.services){
                Object.entries(parsedState.services).map((row:any,key:number)=>{
                    if(row[1]===141){
                        services_.push({price:parsedState.services__values[row[0]],label:parsedState.services__labels[row[0]]})
                        sum_total+=parseFloat(parsedState.services__values[row[0]])||0;
                    }                                        
                })                
            }   

            //console.log(parsedState)
            
            dispatch(setSubTotal(price+sum_total))
            setTickets(tickets_)
            setHotels(hotels_)
            setAccesories(accesories_)
            setServices(services_)

        }
        
    },[formInputs,price])
   
    /*
        if(!formInputs.order_number){
            return  <div></div>
        }
    */
    
    return      <div>
                    <div className='w-[100%]'>
                        <Card>
                            <div className='py-3 px-6'>
                                <div className='mt-2 text-lg md:text-3xl text-center'>
                                    <b>{formInputs.order_number}</b>
                                </div>
                                <div className='mt-2 grid grid-cols-2'>
                                    <div>
                                        Precio {formInputs.is_private?"":"/ persona"}  
                                    </div>
                                    <div className='text-right'>
                                        <b>{formInputs.is_private?formatearMonto(price):formatearMonto(parseFloat(data.unit_price||0))} </b> 
                                    </div>                                 
                                </div>                            
                                
                                <div className='mt-2 grid grid-cols-2'>
                                    <div>
                                        {formInputs.peoples||1} persona{formInputs&&formInputs.peoples&&parseInt(formInputs.peoples)>1?"s":""}
                                    </div>
                                    {
                                        formInputs.is_private?"":<div className='text-right'>
                                            <b>{formatearMonto(parseFloat(formInputs.peoples||1) * parseFloat(data.unit_price||0))} </b>
                                        </div>                                 
                                    }                                  
                                </div> 
                                {
                                    tickets&&
                                    tickets.map&&
                                    tickets.length>0&&(
                                        <div className='mt-2'>
                                            <div className="bg-gray-100 p-2">
                                                <b>Tickets</b>
                                            </div>                                        
                                            <div>
                                                {
                                                    tickets.map((row:any,key:number)=>{
                                                        return  <div className='mt-2 grid grid-cols-3' key={key}>
                                                                    <div className='col-span-2'>
                                                                        {row.label}
                                                                    </div>        
                                                                    <div className='text-right'>
                                                                        <b>{formatearMonto(row.price)}</b>
                                                                    </div>
                                                                </div>
                                                    })
                                                }
                                                
                                                
                                            </div>                                        
                                        </div> 
                                    )
                                }


                                {
                                    hotels&&
                                    hotels.map&&
                                    hotels.length>0&&(
                                        <div className='mt-2'>
                                            <div className="bg-gray-100 p-2">
                                                <b>Hoteles</b>
                                            </div>                                        
                                            <div>
                                                {
                                                    hotels.map((row:any,key:number)=>{
                                                        return  <div className='mt-2 grid grid-cols-3' key={key}>
                                                                    <div className='col-span-2'>
                                                                        {row.label}
                                                                    </div>        
                                                                    <div className='text-right'>
                                                                        <b>{formatearMonto(row.price)}</b>
                                                                    </div>
                                                                </div>
                                                    })
                                                }
                                                
                                                
                                            </div>                                        
                                        </div> 
                                    )
                                }


                                {
                                    accesories&&
                                    accesories.map&&
                                    accesories.length>0&&(
                                        <div className='mt-2'>
                                            <div className="bg-gray-100 p-2">
                                                <b>Accesorios</b>
                                            </div>                                        
                                            <div>
                                                {
                                                    accesories.map((row:any,key:number)=>{
                                                        return  <div className='mt-2 grid grid-cols-3' key={key}>
                                                                    <div className='col-span-2'>
                                                                        {row.label}
                                                                    </div>        
                                                                    <div className='text-right'>
                                                                        <b>{formatearMonto(row.price)}</b>
                                                                    </div>
                                                                </div>
                                                    })
                                                }
                                                
                                                
                                            </div>                                        
                                        </div> 
                                    )
                                }

                                {
                                    services&&
                                    services.map&&
                                    services.length>0&&(
                                        <div className='mt-2'>
                                            <div className="bg-gray-100 p-2">
                                                <b>Servicios</b>
                                            </div>                                        
                                            <div>
                                                {
                                                    services.map((row:any,key:number)=>{
                                                        return  <div className='mt-2 grid grid-cols-3' key={key}>
                                                                    <div className='col-span-2'>
                                                                        {row.label}
                                                                    </div>        
                                                                    <div className='text-right'>
                                                                        <b>{formatearMonto(row.price)}</b>
                                                                    </div>
                                                                </div>
                                                    })
                                                }
                                                
                                                
                                            </div>                                        
                                        </div> 
                                    )
                                }
                                

                                <div className='mt-10 border-t-2 border-gray-100 pt-1 text-right'>
                                    <div>
                                        Subtotal: <b>{formatearMonto(subtotal)} </b>
                                    </div>
                                    {
                                        /**
                                            <div>
                                                Subtotal: <b>{formatearMonto(price)} </b>
                                            </div>      
                                        
                                        */
                                    }
                                    
                                </div>
                            </div>                        
                        </Card>
                    </div>
                </div> 
}
export default MiniResume;