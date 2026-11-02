'use client';
import {useEffect,useRef,useState} from 'react';
export function SourceImage({src,alt,className='',fallback,hero=false}:{hero?:boolean;src?:string|null;alt:string;className?:string;fallback:string}){
 const[compact,setCompact]=useState(false);
 const[failed,setFailed]=useState(false);const image=useRef<HTMLImageElement|null>(null);
 useEffect(()=>{setFailed(false);const timeout=setTimeout(()=>{if(!image.current?.complete||image.current.naturalWidth<64||image.current.naturalHeight<64)setFailed(true);},12000);return()=>clearTimeout(timeout);},[src]);
 useEffect(()=>{if(!hero)return;const el=image.current;if(!el)return;const check=()=>{if(el.naturalWidth){setCompact(el.naturalWidth<el.parentElement!.clientWidth*(window.devicePixelRatio||1));el.style.setProperty('--source-width',`${el.naturalWidth/(window.devicePixelRatio||1)}px`);}};const observer=new ResizeObserver(check);observer.observe(el.parentElement!);el.addEventListener('load',check);check();return()=>{observer.disconnect();el.removeEventListener('load',check);};},[hero,src,failed]);
 return src&&!failed?<img ref={image} data-compact={hero&&compact?"true":undefined} className={className} src={src} alt={alt} onLoad={e=>{if(e.currentTarget.naturalWidth<64||e.currentTarget.naturalHeight<64)setFailed(true);}} onError={()=>setFailed(true)} referrerPolicy="no-referrer" loading="eager"/>:<div className={`image-unavailable ${className}`}><strong>{alt}</strong><small>{fallback}</small></div>;
}
