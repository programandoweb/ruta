import { type Metadata } from "next";
import React from "react";
import ColumnsTable from "@/components/tables/ColumnsTable";
const  title:string     =   "Categorías"
const   alias:string    =   'routes';

export const metadata: Metadata = {
  title: 'Dashboard - '+title+' - '+process.env.NEXT_PUBLIC_NAME,
  description:String(process.env.NEXT_PUBLIC_SLOGAN)
}

const TrackingDataTablesPage = () => {
  return  <ColumnsTable title={title} alias={alias} viewSearchFilter/>
};

export default TrackingDataTablesPage;
