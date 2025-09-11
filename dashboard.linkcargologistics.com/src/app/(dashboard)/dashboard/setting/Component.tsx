'use client'
import React, { useEffect, useState } from "react";
import Tabs from "@/components/tabs";
import SettingTables from "@/components/setting/Table";
import useFormData from "@/hooks/useFormDataNew";
import { BackendDatasetSetting } from "@/data/interface";

const prefixed = "setting";

let handleRequest: any, getInit: any, backend: string;

const DataTablesPage: React.FC = () => {
  const [dataset, setDataset] = useState<BackendDatasetSetting>();
  
  const formData = useFormData(false, true, prefixed);
  handleRequest = formData.handleRequest;
  backend = formData.backend;

  getInit = () => {
    formData.handleRequest(formData.backend + location.pathname, "get").then((response: BackendDatasetSetting) => {
      if(response){
        setDataset(response);
      }
    });
  };

  useEffect(getInit, []);

  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
        <Tabs
          tabs={[
            {
              label: "Grupo Características",
              component: <SettingTables grupo="group_features" extra6={dataset&&dataset.group_features} dataset={dataset&&dataset.group_features} getInit={getInit} />
            },
            {
              label: "Características",
              component: <SettingTables grupo="features" extra7={dataset&&dataset.groups} extra6={dataset&&dataset.group_features} dataset={dataset&&dataset.features} getInit={getInit} />
            },
            {
              label: "Barrios",
              component: <SettingTables grupo="demographic_warrior" extra6={dataset&&dataset.demographic_cities} dataset={dataset&&dataset.demographic_warrior} getInit={getInit} />
            },
            {
              label: "Datos de la empresa",
              component: <SettingTables skipAdd={true} grupo="enterprise" extra4={true} dataset={dataset&&dataset.enterprise} getInit={getInit} />
            },                               
          ]}
        />
      </div>
    </div>
  );
};

export default DataTablesPage;
