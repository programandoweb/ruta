// agrega este icono a tus imports
import {
  MdHome,
  MdOutlineSettings,
  MdInventory,
  MdStore,
  MdCategory,
  MdFastfood,
  MdListAlt,
  MdPeopleAlt,
  MdShoppingCart,
  MdAssessment,
  MdLocalShipping,
  MdSupervisorAccount,
  MdAttachMoney, // 👈 nuevo
} from "react-icons/md";

const routes = [
  {
    name: "Inicio",
    layout: "/dashboard",
    path: "/dashboard",
    icon: <MdHome className="h-6 w-6" />,
    permission: "read_inventory",
  },
  {
    name: "Inventario",
    layout: "/dashboard",
    path: "/dashboard/inventory",
    icon: <MdInventory className="h-6 w-6" />,
    permission: "read_inventory",
    items: [
      {
        name: "Insumos",
        layout: "/dashboard",
        path: "/dashboard/inventory/raw-materials",
        permission: "read_inventory",
      },
      {
        name: "Categorías",
        layout: "/dashboard",
        path: "/dashboard/inventory/categories",
        permission: "read_inventory",
      },
      {
        name: "Entradas",
        layout: "/dashboard",
        path: "/dashboard/inventory/entries",
        permission: "manage_inventory",
      },
      {
        name: "Salidas",
        layout: "/dashboard",
        path: "/dashboard/inventory/exits",
        permission: "manage_inventory",
      },
      {
        name: "Ajustes de stock",
        layout: "/dashboard",
        path: "/dashboard/inventory/adjustments",
        permission: "manage_inventory",
      },
    ],
  },
  {
    name: "Recetas",
    layout: "/dashboard",
    path: "/dashboard/recipes",
    icon: <MdFastfood className="h-6 w-6" />,
    permission: "read_recipes",
  },
  {
    name: "Caja",
    layout: "/dashboard",
    path: "/dashboard/cash",
    icon: <MdAttachMoney className="h-6 w-6" />,
    permission: "read_recipes",
    items: [
      {
        name: "Estado de caja",
        layout: "/dashboard",
        path: "/dashboard/cash",
        permission: "read_recipes",
      },
      {
        name: "Apertura",
        layout: "/dashboard",
        path: "/dashboard/cash/open",
        permission: "read_recipes",
      },
      {
        name: "Movimientos",
        layout: "/dashboard",
        path: "/dashboard/cash/movements",
        permission: "read_recipes",
      },
      {
        name: "Arqueo parcial",
        layout: "/dashboard",
        path: "/dashboard/cash/audit",
        permission: "read_recipes",
      },
      {
        name: "Cierre",
        layout: "/dashboard",
        path: "/dashboard/cash/close",
        permission: "read_recipes",
      },
      {
        name: "Depósitos / Retiro seguro",
        layout: "/dashboard",
        path: "/dashboard/cash/safe-drops",
        permission: "read_recipes",
      },
      {
        name: "Reporte Z (Diario)",
        layout: "/dashboard",
        path: "/dashboard/cash/report-z",
        permission: "read_recipes",
      },
    ],
  },

  {
    name: "Ventas",
    layout: "/dashboard",
    path: "/dashboard/sales",
    icon: <MdShoppingCart className="h-6 w-6" />,
    permission: "read_sales",
    items: [
      {
        name: "Ventas por día",
        layout: "/dashboard",
        path: "/dashboard/sales_by_day",
        permission: "read_inventory",
      },
      {
        name: "Todas",
        layout: "/dashboard",
        path: "/dashboard/sales",
        permission: "read_inventory",
      },      
    ],
  },
  {
    name: "Proveedores",
    layout: "/dashboard",
    path: "/dashboard/providers",
    icon: <MdLocalShipping className="h-6 w-6" />,
    permission: "read_providers",
  },
  {
    name: "Órdenes de compra",
    layout: "/dashboard",
    path: "/dashboard/purchase-orders",
    icon: <MdListAlt className="h-6 w-6" />,
    permission: "read_purchase_orders",
  },
  {
    name: "Usuarios",
    layout: "/dashboard",
    path: "/dashboard/users",
    icon: <MdPeopleAlt className="h-6 w-6" />,
    permission: "read_users",
  },
  {
  name: "Reportes",
  layout: "/dashboard",
  path: "/dashboard/reports",
  icon: <MdAssessment className="h-6 w-6" />,
  permission: "read_reports",
    items: [
      {
        name: "Inventario actual",
        layout: "/dashboard",
        path: "/dashboard/reports/inventory-status",
        permission: "read_reports",
      },
      {
        name: "Movimientos de inventario",
        layout: "/dashboard",
        path: "/dashboard/reports/inventory-movements",
        permission: "read_reports",
      },
      {
        name: "Kardex por insumo",
        layout: "/dashboard",
        path: "/dashboard/reports/kardex",
        permission: "read_reports",
      },
      {
        name: "Compras por proveedor",
        layout: "/dashboard",
        path: "/dashboard/reports/provider-purchases",
        permission: "read_reports",
      },
      {
        name: "Ganancias por productos",
        layout: "/dashboard",
        path: "/dashboard/reports/ganance-purchases",
        permission: "read_reports",
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
  {
    name: "Empresas",
    layout: "/dashboard",
    path: "/dashboard/companies",
    icon: <MdSupervisorAccount className="h-6 w-6" />,
    permission: "manage_companies",
    items: [
      {
        name: "Lista de empresas",
        layout: "/dashboard",
        path: "/dashboard/companies",
        permission: "manage_companies",
      },      
    ],
  },
];

export default routes;
