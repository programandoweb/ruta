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

import { FC, useEffect, useState } from 'react'
import useFormData from '@/hooks/useFormDataNew'
import ItemGrid from './Grids/Item'
import { FaUsers, FaDollarSign, FaBullseye } from 'react-icons/fa';

let formData: any;

const DashboardHomePageProvider: FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  formData = useFormData(false, false, false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const res = await formData.handleRequest(`${formData.backend}/dashboard/summary`, 'get');
      if (res) {
        setDashboardData(res);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="relative w-full mt-8">
      <div className="grid md:grid-cols-4 gap-4">
        <ItemGrid
          title="Eventos activos"
          value={dashboardData?.active_events ?? '...'}
          variation="Pendientes"
          color="indigo"
          icon={<FaBullseye />}
        />
        <ItemGrid
          title="Total de citas"
          value={dashboardData?.total_appointments ?? '...'}
          variation="A la fecha"
          color="white"
          icon={<FaUsers />}
        />
        <ItemGrid
          title="Citas para hoy"
          value={dashboardData?.today_appointments ?? '...'}
          variation="Pendientes"
          color="white"
          icon={<FaDollarSign />}
        />
        <ItemGrid
          title="Total servicios"
          value={dashboardData?.total_services ?? '...'}
          variation="Activos"
          color="white"
          icon={<FaDollarSign />}
        />
      </div>
    </div>
  )
}

export default DashboardHomePageProvider
