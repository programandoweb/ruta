"use client";

import Link from "next/link";
import Image from "next/image";
import { MdModeEdit } from "react-icons/md";
import { IoMdTrash, IoMdSearch } from "react-icons/io";
import StatusCell from "./StatusCell";

const ColumnsTableCards = ({
  columnsState,
  rowsState,
  skipEdit,
  preview,
  del,
  preFixed,
  subFixed,
  HandleModal,
  handleResume,
}: any) => {
  return (
    <div className="space-y-4">
      {rowsState.map((row: any, index: number) => (
        <div
          key={index}
          className="bg-white rounded-xl border shadow-sm p-4 space-y-3"
        >
          {columnsState.map((col: string) => {
            if (col === "id" || col === "resume") return null;

            return (
              <div key={col} className="flex justify-between text-sm">
                <span className="font-semibold text-gray-500">
                  {col}
                </span>

                <span className="text-right">
                  {col === "cover" ? (
                    <Image
                      src={row[col]}
                      alt="cover"
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  ) : col.toLowerCase().includes("status") ? (
                    <StatusCell status={row[col]} />
                  ) : typeof row[col] === "object" ? (
                    "—"
                  ) : (
                    row[col]
                  )}
                </span>
              </div>
            );
          })}

          <div className="flex justify-end gap-3 pt-2 border-t">
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
        </div>
      ))}
    </div>
  );
};

export default ColumnsTableCards;
