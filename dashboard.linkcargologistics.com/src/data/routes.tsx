// ---------------------------------------------------
//  Desarrollado por: Jorge Méndez - Programandoweb
//  Correo: lic.jorgemendez@gmail.com
//  Celular: 3115000926
//  website: Programandoweb.net
//  Proyecto: Ivoolve - Sistema de Rutas
// ---------------------------------------------------

import {
  MdHome,
  MdOutlineSettings,
  MdLocalShipping,
  MdMap,
} from "react-icons/md";

const routes = [
  {
    name: "Inicio",
    layout: "/dashboard",
    path: "/dashboard",
    icon: <MdHome className="h-6 w-6" />,
    permission: "read_dashboard",
  },
  {
    name: "Rutas",
    layout: "/dashboard",
    path: "/dashboard/routes",
    icon: <MdMap className="h-6 w-6" />,
    permission: "manage_routes",
    items: [
      {
        name: "Nueva ruta",
        layout: "/dashboard",
        path: "/dashboard/routes/new",
        permission: "manage_routes",
      },
      {
        name: "Mis rutas",
        layout: "/dashboard",
        path: "/dashboard/routes/list",
        permission: "manage_routes",
      },
    ],
  },
  {
    name: "Seguimiento",
    layout: "/dashboard",
    path: "/dashboard/tracking",
    icon: <MdLocalShipping className="h-6 w-6" />,
    permission: "manage_tracking",
    items: [
      {
        name: "En curso",
        layout: "/dashboard",
        path: "/dashboard/tracking/active",
        permission: "manage_tracking",
      },
      {
        name: "Historial",
        layout: "/dashboard",
        path: "/dashboard/tracking/history",
        permission: "manage_tracking",
      },
    ],
  },
  {
    name: "Configuración",
    layout: "/dashboard",
    path: "/dashboard/settings",
    icon: <MdOutlineSettings className="h-6 w-6" />,
    permission: "read_settings",
  },
];

export default routes;
