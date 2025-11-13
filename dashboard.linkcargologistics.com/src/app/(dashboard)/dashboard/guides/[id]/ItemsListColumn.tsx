"use client";

import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

interface Props {
  items: any[];
  expandedItems: number[];
  toggleExpand: (idx: number) => void;
  handleDelete: (idx: number) => void;
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const ItemsListColumn: React.FC<Props> = ({
  items,
  expandedItems,
  toggleExpand,
  handleDelete,
  setItems,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Listado de Items</h2>
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item, idx) => {
            const isExpanded = expandedItems.includes(idx);
            return (
              <div
                key={item.id || idx}
                className="p-4 rounded-lg shadow-md border bg-white"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(idx)}
                >
                  <p className="font-semibold text-gray-800">
                    {item.name || "Sin nombre"}
                  </p>
                  {isExpanded ? (
                    <FiChevronUp className="text-gray-600" size={20} />
                  ) : (
                    <FiChevronDown className="text-gray-600" size={20} />
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-3 space-y-2">
                    {item.guide && (
                      <p className="text-sm font-semibold text-gray-800">
                        Guía: {item.guide}
                      </p>
                    )}
                    <p className="text-sm text-gray-700">
                      Teléfono: {item.phone}
                    </p>

                    <div>
                      <label className="block text-xs font-medium text-gray-500">
                        Origen:
                      </label>
                      <input
                        type="text"
                        value={item.origin_address}
                        onChange={(e) =>
                          setItems((prev) =>
                            prev.map((it, i) =>
                              i === idx
                                ? { ...it, origin_address: e.target.value }
                                : it
                            )
                          )
                        }
                        className="border rounded px-2 py-1 text-sm w-full mt-1"
                      />
                    </div>

                    <p className="text-sm text-gray-700 capitalize">
                      Tipo: {item.type}
                    </p>
                    <p className="text-sm text-gray-700">Estado: {item.status}</p>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        title="Eliminar"
                        onClick={() => handleDelete(idx)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 italic">No hay items cargados en la ruta.</p>
      )}
    </div>
  );
};

export default ItemsListColumn;
