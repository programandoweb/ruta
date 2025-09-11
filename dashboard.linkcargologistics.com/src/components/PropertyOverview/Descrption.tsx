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

interface DescriptionProps {
  title: string;
  content: string;
}

const Description: React.FC<DescriptionProps> = ({ title, content }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Título */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      <hr className="mb-4" />

      {/* Contenido */}
      <div
        className="text-gray-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </div>
  );
};

export default Description;
