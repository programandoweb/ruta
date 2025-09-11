'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { useSelector, useDispatch } from 'react-redux';
import { setOpenDrawer } from '@/store/Slices/dialogMessagesSlice';
import { MdClose } from 'react-icons/md';
import './index.css';

interface DrawerState {
  direction?: 'left' | 'right' | 'top' | 'bottom';
  open?: boolean;
  className?: string | null;
}

interface DialogState {
  openDrawer: DrawerState;
}

interface RootState {
  dialog: DialogState;
}

interface DrawerComponentProps {
  children?: ReactNode;
}

const DrawerComponent: React.FC<DrawerComponentProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { openDrawer } = useSelector((state: RootState) => state.dialog);
  const [drawerWidth, setDrawerWidth] = useState('40vw');
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateDrawerWidth = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setDrawerWidth('100vw');
        setIsMobile(true);
      } else if (width <= 1024) {
        setDrawerWidth('70vw');
        setIsMobile(false);
      } else {
        setDrawerWidth('40vw');
        setIsMobile(false);
      }
    };

    updateDrawerWidth();
    window.addEventListener('resize', updateDrawerWidth);
    return () => window.removeEventListener('resize', updateDrawerWidth);
  }, []);

  const toggleDrawer = () => {
    dispatch(
      setOpenDrawer({
        direction: openDrawer?.direction || 'right',
        open: !openDrawer?.open,
      })
    );
  };

  if (!mounted) return null;

  return (
    <Drawer
      open={openDrawer?.open || false}
      onClose={toggleDrawer}
      direction={openDrawer?.direction || 'right'}
      style={{ width: drawerWidth, maxWidth: '100vw' }}
      className="relative"
    >
      <div
        className={`absolute z-50 ${isMobile ? 'left-4 top-4' : 'left-5 top-5'}`}
        onClick={toggleDrawer}
      >
        <MdClose className="cursor-pointer h-8 w-8 text-gray-700 hover:text-gray-900" />
      </div>
      <div className="p-4">{children}</div>
    </Drawer>
  );
};

export default DrawerComponent;
