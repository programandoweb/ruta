"use client";

import InputField from "@/components/fields/InputField";
import {
  MdPerson,
  MdPhone,
  MdHome,
  MdLocationOn,
} from "react-icons/md";
import { MdEvent } from "react-icons/md";

interface Props {
  inputs: any;
  setInputs: (value: any) => void;
}

const prefixed = "route";

const RouteFormFields: React.FC<Props> = ({ inputs, setInputs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
      {/* Nombre */}
      <div className="flex items-center gap-2">
        <MdPerson className="text-gray-500 text-lg" />
        <InputField
          prefixed={prefixed}
          name="name"
          label="Nombre (opcional)"
          id="name"
          type="text"
          defaultValue={inputs?.name}
          setInputs={setInputs}
        />
      </div>

      {/* Celular */}
      <div className="flex items-center gap-2">
        <MdPhone className="text-gray-500 text-lg" />
        <InputField
          required
          prefixed={prefixed}
          name="phone"
          label="Celular"
          id="phone"
          type="text"
          defaultValue={inputs?.phone}
          setInputs={setInputs}
        />
      </div>

      {/* Dirección origen */}
      <div className="flex items-center gap-2">
        <MdHome className="text-gray-500 text-lg" />
        <InputField
          required
          prefixed={prefixed}
          name="origin_address"
          label="Dirección inicio ruta"
          id="origin_address"
          type="text"
          defaultValue={inputs?.origin_address}
          setInputs={setInputs}
        />
      </div>

      {/* Dirección destino */}
      <div className="flex items-center gap-2">
        <MdLocationOn className="text-gray-500 text-lg" />
        <InputField
          required
          prefixed={prefixed}
          name="destination_address"
          label="Dirección fin ruta"
          id="destination_address"
          type="text"
          defaultValue={inputs?.destination_address}
          setInputs={setInputs}
        />
      </div>

      {/* Fecha programada */}
      <div className="flex items-center gap-2">
        <MdEvent className="text-gray-500 text-lg" />
        <InputField
          prefixed={prefixed}
          name="date"
          label="Fecha programada"
          id="date"
          type="date"
          defaultValue={inputs?.date}
          setInputs={setInputs}
        />
      </div>
    </div>
  );
};

export default RouteFormFields;
