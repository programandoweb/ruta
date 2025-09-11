/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import { FC, ReactNode } from 'react';

interface ItemGridProps {
  title: string;
  value: string | number;
  variation: string; // e.g., "+40%" o "-12%"
  color: string;     // e.g., "red", "green"
  icon?: ReactNode;  // ícono opcional
}

const ItemGrid: FC<ItemGridProps> = ({ title, value, variation, color, icon }) => {
  const bgColorClass = color === 'white' ? 'bg-white text-black' : `bg-${color}-400 text-white`;

  return (
    <div className={`p-6 rounded-lg shadow-md flex items-center ${bgColorClass}`}>
      {icon && (
        <div className="mr-4 text-3xl">
          {icon}
        </div>
      )}
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <span className="text-sm mt-1 block">{variation}</span>
      </div>
    </div>
  );
};

export default ItemGrid;
