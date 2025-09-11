/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve *  
 * ---------------------------------------------------
 */

'use client';

import { useEffect, useState } from "react";
import NotFoundPage404 from "@/app/not-found";
import WebComponent from "./WebComponent";
import useFormData from "@/hooks/useFormDataNew";

const prefixed = "product";

interface Property {
  id: number;
  title: string;
  price: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
}

interface WebProps {
  searchParams?: Promise<{
    src?: string;
    token?: string;
  }>;
}

const DefaultProperties: Property[] = [
  {
    id: 1,
    title: "Casa En Venta - 2 Dormitorios",
    price: "$670,000",
    type: "SINGLE FAMILY HOME",
    bedrooms: 4,
    bathrooms: 2,
    area: "1200 Sq Ft",
    image: "https://backend-fwbzb.kinsta.app/images/default/programandoweb-avatar-producto.jpg",
  },
  {
    id: 2,
    title: "Apartamento En Venta - 1 Dormitorio",
    price: "$2,500/mo",
    type: "APARTMENT",
    bedrooms: 3,
    bathrooms: 1,
    area: "2450 Sq Ft",
    image: "https://backend-fwbzb.kinsta.app/images/default/programandoweb-avatar-producto.jpg",
  },
  {
    id: 3,
    title: "Apartamento En Venta - 2 Dormitorios",
    price: "$1,900/mo",
    type: "APARTMENT",
    bedrooms: 2,
    bathrooms: 1,
    area: "2300 Sq Ft",
    image: "https://backend-fwbzb.kinsta.app/images/default/programandoweb-avatar-producto.jpg",
  },
];

const Web = (props: WebProps) => {
  const [dataset, setDataset] = useState<Property[] | null>(DefaultProperties);
  const [hasError, setHasError] = useState(false);
  const formData = useFormData(false, false, false, true);

  /*
  useEffect(() => {
    const endpoint = props.searchParams?.src
      ? `${props.searchParams.src}?token=${props.searchParams.token}`
      : `${formData.backend}${location.pathname}`;

    formData.handleRequest(endpoint)
      .then((response: any) => {
        if (response && response[prefixed]) {
          setDataset(response[prefixed]);
        } else {
          setHasError(true);
        }
      })
      .catch(() => setHasError(true));
  }, []);
  */

  useEffect(() => {
    const sendHeightToParent = () => {
      const height = document.body.scrollHeight * 1.5;
      window.parent.postMessage({ height }, "*");
    };

    sendHeightToParent();
    window.addEventListener("resize", sendHeightToParent);

    return () => {
      window.removeEventListener("resize", sendHeightToParent);
    };
  }, []);

  if (hasError) {
    return <NotFoundPage404 />;
  }

  if (!dataset) {
    return <div></div>;
  }

  return <WebComponent dataset={dataset} />;
};

export default Web;
