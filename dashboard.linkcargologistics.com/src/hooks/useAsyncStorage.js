'use client'
import { useState, useEffect } from 'react';

const useAsyncStorage = (key) => {

  const [data, setData] = useState(null); // Estado para almacenar los datos
  const [loading, setLoading] = useState(false); // Estado para indicar si se están cargando los datos
  const [error, setError] = useState(null); // Estado para almacenar cualquier error que pueda ocurrir

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Establece el estado de carga a verdadero
      setError(null); // Reinicia el estado de error

      try {
        const storedData = await getDataFromStorage(key); // Obtiene los datos del almacenamiento
        setData(storedData); // Establece los datos en el estado
      } catch (err) {
        setError(err); // Establece el error en el estado
      } finally {
        setLoading(false); // Establece el estado de carga a falso
      }
    };

    fetchData(); // Llama a la función fetchData al cargar el componente o cuando la clave cambie
  }, [key]);

  const getDataFromStorage = async (key) => {
    try {
      const storedData = localStorage.getItem(key); // Obtiene los datos del almacenamiento
      if (storedData&&storedData!=='undefined') {
        return JSON.parse(storedData); // Devuelve los datos parseados si existen
      }
      return null; // Devuelve nulo si no existen datos  
    } catch (error) {
      console.log(error)
    }
    
  };

  const setDataToStorage = async (key, newData) => {
    localStorage.setItem(key, JSON.stringify(newData)); // Almacena los nuevos datos en el almacenamiento
    setData(newData); // Establece los nuevos datos en el estado
    return newData
  };

  const removeDataFromStorage = async (key) => {
    localStorage.removeItem(key); // Elimina los datos del almacenamiento
    setData(null); // Establece los datos en el estado como nulos
  };

  return {
    data, // Datos actuales
    loading, // Estado de carga
    error, // Error
    setDataToStorage,
    getData:  (key)  =>  getDataFromStorage(key),
    setData: (newData) => setDataToStorage(key, newData), // Función para establecer nuevos datos
    removeData: () => removeDataFromStorage(key), // Función para eliminar datos
  };
};

export default useAsyncStorage;
