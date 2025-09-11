import Card from "@/components/card";
import { type Metadata } from "next";
import Link from "next/link";
import React from "react";
import { MdOutlineSettings } from "react-icons/md";

const title:string    =   "Desarrollador"
const alias:string    =   'dev';

export const metadata: Metadata = {
  title: 'Dashboard - '+title+' - '+process.env.NEXT_PUBLIC_NAME,
  description:String(process.env.NEXT_PUBLIC_SLOGAN)
}

const Developer = () => {  

  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
        <Card>
          <div className="p-4 text-center">
            <div className="flex justify-center">
              <MdOutlineSettings className="w-14 md:w-30 h-14 md:h-30 mb-5 mt-5" ></MdOutlineSettings>
            </div>
            <h3>
              Sistema bien desarrollado en Colombia, por Jorge Méndez de <Link href="https://programandoweb.net" target="_blank">programandoweb.net</Link>
            </h3>
            <div>
              Soporte técnico lic.jorgemendez@gmail.com
            </div>
            <div>
              Tecnología de desarrollo: <b>NEXTJS 14 y Laravel 11</b>
            </div>            
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Developer;
