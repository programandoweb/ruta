'use client'
import React, { useEffect, useState } from "react";
import useFormData from "@/hooks/useFormDataNew";
import InputField from '@/components/fields/InputField';
import Image from "next/image";
import UploadImage from "../uploads/UploadImage";
import { Pwa } from "@/data/interface";

const prefixed = "pwa";

interface SettingPwaProps {
  dataset: Pwa;
  getInit: () => void;
}

const SettingPwa: React.FC<SettingPwaProps> = ({ dataset, getInit }) => {
  const formData = useFormData(false, false, false);
  const [inputs, setInputs] = useState<any>({});
  const [items, setItems] = useState<any[]>([]);
  const [icons, setIcons] = useState<any[]>([]);
  const [screenshots, setScreenshots] = useState<any[]>([]);

  useEffect(() => {
    const inputs_: any[] = [];
    const inputs_2: any = {};
    if (dataset) {
      Object.entries(dataset).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (key === 'icons') {
            setIcons(value);
          } else if (key === 'screenshots') {
            setScreenshots(value);
          }
        } else {
          inputs_.push({ name: key, value: value as string });
          inputs_2[key] = value;
        }
      });
      setInputs(inputs_2);
      setItems(inputs_);
    }
  }, [dataset]);

  const handleCreateDB = () => {
    formData.handleRequest(formData.backend + location.pathname + "/pwa", "post", { ...inputs })
      .then((response: any) => {
        if (response && response[prefixed]) {
          console.log(response[prefixed]);
        }
      });
  };

  return (
    <div>
      <div className="p-4 bg-gray-50">
        <div className="text-lg text-navy-700 dark:text-white font-bold">Info</div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {items.map((row, key) => (
            <div key={key}>
              <InputField
                defaultValue={inputs[row.name]}
                setInputs={setInputs}
                prefixed={prefixed}
                name={row.name}
                variant="autenticación"
                extra="mb-0"
                label={row.name}
                placeholder={row.name}
                id={row.name}
                type="text"
              />
            </div>
          ))}
          <div onClick={handleCreateDB} className="text-center cursor-pointer rounded-xl bg-brand-500 py-6 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            Guardar
          </div>
        </div>
      </div>
      <div className="p-4 bg-gray-100 mt-2">
        <div className="text-lg text-navy-700 dark:text-white font-bold">Icons</div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {icons.map((row, key) => (
            <div key={key}>
              <Image src={row.src} alt="Progrmandoweb" width={150} height={150} />
              <UploadImage label={row.sizes} repository="pwa_settings" id={row.id} getInit={getInit} />
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-gray-50 mt-2">
        <div className="text-lg text-navy-700 dark:text-white font-bold">Screnshots</div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {screenshots.map((row, key) => (
            <div key={key}>
              <Image src={row.src} alt={row.sizes} width={100} height={100} />
              <UploadImage label={row.sizes} repository="pwa_settings" id={row.id} getInit={getInit} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingPwa;
