/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

'use client';

import { NextPage } from 'next';
import { Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';

interface Props {
  dataset: { id: string | number; label: string }[];
  tab: string | number;
  setTab: Dispatch<SetStateAction<string | number>>;
}

const TabsMenu: NextPage<Props> = ({ dataset, tab, setTab }) => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-start gap-2 sm:gap-4 overflow-x-auto">
        {dataset.map((item) => {
          const isActive = item.id === tab;

          return (
            <motion.button
              key={item.id}
              onClick={() => setTab(item.id)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300
                ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-800 hover:bg-brand-100'
                }`}
            >
              {item.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default TabsMenu;
