'use client'

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import { useEffect, useState } from 'react';
import DashboardHomePage from '@/components/dashboard';
import { FC } from 'react';
import DashboardHomePageProvider from '@/components/dashboard/DashboardHomePageProvider';

type Props = {};

interface User {
  role: string;
  [key: string]: any;
}

const DashboardPage: FC<Props> = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    };
    fetchUser();
  }, []);

  if (user?.role === 'providers') {
    console.log('El usuario es administrador');
    return <DashboardHomePageProvider />;
  } 

  return <DashboardHomePage />;
};

export default DashboardPage;
