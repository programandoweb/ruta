"use client";

import type { JSX } from "react";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillWarning,
} from "react-icons/ai";

const StatusCell = ({ status }: { status: string }) => {
  let icon: JSX.Element | null = null;
  let bold = false;
  let newString: string | null = null;

  const value = status?.toString().toLowerCase();

  switch (value) {
    case "cortado":
    case "armado":
      icon = <AiFillCheckCircle className="text-blue-500" />;
      bold = true;
      break;

    case "alistado":
    case "laqueado":
      icon = <AiFillCheckCircle className="text-orange-500" />;
      bold = true;
      break;

    case "ensamble":
      icon = <AiFillCheckCircle className="text-purple-500" />;
      bold = true;
      break;

    case "1":
      icon = <AiFillCheckCircle className="text-green-500" />;
      bold = true;
      newString = "Activo";
      break;

    case "0":
      icon = <AiFillCloseCircle className="text-red-500" />;
      bold = true;
      newString = "Inactivo";
      break;

    case "entrada":
    case "pagado":
    case "finalizado":
    case "sale":
    case "payment":
    case "receipt":
    case "efectivo":
      icon = <AiFillCheckCircle className="text-green-500" />;
      bold = true;
      break;

    case "salida":
    case "open":
    case "venta en espera":
    case "pago en espera":
    case "en espera":
      icon = <AiFillWarning className="text-yellow-500" />;
      bold = true;
      break;

    case "close":
    case "trash":
    case "alerta: inventario bajo":
    case "anulado":
      icon = <AiFillCloseCircle className="text-red-500" />;
      bold = true;
      break;

    case "purchase":
    case "débito":
    case "parcial":
      icon = <AiFillCheckCircle className="text-blue-500" />;
      bold = true;
      break;

    case "tax":
      icon = <AiFillCheckCircle className="text-yellow-500" />;
      bold = true;
      break;

    case "transferencia":
      icon = <AiFillCheckCircle className="text-blue-500" />;
      bold = true;
      break;

    case "crédito":
      icon = <AiFillCheckCircle className="text-purple-500" />;
      bold = true;
      break;

    default:
      icon = null;
      bold = false;
      break;
  }

  return (
    <div className="flex items-center gap-2 justify-center">
      {icon && <span className="text-xl">{icon}</span>}
      <span
        className={`text-sm text-navy-700 dark:text-white ${
          bold ? "font-bold" : ""
        }`}
      >
        {newString || status}
      </span>
    </div>
  );
};

export default StatusCell;
