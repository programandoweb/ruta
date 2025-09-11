/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

'use client';

import { NextPage } from 'next';
import { useState } from 'react';
import TabsMenu from '../tabs/TabsMenu';
import TabContent from '../tabs/TabContent';
import Card from '@/components/card';
import { motion } from 'framer-motion';
import { FaChair } from 'react-icons/fa';
import DrawerComponent from '@/components/drawer';
import { useDispatch } from 'react-redux';
import { setOpenDrawer } from '@/store/Slices/dialogMessagesSlice';
import ProductsDrawer from '@/components/menu/ProductsDrawer';
import { useCatalog } from '@/hooks/useCatalog'; // 👈 nuestro hook híbrido
import Link from 'next/link';

const FoodMesas: NextPage = () => {
  const [tab, setTab] = useState<string | number>(0);
  const [selectedMesa, setSelectedMesa] = useState<any>(null);

  const dispatch = useDispatch();

  // 🚀 Hook híbrido trae caja y catálogo
  const { products, categories, isOnline, cashStatus } = useCatalog();
  // cashStatus: 'open' | 'closed'

  const categoriesArray = [
    { id: 0, label: 'Todas las Áreas' },
    ...(categories || []).map((cat: any) => ({
      id: cat.id,
      label: cat.label,
    })),
  ];

  const filteredItems =
    tab === 0
      ? (categories || []).flatMap((cat: any) =>
          (cat.childrens || []).map((mesa: any) => ({
            ...mesa,
            parentLabel: cat.label,
          }))
        )
      : (categories.find((cat: any) => String(cat.id) === String(tab))
          ?.childrens || []
        ).map((mesa: any) => ({
          ...mesa,
          parentLabel:
            categories.find((cat: any) => String(cat.id) === String(tab))
              ?.label || '',
        }));

  const handleOpenDrawer = (mesa: any) => {
    setSelectedMesa(mesa);
    dispatch(
      setOpenDrawer({
        direction: 'right',
        open: true,
      })
    );
  };

  // ⚡ Mostrar alerta si caja cerrada
  if (cashStatus === 'closed') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          ⚠️ Debes aperturar caja primero
        </h2>
        <p className="text-gray-600 mb-6">
          Para acceder al menú y asignar productos necesitas abrir una caja.
        </p>
        <Link
          href="/dashboard/cash/open"
          className="flex items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        >
          Ir a Apertura de Caja
        </Link>
      </div>
    );
  }

  return (
    <div>
      <TabsMenu dataset={categoriesArray} tab={tab} setTab={setTab} />

      <TabContent tabKey={tab}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 mt-4">
          {filteredItems.map((mesa: any) => (
            <motion.div
              key={mesa.id}
              whileHover={{ borderWidth: '1px', borderColor: '#1D4ED8' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="rounded-xl border border-transparent cursor-pointer"
              onClick={() => handleOpenDrawer(mesa)}
            >
              <Card className="p-4 text-center">
                <FaChair className="mx-auto text-4xl text-brand-600 mb-2" />
                <div className="font-bold text-lg">
                  {mesa.label}{' '}
                  <span className="text-sm text-gray-500">
                    ({mesa.parentLabel})
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </TabContent>

      <div className="text-right mt-2 text-sm text-gray-500">
        Estado: {isOnline ? '🌍 Online' : '📴 Offline'}
      </div>

      <DrawerComponent>
        {selectedMesa && (
          <div>
            <h2 className="text-xl font-bold mb-2 text-right">
              {selectedMesa.label}
            </h2>
            <p className="text-gray-600 mb-4 text-right">
              Área: {selectedMesa.parentLabel}
            </p>
            <ProductsDrawer
              key={selectedMesa.id}
              products={products || []}
              storageKey={`mesa_${selectedMesa.id}`}
            />
          </div>
        )}
      </DrawerComponent>
    </div>
  );
};

export default FoodMesas;
