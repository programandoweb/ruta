'use client'
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLanguage } from '@/store/Slices/languageSlice';
import lang from "@/data/lang";

const defaultLang = "es";

const Lang = () => {
  const dispatch = useDispatch();

  const handleLanguageChange = (language: string) => {
    dispatch(setLanguage(lang[language]));
  };

  useEffect(() => {
    dispatch(setLanguage(lang[defaultLang]));
  }, [dispatch]);

  if (!lang) {
    return <div></div>;
  }

  return (
    <div className="flex justify-end">
      {Object.keys(lang).map((key) => (
        <div key={key} className="w-10 h-10 mr-1">
          <button onClick={() => handleLanguageChange(key)}>
            {key.toUpperCase()}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Lang;
