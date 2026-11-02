'use client';
import {useEffect,useState} from 'react';
import {Sun,Moon,Monitor} from 'lucide-react';
import {useLanguage} from './Language';
type Mode='system'|'light'|'dark';
const labels={en:['Appearance','System','Light','Dark'],zh:['外观','跟随系统','浅色','深色'],ja:['外観','システム','ライト','ダーク']};
export function Appearance(){
 const {locale}=useLanguage();const [mode,setMode]=useState<Mode>('light');
 useEffect(()=>{try{const saved=localStorage.getItem('orimeri.appearance');if(saved==='light'||saved==='dark'||saved==='system'){setMode(saved);document.documentElement.dataset.appearance=saved;}}catch{}},[]);
 function change(value:Mode){setMode(value);document.documentElement.dataset.appearance=value;try{localStorage.setItem('orimeri.appearance',value);}catch{}}
 const text=labels[locale];const options=[{value:'light' as Mode,label:text[2],Icon:Sun},{value:'dark' as Mode,label:text[3],Icon:Moon},{value:'system' as Mode,label:text[1],Icon:Monitor}];
 return <div className="appearance-control appearance-options" role="group" aria-label={text[0]}>{options.map(({value,label,Icon})=><button key={value} type="button" aria-label={label} title={label} aria-pressed={mode===value} onClick={()=>change(value)}><Icon size={18} aria-hidden="true"/><span className="sr-only">{label}</span></button>)}</div>;
}
