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
import { useState, useMemo } from 'react';
import TabsMenu from '../tabs/TabsMenu';
import TabContent from '../tabs/TabContent';
import Card from '@/components/card';
import { motion } from 'framer-motion';
import { FaCashRegister, FaMoneyBillWave } from 'react-icons/fa';
import DrawerComponent from '@/components/drawer';
import { useDispatch } from 'react-redux';
import { setOpenDrawer } from '@/store/Slices/dialogMessagesSlice';
import { useCatalog } from '@/hooks/useCatalog';

// 👉 importamos el componente de ventas
import SalesList from './SalesList';
import { formatearMonto } from '@/utils/fuctions';

const VentasMesas: NextPage = () => {
  const [tab, setTab] = useState<string | number>(0);
  const [selectedMesa, setSelectedMesa] = useState<any>(null);

  const dispatch = useDispatch();
  const { isOnline, byDay: categories } = useCatalog();

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

  // 👉 Totalizador general de TODAS las ventas de TODAS las mesas
  const totalGeneral = useMemo(() => {
    if (!categories) return 0;
    return categories.reduce((acc: number, cat: any) => {
      const mesas = cat.childrens || [];
      const totalCat = mesas.reduce((sumMesa: number, mesa: any) => {
        return (
          sumMesa +
          (mesa.items_sale || []).reduce(
            (s: number, v: any) => s + Number(v.total_price),
            0
          )
        );
      }, 0);
      return acc + totalCat;
    }, 0);
  }, [categories]);

  return (
    <div className="space-y-4">
      {/* 👉 Totalizador general */}
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-4 rounded-xl shadow flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaMoneyBillWave className="text-3xl" />
          <div>
            <p className="text-sm opacity-90">Total General de Ventas</p>
            <p className="text-2xl font-bold">${formatearMonto(totalGeneral)}</p>
          </div>
        </div>
        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
          {categories?.flatMap((c: any) => c.childrens || []).length || 0} mesas
        </span>
      </div>

      <TabsMenu dataset={categoriesArray} tab={tab} setTab={setTab} />

      <TabContent tabKey={tab}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 mt-4">
          {filteredItems.map((mesa: any) => {
            const acumuladoMesa = (mesa.items_sale || []).reduce(
              (acc: number, sale: any) => acc + Number(sale.total_price),
              0
            );

            return (
              <motion.div
                key={mesa.id}
                whileHover={{ borderWidth: '1px', borderColor: '#1D4ED8' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="rounded-xl border border-transparent cursor-pointer"
                onClick={() => handleOpenDrawer(mesa)}
              >
                <Card className="p-4 text-center">
                  <FaCashRegister className="mx-auto text-4xl text-green-600 mb-2" />
                  <div className="font-bold text-lg">{mesa.label}</div>
                  <div className="text-sm text-gray-500 mb-2">
                    {mesa.parentLabel}
                  </div>
                  {/* 👉 acumulado por mesa */}
                  <div className="text-green-700 font-bold text-sm">
                    ${formatearMonto(acumuladoMesa)}
                  </div>
                </Card>
              </motion.div>
            );
          })}
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

            {/* 👉 Aquí mostramos la lista de ventas */}
            {selectedMesa.items_sale?.length > 0 ? (
              <SalesList sales={selectedMesa.items_sale} />
            ) : (
              <div className="p-4 text-center text-gray-500 border rounded-lg">
                Esta mesa no tiene ventas registradas 🚫
              </div>
            )}
          </div>
        )}
      </DrawerComponent>
    </div>
  );
};

export default VentasMesas;
