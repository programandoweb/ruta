'use client';

import { MdModeEdit } from "react-icons/md";
import { IoMdTrash,IoMdSearch } from "react-icons/io";
import { AiFillCheckCircle, AiFillCloseCircle, AiFillWarning } from "react-icons/ai"; // Íconos de estatus
import { Fragment, useEffect, useState, type JSX } from "react";
import CardMenu from "@/components/card/CardMenu";
import Card from "@/components/card";
import Link from "next/link";
import useFormDataNew from "@/hooks/useFormDataNew";
import { setShowModal, setDialogTitle, setAcceptModal } from "@/store/Slices/dialogMessagesSlice";
import { useSelector, useDispatch } from 'react-redux';
import TablePaginationDemo from "./Pagination";
import { useSearchParams } from 'next/navigation';
import ResumeComponent from "./Resume";
import ModalComponent from "../modal/ModalComponent";
import Image from "next/image";

interface PaginatorData {
  data: any;
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

type Props = {
  back?:boolean;
  subFixed?:string;
  preFixed?:string;
  preview?:boolean;
  title?: string;
  alias?: string;
  del?: boolean;
  skipEdit?: boolean;
  classNameTd?: any[];
  dataset?: any[] | undefined;
  skipHeader?: boolean | undefined;
  component?: any;
  viewDateFilter?: boolean;
  viewSearchFilter?: boolean;
  download?:boolean
}

let init: any;

// Componente para renderizar el estado dinámicamente con íconos y colores
const StatusCell = ({ status }: { status: string }) => {
  let icon: JSX.Element | null = null;
  let bold = false;
  let new_string = null;

  // Verifica el estado y aplica íconos y negrita a los valores reconocidos

  const switch_value: any = status.toString().toLowerCase();

  switch (switch_value) {
    case "cortado":
    case "armado":
      icon = <AiFillCheckCircle className="text-blue-500" />;
      bold = true;
      break;

    case "alistado":
    case "laqueado":
      icon = <AiFillCheckCircle className="text-orange-500" />;
      bold = true;
      break;

    case "ensamble":
      icon = <AiFillCheckCircle className="text-purple-500" />;
      bold = true;
      break;

    case "1":
      icon = <AiFillCheckCircle className="text-green-500" />;
      bold = true;
      new_string = "Activo";
      break;

    case "0":
      icon = <AiFillCloseCircle className="text-red-500" />;
      bold = true;
      new_string = "Inactivo";
      break;

    case "entrada":
    case "pagado":
    case "finalizado":
      icon = <AiFillCheckCircle className="text-green-500" />;
      bold = true;
      break;
    case "salida":
    case "open":
      icon = <AiFillWarning className="text-yellow-500" />;
      bold = true;
    break;
    case "close":
      icon = <AiFillCloseCircle className="text-red-500" />;
      bold = true;
      break;
    case "trash":
      icon = <AiFillCloseCircle className="text-gray-500" />;
      bold = true;
      break;

    case "sale":
    case "payment":
    case "receipt":
      icon = <AiFillCheckCircle className="text-green-500" />;
      bold = true;
      break;

    case "purchase":
    case "débito":
    case "parcial":
      icon = <AiFillCheckCircle className="text-blue-500" />;
      bold = true;
      break;

    case "tax":
      icon = <AiFillCheckCircle className="text-yellow-500" />;
      bold = true;
      break;

    case "venta en espera":
    case "pago en espera":
    case "en espera":
      icon = <AiFillWarning className="text-yellow-500" />;
      bold = true;
      break;

    case "venta finalizada":
      icon = <AiFillCheckCircle className="text-green-500" />;
      bold = true;
    break;
    case "alerta: inventario bajo":
    case "anulado":
      icon = <AiFillCloseCircle className="text-red-500" />;
      bold = true;
      break;

    case "efectivo":
      icon = <AiFillCheckCircle className="text-green-500" />;
      bold = true;
      break;

    case "transferencia":
      icon = <AiFillCheckCircle className="text-blue-500" />;
      bold = true;
      break;

    case "crédito":
      icon = <AiFillCheckCircle className="text-purple-500" />;
      bold = true;
      break;

    default:
      icon = null;
      bold = false;
      break;
  }

  return (
    <div className="flex items-center gap-2 justify-center">
      {icon && <div className="rounded-full text-xl">{icon}</div>}
      <p className={`text-sm ${bold ? 'font-bold' : ''} text-navy-700 dark:text-white`}>
        {new_string || status}
      </p>
    </div>
  );
};

const ColumnsTable = (props: Props) => {
  const initialPaginatorData: PaginatorData = {
    current_page: 1,
    data: [],
    first_page_url: '',
    from: 0,
    last_page: 1,
    last_page_url: '',
    links: [],
    next_page_url: null,
    path: '',
    per_page: 15,
    prev_page_url: null,
    to: 0,
    total: 0,    
  };

  const searchParams = useSearchParams();
  const { back, alias, del, classNameTd, dataset, skipHeader, skipEdit, component, viewDateFilter, viewSearchFilter, preview, subFixed, preFixed, download } = props;
  const { accept }    =     useSelector((select: any) => select.dialog) || {};
  const { loading }   =     useSelector((select: any) => select.loading.open) || false;
  const dispatch      =     useDispatch();
  const [columnsState, setColumnsState] =   useState<string[]>([]);
  const [rowsState, setRowsState]       =   useState<any[]>([]);
  const { handleRequest, backend }      =   useFormDataNew(false, false, false);
  const [paginator, setPaginator]       =   useState<PaginatorData>(initialPaginatorData);
  const [status, setStatus]             =   useState<any>({salesStatuses:[],paymentStatuses:[]});

  const [modal, setModal] = useState<any>(false);
  const [load, setLoad] = useState<any>(false);

  init = () => {
    setLoad(true);
    setRowsState([]);

    if (dataset) {
      if (!dataset[0]) {
        setLoad(false); // Agregar esta línea para detener el loading si dataset no tiene datos
        return;
      }
      setRowsState(dataset);
      const columns__: string[] = [];
      Object.entries(dataset[0]).map((row) => {
        columns__.push(row[0]);
      });
      setColumnsState(columns__);
      setLoad(false); // Asegurarse de detener el loading
      return;
    }

    handleRequest(backend + document.location.pathname + "?" + searchParams.toString(), "get").then(response => {
      setLoad(false);
      
      if (response && response.salesStatuses && response.paymentStatuses ) {
        setStatus({salesStatuses:response.salesStatuses,paymentStatuses:response.paymentStatuses})
      }

      if (response && alias && response[alias] && response[alias].data) {
        setPaginator(response[alias] || {});
      }
      if (response && alias && response[alias] && response[alias].data && response[alias].data[0]) {
        setRowsState(response[alias].data);
        const columns__: string[] = [];
        Object.entries(response[alias].data[0]).map((row) => {
          columns__.push(row[0]);
        });
        setColumnsState(columns__);
      }

    });
  }

  useEffect(() => {
    if (!accept) {
      init();
    }
    if (!modal && !load) {
      init();
    }
  }, [accept, searchParams, modal]);

  const HandleModal = (row: any) => {
    dispatch(setAcceptModal(row));
    dispatch(setDialogTitle("<div>Está a punto de eliminar este registro</div><b>¿Está seguro de continuar?</b>"));
    dispatch(setShowModal(true));
  }

  const handleResume = (row: any) => {
    setModal(row);
  }

  return (
    <Card className="w-full pb-10 p-4 h-full bg-lightPrimary dark:bg-darkPrimary">
      {
        (!skipHeader || viewSearchFilter) && (
          <header className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              {/* Title */}
            </div>
            <CardMenu download={download} back={back?true:false} status={status} viewDateFilter={viewDateFilter} viewSearchFilter={viewSearchFilter} skipHeader={skipHeader} />
          </header>
        )
      }

      {     
        modal&&(<ModalComponent component={component || ResumeComponent} row={modal} modal={modal} onClose={() => setModal(false)} />)
      }      

      <div className="mt-8 h-full overflow-x-auto">
        <table className="w-full">
  <thead className="rounded-t-lg">
    <tr className="bg-brand-500 text-white pt-[5px] pb-[5px]">
      {columnsState?.map((row, key) => {
        if (row === 'id' || row === 'resume') return;
        return (
          <th
            key={key}
            className={
              "border-b border-gray-200 dark:!border-navy-700 pl-2 " +
              ((classNameTd && classNameTd[key - 1]) || " text-center ")
            }
          >
            {row}
          </th>
        );
      })}
      {!skipEdit && (
        <th
          style={{ width: 100 }}
          className="border-b border-gray-200 py-[10px] text-center dark:!border-navy-700"
        >
          {!loading && columnsState.length > 0
            ? "Acción"
            : "No hay datos a mostrar"}
        </th>
      )}
    </tr>
  </thead>
  <tbody>
    {rowsState.map((row, index) => (
      <tr
        key={index}
        className={
          index % 2 === 0 ? "bg-gray-200 hover:bg-gray-300" : "hover:bg-gray-300"
        }
      >
        {!columnsState.find((search: {}) => search === 'resume') ? (
          <Fragment>
            {columnsState?.map((rowColumn, keyColumn) => {
              if (rowColumn === 'id') return null;

              if (rowColumn === 'cover') {
                return (
                  <td
                    key={keyColumn}
                    className={
                      "px-[10px] pt-[5px] pb-[5px] sm:text-[14px] " +
                      ((classNameTd && classNameTd[keyColumn - 1]) ||
                        " text-center ")
                    }
                  >
                    <Image
                      src={row[rowColumn]}
                      alt="cover image"
                      width={50}
                      height={50}
                      className="rounded"
                    />
                  </td>
                );
              }

              if (
                rowColumn.toLowerCase().includes('status') ||
                rowColumn.toLowerCase().includes('estatus')
              ) {
                return (
                  <td
                    key={keyColumn}
                    className={
                      "px-[10px] pt-[5px] pb-[5px] sm:text-[14px] " +
                      ((classNameTd && classNameTd[keyColumn - 1]) ||
                        " text-center ")
                    }
                  >
                    <StatusCell status={row[rowColumn]} />
                  </td>
                );
              }

              return (
                <td
                  key={keyColumn}
                  className={
                    "px-[10px] pt-[5px] pb-[5px] sm:text-[14px] " +
                    ((classNameTd && classNameTd[keyColumn - 1]) ||
                      " text-center ")
                  }
                >
                  {typeof row[rowColumn] === 'object' && row[rowColumn] !== null
                    ? '—'
                    : row[rowColumn]}
                </td>
              );
            })}
          </Fragment>
        ) : (
          <Fragment>
            {columnsState?.map((rowColumn, keyColumn) => {
              if (rowColumn === 'id' || rowColumn === 'resume') return;

              return (
                <td
                  key={keyColumn}
                  className={
                    "px-[10px] pt-[5px] pb-[5px] sm:text-[14px] " +
                    ((classNameTd && classNameTd[keyColumn - 1]) ||
                      " text-center ")
                  }
                >
                  <div onClick={() => handleResume(row)}>
                    {rowColumn.toLowerCase().includes('status') ||
                    rowColumn.toLowerCase().includes('estatus') ||
                    rowColumn.toLowerCase().includes('estado de pago') ||
                    rowColumn.toLowerCase().includes('estado') ||
                    rowColumn.toLowerCase().includes('estado de venta') ? (
                      <StatusCell status={row[rowColumn]} />
                    ) : (
                      <Fragment>
                        {typeof row[rowColumn] === 'object' && row[rowColumn] !== null
                          ? '—'
                          : row[rowColumn]}
                      </Fragment>
                    )}
                  </div>
                </td>
              );
            })}
          </Fragment>
        )}
        <td>
          <div
            className={
              "flex justify-center pt-[5px] pb-[5px] sm:text-[20px] text-center" +
              (row.Fijo && row.Fijo === 'Sí'
                ? " pointer-events-none opacity-20"
                : "")
            }
          >
            {!skipEdit && (
              <Link
                href={
                  document.location.pathname +
                  "/" +
                  (preFixed || "") +
                  String(row.id) +
                  (subFixed || "")
                }
              >
                <div style={{ display: "inline-block", textAlign: "center" }}>
                  <MdModeEdit className="text-brand-500" />
                </div>
              </Link>
            )}
            {preview && (
              <Link
                href={
                  document.location.pathname + "/" + String(row.id) + "?readonly=1"
                }
              >
                <span className="cursor-pointer">
                  <IoMdSearch className="w-6 h-6 text-blue-500" />
                </span>
              </Link>
            )}
            {del && (
              <span className="cursor-pointer" onClick={() => HandleModal(row)}>
                <IoMdTrash className="w-6 h-6 text-red-500" />
              </span>
            )}
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        { !load && <TablePaginationDemo paginator={paginator} /> }
      </div>
    </Card>
  );
};

export default ColumnsTable;
