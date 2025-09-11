'use client';

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve *  
 * ---------------------------------------------------
 */

import React from "react";

interface PropertyHeaderProps {
  title: string;
  price: string;
  address: string;
  labels: { text: string; color: string }[]; // Array de etiquetas con texto y color
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({ title, price, address, labels }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow-sm">
      {/* Título e Información */}
      <div>
        {
          /**
           * <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
           */
        }        
        <div className="flex items-center gap-2 mt-2">
          {/* Etiquetas */}
          {labels.map((label, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-sm font-medium text-white rounded uppercase` }
              style={{ backgroundColor: label.color }}
            >
              {label.text}
            </span>
          ))}
        </div>
        <p className="text-gray-600 mt-2 uppercase">{address}</p>
      </div>

      {/* Precio */}
      <div className="mt-4 md:mt-0">
        <span className="text-3xl font-semibold text-blue-600">{price}</span>
        <span className="text-gray-600"></span>
      </div>
    </div>
  );
};

export default PropertyHeader;
