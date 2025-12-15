'use client'
/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiAlignJustify } from "react-icons/fi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { AiOutlineQrcode } from "react-icons/ai";
import Dropdown from "@/components/dropdown";
import routes from "@/data/routes";
import { useSidebarContext } from "@/providers/SidebarProvider";
import Cookies from "js-cookie";
import { clearData, clearDataInputs } from "@/store/Slices/dataSlice";
import { useDispatch } from "react-redux";
import Image from "next/image";

/* 🔹 NUEVO */
import DrawerComponent from "@/components/drawer";
import { setOpenDrawer } from "@/store/Slices/dialogMessagesSlice";
import ProductionOrderScanner from "../QrScannerComponent/ProductionOrderScanner";

type Props = {}

const Navbar = ({}: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenSidebar } = useSidebarContext();

  const [currentRoute, setCurrentRoute] = useState("Main Dashboard");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    getActiveRoute(routes);
  }, [pathname]);

  const getActiveRoute = (routes: any): string => {
    let activeRoute = "Main Dashboard";

    routes.map((row: any) => {
      if (row.items) {
        const found =
          row.items.find((r: any) => r.path === window.location.pathname) ||
          row.items.find((r: any) =>
            window.location.pathname.includes(r.path)
          );

        if (found) {
          setCurrentRoute(found.name);
          activeRoute = found.name;
        }
      } else if (window.location.href.indexOf(row.path) !== -1) {
        setCurrentRoute(row.name);
        activeRoute = row.name;
      }
    });

    return activeRoute;
  };

  const handleOffSession = async () => {
    dispatch(clearDataInputs());
    dispatch(clearData());
    localStorage.removeItem("user");
    Cookies.remove("token");
    setTimeout(() => router.replace(`/auth`), 1000);
  };

  const handleMyProfile = () => {
    router.replace(`/dashboard/profile`);
  };

  return (
    <>
      {/* 🔹 DRAWER GLOBAL */}
      <DrawerComponent width="100vw">
        <div className="flex h-full w-full bg-gray-50 dark:bg-gray-900">
          <ProductionOrderScanner />
        </div>
      </DrawerComponent>

      <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
        {/* LEFT */}
        <div className="ml-[6px]">
          <div className="h-6 w-[224px] pt-1">
            <Link className="text-sm font-normal text-navy-700 dark:text-white" href="#">
              Pages <span className="mx-1">/</span>
            </Link>
            <Link className="text-sm font-normal capitalize text-navy-700 dark:text-white" href="#">
              {currentRoute}
            </Link>
          </div>
          <p className="text-[26px] font-bold capitalize text-navy-700 dark:text-white">
            {currentRoute}
          </p>
        </div>

        {/* RIGHT */}
        <div className="relative mt-[3px] flex h-[61px] w-[105px] items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl dark:!bg-navy-800 md:w-[145px]">

          <span
            className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
            onClick={() => setOpenSidebar(true)}
          >
            <FiAlignJustify className="h-5 w-5" />
          </span>

          {/* 🔹 QR ICON */}
          <div
            onClick={() =>
              dispatch(
                setOpenDrawer({
                  direction: "right",
                  open: true,
                })
              )
            }
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 dark:bg-navy-700 dark:text-white"
            title="Escanear código QR"
          >
            <AiOutlineQrcode className="h-5 w-5" />
          </div>

          {/* INFO */}
          <Dropdown
            button={
              <IoMdInformationCircleOutline className="h-4 w-4 cursor-pointer text-gray-600 dark:text-white" />
            }
            className="py-2 top-6 -left-[250px] w-max"
          >
            <div className="flex w-[350px] flex-col gap-2 rounded-[20px] bg-white p-4 shadow-xl dark:bg-navy-700 dark:text-white">
              <Link
                target="blank"
                href="https://programandoweb.net/"
                className="flex items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white"
              >
                Design & Dev
              </Link>
            </div>
          </Dropdown>

          {/* PROFILE */}
          <Dropdown
            button={
              <Image
                className="h-10 w-10 cursor-pointer rounded-full"
                src={"/img/avatars/avatar4.png"}
                alt="Avatar"
                width={50}
                height={50}
              />
            }
            className="py-2 top-8 -left-[180px] w-max"
          >
            <div className="flex w-56 flex-col rounded-[20px] bg-white p-4 shadow-xl dark:bg-navy-700 dark:text-white">
              <p className="mb-2 text-sm font-bold">👋 Hola, {user?.name}</p>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 mb-2" />
              <div onClick={handleMyProfile} className="cursor-pointer text-sm hover:underline">
                Mi perfil
              </div>
              <div
                onClick={handleOffSession}
                className="mt-3 cursor-pointer text-sm font-medium text-red-500 hover:underline"
              >
                Cerrar sesión
              </div>
            </div>
          </Dropdown>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
