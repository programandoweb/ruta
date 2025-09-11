import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { InputsData } from "@/data/interface"; // Importar InputsData
import { ProductProps } from "@/data/interface";


interface GoogleMapProps {
    placeholder?: string;
    label?: string;
    name?: string;
    inputs: InputsData;
    setInputs?: React.Dispatch<React.SetStateAction<ProductProps | undefined>>;
}

// Estilos del contenedor del mapa
export const defaultMapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "15px 0px 0px 15px",
};

// Coordenadas iniciales de Montevideo
const montevideoCoordinates = {
    lat: -34.9011,
    lng: -56.1645,
};

const GoogleMapIndex: React.FC<GoogleMapProps> = ({ inputs, setInputs }) => {
    const [mapCenter, setMapCenter] = useState(montevideoCoordinates); 
    const [markerPosition, setMarkerPosition] = useState(montevideoCoordinates); 

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    useEffect(() => {
        const address = inputs?.dataDinamic?.Ubicación?.Dirección;
        if (address) {
            geocodeAddress(address);
        }
    }, [inputs]);

    const geocodeAddress = (address: string) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, handleGeocodeResponse);
    };

    const handleGeocodeResponse = (results: any, status: string) => {
        if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;
            const newCoordinates = {
                lat: location.lat(),
                lng: location.lng(),
            };
            updateMapCoordinates(newCoordinates);
        } else {
            console.error("Error al geocodificar la dirección:", status);
        }
    };

    const updateMapCoordinates = (coordinates: { lat: number; lng: number }) => {
        setMapCenter(coordinates);
        setMarkerPosition(coordinates);
    };

    const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const newCoordinates = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };
            updateMapCoordinates(newCoordinates);
    
            if (setInputs) {
                // Realizamos la geocodificación inversa
                reverseGeocode(newCoordinates, (geoData) => {
                    setInputs((prevInputs: any) => ({
                        ...prevInputs,
                        dataDinamic: {
                            ...prevInputs?.dataDinamic,
                            Ubicación: {
                                ...prevInputs?.dataDinamic?.Ubicación,
                                lat: newCoordinates.lat,
                                lng: newCoordinates.lng,
                                Coordenadas: `Lat: ${newCoordinates.lat}, Lng: ${newCoordinates.lng}`,
                                PaísGM: geoData?.country || "",
                                RegiónGM: geoData?.administrative_area_level_1 || "",
                                CiudadGM: geoData?.locality || geoData?.administrative_area_level_2 || "",
                                BarrioGM: geoData?.neighborhood || "",
                                Dirección: geoData?.formatted_address || "",
                            },
                        },
                    }));
                });
            }
        }
    };

    useEffect(() => {
        // Verifica si hay coordenadas guardadas en `inputs`
        const savedLocation = inputs?.dataDinamic?.Ubicación;
        if (savedLocation?.lat && savedLocation?.lng) {
            // Si existen coordenadas guardadas, actualiza el centro del mapa y el marcador
            const newCoordinates = {
                lat: savedLocation.lat,
                lng: savedLocation.lng,
            };
            //console.log(newCoordinates)
            updateMapCoordinates(newCoordinates);
        } else {
            // Si no existen coordenadas guardadas, usa las coordenadas por defecto de Montevideo
            updateMapCoordinates(montevideoCoordinates);
        }
    }, [inputs]);
    
    
    // Función para realizar la geocodificación inversa
    const reverseGeocode = (coordinates: { lat: number; lng: number }, callback: (geoData: any) => void) => {
        const geocoder = new google.maps.Geocoder();
    
        geocoder.geocode({ location: coordinates }, (results:any, status) => {
            if (status === "OK" && results[0]) {
                const addressComponents = results[0].address_components;
                const geoData: any = {
                    formatted_address: results[0].formatted_address, // Dirección completa
                };
    
                // Extraer datos relevantes de address_components
                addressComponents.forEach((component:any) => {
                    if (component.types.includes("country")) {
                        geoData.country = component.long_name;
                    }
                    if (component.types.includes("administrative_area_level_1")) {
                        geoData.administrative_area_level_1 = component.long_name;
                    }
                    if (component.types.includes("administrative_area_level_2")) {
                        geoData.administrative_area_level_2 = component.long_name;
                    }
                    if (component.types.includes("locality")) {
                        geoData.locality = component.long_name;
                    }
                    if (component.types.includes("neighborhood")) {
                        geoData.neighborhood = component.long_name;
                    }
                });
    
                // Llamar al callback con los datos procesados
                callback(geoData);
            } else {
                console.error("Geocodificación inversa fallida:", status);
                callback({});
            }
        });
    };
    

    if (!isLoaded) return <div>Loading...</div>;
    //console.log(inputs.dataDinamic?.Ubicación)

    return (
        <div className="w-full h-full bg-gray-100">
            <GoogleMap
                mapContainerStyle={defaultMapContainerStyle}
                center={mapCenter}
                zoom={14}
            >
                <Marker
                    position={markerPosition}
                    draggable={true}
                    onDragEnd={handleMarkerDragEnd}
                />
            </GoogleMap>
        </div>
    );
};

export default GoogleMapIndex;
