'use client';
import {useEffect,useRef,useState} from 'react';
export function SourceImage({src,alt,className='',fallback}:{src?:string|null;alt:string;className?:string;fallback:string}){
 const[failed,setFailed]=useState(false);const image=useRef<HTMLImageElement|null>(null);
 useEffect(()=>{setFailed(false);const timeout=setTimeout(()=>{if(!image.current?.complete||image.current.naturalWidth<64||image.current.naturalHeight<64)setFailed(true);},12000);return()=>clearTimeout(timeout);},[src]);
 return src&&!failed?<img ref={image} className={className} src={src} alt={alt} onLoad={e=>{if(e.currentTarget.naturalWidth<64||e.currentTarget.naturalHeight<64)setFailed(true);}} onError={()=>setFailed(true)} referrerPolicy="no-referrer" loading="eager"/>:<div className={`image-unavailable ${className}`}><strong>{alt}</strong><small>{fallback}</small></div>;
}
