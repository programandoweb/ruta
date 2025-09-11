/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve *  
 * ---------------------------------------------------
 */

'use client';

import React from "react";
import { FaCalendarAlt, FaHome, FaMoneyBillWave, FaRuler, FaBed, FaBath, FaCar, FaWarehouse, FaBuilding, FaClipboardCheck, FaSwimmingPool, FaTools, FaCouch, FaKey } from "react-icons/fa";

interface DetailsProps {
  propertyDetails: {
    propertyID: string;
    price: string;
    size: string;
    bedrooms: number;
    bathrooms: number;
    garage: number;
    garageSize: string;
    yearBuilt: number;
    type: string;
    status: string;
  };
  additionalDetails: {
    deposit: string;
    poolSize: string;
    lastRemodelYear: number;
    amenities: string;
    additionalRooms: string;
    equipment: string;
  };
  updatedDate: string;
}

const Details: React.FC<DetailsProps> = ({
  propertyDetails,
  additionalDetails,
  updatedDate,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Header con fecha de actualización */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaHome /> Detalles de la Propiedad
        </h2>
        <div className="flex items-center text-sm text-gray-500 gap-2">
          <FaCalendarAlt />
          <span>Actualizado el {updatedDate}</span>
        </div>
      </div>

      <hr className="mb-4" />

      {/* Propiedad */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <FaClipboardCheck className="text-gray-500" />
            <span><strong>ID Propiedad:</strong> {propertyDetails.propertyID}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCar className="text-gray-500" />
            <span><strong>Garaje:</strong> {propertyDetails.garage}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-gray-500" />
            <span><strong>Precio:</strong> {propertyDetails.price}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaWarehouse className="text-gray-500" />
            <span><strong>Tamaño Garaje:</strong> {propertyDetails.garageSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaRuler className="text-gray-500" />
            <span><strong>Tamaño Propiedad:</strong> {propertyDetails.size}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBuilding className="text-gray-500" />
            <span><strong>Año Construcción:</strong> {propertyDetails.yearBuilt}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBed className="text-gray-500" />
            <span><strong>Habitaciones:</strong> {propertyDetails.bedrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaHome className="text-gray-500" />
            <span><strong>Tipo Propiedad:</strong> {propertyDetails.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBath className="text-gray-500" />
            <span><strong>Baños:</strong> {propertyDetails.bathrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClipboardCheck className="text-gray-500" />
            <span><strong>Estado:</strong> {propertyDetails.status}</span>
          </div>
        </div>
      </div>

      {/* Detalles Adicionales */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaCouch /> Detalles Adicionales
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <FaKey className="text-gray-500" />
          <span><strong>Depósito:</strong> {additionalDetails.deposit}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaTools className="text-gray-500" />
          <span><strong>Amenidades:</strong> {additionalDetails.amenities}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaSwimmingPool className="text-gray-500" />
          <span><strong>Tamaño Piscina:</strong> {additionalDetails.poolSize}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaBed className="text-gray-500" />
          <span><strong>Habitaciones Extras:</strong> {additionalDetails.additionalRooms}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaBuilding className="text-gray-500" />
          <span><strong>Última Remodelación:</strong> {additionalDetails.lastRemodelYear}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaTools className="text-gray-500" />
          <span><strong>Equipo Incluido:</strong> {additionalDetails.equipment}</span>
        </div>
      </div>
    </div>
  );
};

export default Details;
