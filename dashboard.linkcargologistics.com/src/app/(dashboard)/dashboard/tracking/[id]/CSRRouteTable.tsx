"use client";

/**
 * ---------------------------------------------------
 * Desarrollado por: Jorge Méndez - Programandoweb
 * Correo: lic.jorgemendez@gmail.com
 * Celular: 3115000926
 * website: Programandoweb.net
 * Proyecto: Ivoolve - Sistema de Rutas
 * ---------------------------------------------------
 */

import { Fragment } from "react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaMapMarkedAlt,
  FaFilePdf,
} from "react-icons/fa";
import BasicBtnUpload from "@/components/buttom/BasicBtnUpload";
import Link from "next/link";
import CommentsSectionContainer from "@/components/comments";
import { DAYS } from "@/constants/days";

const ENDPOINT = {
  MOV: "https://app.movexlogistica.com/api/v1/packages/pdf/guide?guideNumber=",
  LAT: "https://backend.latinoexpress-cargo.com/api/v1/packages/pdf/guide?guideNumber=",
} as const;

type ServiceKey = keyof typeof ENDPOINT;

const CSRRouteTable = ({
  routes,
  itemsById,
  data,
  setInputs,
  handleAccept,
  handleReject,
  openGoogleMapsAndNotify,
}: any) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              ID
            </th>
            <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              Dirección
            </th>
            <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              Cajas / Evidencias
            </th>
            <th className="px-5 py-3 text-center text-xs font-bold text-gray-600 uppercase">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-100">
          {routes.map((route: any, index: number) => {
            const relatedItem = itemsById.get(route.phone);
            console.log(relatedItem)
            return (
              <tr key={route.order} className="hover:bg-gray-50 transition">
                <td className="px-5 py-4 align-top">
                  <div className="font-semibold text-gray-800">
                    {index + 1}. {route.origen_real}
                  </div>
                </td>

                <td className="px-5 py-4 align-top">
                  {relatedItem && (
                    <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 space-y-1">
                      <p><b>Dirección IA:</b> {route.address}</p>
                      <p><b>Guía:</b> {relatedItem.guide}</p>
                      <p><b>Nombre:</b> {relatedItem.name || "No disponible"}</p>
                      <p><b>Teléfono:</b> {relatedItem.phone}</p>
                      <p>
                        <b>Status:</b>{" "}
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                          {relatedItem.status}
                        </span>
                      </p>
                      <p className="">
                        <b>Observación:</b> {relatedItem.observation}
                      </p>
                      <p className="">
                        <b>Día:</b> {DAYS[relatedItem.day]}
                      </p>
                      <p>
                        <b>Acción:</b>{" "}
                        {relatedItem.type === "pickup"
                          ? "Recoger caja"
                          : "Entregar caja"}
                      </p>
                      <CommentsSectionContainer module="attendance" pathname={"tracking_" + relatedItem.guide} />
                    </div>
                  )}
                </td>

                <td className="px-5 py-4 align-top space-y-3">
                  {route?.json_box_and_guide?.map((row: any, k: number) => {
                    const service = row?.service as ServiceKey | undefined;

                    return (
                      <div
                        key={k}
                        className="flex flex-wrap items-center justify-between gap-3 border rounded-lg p-3 bg-gray-50"
                      >
                        <div className="text-xs font-semibold text-gray-700">
                          {row.guide}
                          <span className="text-gray-400 mx-1">|</span>
                          {row.box}
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                            {row.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <BasicBtnUpload
                            name={"evidence_" + row.guide + row.box}
                            keys={JSON.stringify({
                              order: data?.id,
                              lat: route?.lat,
                              lng: route?.lng,
                            })}
                            gallery={row?.evidences}
                            label="Subir evidencia"
                            setFormData={setInputs}
                          />

                          {row.status === "Borrador" ? (
                            <>
                              <Link
                                target="_blank"
                                title="PDF"
                                href={
                                  service
                                    ? `${ENDPOINT[service]}${row.guide}`
                                    : "#"
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaFilePdf size={18} />
                              </Link>

                              <button
                                title="Aceptar"
                                onClick={() =>
                                  handleAccept(
                                    route.address,
                                    relatedItem.id,
                                    row
                                  )
                                }
                                className="text-green-600 hover:text-green-800"
                              >
                                <FaThumbsUp size={18} />
                              </button>

                              <button
                                title="Rechazar"
                                onClick={() =>
                                  handleReject(
                                    route.address,
                                    relatedItem.id,
                                    row
                                  )
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaThumbsDown size={18} />
                              </button>
                            </>
                          ) : (
                            <Fragment>
                              <Link
                                target="_blank"
                                title="PDF"
                                href={
                                  service
                                    ? `${ENDPOINT[service]}${row.guide}`
                                    : "#"
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaFilePdf size={18} />
                              </Link>
                              <span className="text-xs font-bold uppercase text-gray-500">
                                {row.status}
                              </span>
                            </Fragment>
                          )}
                        </div>
                        
                      </div>
                    );
                  })}
                </td>

                <td className="px-5 py-4 text-center align-middle">
                  <button
                    title="Abrir mapa"
                    onClick={() => openGoogleMapsAndNotify(route)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                  >
                    <FaMapMarkedAlt size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CSRRouteTable;
