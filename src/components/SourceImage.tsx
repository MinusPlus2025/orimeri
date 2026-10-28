'use client';
import {useEffect,useRef,useState} from 'react';
export function SourceImage({src,alt,className='',fallback}:{src?:string|null;alt:string;className?:string;fallback:string}){
 const[failed,setFailed]=useState(false);const loaded=useRef(false);
 useEffect(()=>{setFailed(false);loaded.current=false;const timeout=setTimeout(()=>{if(!loaded.current)setFailed(true);},12000);return()=>clearTimeout(timeout);},[src]);
 return src&&!failed?<img className={className} src={src} alt={alt} onLoad={e=>{loaded.current=true;if(e.currentTarget.naturalWidth<64||e.currentTarget.naturalHeight<64)setFailed(true);}} onError={()=>setFailed(true)} referrerPolicy="no-referrer" loading="eager"/>:<div className={`image-unavailable ${className}`}><strong>{alt}</strong><small>{fallback}</small></div>;
}
