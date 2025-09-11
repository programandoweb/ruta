export interface SimpleTextareaProps {
  data: any; // Asegúrate de que data sea del tipo FormData
  label?: string;
  name: string;
  rows?: number;
  setFormData?: React.Dispatch<React.SetStateAction<FormData>>; // Ajusta el tipo de setFormData según corresponda
  setInputs?: React.Dispatch<React.SetStateAction<any>>; // Agrega setInputs a la interfaz
  disabled?: boolean; // Propiedad opcional para indicar si el textarea está deshabilitado
}
