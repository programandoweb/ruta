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
import { DAYS } from "@/constants/days";
import { formatearMonto } from "@/utils/fuctions";

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
        const status = relatedItem?.json_status ?? {};
        const service: ServiceKey = "MOV";

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

            {/* INFO DETALLADA */}
            {relatedItem && (
              <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1">
                <p><b>Dirección IA:</b> {route.address}</p>
                <p><b>Guía:</b> {relatedItem.guide}</p>
                <p><b>Nombre:</b> {relatedItem.name || "No disponible"}</p>
                <p><b>Cobrar:</b> {formatearMonto(route.cost)}</p>
                <p><b>Depósito:</b> {formatearMonto(route.deposit)}</p>
                <p><b>Teléfono:</b> {relatedItem.phone}</p>
                <p><b>Observación:</b> {relatedItem.observation}</p>
                <p><b>Día:</b> {DAYS[relatedItem.day]}</p>
                <p>
                  <b>Acción:</b>{" "}
                  {!route?.delivery_day
                    ? "Recoger caja"
                    : "Entregar caja"}
                </p>

                <CommentsSectionContainer
                  module="attendance"
                  pathname={"tracking_" + relatedItem.guide}
                />
              </div>
            )}

            {/* CAJAS */}
            <div className="space-y-3">
              {route?.cajas?.map((row: any, k: number) => {
                if (!relatedItem?.guide) return null;

                const statusKey = `${relatedItem?.guide}_${row}`;
                const currentStatus =
                  status?.[statusKey]?.status ?? "Borrador";

                const keysEvidence =
                  "evidence_" + relatedItem.guide + row;

                const evidence =
                  relatedItem?.evidence_urls &&
                  typeof relatedItem.evidence_urls === "object"
                    ? relatedItem.evidence_urls[keysEvidence]
                    : [];

                return (
                  <div
                    key={k}
                    className="border rounded-lg p-3 space-y-3 bg-gray-50"
                  >
                    {/* BOX HEADER */}
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <div>
                        {relatedItem.guide}
                        <span className="text-gray-400 mx-1">|</span>
                        {row}
                        <span className="text-gray-400 mx-1">|</span>
                        {currentStatus}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap items-center gap-3">
                      <BasicBtnUpload
                        name={"evidence_" + relatedItem.guide + row}
                        keys={JSON.stringify({
                          order: data?.id,
                          lat: route?.lat,
                          lng: route?.lng,
                        })}
                        gallery={evidence || row?.evidences}
                        label="Subir evidencia"
                        setFormData={setInputs}
                      />

                      {route?.delivery_day && (
                        <Link
                          target="_blank"
                          title="PDF"
                          href={`${ENDPOINT[service]}${relatedItem.guide}`}
                          className="text-red-600"
                        >
                          <FaFilePdf size={18} />
                        </Link>
                      )}

                      {currentStatus === "Borrador" && (
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

                      {currentStatus !== "Borrador" && (
                        <span className="text-xs font-bold uppercase text-gray-500">
                          {currentStatus}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CSRRouteCardsMobile;
