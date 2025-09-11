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
import { FaMapMarkerAlt } from "react-icons/fa";

interface GoogleMapSectionProps {
  address: string;
  zipCode: string;
  city: string;
  area: string;
  state: string;
  country: string;
  mapLink: string;
}

const GoogleMapSectionOld: React.FC<GoogleMapSectionProps> = ({
  address,
  zipCode,
  city,
  area,
  state,
  country,
  mapLink,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Address</h2>
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition-all flex items-center gap-2"
        >
          <FaMapMarkerAlt />
          Open on Google Maps
        </a>
      </div>

      <hr className="mb-4" />

      {/* Address Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-800">Address</span>
          <span className="text-gray-600">{address}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-800">Zip/Postal Code</span>
          <span className="text-gray-600">{zipCode}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-800">City</span>
          <span className="text-gray-600">{city}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-800">Area</span>
          <span className="text-gray-600">{area}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-800">State/county</span>
          <span className="text-gray-600">{state}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-800">Country</span>
          <span className="text-gray-600">{country}</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapSectionOld;
