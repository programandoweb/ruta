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

import { Fragment } from "react";
import { FaBed, FaBath, FaRulerCombined, FaHeart, FaExpand } from "react-icons/fa";

interface Property {
  id: number;
  title: string;
  price: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
}

interface WebComponentProps {
  dataset: Property[];
}

const PropertyCard = ({ property }: { property: Property }) => {
  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden mb-4 relative">
      <div className="w-1/3">
        <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
      </div>
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold">{property.title}</h3>
          <p className="text-xl font-bold">{property.price}</p>
          <p className="text-sm text-gray-500">{property.type}</p>
        </div>
        <div className="flex items-center gap-4 text-gray-700 mt-2">
          <span className="flex items-center gap-1"><FaBed /> {property.bedrooms}</span>
          <span className="flex items-center gap-1"><FaBath /> {property.bathrooms}</span>
          <span className="flex items-center gap-1"><FaRulerCombined /> {property.area}</span>
        </div>
      </div>
      <div className="absolute top-2 right-2 flex space-x-2 text-gray-500">
        <button className="p-2 rounded-full hover:bg-gray-100"><FaExpand /></button>
        <button className="p-2 rounded-full hover:bg-gray-100"><FaHeart /></button>
      </div>
    </div>
  );
};

const WebComponent = ({ dataset }: WebComponentProps) => {
  return (
    <Fragment>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold">List Layout Full Width</h2>
        <p className="text-gray-500 mb-4">{dataset.length} Properties</p>
        <div>
          { dataset&&
            dataset.map&&
            dataset.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default WebComponent;
