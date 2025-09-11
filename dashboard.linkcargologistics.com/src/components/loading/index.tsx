'use client';

import ThemeProvider from '@/providers/ThemeProvider';
import { useSelector, useDispatch } from "react-redux";
import './index.css';
import Image from 'next/image';
import { Fragment, useEffect } from 'react';
import { handleCloseLoading } from "@/store/Slices/loadingSlice";

// Definir la interfaz para el estado de la aplicación
interface RootState {
  loading: {
    open: boolean;
  };
}

const Loading = () => {
  // Utilizar la interfaz RootState para el estado
  const open = useSelector((state: RootState) => state.loading.open);
  const dispatch    =     useDispatch();

  useEffect(()=>{
    if(open){
      setTimeout(() => {
        dispatch(handleCloseLoading());
      }, 3000);
    }
  },[open])

  return <Fragment></Fragment>

  return (
    <ThemeProvider>
      <div className={`loading-overlay ${open ? 'open' : 'closed'}`}>
        <Image
          width={200}
          height={200}
          alt={String(process.env.NEXT_PUBLIC_NAME)}
          src="/img/loading.webp"
          priority
        />
      </div>
    </ThemeProvider>
  );
};

export default Loading;
