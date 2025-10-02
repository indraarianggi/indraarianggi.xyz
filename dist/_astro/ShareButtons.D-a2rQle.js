import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{t as i}from"./index.DHIqLpnd.js";import{c as a,B as r}from"./Button.eZO_XFKK.js";import"./index.7in8nkh5.js";import"./index.BL2HOGcR.js";import"./utils.CBfrqCZ4.js";/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]],h=a("facebook",d);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]],k=a("link",p);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]],m=a("linkedin",u);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]],f=a("twitter",w);function N({title:c}){const n=s=>{const t=window.location.href;let o="";switch(s){case"twitter":o=`https://twitter.com/intent/tweet?text=${encodeURIComponent(c)}&url=${encodeURIComponent(t)}`;break;case"linkedin":o=`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(t)}`;break;case"facebook":o=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(t)}`;break;case"copy":navigator.clipboard.writeText(t).then(()=>{i("Link copied!",{description:"The article link has been copied to your clipboard."})},l=>{console.error("Could not copy text: ",l),i.error("Copy failed",{description:"Could not copy the link to your clipboard."})});return}o&&window.open(o,"_blank","noopener,noreferrer")};return e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(r,{variant:"outline",size:"icon",className:"cursor-pointer rounded-full",onClick:()=>n("twitter"),"aria-label":"Share on Twitter",children:e.jsx(f,{className:"h-4 w-4"})}),e.jsx(r,{variant:"outline",size:"icon",className:"cursor-pointer rounded-full",onClick:()=>n("linkedin"),"aria-label":"Share on LinkedIn",children:e.jsx(m,{className:"h-4 w-4"})}),e.jsx(r,{variant:"outline",size:"icon",className:"cursor-pointer rounded-full",onClick:()=>n("facebook"),"aria-label":"Share on Facebook",children:e.jsx(h,{className:"h-4 w-4"})}),e.jsx(r,{variant:"outline",size:"icon",className:"cursor-pointer rounded-full",onClick:()=>n("copy"),"aria-label":"Copy link",children:e.jsx(k,{className:"h-4 w-4"})})]})}export{N as ShareButtons};
