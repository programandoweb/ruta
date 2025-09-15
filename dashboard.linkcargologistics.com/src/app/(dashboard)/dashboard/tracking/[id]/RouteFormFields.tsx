"use client";

import { MdPerson, MdPhone, MdHome, MdLocationOn, MdEvent } from "react-icons/md";

interface Props {
  inputs: any;
}

const RouteFormFields: React.FC<Props> = ({ inputs }) => {
  const Field = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string | null | undefined;
  }) => (
    <div className="flex flex-col p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
        <Icon className="text-lg" />
        <span>{label}</span>
      </div>
      <div className="mt-1 pl-6 text-gray-900 font-semibold break-words">
        {value || "-"}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
      <Field icon={MdPerson} label="Nombre (opcional)" value={inputs?.name} />
      <Field icon={MdPhone} label="Celular" value={inputs?.phone} />
      <Field icon={MdHome} label="Dirección inicio ruta" value={inputs?.origin_address} />
      <Field icon={MdLocationOn} label="Dirección fin ruta" value={inputs?.destination_address} />
      <Field icon={MdEvent} label="Fecha programada" value={inputs?.date} />
    </div>
  );
};

export default RouteFormFields;
