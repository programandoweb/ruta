import { type Metadata } from "next";


import React from "react";
import VentasMesas from "@/components/menu/VentasMesas";
const  title:string     =   "Categorías"


export const metadata: Metadata = {
  title: 'Dashboard - '+title+' - '+process.env.NEXT_PUBLIC_NAME,
  description:String(process.env.NEXT_PUBLIC_SLOGAN)
}

const DataTablesPage = () => {
  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
        <VentasMesas/>
      </div>
    </div>
  );
};

export default DataTablesPage;
