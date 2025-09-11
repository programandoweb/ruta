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
import { FaCheckCircle } from "react-icons/fa";

interface FeatureProps {
  features: string[];
}

const Features: React.FC<FeatureProps> = ({ features }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Features</h2>
      <hr className="mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center text-gray-700 space-x-2"
          >
            <FaCheckCircle className="text-green-500" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
