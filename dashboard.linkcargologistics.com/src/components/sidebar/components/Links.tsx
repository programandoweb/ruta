'use client';
import React, { MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import DashIcon from "@/components/icons/DashIcon";
import { MdKeyboardArrowDown } from "react-icons/md";
import routes from "@/data/routes";
import useAsyncStorage from "@/hooks/useAsyncStorage";

type Props = {
  onClickRoute?: (e: MouseEvent<HTMLElement>) => any | any;
}

export function SidebarLinks({ onClickRoute }: Props) {
  const [user, setUser] = useState<any>(null);
  const storage           =   useAsyncStorage("user"); // Asegúrate de pasar la clave aquí

  useEffect(() => {
    const fetchUser = async () => {
      const userStorage   =   await storage.getData("user"); // Obtener los datos
      setUser(userStorage); // Actualizar el estado con los datos
    };

    fetchUser();
  }, []);

  const pathname = usePathname();
  const activeRoute = (routeName: string) => {
    return pathname?.includes(routeName);
  };

  const [showSublinks, setShowSublinks] = useState<number | null>(null);

  const handleToggleSublinks = (index: number) => {
    setShowSublinks(showSublinks === index ? null : index);
  };

  const createLinks = (routes: any) => {
    return routes.map((route: any, index: number) => {

      //if (route.layout === "/dashboard" || route.layout === "/auth" || route.layout === "/rtl") {
      if (route.layout === "/dashboard" || route.layout === "/auth" || route.layout === "/rtl") {

        //console.log(route.path)

        if(!route.permission||!user?.permissions.find((search:any)=>{return search===route.permission}))return;

        return (
          <div key={index} className="mb-3 hover:cursor-pointer">
            {!route.items&& (
              <Link href={route.path} onClick={onClickRoute}>
                <li className="flex items-center px-8">
                  <span className={`${activeRoute(route.path) ? "font-bold text-brand-500 dark:text-white" : "font-medium text-gray-900"}`}>
                    {route.icon ? route.icon : <DashIcon />}{" "}
                  </span>
                  <div className={`flex items-center w-100 ml-4 ${activeRoute(route.path) ? "font-bold text-brand-500 dark:text-white" : "font-medium text-gray-900"}`}>
                    {route.name}
                  </div>
                </li>
              </Link>
            )}
            {route.items && route.items.map && (
              <>
                <li className="flex items-center px-8">
                  <span className={`${activeRoute(route.path) ? "font-bold text-brand-500 dark:text-white" : "font-medium text-gray-900"}`}>
                    {route.icon ? route.icon : <DashIcon />}{" "}
                  </span>
                  <div className={`flex items-center w-100 ml-4 ${activeRoute(route.path) ? "font-bold text-brand-500 dark:text-white" : "font-medium text-gray-900"}`} onClick={() => handleToggleSublinks(index)}>
                    {route.name}
                    {route.items && (
                      <MdKeyboardArrowDown className="ml-2" />
                    )}
                  </div>
                </li>
                {showSublinks === index && (
                  <ul className="pl-8">
                    {route.items.map((item: any, subIndex: number) => (
                      <li key={subIndex} className="py-2 ml-6 pl-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <Link href={item.path}>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        );
      }
    });
  };

  if (!user) {
    return <div className="text-center">Cargando...</div>;
  }

  return createLinks(routes);
}

export default SidebarLinks;
