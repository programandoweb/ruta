/**
 * ---------------------------------------------------
 * Desarrollado por: Jorge Méndez - Programandoweb
 * Correo: lic.jorgemendez@gmail.com
 * Celular: 3115000926
 * website: Programandoweb.net
 * Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import useFormData from '@/hooks/useFormDataNew';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import TabsMenu from '../tabs/TabsMenu';
import TabContent from '../tabs/TabContent';
import Card from '@/components/card'; // asume que tienes un componente Card
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaEdit } from 'react-icons/fa'; // Importa el ícono de edición
import Link from 'next/link';
import { formatearMonto } from '@/utils/fuctions';

const FoodMenu: NextPage = () => {
  const [data, setData] = useState<any>({});
  const [tab, setTab] = useState<string | number>(0);
  const [user, setUser] = useState<any>(null); // Nuevo estado para el usuario

  const formData = useFormData(false, false, false);

  useEffect(() => {
    // Cargar el menú
    formData
      .handleRequest(formData.backend + "/open/menu")
      .then((res: any) => {
        if (res) setData(res);
      });

    // Cargar el usuario desde localStorage
    const loadUserFromLocalStorage = async () => {
      try {
        const storedUser = await localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error al cargar el usuario de localStorage:", error);
      }
    };

    loadUserFromLocalStorage();
  }, []); // El array de dependencias vacío asegura que se ejecute solo una vez al montar el componente

  const categoriesArray = [
    { id: 0, label: 'Todos' },
    ...Object.entries(data?.categories || {}).map(([id, label]) => ({
      id,
      label: label as string,
    })),
  ];

  const filteredItems = tab === 0
    ? data?.menu || []
    : (data?.menu || []).filter(
        (item: any) => String(item.product_category_id) === String(tab)
      );

  return (
    <div>
      <TabsMenu dataset={categoriesArray} tab={tab} setTab={setTab} />
      <TabContent tabKey={tab}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 mt-4">
          {filteredItems.map((item: any) => (
            <motion.div
                key={item.id}
                whileHover={{
                    borderWidth: '2px',
                    borderColor: '#1D4ED8' // azul (tailwind blue-700)
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="rounded-xl border border-transparent"
                >
                <Card className='p-4'>
                    <div>
                      <Image
                          src={item.gallery && item.gallery[0] ? item.gallery[0] : "/img/dashboards/no-image.jpg"}
                          alt={item.name}
                          width={500}
                          height={500}
                          className='object-cover w-full'
                      />
                      <div className='text-center'>
                          <div className="font-bold text-lg text-center">{item.name}</div>
                          <div className="text-xs text-gray-600">{item.short_description}</div>
                          <div className="text-brand-600 font-semibold">
                          <span>${formatearMonto(item.price)}</span>
                          {user?.role === 'admin' && (
                              <Link className="ml-2" href={"/dashboard/recipes/" + item.id}>
                                <FaEdit className="inline-block text-lg" />
                              </Link>
                          )}
                          </div>
                      </div>
                    </div>
                </Card>
            </motion.div>
          ))}
        </div>
      </TabContent>
    </div>
  );
};

export default FoodMenu;