'use client';
import {useEffect,useState} from 'react';
import {useLanguage} from './Language';
type Mode='system'|'light'|'dark';
const labels={en:['Appearance','System','Light','Dark'],zh:['外观','跟随系统','浅色','深色'],ja:['外観','システム','ライト','ダーク']};
export function Appearance(){
 const {locale}=useLanguage();const [mode,setMode]=useState<Mode>('light');
 useEffect(()=>{try{const saved=localStorage.getItem('orimeri.appearance');if(saved==='light'||saved==='dark'||saved==='system'){setMode(saved);document.documentElement.dataset.appearance=saved;}}catch{}},[]);
 function change(value:Mode){setMode(value);document.documentElement.dataset.appearance=value;try{localStorage.setItem('orimeri.appearance',value);}catch{}}
 const text=labels[locale];return <label className="appearance-control"><span>{text[0]}</span><select aria-label={text[0]} data-testid="appearance" value={mode} onChange={e=>change(e.target.value as Mode)}><option value="system">{text[1]}</option><option value="light">{text[2]}</option><option value="dark">{text[3]}</option></select></label>;
}
