"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdModeEdit } from "react-icons/md";
import { IoMdTrash, IoMdSearch } from "react-icons/io";
import StatusCell from "./StatusCell";

const ColumnsTableDesktop = ({
  columnsState,
  rowsState,
  classNameTd,
  skipEdit,
  preview,
  del,
  preFixed,
  subFixed,
  HandleModal,
  handleResume,
}: any) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-brand-500 text-white">
            {columnsState.map((col: string, key: number) => {
              if (col === "id" || col === "resume") return null;
              return (
                <th
                  key={key}
                  className={
                    "border-b px-2 py-2 " +
                    ((classNameTd && classNameTd[key - 1]) || "text-center")
                  }
                >
                  {col}
                </th>
              );
            })}

            {!skipEdit && <th className="text-center">Acción</th>}
          </tr>
        </thead>

        <tbody>
          {rowsState.map((row: any, index: number) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-200" : "bg-white"}
            >
              {columnsState.map((col: string, key: number) => {
                if (col === "id") return null;

                if (col === "cover") {
                  return (
                    <td key={key} className="text-center">
                      <Image
                        src={row[col]}
                        alt="cover"
                        width={50}
                        height={50}
                        className="rounded"
                      />
                    </td>
                  );
                }

                if (col.toLowerCase().includes("status")) {
                  return (
                    <td key={key} className="text-center">
                      <StatusCell status={row[col]} />
                    </td>
                  );
                }

                return (
                  <td key={key} className="text-center">
                    {typeof row[col] === "object" ? "—" : row[col]}
                  </td>
                );
              })}

              <td>
                <div className="flex justify-center gap-2">
                  {!skipEdit && (
                    <Link
                      href={
                        document.location.pathname +
                        "/" +
                        (preFixed || "") +
                        row.id +
                        (subFixed || "")
                      }
                    >
                      <MdModeEdit className="text-brand-500" />
                    </Link>
                  )}

                  {preview && (
                    <Link
                      href={
                        document.location.pathname +
                        "/" +
                        row.id +
                        "?readonly=1"
                      }
                    >
                      <IoMdSearch className="text-blue-500" />
                    </Link>
                  )}

                  {del && (
                    <span onClick={() => HandleModal(row)}>
                      <IoMdTrash className="text-red-500 cursor-pointer" />
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ColumnsTableDesktop;
