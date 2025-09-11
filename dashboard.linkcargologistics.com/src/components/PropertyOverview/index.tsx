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
import { FaBed, FaBath, FaCar, FaRuler, FaCalendarAlt } from "react-icons/fa";

interface PropertyOverviewProps {
  type: string;
  propertyID: string;
  bedrooms: number;
  bathrooms: number;
  garage: number;
  sqFt: number;
  yearBuilt: number;
}

const PropertyOverview: React.FC<PropertyOverviewProps> = ({
  type,
  propertyID,
  bedrooms,
  bathrooms,
  garage,
  sqFt,
  yearBuilt,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Título y Property ID */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-800">Property ID:</span> {propertyID}
        </p>
      </div>

      <hr className="mb-4" />

      {/* Propiedades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4">
        {/* Tipo de propiedad */}
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-gray-800">{type}</p>
          <p className="text-sm text-gray-500">Property Type</p>
        </div>

        {/* Dormitorios */}
        <div className="flex items-center gap-2">
          <FaBed className="text-gray-700" size={20} />
          <p className="text-lg font-semibold text-gray-800">{bedrooms}</p>
          <p className="text-sm text-gray-500">Bedrooms</p>
        </div>

        {/* Baños */}
        <div className="flex items-center gap-2">
          <FaBath className="text-gray-700" size={20} />
          <p className="text-lg font-semibold text-gray-800">{bathrooms}</p>
          <p className="text-sm text-gray-500">Bathrooms</p>
        </div>

        {/* Garage */}
        <div className="flex items-center gap-2">
          <FaCar className="text-gray-700" size={20} />
          <p className="text-lg font-semibold text-gray-800">{garage}</p>
          <p className="text-sm text-gray-500">Garage</p>
        </div>

        {/* Metros cuadrados */}
        <div className="flex items-center gap-2">
          <FaRuler className="text-gray-700" size={20} />
          <p className="text-lg font-semibold text-gray-800">{sqFt}</p>
          <p className="text-sm text-gray-500">Sq Ft</p>
        </div>

        {/* Año de construcción */}
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-700" size={20} />
          <p className="text-lg font-semibold text-gray-800">{yearBuilt}</p>
          <p className="text-sm text-gray-500">Year Built</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyOverview;
