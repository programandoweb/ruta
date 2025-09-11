'use client'
import { MdModeEdit } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import CardMenu from "@/components/card/CardMenu";
import Card from "@/components/card";
import Link from "next/link";
import TablePaginationDemo from "./Pagination";

interface RowData {
  id: number;
  [key: string]: any; // Allows any additional properties
}

interface Column {
  key: string;
  label: string;
  href?:string;
}

interface SimpleTableProps {
  columns: Column[];
  rows: RowData[];
}

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const SimpleTable: React.FC<SimpleTableProps> = ({ columns, rows }) => {
  return (
    <Card className={"w-full pb-10 p-4 h-full"}>
      <div className="h-full overflow-x-auto">
        <table className="w-full">
          <thead className="rounded-t-lg">
            <tr className="bg-brand-500 text-white pt-[5px] pb-[5px]">
              {columns.map((column, key) => (
                <th
                  key={key}
                  className="border-b border-gray-200 dark:!border-navy-700 pl-2 text-center"
                >
                  {column.label}
                </th>
              ))}              
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-200 hover:bg-gray-300" : "hover:bg-gray-300"}
              >
                {columns.map((column, keyColumn) => (
                  <td
                    key={keyColumn}
                    className="px-[10px] pt-[5px] pb-[5px] sm:text-[14px] text-center"
                  >
                    {
                      column.label!=="PDF"&&(
                        getNestedValue(row, column.key)
                      )
                    }
                    {
                      column.label==="PDF"&&(
                        <Link href={column.href+getNestedValue(row, column.key)||"#"} target="_blank">
                          Ver 
                        </Link>                        
                      )
                    }
                  </td>
                ))}                
              </tr>
            ))}
          </tbody>
        </table>        
      </div>
    </Card>
  );
};

export default SimpleTable;
