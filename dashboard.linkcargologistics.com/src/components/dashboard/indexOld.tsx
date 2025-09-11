'use client'
import { FC, useEffect, useState } from 'react';
import { IoMdTrendingUp } from "react-icons/io";
import { MdBarChart } from "react-icons/md";
import { MdBlindsClosed } from "react-icons/md";
import { IoMdAlert } from "react-icons/io";
import Widget from "@/components/widget/Widget";
import { formatearMonto } from '@/utils/fuctions';
import useFormData from '@/hooks/useFormDataNew';


type Props = {};

let getInit:any;
let formData:any;


const DashboardHomePage: FC<Props> = () => {
    const [dataset, setDataset]         =   useState<any>({});
    formData = useFormData(false, false, false);

    const getInit = () => {
        formData.handleRequest(formData.backend + "/resume").then((response: any) => {
            console.log(response)
          if (response) {
            setDataset(response);
          }
        });
      };      
    
      useEffect(getInit, []);

      console.log(dataset)
 
    return (
        <>
            {/* Card widget */}
            <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3">
                <Widget
                    url="/dashboard/production-order"
                    icon={<MdBarChart className="h-7 w-7" />}
                    title={"Órdenes de producción en espera"}
                    subtitle={formatearMonto(dataset.openProductionOrdersCount||0,0)}
                />
                <Widget
                    url="/dashboard/sales"
                    icon={<MdBlindsClosed className="h-6 w-6" />}
                    title={"Ventas Abiertas"}
                    subtitle={"$"+formatearMonto(dataset.totalAmount||0)}
                />
                <Widget
                    url="/dashboard/accounts"
                    icon={<IoMdTrendingUp className="h-7 w-7" />}
                    title={"Pagos del día"}
                    subtitle={"$"+formatearMonto(parseFloat(dataset.salesOfTheDay)||0)}
                />
                <Widget
                    url="/dashboard/inventory/stock"
                    icon={<IoMdAlert className="h-7 w-7" />}
                    title={"Alerta Materia Prima"}
                    subtitle={dataset.alertProducts}
                />
                {
                    /*
                        <Widget
                            icon={<MdDoNotDisturbOnTotalSilence className="h-7 w-7" />}
                            title={"Operaciones del día"}
                            subtitle={"#"+(dataset.total_operations||0)}
                        />    
                    */
                }                
            </div>            
        </>
    );
}

export default DashboardHomePage;