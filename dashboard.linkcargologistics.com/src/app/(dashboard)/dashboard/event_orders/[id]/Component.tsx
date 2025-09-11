'use client';

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve - Usuarios
 * ---------------------------------------------------
 */

import Card from '@/components/card';
import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const prefixed = 'order';
const statusOptions = ['en_progreso', 'completada', 'cancelada'];

const UserFormComponent: React.FC = () => {
  const [user, setUser] = useState<any>({});
  const [order, setOrder] = useState<any>({});
  const router = useRouter();
  const formData = useFormData(false, false, false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getInit = () => {
    formData
      .handleRequest(formData.backend + location.pathname)
      .then((response: any) => {
        if (response && response[prefixed]) {
          setOrder(response[prefixed]);
        }
      });
  };

  useEffect(getInit, []);

  const handleChangeStatus = async (newStatus: string) => {
    try {
      await formData.handleRequest(
        `${formData.backend}/dashboard/event_orders/order/${order.id}/status`,
        'put',
        { status: newStatus }
      ).then((response: any) => {
        if (response && response[prefixed]) {
          setOrder(response[prefixed]);
        }
      });
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  return (
    <Fragment>
      <div className="h-12 mb-4">
        <BtnBack back />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-1">
        <Card className="mt-2">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><strong>ID:</strong> {order?.id}</div>
              <div><strong>Cliente:</strong> {order?.Cliente}</div>
              <div><strong>Proveedor:</strong> {order?.Proveedor}</div>
              <div><strong>Empleado:</strong> {order?.Empleado}</div>
              <div><strong>Servicio:</strong> {order?.Servicio}</div>
              <div><strong>Cantidad:</strong> {order?.Cantidad}</div>
              <div><strong>Precio:</strong> ${order?.Precio}</div>
              <div><strong>Fecha:</strong> {order?.Fecha}</div>
              <div><strong>Estado del Pedido:</strong> {order?.status}</div>
            </div>

            {order?.status === 'pendiente' && (
              <div className="col-span-full mt-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Cambiar Estado</h2>
                <div className="flex flex-wrap gap-3">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      className={`px-4 py-2 rounded-md border text-sm font-medium
                        ${order?.status === status
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
                      `}
                      onClick={() => handleChangeStatus(status)}
                    >
                      {status.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="col-span-full mt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Slot / Cita Agendada</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><strong>Día:</strong> {order?.Horario?.Día}</div>
                <div><strong>Inicio:</strong> {order?.Horario?.Inicio}</div>
                <div><strong>Fin:</strong> {order?.Horario?.Fin}</div>
                <div><strong>Estado:</strong> {order?.Horario?.Estado}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Fragment>
  );
};

export default UserFormComponent;
