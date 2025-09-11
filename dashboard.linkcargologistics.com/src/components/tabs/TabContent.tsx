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
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  tabKey: string | number; // clave única por tab activa para animar
}

const TabContent: NextPage<Props> = ({ children, tabKey }) => {
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={tabKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TabContent;
