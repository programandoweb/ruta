"use client";

/**
 * ---------------------------------------------------
 * Desarrollado por: Jorge Méndez - Programandoweb
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

const ENDPOINT = {
  MOV: "https://app.movexlogistica.com/api/v1/packages/pdf/guide?guideNumber=",
  LAT: "https://backend.latinoexpress-cargo.com/api/v1/packages/pdf/guide?guideNumber=",
} as const;

type ServiceKey = keyof typeof ENDPOINT;

const CSRRouteCardsMobile = ({
  routes,
  itemsById,
  data,
  setInputs,
  handleAccept,
  handleReject,
  openGoogleMapsAndNotify,
}: any) => {
  return (
    <div className="space-y-5">
      {routes.map((route: any, index: number) => {
        const relatedItem = itemsById.get(route.phone);

        return (
          <div
            key={route.order}
            className="bg-white rounded-xl shadow border border-gray-100 p-4 space-y-4"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {index + 1}. {route.origen_real}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {route.address}
                </p>
              </div>

              <button
                onClick={() => openGoogleMapsAndNotify(route)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700"
              >
                <FaMapMarkedAlt size={16} />
              </button>
            </div>

            {/* INFO CLIENTE */}
            {relatedItem && (
              <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1">
                <p><b>Guía:</b> {relatedItem.guide}</p>
                <p><b>Nombre:</b> {relatedItem.name || "No disponible"}</p>
                <p><b>Teléfono:</b> {relatedItem.phone}</p>

                <div className="flex justify-between items-center pt-1">
                  <span className="font-semibold">
                    {relatedItem.type === "pickup"
                      ? "Recoger caja"
                      : "Entregar caja"}
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                    {relatedItem.status}
                  </span>
                </div>
              </div>
            )}

            {/* CAJAS */}
            <div className="space-y-3">
              {route?.json_box_and_guide?.map((row: any, k: number) => {
                const service = row?.service as ServiceKey | undefined;

                return (
                  <div
                    key={k}
                    className="border rounded-lg p-3 space-y-3 bg-gray-50"
                  >
                    {/* BOX INFO */}
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <div>
                        {row.guide}{" "}
                        <span className="text-gray-400 mx-1">|</span>
                        {row.box}
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        {row.status}
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap items-center gap-3">
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

                      <Link
                        target="_blank"
                        title="PDF"
                        href={
                          service
                            ? `${ENDPOINT[service]}${row.guide}`
                            : "#"
                        }
                        className="text-red-600"
                      >
                        <FaFilePdf size={18} />
                      </Link>

                      {row.status === "Borrador" && (
                        <Fragment>
                          <button
                            title="Aceptar"
                            onClick={() =>
                              handleAccept(
                                route.address,
                                relatedItem.id,
                                row
                              )
                            }
                            className="text-green-600"
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
                            className="text-red-600"
                          >
                            <FaThumbsDown size={18} />
                          </button>
                        </Fragment>
                      )}
                    </div>
                  </div>
                );
              })}
              <CommentsSectionContainer module="attendance" pathname={"tracking_" + relatedItem.guide} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CSRRouteCardsMobile;
