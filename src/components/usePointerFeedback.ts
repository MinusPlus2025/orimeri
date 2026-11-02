 'use client';
import {useEffect} from 'react';
/** Pointer feedback moves only the preview image, never the control's hit area. */
export function usePointerFeedback(){useEffect(()=>{
 const media=matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
 let target:HTMLElement|null=null,frame=0,x=0,y=0;
 const reset=()=>{cancelAnimationFrame(frame);frame=0;target?.style.removeProperty('--pointer-x');target?.style.removeProperty('--pointer-y');target=null;};
 const move=(event:PointerEvent)=>{if(!media.matches||event.pointerType!=='mouse'){reset();return;}const next=(event.target as Element).closest<HTMLElement>('.culture-select:not(:disabled), .linked-tastes button, .proposal-index button');if(next!==target){reset();target=next;}if(!target)return;const box=target.getBoundingClientRect();x=Math.max(-2,Math.min(2,((event.clientX-box.left)/box.width-.5)*4));y=Math.max(-2,Math.min(2,((event.clientY-box.top)/box.height-.5)*4));if(!frame)frame=requestAnimationFrame(()=>{target?.style.setProperty('--pointer-x',`${x}px`);target?.style.setProperty('--pointer-y',`${y}px`);frame=0;});};
 document.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',reset);window.addEventListener('blur',reset);window.addEventListener('scroll',reset,true);media.addEventListener('change',reset);
 return()=>{reset();document.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',reset);window.removeEventListener('blur',reset);window.removeEventListener('scroll',reset,true);media.removeEventListener('change',reset);};
 },[]);}
