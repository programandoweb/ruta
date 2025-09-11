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

import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaCity, FaGlobeAmericas, FaHome, FaMapSigns, FaFlag } from "react-icons/fa";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// Definición de las propiedades que recibe el componente
interface GoogleMapSectionProps {
  address: string;
  zipCode: string;
  city: string;
  area: string;
  state: string;
  country: string;
  mapLink: string;
  propertyData?: any; // Datos adicionales de la propiedad (opcional)
}

// Estilos por defecto para el contenedor del mapa
const defaultMapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "15px 0px 0px 15px",
};

// Coordenadas por defecto para Montevideo, Uruguay
const montevideoCoordinates = {
  lat: -34.9011,
  lng: -56.1645,
};

// Componente principal que muestra la sección del mapa y los detalles de la dirección
const GoogleMapSection: React.FC<GoogleMapSectionProps> = ({
  address,
  zipCode,
  city,
  area,
  state,
  country,
  propertyData,
  mapLink,
}) => {
  
  // Estado para manejar el centro del mapa y la posición del marcador
  const [mapCenter, setMapCenter] = useState(montevideoCoordinates);
  const [markerPosition, setMarkerPosition] = useState(montevideoCoordinates);

  // Carga el script de Google Maps con la API key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Función para inicializar el mapa con las coordenadas de la propiedad
  const init = () => {
    try {
      // Parsea los datos dinámicos de la propiedad para obtener la ubicación
      const json: any = JSON.parse(propertyData.dataDinamic)["Ubicación"];
      const lat = json.lat;
      const lng = json.lng;

      // Actualiza el centro del mapa y la posición del marcador
      setMapCenter({
        lat: lat,
        lng: lng,
      });

      setMarkerPosition({
        lat: lat,
        lng: lng,
      });

    } catch (error) {
      console.error("Error en Mapa", error);
    }
  };

  // Efecto que se ejecuta al montar el componente para inicializar el mapa
  useEffect(() => {
    init();
  }, []);

  // Si el script de Google Maps no está cargado, muestra un mensaje de carga
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Header de la sección */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaHome />
          Dirección
        </h2>
      </div>

      <hr className="mb-4" />

      {/* Detalles de la dirección y el mapa */}
      <div className="grid grid-cols-2 gap-4">
        {/* Sección del mapa */}
        <div>
          <div id="map-programandoweb-jorgedev" className="h-72">
            <GoogleMap
              mapContainerStyle={defaultMapContainerStyle}
              center={mapCenter}
              zoom={14}
            >
              <Marker position={markerPosition} />
            </GoogleMap>
          </div>
        </div>

        {/* Detalles de la dirección */}
        <div>
          <div>
            <div className="flex items-center gap-2">
              <FaHome className="text-blue-500" />
              <span className="font-semibold text-gray-800">Dirección: </span>
            </div>
            <span className="text-gray-600 ml-7">{address}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <FaMapSigns className="text-green-500" />
              <span className="font-semibold text-gray-800">Código Postal: </span>
            </div>
            <span className="text-gray-600 ml-7">{zipCode}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <FaCity className="text-orange-500" />
              <span className="font-semibold text-gray-800">Ciudad: </span>
            </div>
            <span className="text-gray-600 ml-7">{city}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              <span className="font-semibold text-gray-800">Área: </span>
            </div>
            <span className="text-gray-600 ml-7">{area}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <FaGlobeAmericas className="text-purple-500" />
              <span className="font-semibold text-gray-800">Estado/Provincia: </span>
            </div>
            <span className="text-gray-600 ml-7">{state}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <FaFlag className="text-indigo-500" />
              <span className="font-semibold text-gray-800">País: </span>
            </div>
            <span className="text-gray-600 ml-7">{country}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapSection;