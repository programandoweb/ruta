'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiAlignJustify, FiSearch } from "react-icons/fi";
import { BsArrowBarUp } from "react-icons/bs";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import {
  IoMdNotificationsOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import Dropdown from "@/components/dropdown";

import routes from "@/data/routes";
import { useSidebarContext } from "@/providers/SidebarProvider";
import { useThemeContext } from "@/providers/ThemeProvider";

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { clearData, clearDataInputs } from "@/store/Slices/dataSlice";
import { useDispatch } from "react-redux";
import Image from "next/image";

type Props = {}

const Navbar = ({ }: Props) => {
  const dispatch = useDispatch();
  const [currentRoute, setCurrentRoute] = useState("Main Dashboard");
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenSidebar } = useSidebarContext();
  const { theme, setTheme } = useThemeContext();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    getActiveRoute(routes);
  }, [pathname]);

  const getActiveRoute = (routes: any): string => {
    let activeRoute = "Main Dashboard";
  
    const searchRoute = (routes: any[]) => {
      let result:any = false;

      routes.map((row)=>{
        if (row.items) {
          result    =   row.items.find((search:any)=>search.path===window.location.pathname)
          if(!result){
            result    =   row.items.find((search:any)=>window.location.pathname.includes(search.path))
          }
          
          if(result&&result.name){
            
            setCurrentRoute(result.name);
            activeRoute = result.name;
            return true;
          }          
        }
        if (!result&&window.location.href.indexOf(row.path) !== -1) {
          setCurrentRoute(row.name);
          activeRoute = row.name;
          return true;
        }
      })

      return false;

    };
  
    searchRoute(routes);
    
    return activeRoute;
  };
  

  const handleOffSession = async () => {
    dispatch(clearDataInputs());
    dispatch(clearData());
    localStorage.removeItem('user');
    Cookies.remove('token');
    setTimeout(() => {
      router.replace(`/auth`);
    }, 1000);
  }

  const handleMyProfile = () => {
    router.replace(`/dashboard/profile`);
  }

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <Link className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white" href=" " >
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </Link>
          <Link className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white" href="#" >
            {currentRoute}
          </Link>
        </div>
        <p className="shrink text-[26px] capitalize text-navy-700 dark:text-white">
          <Link href="#" className="font-bold capitalize hover:text-navy-700 dark:hover:text-white" >
            {currentRoute}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[55px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[105px] md:flex-grow-0 md:gap-1 xl:w-[165px] xl:gap-2">
        {
          /*          
            <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
              <p className="pl-3 pr-2 text-xl">
                <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
              </p>
              <input
                type="text"
                placeholder="Buscar..."
                className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
              />
            </div>  
          */
        }
        
        <span className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden" onClick={() => setOpenSidebar(true)} >
          <FiAlignJustify className="h-5 w-5" />
        </span>

        {/* start Horizon PRO */}
        <Dropdown
          button={
            <p className="cursor-pointer">
              <IoMdInformationCircleOutline className="h-4 w-4 text-gray-600 dark:text-white" />
            </p>
          }
          className={"py-2 top-6 -left-[250px] md:-left-[330px] w-max"}
          animation="origin-[75%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
        >
          <div className="flex w-[350px] flex-col gap-2 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
            <div className="mb-2 aspect-video w-full rounded-lg bg-cover bg-no-repeat bg-[url('/img/layout/Navbar.png')]" />
            <Link target="blank" href="https://programandoweb.net/"
              className="px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              Design & Dev
            </Link>
            {
              /*
                <Link target="blank" href="https://programandoweb.net/"
                    className="px-full linear flex cursor-pointer items-center justify-center rounded-xl border py-[11px] font-bold text-navy-700 transition duration-200 hover:bg-gray-200 hover:text-navy-700 dark:!border-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white dark:active:bg-white/10"
                  >
                    Visitar Programandoweb
                  </Link>  
              */
            }
            <Link target="blank" href="https://horizon-ui.com/?ref=live-free-tailwind-react"
              className="hover:bg-black px-full linear flex cursor-pointer items-center justify-center rounded-xl py-[11px] font-bold text-navy-700 transition duration-200 hover:text-navy-700 dark:text-white dark:hover:text-white"
            >
              horizon-ui Base del Poyecto
            </Link>
          </div>
        </Dropdown>

        {/* DARK MODE 
          <div className="cursor-pointer text-gray-600"
          onClick={() => {
            theme === 'dark' ? setTheme('light') : setTheme('dark')
          }}
        >
          {theme === 'dark' ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        
        */}
        

        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <Image  className="h-10 w-10 rounded-full cursor-pointer"
                    src={'/img/avatars/avatar4.png'}
                    alt="Elon Musk"
                    width={50}
                    height={50}/>
            
          }
          className={"py-2 top-8 -left-[180px] w-max"}
        >
          <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
            <div className="p-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  👋 Hola, {user?.name}
                </p>{" "}
              </div>
            </div>
            <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

            <div className="flex flex-col p-4">
              <div onClick={handleMyProfile} className="cursor-pointer text-sm text-gray-800 dark:text-white hover:dark:text-white" >
                Mi perfil
              </div>
              <div onClick={handleOffSession} className="cursor-pointer mt-3 text-sm font-medium text-red-500 hover:text-red-500" >
                Cerrar sesión
              </div>
            </div>
          </div>
        </Dropdown>

      </div>
    </nav>
  );
};

export default Navbar;
