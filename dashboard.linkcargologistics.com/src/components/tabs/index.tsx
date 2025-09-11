'use client';

import { useState } from 'react';
import { Tab } from './tabsInterface'; // Asegúrate de que la ruta sea correcta
import { useDispatch } from 'react-redux';
import { setOpenSC } from '@/store/Slices/dialogMessagesSlice';

const timeout:number=1000

const Tabs: React.FC<{ tabs: Tab[] }> = ({ tabs }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading]     = useState<boolean>(false);

  const handleTabClick = (index: number) => {
    setLoading(true)
    dispatch(setOpenSC(true));
    setActiveTab(index);
    setTimeout(() => {
      setLoading(false)
    }, timeout);
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-md">
      {/* Responsive Navigation */}
      <div className="border-b border-gray-200">
        {/* Dropdown for mobile */}
        <div className="sm:hidden">
          <select
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={activeTab}
            onChange={(e) => handleTabClick(Number(e.target.value))}
          >
            {tabs.map((tab, index) => (
              <option key={index} value={index}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs for larger screens */}
        <nav className="hidden sm:flex">
          {
            tabs.map((tab, index) => (
              <div
                key={index}
                className={`cursor-pointer text-center flex-1 sm:flex-none px-4 py-2 -mb-px 
                  ${
                    activeTab === index
                      ? 'text-brand-500 border-b-2 border-brand-500 dark:text-brand-400'
                      : 'text-gray-600 hover:text-brand-500 hover:border-brand-500 dark:text-gray-300 dark:hover:text-brand-400'
                  } focus:outline-none`}
                onClick={() => handleTabClick(index)}
              >
                
                {tab.label}
              </div>
            ))
          }
        </nav>
      </div>
      {/* Tabs Content */}
      <div className="p-4">
        {
          loading && (
            <div className="flex justify-center items-center min-h-[200px]">
              <div
                className="text-xl font-bold text-gray-700 dark:text-white animate-pulse transform transition-all ease-in-out duration-500"
              >
                Cargando...
              </div>
            </div>
          )
        }
        { 
          !loading&&(
            tabs[activeTab].component
          )
        }
      </div>
    </div>
  );
};

export default Tabs;
