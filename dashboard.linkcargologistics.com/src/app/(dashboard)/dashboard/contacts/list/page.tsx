import { type Metadata } from "next";
import ColumnsTable from "@/components/tables/ColumnsTable";
import React from "react";
const  title:string     =   "Categorías"
const   alias:string    =   'users';

export const metadata: Metadata = {
  title: 'Dashboard - '+title+' - '+process.env.NEXT_PUBLIC_NAME,
  description:String(process.env.NEXT_PUBLIC_SLOGAN)
}

const DataTablesPage = () => {
  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
        <ColumnsTable title={title} alias={alias} viewSearchFilter download/>
      </div>
    </div>
  );
};

export default DataTablesPage;
