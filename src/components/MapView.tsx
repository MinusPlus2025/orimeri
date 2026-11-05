'use client';
import {useEffect,useRef,useState} from 'react';
import type * as L from 'leaflet';
import type {Investigation} from '@/lib/types';
import {useLanguage} from './Language';
import {Plus,Minus,Maximize,RefreshCw} from 'lucide-react';
export default function MapView({result,selected,onSelect}:{result:Investigation;selected:string|null;onSelect:(id:string)=>void}){
 const tiles=useRef<L.TileLayer|null>(null);const[tilesLoading,setTilesLoading]=useState(true);const[retryTick,setRetryTick]=useState(0);
 const resultRef=useRef(result);resultRef.current=result;
 const div=useRef<HTMLDivElement>(null),map=useRef<L.Map|null>(null),layer=useRef<L.LayerGroup|null>(null),lib=useRef<typeof L|null>(null),onPick=useRef(onSelect);onPick.current=onSelect;const[zoomTick,setZoomTick]=useState(0);const[loaded,setLoaded]=useState(false),[tilesFailed,setTilesFailed]=useState(false);const{t}=useLanguage();const proposalsLabel=t('proposals');
 useEffect(()=>{
  let disposed=false,frame=0,timer:ReturnType<typeof setTimeout>|undefined;let observer:ResizeObserver|undefined;
  setTilesLoading(true);setTilesFailed(false);setLoaded(false);
  import('leaflet').then(m=>{
   if(disposed||!div.current)return;lib.current=m;
   const current=resultRef.current;
   const x=m.map(div.current,{zoomControl:false,scrollWheelZoom:false});map.current=x;
   x.fitBounds(m.latLng(current.area.lat,current.area.lon).toBounds(current.radiusM*2),{padding:[16,16],animate:false});
   x.on('zoomend',()=>setZoomTick(v=>v+1));
   let succeeded=0,failed=0;
   const start=()=>{clearTimeout(timer);setTilesLoading(true);timer=setTimeout(()=>{if(!disposed){setTilesLoading(false);setTilesFailed(true);}},12000);};
   const tile=m.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',maxZoom:19,updateWhenIdle:true,keepBuffer:2});tiles.current=tile;
   tile.on('loading',()=>{succeeded=0;failed=0;start();});
   tile.on('tileload',()=>{succeeded++;});
   tile.on('tileerror',()=>{failed++;});
   tile.on('load',()=>{clearTimeout(timer);if(!disposed){setTilesLoading(false);setTilesFailed(failed>0||succeeded===0);}});
   start();tile.addTo(x);layer.current=m.layerGroup().addTo(x);setLoaded(true);
   // Resizing must not reset the camera and cancel in-flight tile requests.
   observer=new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(div.current?.clientWidth&&div.current?.clientHeight)x.invalidateSize({pan:true,debounceMoveend:true});});});observer.observe(div.current);
  });
  return()=>{disposed=true;clearTimeout(timer);cancelAnimationFrame(frame);observer?.disconnect();map.current?.remove();map.current=null;tiles.current=null;};
 },[retryTick]);
 useEffect(()=>{if(!loaded||!map.current||!lib.current||!layer.current||!div.current?.clientWidth)return;const m=lib.current,x=map.current;layer.current.clearLayers();const circle=m.circle([result.area.lat,result.area.lon],{radius:result.radiusM,color:'#326e65',weight:1,fillColor:'#326e65',fillOpacity:.035,dashArray:'5 5'}).addTo(layer.current);m.circleMarker([result.area.lat,result.area.lon],{radius:4,color:'#326e65',fillOpacity:1}).bindTooltip(result.area.name).addTo(layer.current);const groups:typeof result.places[]=[];
 result.places.forEach(p=>{const pos=x.latLngToLayerPoint([p.lat,p.lon]);const group=groups.find(g=>x.latLngToLayerPoint([g[0].lat,g[0].lon]).distanceTo(pos)<38);if(group)group.push(p);else groups.push([p]);});
 groups.forEach(group=>{const p=group[0],isGroup=group.length>1,node=document.createElement('button');node.className='map-marker'+(selected===p.id&&!isGroup?' chosen':'')+(isGroup?' cluster':'');node.textContent=isGroup?String(group.length):String(result.places.indexOf(p)+1);node.setAttribute('aria-label',isGroup?`${group.length} ${proposalsLabel}`:p.name);if(!isGroup)node.dataset.placeId=p.id;else node.dataset.cluster='true';node.setAttribute('aria-pressed',String(selected===p.id&&!isGroup));node.onclick=()=>{if(isGroup){const list=document.createElement('div');list.className='map-cluster-list';group.forEach(place=>{const choice=document.createElement('button');choice.className='map-cluster-choice';choice.dataset.placeId=place.id;choice.textContent=place.name;choice.onclick=()=>{onPick.current(place.id);x.closePopup();};list.appendChild(choice);});m.popup({maxWidth:240}).setLatLng([p.lat,p.lon]).setContent(list).openOn(x);}else onPick.current(p.id);};const lat=group.reduce((v,p)=>v+p.lat,0)/group.length,lon=group.reduce((v,p)=>v+p.lon,0)/group.length;const marker=m.marker([lat,lon],{icon:m.divIcon({html:node,className:'map-marker-host',iconSize:[34,34],iconAnchor:[17,17]}),keyboard:false}).addTo(layer.current!);const label=document.createElement('span');label.textContent=isGroup?group.map(p=>p.name).join(' · '):p.name;marker.bindTooltip(label,{direction:'top'});});x.invalidateSize();},[loaded,result,selected,zoomTick,proposalsLabel]);
 useEffect(()=>{if(loaded&&map.current&&lib.current){const bounds=lib.current.latLng(result.area.lat,result.area.lon).toBounds(result.radiusM*2);map.current.fitBounds(bounds,{padding:[16,16],animate:false});}},[loaded,result.area.id,result.radiusM]);
 useEffect(()=>{if(!loaded||!map.current||!div.current?.clientWidth)return;const place=result.places.find(p=>p.id===selected);if(place)map.current.panTo([place.lat,place.lon],{animate:!window.matchMedia('(prefers-reduced-motion: reduce)').matches});},[selected,loaded]);
 function fit(){if(map.current&&lib.current)map.current.fitBounds(lib.current.latLng(result.area.lat,result.area.lon).toBounds(result.radiusM*2),{padding:[16,16]});}
 return <div className="map-wrap"><div ref={div} className="leaflet-map" aria-label={t('map')}/><div className="map-controls"><button title={t('zoomIn')} aria-label={t('zoomIn')} onClick={()=>map.current?.zoomIn()}><Plus size={17}/></button><button title={t('zoomOut')} aria-label={t('zoomOut')} onClick={()=>map.current?.zoomOut()}><Minus size={17}/></button><button title={t('fitMap')} aria-label={t('fitMap')} onClick={fit}><Maximize size={16}/></button></div>{tilesLoading&&<p className="map-loading" role="status">{t('map')}…</p>}{tilesFailed&&<div className="map-fallback" role="status"><p>{t('mapUnavailable')}</p><button onClick={()=>setRetryTick(v=>v+1)}><RefreshCw size={14}/>{t('retry')}</button></div>}</div>
}
