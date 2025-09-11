export function serializarData(data){

  return;

}

export function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function resaltarTexto(texto) {
  if(!texto){
    return;
  }
  return texto.replace(/\*(.*?)\*/g, '<b>$1</b>');
}

export function eliminarShortcodes(texto) {
  if (!texto) {
    return "No disponible";
  }
  return texto.replace(/\[.*?\]/g, '');
}

export function getParamsFromUrl(url) {
  const regex = /\?(.+)$/; // Improved regex for capturing everything after '?'
  const match = regex.exec(url);

  if (match) {
    return match[1]; // Efficiently parse parameters
  } else {
    return new URLSearchParams(); // Return an empty URLSearchParams object
  }
}

export function obtenerSubdominio(dominio) {
  // Dividir por los puntos en la URL
  const partes  =   dominio.split('.');

  // Si hay más de dos partes (es decir, subdominio presente), devolver todas las partes menos el último elemento
  if (partes.length > 2) {
    return partes.slice(0, -2).join('.')+".";
  } else {
    return null; // No hay subdominio
  }
}

export function getBackendUrl(tenant_id) {

    let BACKEND;
    const test  =   false 
    let opt     =   false;   
    if (!window) {
        opt         =   1;
        BACKEND = process.env.NEXT_PUBLIC_BACKENDREMOTE;
    }else if (test) {
        opt         =   2;
        BACKEND     =   "https://"+tenant_id+"."+process.env.NEXT_PUBLIC_TENANT+"/api/v1";
    } else if (window && window.location && window.location.hostname && !window.location.port) {
        opt         =   3;
        //BACKEND = window.location.protocol + "//backend."+tenant_id + "." + window.location.hostname + (window.location.port ? ":" + process.env.NEXT_PUBLIC_PORT + "/api/v1" : "/api/v1");
        BACKEND = window.location.protocol + "//"+tenant_id + "." + window.location.hostname + (window.location.port ? "/api/v1" : "/api/v1");
    } else if (window && window.location && window.location.hostname && window.location.port) {
        opt         =   4;
        /* Quiere decir que estoy en localhost */
        //BACKEND = window.location.protocol + "//" + tenant_id + "." + window.location.hostname + (window.location.port ? ":" + process.env.NEXT_PUBLIC_PORT + "/api/v1" : "/api/v1");
        BACKEND = window.location.protocol + "//" + tenant_id + "." + window.location.hostname + (window.location.port ? "/api/v1" : "/api/v1");
    }
    //console.log("backend: "+BACKEND,"opt :"+opt," Tenant: "+tenant_id)  
    return BACKEND;
}

export function isValidJson(jsonString) {
  try {
      JSON.parse(jsonString);
      return true;
  } catch (error) {
      return false;
  }
}


export const encodeStringToUrl=(str)=>{
  // Reemplaza los caracteres especiales con sus códigos de URL
  return encodeURIComponent(str)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22")
    .replace(/&/g, "%26")
    .replace(/#/g, "%23")
    .replace(/\?/g, "%3F")
    .replace(/=/g, "%3D");
}

export function organizeData(backendData) {
  const organizedData = {
    config: [],
    realestate: [],
    realestateGroups: [],
    realestateProperties: [],
    realestateCommonSpaces: [],
  };

  if (!backendData.config) {
    return;
  }
  // Iterate through the config data
  backendData.config.forEach((configItem) => {
    const { get_all, realestate_common_spaces, ...configData } = configItem;

    // Add config data to the organizedData
    organizedData.config.push(configData);

    // Process get_all data
    get_all.forEach((realestateItem) => {
      const { by_groups, ...realestateData } = realestateItem;

      // Add realestate data to the organizedData
      organizedData.realestate.push(realestateData);

      // Process by_groups data
      by_groups.forEach((propertyItem) => {
        // Extract id and name from propertyItem
        const { id, name } = propertyItem;

        // Add realestateGroups data to the organizedData
        organizedData.realestateGroups.push({
          realestate_groups_id: propertyItem.realestate_groups_id,
          ...propertyItem,
        });

        // Add only id and name to realestateProperties data
        organizedData.realestateProperties.push({ id, name });
      });
    });

    // Process realestate_common_spaces data
    organizedData.realestateCommonSpaces.push(...realestate_common_spaces);
  });

  return organizedData;
}

export function fecha(dateString){

  if(!dateString)return;

  // Split the dateString into year, month, and day parts
  const [year, month, day] = dateString.split('-');

  // Create a new Date object with the given dateString
  const date = new Date(`${year}-${month}-${day}`);

  // Array of Spanish day names
  const dayNames = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayIndex = date.getDay();

  // Return the formatted date with the day name in Spanish
  return `${day}-${month}-${year} (${dayNames[dayIndex]})`;
  
}



export function formatarFechaLaravel(fechaLaravel) {
  // Crear un objeto de fecha a partir de la cadena de fecha de Laravel
  const fecha = new Date(fechaLaravel);

  // Obtener los componentes de la fecha
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son 0-indexados
  const anio = fecha.getFullYear().toString().slice(-2);

  // Construir la cadena de fecha en el formato DD/MM/YY
  const fechaFormateada = `${dia}/${mes}/${anio}`;

  return fechaFormateada;
}


export function formatarHoraLaravel(fechaLaravel) {
  // Crear un objeto de fecha a partir de la cadena de fecha de Laravel
  const fecha = new Date(fechaLaravel);

  // Obtener los componentes de la hora
  const horas = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  const segundos = fecha.getSeconds().toString().padStart(2, '0');

  // Construir la cadena de fecha y hora en el formato DD/MM/YY HH:mm:ss
  const fechaHoraFormateada = `${horas}:${minutos}:${segundos}`;

  return fechaHoraFormateada;
}

export const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const formattedTime = `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return formattedTime;
};

export function formatearMonto(monto,toFixed=2) {
  // Verificar si el monto es un número
  if (isNaN(monto)) {
      return "Error: no es un número válido";
  }

  // Redondear el monto a dos decimales
  monto = parseFloat(monto).toFixed(toFixed);

  // Separar las partes enteras y decimales
  var partes = monto.split(".");

  // Formatear las partes enteras con puntos como separador de miles
  partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Unir las partes con coma como separador decimal
  return partes.join(",");
}

export const generateUniqueId=()=>{
  // Obtener la fecha actual en milisegundos
  const timestamp = new Date().getTime().toString();

  // Generar una cadena aleatoria de longitud 10
  const randomString = Math.random().toString(36).substring(2, 12);

  // Combinar la marca de tiempo y la cadena aleatoria
  const uniqueId = timestamp + randomString;

  // Asegurar que la longitud del ID sea exactamente 20 caracteres
  return uniqueId.slice(0, 20);
}

