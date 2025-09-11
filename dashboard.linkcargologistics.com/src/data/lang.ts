// lang.ts

export interface Lang {
  [key: string]: {
    loading: string;
    price: string;
    currency: string;
    persons: string;
    description: string;
    tour_date: string;
    private_tour: string;
    sub_total: string;
    process_reservation: string;
    cancel: string;
    first_name_1: string;
    first_name_2: string;
    nationality: string;
    id_number_1: string;
    celular: string;
    email: string;
    allergies: string;
    diet_type: string;
    continue_reservation: string;
    go_back: string;
    tickets: string;
    hotels: string;
    accessories: string;
    services: string;
    amount: string;
    autenticacion: string; // Sin acento en "autenticacion"
    title: string;
    isLocal: string;
    private: string; // Agregado para la traducción de "Privado/Private"
    tb:string;
    tdc:string;
    qr:string;
    end:string;
    end2:string;
    uploadfile:string;
    observation:string;
    uploadId:string;
    tickets_text:string;
    hotels_text:string;
    accesories_text:string;
    services_text:string;
  };
}

const lang: Lang = {
  es: {
    loading: "Cargando...",
    price: "Precio",
    currency: "Bs.",
    persons: "Personas",
    description: "Descripción",
    tour_date: "Fecha del tour",
    private_tour: "Deseas privado",
    sub_total: "Sub total",
    process_reservation: "Procesar",
    cancel: "Cancelar",
    first_name_1: "Nombres",
    first_name_2: "Apellidos",
    nationality: "Nacionalidad",
    id_number_1: "Número de documento",
    celular: "Celular",
    email: "Email",
    allergies: "Alergias",
    diet_type: "Tipo alimentación",
    continue_reservation: "Continuar",
    go_back: "Volver",
    tickets: "Tickets",
    hotels: "Hoteles",
    accessories: "Accesorios",
    services: "Servicios",
    amount: "Bs.",
    autenticacion: "autenticación", // Sin acento en "autenticacion"
    title: "Título",
    isLocal: "isLocal",
    private: "Privado", // Traducción de "Privado"
    tb:"Transferencia bancaria",
    tdc:"Tarjeta de crédito",
    qr:"QR bancario",
    end:"Terminar reserva",
    end2:"Hemos enviado un correo electrónico con nuevas instrucciones",
    uploadfile:"Por favor sube el comprobante de pago",
    observation:"Nota adicional",
    uploadId:"Es importante subir una imagen del documento de identidad para su seguridad y la nuestra.",
    tickets_text:"Es importante seleccionar su tickets",
    hotels_text:"Es importante seleccionar su hoteles",
    accesories_text:"Es importante seleccionar su accesorios",
    services_text:"Es importante seleccionar su servicios",
  },
  en: {
    loading: "Loading...",
    price: "Price",
    currency: "Bs.",
    persons: "Persons",
    description: "Description",
    tour_date: "Tour Date",
    private_tour: "Private Tour",
    sub_total: "Sub Total",
    process_reservation: "Process",
    cancel: "Cancel",
    first_name_1: "First Name",
    first_name_2: "Last Name",
    nationality: "Nationality",
    id_number_1: "ID Number",
    celular: "Cellphone",
    email: "Email",
    allergies: "Allergies",
    diet_type: "Diet Type",
    continue_reservation: "Continue",
    go_back: "Go Back",
    tickets: "Tickets",
    hotels: "Hotels",
    accessories: "Accessories",
    services: "Services",
    amount: "Amount",
    autenticacion: "Authentication", // Sin acento en "autenticacion"
    title: "Title",
    isLocal: "isLocal",
    private: "Private", // Traducción de "Private"
    tb:"Transferencia bancaria",
    tdc:"Tarjeta de crédito",
    qr:"QR bancario",
    end:"End Reservation",
    end2:"We have sent an email with new instructions.",
    uploadfile:"Please upload the payment receipt",
    observation:"Additional note",
    uploadId:"It's important to upload an image of your ID for your security and ours.",
    tickets_text: "It's important to select your tickets",
    hotels_text: "It's important to select your hotels",
    accesories_text: "It's important to select your accessories",
    services_text: "It's important to select your services"
  },
};

export default lang;
