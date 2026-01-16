'use client';

import * as React from "react";
import { useState } from "react";
import useAsyncStorage from "@/hooks/useAsyncStorage";
import { MdFileUpload } from "react-icons/md";

interface UploadBtnProps {
  label: string;
  name: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  className?: string;
  disabled?: boolean;
  fileName?: string;
  keys?: any;
  gallery?: any;
}

const BasicBtnUpload: React.FC<UploadBtnProps> = ({
  label,
  name,
  className,
  disabled,
  fileName,
  keys,
  gallery: galleryProps,
}) => {
  const storage = useAsyncStorage();

  const [isLoading, setIsLoading] = useState(false);
  const [gallery, setGallery] = useState<string[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Aceptar SOLO imágenes
    if (!file.type.startsWith('image/')) {
      e.target.value = '';
      return;
    }

    // Máx 5MB
    if (file.size > 5 * 1024 * 1024) {
      e.target.value = '';
      return;
    }

    setIsLoading(true);

    try {
      const user = await storage.getData("user");
      const formData = new FormData();

      formData.append("doc", file);
      formData.append("save_as", "route_items");
      formData.append("prefixed", name);
      formData.append("key", keys);
      formData.append("content", "evidence_urls");
      if (fileName) formData.append("fileName", fileName);

      let BACKEND = `${window.location.protocol}//${window.location.hostname}/api/v1`;

      if (window.location.hostname === "localhost") {
        BACKEND = BACKEND.replace(
          "localhost",
          `localhost:${process.env.NEXT_PUBLIC_PORT}`
        );
      }

      if (process.env.NEXT_PUBLIC_BACKEND_URL) {
        BACKEND =
          process.env.NEXT_PUBLIC_BACKEND_URL +
          process.env.NEXT_PUBLIC_VERSION;
      }

      const response = await fetch(
        BACKEND + (user ? "/multimedia/upload" : "/multimedia/upload-open"),
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (!response.ok) throw new Error();

      const responseData = await response.json();
      const slug = responseData?.data?.doc?.slug;

      if (slug) {
        setGallery((prev) => [...prev, slug]);
      }
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  React.useEffect(() => {
    if (galleryProps) {
      setGallery(galleryProps);
    }
  }, [galleryProps]);

  return (
    <div className={`inline-flex flex-col items-center ${className || ""}`}>
      <label
        className={`
          inline-flex items-center gap-2
          px-3 py-1.5
          text-xs font-medium
          rounded-md
          border border-brand-500
          text-brand-600
          hover:bg-brand-50
          transition
          cursor-pointer
          ${disabled ? "opacity-40 cursor-not-allowed" : ""}
        `}
      >
        <MdFileUpload size={16} />
        {isLoading ? "Subiendo…" : label}

        {!disabled && (
          <input
            type="file"
            className="hidden"
            accept="image/*"   // ✅ SOLO imágenes
            onChange={handleUpload}
          />
        )}
      </label>

      {gallery.length > 0 && (
        <div className="mt-2 flex gap-1 flex-wrap justify-center">
          {gallery.map((img, i) => (
            <a
              key={i}
              href={img}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-10 h-10 border rounded overflow-hidden hover:opacity-80"
              title={`Evidencia ${i + 1}`}
            >
              <img
                src={img}
                alt={`evidencia-${i}`}
                className="w-full h-full object-cover"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default BasicBtnUpload;
