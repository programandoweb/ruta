
export interface ProductDetails {
    ingredients: Ingredient[];
  }
  
  export interface Product {
    id: number;
    name: string;
    price: number;
    product: ProductDetails;
  }
  
  export interface Icon {
    id: number;
    name: string;
    value: string | null;
    src: string;
    sizes: string;
    type: string;
    label: string | null;
  }
  
  export interface Screenshot {
    id: number;
    name: string;
    value: string | null;
    src: string;
    sizes: string;
    type: string;
    label: string;
  }
  
  export interface Pwa {
    name: string;
    short_name: string;
    description: string;
    start_url: string;
    display: string;
    background_color: string;
    theme_color: string;
    icons: Icon[];
    screenshots: Screenshot[];
  }
  
  export interface MasterTable {
    id: number;
    Nombre?:string;
    label: string;
    grupo: string;
    value?: string | null; // Dado que `value` puede ser nulo, lo marcamos como opcional
    description?: string | null; // `description` también puede ser nulo, así que es opcional
    medida_id?: number | null; // `medida_id` puede ser nulo, así que es opcional y puede ser null
    icon?: string | null; // `icon` puede ser nulo, así que es opcional
  }
  
  export interface BackendDataset {
    diet_types: MasterTable[] | undefined;
    allergies: MasterTable[] | undefined;
    lang: MasterTable[] | undefined;
    bancos_bolivia: MasterTable[] | undefined;
    payment_method_id: MasterTable[] | undefined;
    online_payment_method_id: MasterTable[] | undefined;  
    links_payment_method_id: MasterTable[] | undefined;  
    transfer_payment_method: MasterTable[] | undefined;  
    tables: MasterTable[] | undefined;  
    qr_payment_method: MasterTable[] | undefined;  
    pwa: Pwa;
    masterTable: MasterTable[];
    prefixed?: string | undefined; 
    master_ingredient?:any; 
    units_of_measurement?:any;
    cash_register:any;
    tax:any;
    enterprise:any;
    logo:string;
  }
  
  export interface SettingTablesProps {
    dataset?: MasterTable[];
    getInit?: () => void | undefined;
    setOpen?:any;
    prefixed?: string | undefined;
    extra?:boolean|undefined;
    extra2?:boolean|undefined;
    extra3?:boolean|undefined;
    extra4?:boolean|undefined;
    extra5?:boolean|undefined;
    extra6?:any;
    extra7?:any;
    grupo:string;
    online_paid?:any;
    skipAdd?:boolean|undefined;
  }
  
  export interface OnlinePaidInterface {
    dataset?: MasterTable[]|undefined;
    getInit?: () => void | undefined;
    grupo:string; 
  }
  
  export interface MasterTablesDataset {
      dataset?: any;
      getInit?: () => void | undefined;
      grupo:string; 
      inputs:any;
      setInputs:any;
  }
  
  
  // Interfaz para un ingrediente
  export interface Ingredient {
    id: number;
    label: string;
    grupo: string;
    value: string;
    description: string;
    medida_id: number | null;
    bool_status: number;
    icon: string;
    medida: string | null;
    name: string;
    type: string;
  }
  
  // Interfaz para el objeto de ingredientes
  export interface IngredientsState {
    ingredients: Ingredient[];
  }
  
  export interface RawMaterial {
    value: number;
    name: string;
  }
  
  export interface RawMaterialsData {
    raw_materials: RawMaterial[];
  }
  
  export interface UserInputs {
    customer_group_id: string;
    name: string;
    company_name?: string;
    email: string;
    phone_number: string;
    identification_number?: string;
    address: string;
    city: string;
    state?: string;
    postal_code?: string;
    country: string;
    id?: number | null;
    credit?: any; // Puede ajustarse el tipo de `credit` según las necesidades del proyecto
  }
  
  
  
  export interface Paid {
    id: number;
    inventory_entries_id: number;
    suppliers_id: number;
    amount_paid: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface ResumeData {
    id: number;
    mp: string;          // Materia Prima
    TE: number;          // Total Entradas
    TS: number;          // Total Salidas
    Disponible: number;  // Disponibilidad
    UM: string;          // Unidad de Medida
    paids: Paid[];       // Lista de pagos asociados
  }
  
  export interface Resume {
    data: ResumeData;     // Datos del resumen
    data2: any; 
  }
  
  export interface ProductProps {
    id: number;
    Producto: string;
    Precio: string;
    slug: string;
    cantidad: number;
    fecha: string;
    resume: Resume | null;  // Permitimos que resume pueda ser null
    restante?:any;
  }
  