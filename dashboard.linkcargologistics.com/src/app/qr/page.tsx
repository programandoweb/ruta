/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import { NextPage } from "next";
import CSRQR from './CSRQR'

// -------------------------------------------------------------------
// Interfaces
// -------------------------------------------------------------------

interface SEO {
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
  };
}

interface ShoppingDataset {
  exists: boolean;
  seo: SEO;
  data: any;
}

// -------------------------------------------------------------------
// Utilidades
// -------------------------------------------------------------------

const getBackendUrl = () => process.env.NEXT_PUBLIC_BACKEND_URL+(process.env.NEXT_PUBLIC_VERSION||"") || "";

// Llamada al backend
const getShoppingcartData = async (id: string, url:string): Promise<ShoppingDataset | null> => {
  try {
    const endpoint  =   url+"&format=json"||`${getBackendUrl()}/open/production-order/${id}`;

    const res       =   await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok)      return null;    
    const dataset   = await res.json();
    return dataset?.data;

  } catch {
    return null;
  }
};

const Page: NextPage<any> = async (props)=> {
  const id        =   props?.searchParams?.id  
  const url       =   props?.searchParams?.url
  //console.log(url)
  if (!id&&!url) return null;
  const dataset   =   await getShoppingcartData(id,url);
  console.log(dataset)
  return <CSRQR dataset={dataset}/>
}

export default Page