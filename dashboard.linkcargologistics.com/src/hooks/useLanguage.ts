import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '@/store/Slices/languageSlice';
import { useEffect, useState } from 'react';

const useLanguage = () => {
  const [current,setCurrent]  =   <any>useState(false);  
  const dispatch  =   useDispatch();    
  const language  =   useSelector((state: any) => state.lang.selectedLanguage);

  const changeLanguage = (lang: any) => {
    setCurrent(lang)
    dispatch(setLanguage(lang));
  };

  const lang = (key:string)=>{
    return current&&current[key]||null
  }

  useEffect(()=>{
    setCurrent(language)    
  },[language])
  
  return { lang, current, language, changeLanguage };
};

export default useLanguage;
