import React, { useState, useEffect } from 'react';
import { MdModeEdit } from "react-icons/md";
import { SettingTablesProps } from "@/data/interface";

const MasterTable: React.FC<SettingTablesProps> = ({ dataset, setOpen, grupo, skipAdd }) => {

  const [currentPage, setCurrentPage]     =   useState(1);
  const [itemsPerPage]                    =   useState(10);
  const [filteredData, setFilteredData]   =   useState(dataset||[]);
  const [filter, setFilter]               =   useState('');

  useEffect(() => {
    if(dataset&&dataset.length>0){      
      setFilteredData(dataset.filter((item:any) => item.Nombre.toLowerCase().includes(filter.toLowerCase())));
      setCurrentPage(1); // Reset to first page on filter change
    }else{
      setFilteredData([])
    }    
  }, [filter, dataset]);

  const indexOfLastItem     =   currentPage * itemsPerPage;
  const indexOfFirstItem    =   indexOfLastItem - itemsPerPage;
  const currentItems        =   filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages          =   Math.ceil(filteredData.length / itemsPerPage);

  

  return (
    <div className="h-full overflow-x-auto">
      <input
        type="text"
        placeholder="Filtrar..."
        className="mb-4 p-2 border rounded w-full"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <table className="w-full">
        <thead className="rounded-t-lg">
          <tr className="bg-brand-500 text-white pt-[5px] pb-[5px]">
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row, key) => (
            <tr key={key}>
              <td>
                <div className="p-2">
                  {row.Nombre}
                </div>
              </td>
              <td width={100}>
                <div className="cursor-pointer p-2 flex justify-center pt-[5px] pb-[5px] sm:text-[20px] text-center">
                  <MdModeEdit className="w-6 h-6 text-brand-500 cursor-pointer" onClick={() => setOpen(row)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-gray-300' : ''}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
      {!skipAdd && (
        <div
          onClick={() => setOpen({ Nombre: " ", grupo })}
          className="flex align-middle justify-center text-center linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        >
          Agregar
        </div>
      )}
    </div>
  );
};

export default MasterTable;
