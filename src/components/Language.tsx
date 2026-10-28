'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import {messages,type Locale,type Key} from '@/lib/i18n';
const Context=createContext<{locale:Locale;setLocale:(l:Locale)=>void;t:(k:Key)=>string}>({locale:'en',setLocale:()=>{},t:k=>messages.en[k]});
export function LanguageProvider({children}:{children:React.ReactNode}){const[locale,set]=useState<Locale>('en');useEffect(()=>{const l=localStorage.getItem('orimeri.locale');if(l==='en'||l==='zh'||l==='ja')set(l);},[]);function setLocale(l:Locale){set(l);try{localStorage.setItem('orimeri.locale',l);}catch{}}useEffect(()=>{document.documentElement.lang=locale==='zh'?'zh-CN':locale;},[locale]);return <Context.Provider value={{locale,setLocale,t:k=>messages[locale][k]}}>{children}</Context.Provider>}
export const useLanguage=()=>useContext(Context);
export function LanguageSwitch(){const{locale,setLocale}=useLanguage();return <div className="language-switch" role="group" aria-label="Language">{(['en','zh','ja'] as Locale[]).map(l=><button key={l} lang={l} onClick={()=>setLocale(l)} aria-pressed={locale===l}>{l==='en'?'English':l==='zh'?'简体中文':'日本語'}</button>)}</div>}
