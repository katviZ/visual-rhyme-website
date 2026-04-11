import { useState, useEffect, useMemo, useCallback } from "react";

/* ── Colors matched to website's CSS variable palette ── */
const BRAND = "#9333EA"; /* --purple-500 */
const BL = "#A855F7";    /* --purple-400 */
const DARK = "#09090B";  /* --black */
const CARD = "rgba(255, 255, 255, 0.03)"; /* --bg-card */
const MM_PER_FT = 304.8;
const MODULE = { w: 320, h: 160 };
const fmt = (n) => "₹" + n.toLocaleString("en-IN");

const VRLogo = ({ size = 48 }) => (
  <svg viewBox="0 0 200.39 210.49" width={size} height={size}>
    <path fill="#9333EA" d="M200.39,142.2c-6.18-13.33-16.84-26.1-31.54-30.22-9.01-2.62-18.31-2.22-27.51-.75,2.18-5.55,4.83-12.33,6.66-16.94l13.4.69c3.69.02,7.39-.91,10.63-2.7,10.48-5.49,14.55-19.75,8.53-29.94-2.06-4.08-7.79-5.44-11.51-2.78-11.05,6.47-19.94,16.47-25.2,28.14l-15.99-.83c9.55-29.69,20.47-45.32,54.44-49.92-14.63-1.31-31.02,1.53-41.94,12.21-6.78,6.49-11.08,14.74-14.4,23.45-3.72-4.66-8.26-10.34-11.34-14.23l7.3-11.26c1.87-3.19,2.9-6.86,2.98-10.55.49-11.82-9.83-22.48-21.66-22.35-4.56-.25-8.6,4.03-8.17,8.58.08,12.8,4.29,25.51,11.77,35.89l-8.71,13.43C77.18,48.99,69.1,31.73,82.1,0c-8.45,12.02-14.18,27.63-10.4,42.43,2.23,9.12,7.23,16.97,13.1,24.2-5.9.89-13.09,1.99-18,2.7l-6.1-11.95c-1.83-3.21-4.49-5.94-7.65-7.85-9.99-6.33-24.38-2.73-30.19,7.59-2.5,3.82-.82,9.46,3.35,11.36,11.13,6.33,24.24,9.04,36.97,7.75l7.27,14.26c-30.49,6.57-49.48,4.94-70.46-22.18,6.18,13.33,16.84,26.1,31.54,30.22,9.01,2.62,18.31,2.22,27.51.75-2.17,5.55-4.83,12.33-6.66,16.93l-13.4-.69c-3.69-.02-7.39.91-10.63,2.7-10.48,5.49-14.55,19.75-8.53,29.94,2.06,4.08,7.79,5.44,11.51,2.78,11.05-6.47,19.94-16.47,25.2-28.14l15.99.83c-9.55,29.69-20.47,45.32-54.44,49.92,14.63,1.31,31.02-1.53,41.94-12.21,6.78-6.49,11.08-14.74,14.4-23.45,3.72,4.66,8.27,10.34,11.34,14.24l-7.3,11.26c-1.87,3.19-2.9,6.86-2.98,10.55-.49,11.82,9.83,22.48,21.66,22.35,4.56.25,8.6-4.03,8.17-8.58-.08-12.8-4.29-25.51-11.77-35.89l8.71-13.43c20.94,23.12,29.01,40.38,16.02,72.11,8.45-12.02,14.18-27.63,10.4-42.43-2.23-9.12-7.23-16.97-13.1-24.2,5.9-.89,13.09-1.99,18-2.7l6.1,11.95c1.83,3.21,4.49,5.94,7.65,7.85,9.99,6.33,24.38,2.73,30.19-7.59,2.5-3.82.82-9.47-3.35-11.36-11.13-6.33-24.24-9.04-36.97-7.75l-7.27-14.26c30.49-6.57,49.48-4.94,70.46,22.18ZM172.27,65.05c.9-.72,2.19-.7,2.73.43,5.91,10.04-1.91,23.42-13.58,23.14l-10.71-.56c4.81-9.51,12.35-17.63,21.55-23.02ZM101.42,22.72c-.17-1.14.49-2.24,1.74-2.15,11.65-.1,19.33,13.36,13.25,23.33l-5.84,9c-5.83-8.92-9.09-19.51-9.16-30.17ZM29.34,62.92c-1.07-.42-1.7-1.54-.99-2.58,5.74-10.14,21.23-10.06,26.83.19l4.87,9.55c-10.64.59-21.44-1.88-30.71-7.16ZM28.11,145.44c-.9.72-2.19.7-2.73-.43-5.91-10.04,1.91-23.42,13.58-23.14l10.71.56c-4.81,9.51-12.35,17.63-21.55,23.02ZM98.97,187.77c.17,1.14-.49,2.24-1.74,2.15-11.66.1-19.33-13.36-13.25-23.33l5.84-9c5.83,8.92,9.09,19.51,9.16,30.17ZM110.7,138.17c-3.09-3.45-6.27-6.8-9.32-10.11l-2.21,3.41-9.73,15.01c-3.82-4.82-8.94-11.19-12.51-15.67,1.45-4.4,2.75-8.83,4.1-13.13l-4.06-.21-17.86-.92c2.27-5.72,5.22-13.34,7.32-18.66,4.54-.95,9.03-2.03,13.42-3.01l-1.85-3.62-8.13-15.93c6.09-.9,14.16-2.15,19.82-3,3.09,3.45,6.27,6.8,9.32,10.11l2.21-3.41,9.73-15.01c3.82,4.82,8.94,11.19,12.51,15.67-1.45,4.4-2.75,8.83-4.1,13.13l4.06.21,17.86.92c-2.27,5.72-5.22,13.34-7.32,18.67-4.54.95-9.03,2.03-13.42,3.01l1.85,3.62,8.13,15.93c-6.09.9-14.16,2.15-19.82,3ZM171.05,147.57c1.07.42,1.7,1.54.99,2.58-5.74,10.14-21.23,10.06-26.83-.19l-4.87-9.55c10.64-.59,21.44,1.88,30.71,7.16Z"/>
  </svg>
);

const FONT = "'SK-Modernist', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const SCREEN_PRICES = {
  outdoor: { 6.67:{rate:5000,gst:18,s:"Reyansh Outdoor P6.67"}, 4:{rate:5500,gst:18,s:"Reyansh Outdoor P4"}, 3:{rate:7250,gst:18,s:"Reyansh Outdoor P3"}, 2.5:{rate:12500,gst:18,s:"Reyansh Outdoor P2.5"} },
  indoor: { 2.5:{rate:7500,gst:18,s:"Reyansh Indoor P2.5"}, 1.86:{rate:10500,gst:18,s:"Reyansh Indoor P1.86"}, 1.56:{rate:23000,gst:28,s:"Reyansh Indoor P1.56"} },
  microled: { 1.56:{rate:23000,gst:28,s:"Leynna Cosmo P1.56"}, 1.25:{rate:25000,gst:28,s:"Leynna Cosmo P1.25"}, 1.17:{rate:23500,gst:28,s:"Leynna Cosmo P1.17"}, 0.93:{rate:35000,gst:28,s:"Leynna Sapphire P0.93"}, 0.78:{rate:60000,gst:28,s:"Leynna Sapphire P0.78"} },
};

function getCtrlPrice(ports, micro) {
  if (micro) { if(ports<=3)return 125000; if(ports<=7)return 150000; if(ports<=12)return 200000; if(ports<=20)return 250000; return 350000; }
  if(ports<=1)return 15000; if(ports<=2)return 25000; if(ports<=3)return 45000; if(ports<=5)return 75000; if(ports<=7)return 125000; return 150000;
}

function getInstallRate(a){ if(a<50)return 300; if(a<=150)return 200; return 150; }

const PRODUCTS = {
  outdoor:{series:"Reyansh Outdoor",type:"MiniLED",pitches:[{pp:6.67,l:"P6.67"},{pp:4,l:"P4"},{pp:3,l:"P3"},{pp:2.5,l:"P2.5"}],cabs:[{w:960,h:960,l:"960×960mm"},{w:960,h:1280,l:"960×1280mm"},{w:1280,h:1280,l:"1280×1280mm"}]},
  indoor:{series:"Reyansh Indoor",type:"MiniLED",pitches:[{pp:2.5,l:"P2.5"},{pp:1.86,l:"P1.86"},{pp:1.56,l:"P1.56"}],cabs:[{w:640,h:480,l:"640×480mm"}]},
  microled:{series:"Leynna MicroLED",type:"MicroLED",pitches:[{pp:1.56,l:"P1.56"},{pp:1.25,l:"P1.25"},{pp:1.17,l:"P1.17"},{pp:0.93,l:"P0.93"},{pp:0.78,l:"P0.78"}],cabs:[{w:600,h:337.5,l:"600×337.5mm"},{w:609.6,h:342.9,l:"609.6×342.9mm"}]},
};

function suggestPP(d,out){ const all=out?PRODUCTS.outdoor.pitches:[...PRODUCTS.indoor.pitches,...PRODUCTS.microled.pitches]; const u=[...new Map(all.map(p=>[p.pp,p])).values()].sort((a,b)=>b.pp-a.pp); const s=u.filter(p=>p.pp<=d); return s.length?s[0]:u[u.length-1]; }
function getCat(pp,out){ if(out)return PRODUCTS.outdoor; if(PRODUCTS.indoor.pitches.find(p=>p.pp===pp))return PRODUCTS.indoor; if(PRODUCTS.microled.pitches.find(p=>p.pp===pp))return PRODUCTS.microled; return pp<=1.56?PRODUCTS.microled:PRODUCTS.indoor; }

function getPrice(pp,out){
  const k=pp;
  if(out&&SCREEN_PRICES.outdoor[k])return SCREEN_PRICES.outdoor[k];
  if(!out){ if(SCREEN_PRICES.indoor[k])return SCREEN_PRICES.indoor[k]; if(SCREEN_PRICES.microled[k])return SCREEN_PRICES.microled[k]; }
  const all=out?SCREEN_PRICES.outdoor:{...SCREEN_PRICES.indoor,...SCREEN_PRICES.microled};
  const ks=Object.keys(all).map(Number).sort((a,b)=>a-b);
  const lo=ks.filter(x=>x<=pp).pop(); const hi=ks.filter(x=>x>=pp).shift();
  if(lo&&hi&&lo!==hi){ const r=(pp-lo)/(hi-lo); return{rate:Math.round(all[lo].rate+(all[hi].rate-all[lo].rate)*(1-r)),gst:pp<=1.56?28:18,s:`Custom ${pp}mm`}; }
  if(lo)return all[lo]; if(hi)return all[hi]; return{rate:7500,gst:18,s:`Custom ${pp}mm`};
}

function calc(wFt,hFt,pp,cab,out){
  const tW=wFt*MM_PER_FT, tH=hFt*MM_PER_FT;
  const cat=getCat(pp,out);
  const reyansh=out||(cat===PRODUCTS.indoor);
  const useModules=reyansh&&(tW<960||tH<960);
  const tileW=useModules?MODULE.w:cab.w, tileH=useModules?MODULE.h:cab.h;
  const mk=(nW,nH,label)=>{
    const sW=nW*tileW, sH=nH*tileH, wF=sW/MM_PER_FT, hF=sH/MM_PER_FT, area=wF*hF;
    const rW=Math.floor(sW/pp), rH=Math.floor(sH/pp), tp=rW*rH;
    const diag=Math.sqrt(sW**2+sH**2)/25.4;
    const gcd=(a,b)=>b===0?a:gcd(b,a%b); const g=gcd(rW,rH);
    const micro=cat.type==="MicroLED";
    const ppp=micro?500000:650000, ports=Math.max(1,Math.ceil(tp/ppp));
    const pi=getPrice(pp,out);
    const sc=Math.round(pi.rate*area), sg=Math.round(sc*pi.gst/100);
    const cc=getCtrlPrice(ports,micro), cg=Math.round(cc*0.18);
    const ir=getInstallRate(area), ic=Math.round(ir*Math.ceil(area)), ig=Math.round(ic*0.18);
    const sub=sc+cc+ic, tg=sg+cg+ig, gt=sub+tg;
    const modulesW=useModules?nW:nW*Math.round(cab.w/MODULE.w);
    const modulesH=useModules?nH:nH*Math.round(cab.h/MODULE.h);
    const totalModules=modulesW*modulesH;
    const cabsW=useModules?null:nW, cabsH=useModules?null:nH, totalCabs=useModules?null:nW*nH;
    return{label,useModules,reyansh,cabsW,cabsH,totalCabs,modulesW,modulesH,totalModules,sW,sH,wF:wF.toFixed(2),hF:hF.toFixed(2),area:parseFloat(area.toFixed(1)),rW,rH,tp,ports,diag:diag.toFixed(1),asp:`${rW/g}:${rH/g}`,cab,pp,pi,sc,sg,cc,cg,ir,ic,ig,sub,tg,gt};
  };
  const fW=Math.floor(tW/tileW), fH=Math.floor(tH/tileH), cW=Math.ceil(tW/tileW), cH=Math.ceil(tH/tileH);
  return{ smaller:fW>0&&fH>0?mk(fW,fH,"Nearest Fit (≤ Input)"):null, larger:mk(cW,cH,"Optimal Fit (≥ Input)") };
}

function Cab3D({cW,cH,cabW,cabH}){
  const mxW=200,mxH=130,asp=(cW*cabW)/(cH*cabH);
  let dW,dH; if(asp>mxW/mxH){dW=mxW;dH=mxW/asp;}else{dH=mxH;dW=mxH*asp;}
  const clW=dW/cW, clH=dH/cH;
  const dots=useMemo(()=>Array.from({length:Math.min(cW*cH,15)}).map((_,i)=>({cx:((i*97+13)%100)/100,cy:((i*53+29)%100)/100,op:0.25+((i*37)%40)/100,dur:1.5+((i*71)%200)/100})),[cW,cH]);
  return(
    <svg viewBox={`-3 -10 ${dW+24} ${dH+22}`} style={{width:"100%",maxWidth:240,display:"block",margin:"6px auto"}}>
      <defs><linearGradient id="sd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BL} stopOpacity="0.5"/><stop offset="100%" stopColor={BRAND} stopOpacity="0.15"/></linearGradient></defs>
      <polygon points={`0,0 ${dW},0 ${dW+8},-7 8,-7`} fill="rgba(147,51,234,0.15)" stroke={BRAND} strokeWidth="0.3"/>
      <polygon points={`${dW},0 ${dW+8},-7 ${dW+8},${dH-7} ${dW},${dH}`} fill="url(#sd)" stroke={BRAND} strokeWidth="0.3"/>
      <rect x="0" y="0" width={dW} height={dH} fill={DARK} stroke={BL} strokeWidth="0.7"/>
      {Array.from({length:cW}).map((_,i)=>Array.from({length:cH}).map((_,j)=>(<rect key={`${i}${j}`} x={i*clW+0.3} y={j*clH+0.3} width={clW-0.6} height={clH-0.6} fill="none" stroke={BRAND} strokeWidth="0.25" strokeDasharray="1.2,1.2" opacity="0.35"/>)))}
      {dots.map((d,i)=>(<circle key={`p${i}`} cx={d.cx*dW} cy={d.cy*dH} r="0.5" fill={BL} opacity={d.op}><animate attributeName="opacity" values="0.15;0.6;0.15" dur={`${d.dur}s`} repeatCount="indefinite"/></circle>))}
    </svg>
  );
}

function PriceTable({d}){
  const rows=[
    {item:"LED Display",unit:`${fmt(d.pi.rate)}/sqft`,qty:`${d.area} sqft`,tot:d.sc,gp:d.pi.gst,gv:d.sg},
    {item:"Video Controller",unit:"Per System",qty:`${d.ports} Port(s)`,tot:d.cc,gp:18,gv:d.cg},
    {item:"Installation",unit:`${fmt(d.ir)}/sqft`,qty:`${Math.ceil(d.area)} sqft`,tot:d.ic,gp:18,gv:d.ig},
  ];
  const th={padding:"7px 8px",textAlign:"left",fontSize:8,textTransform:"uppercase",letterSpacing:1.2,color:"rgba(161,161,170,0.6)",borderBottom:"1px solid rgba(147,51,234,0.18)",fontWeight:600,fontFamily:FONT};
  const td={padding:"7px 8px",fontSize:11,borderBottom:"1px solid rgba(147,51,234,0.06)",color:"#D4D4D8",fontFamily:FONT};
  const tr={...td,textAlign:"right",fontFamily:FONT_MONO,fontWeight:600};
  return(
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",marginTop:10}}>
        <thead><tr><th style={th}>Item</th><th style={th}>Rate</th><th style={th}>Qty</th><th style={{...th,textAlign:"right"}}>Amount</th><th style={{...th,textAlign:"right"}}>GST%</th><th style={{...th,textAlign:"right"}}>GST</th></tr></thead>
        <tbody>{rows.map((r,i)=>(<tr key={i}><td style={td}>{r.item}</td><td style={td}>{r.unit}</td><td style={td}>{r.qty}</td><td style={tr}>{fmt(r.tot)}</td><td style={tr}>{r.gp}%</td><td style={tr}>{fmt(r.gv)}</td></tr>))}</tbody>
        <tfoot>
          <tr><td colSpan="3" style={{...td,fontWeight:700,borderTop:"1px solid rgba(147,51,234,0.25)"}}>Subtotal</td><td style={{...tr,borderTop:"1px solid rgba(147,51,234,0.25)"}}>{fmt(d.sub)}</td><td style={tr}></td><td style={{...tr,borderTop:"1px solid rgba(147,51,234,0.25)"}}>{fmt(d.tg)}</td></tr>
          <tr><td colSpan="3" style={{...td,fontWeight:800,fontSize:13,color:BL,border:"none"}}>Grand Total (Incl. GST)</td><td colSpan="3" style={{...tr,fontWeight:800,fontSize:15,color:BL,border:"none"}}>{fmt(d.gt)}</td></tr>
        </tfoot>
      </table>
    </div>
  );
}

function ResultCard({d,rec}){
  if(!d)return null;
  return(
    <div style={{background:rec?"linear-gradient(135deg,rgba(147,51,234,0.08),rgba(9,9,11,0.96))":"linear-gradient(135deg,rgba(46,16,101,0.05),rgba(9,9,11,0.96))",border:`1px solid ${rec?BL:"rgba(147,51,234,0.18)"}`,borderRadius:14,padding:"16px 14px",position:"relative",overflow:"hidden"}}>
      {rec&&<div style={{position:"absolute",top:9,right:9,background:"linear-gradient(135deg,#7C3AED,#9333EA)",color:"#fff",fontSize:7.5,fontWeight:700,padding:"2px 9px",borderRadius:18,letterSpacing:1.2,textTransform:"uppercase",fontFamily:FONT}}>Recommended</div>}
      <div style={{fontSize:9,color:"rgba(161,161,170,0.55)",textTransform:"uppercase",letterSpacing:2,fontWeight:700,marginBottom:4,fontFamily:FONT}}>{d.label}</div>
      <Cab3D cW={d.useModules?d.modulesW:d.cabsW} cH={d.useModules?d.modulesH:d.cabsH} cabW={d.useModules?MODULE.w:d.cab.w} cabH={d.useModules?MODULE.h:d.cab.h}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"7px 10px",marginTop:8}}>
        {[["Screen",`${d.wF}×${d.hF} ft`],["Diagonal",`${d.diag}″`],["Resolution",`${d.rW}×${d.rH}`],["Pixels",d.tp.toLocaleString()],["Area",`${d.area} sqft`],...(!d.useModules?[["Cabinets",`${d.totalCabs} (${d.cabsW}×${d.cabsH})`]]:[]),...(d.reyansh?[["Modules",`${d.totalModules} (${d.modulesW}×${d.modulesH})`]]:[]),["Aspect",d.asp],["Ports",d.ports],["Pitch",`${d.pp}mm`]].map(([l,v])=>(
          <div key={l}><div style={{fontSize:7.5,color:"rgba(161,161,170,0.4)",textTransform:"uppercase",letterSpacing:1,fontFamily:FONT}}>{l}</div><div style={{fontSize:11,color:"#D4D4D8",fontWeight:600,fontFamily:FONT_MONO}}>{v}</div></div>
        ))}
      </div>
      <PriceTable d={d}/>
    </div>
  );
}

export default function PixelQuotePro(){
  const[step,setStep]=useState(0);
  const initForm={name:"",email:"",phone:"",cc:"+91",co:"",vd:"",env:"outdoor",pp:"",cp:false,w:"",h:"",ci:0};
  const[form,setForm]=useState(()=>{try{const s=localStorage.getItem("pqp_form");return s?{...initForm,...JSON.parse(s)}:initForm;}catch{return initForm;}});
  const[errors,setErrors]=useState({});
  const[results,setResults]=useState(null);
  const[sug,setSug]=useState(null);
  const[anim,setAnim]=useState(true);
  const[quoteRef,setQuoteRef]=useState("");
  const[quoteDate,setQuoteDate]=useState("");
  const out=form.env==="outdoor";

  useEffect(()=>{try{localStorage.setItem("pqp_form",JSON.stringify(form));}catch{}},[form]);

  useEffect(()=>{if(form.vd&&parseFloat(form.vd)>0){const s=suggestPP(parseFloat(form.vd),out);setSug(s);if(!form.cp)setForm(f=>({...f,pp:String(s.pp)}));}},[form.vd,form.env,form.cp]);

  const cat=useMemo(()=>form.pp?getCat(parseFloat(form.pp),out):null,[form.pp,out]);
  const pitches=useMemo(()=>out?PRODUCTS.outdoor.pitches:[...PRODUCTS.indoor.pitches,...PRODUCTS.microled.pitches],[out]);

  const validate=(s)=>{const e={};if(s>=0){if(!form.name.trim())e.name="Required";if(!form.email.includes("@")||!form.email.includes("."))e.email="Valid email required";if(form.phone.replace(/\D/g,"").length<10)e.phone="Min 10 digits";}if(s>=1){if(!form.vd||parseFloat(form.vd)<=0)e.vd="Required";if(!form.pp)e.pp="Required";}if(s>=2){if(!form.w||parseFloat(form.w)<=0)e.w="Required";if(!form.h||parseFloat(form.h)<=0)e.h="Required";}return e;};

  const go=(cb)=>{setAnim(false);setTimeout(()=>{cb();setAnim(true);},180);};
  const next=()=>{const e=validate(step);setErrors(e);if(Object.keys(e).length)return;go(()=>{if(step===2){const pp=parseFloat(form.pp),c=getCat(pp,out),cb=c.cabs[Math.min(form.ci,c.cabs.length-1)];setResults(calc(parseFloat(form.w),parseFloat(form.h),pp,cb,out));{const yr=new Date().getFullYear();const key="pqp_counter_"+yr;let n=1;try{n=parseInt(localStorage.getItem(key)||"0",10)+1;localStorage.setItem(key,String(n));}catch{}setQuoteRef("VR-"+yr+"-"+String(n).padStart(4,"0"));}setQuoteDate(new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}));setStep(3);}else setStep(s=>s+1);});};
  const goToStep=(s)=>{if(s<step)go(()=>{setStep(s);setResults(null);});};
  const back=()=>go(()=>{setStep(s=>s-1);setResults(null);});
  const reset=()=>go(()=>{setStep(0);setForm(initForm);setResults(null);setErrors({});setQuoteRef("");setQuoteDate("");try{localStorage.removeItem("pqp_form");}catch{}});
  const handlePrint=useCallback(()=>window.print(),[]);
  const handleShare=useCallback(()=>{const r=results?.larger||results?.smaller;if(!r)return;const t=`*LED Display Quote — ${quoteRef}*%0A${quoteDate}%0AClient: ${form.name}${form.co?" | "+form.co:""}%0AScreen: ${r.wF}×${r.hF} ft (${r.area} sqft)%0APitch: ${r.pp}mm | ${r.rW}×${r.rH}px%0A*Grand Total: ${fmt(r.gt)}* (incl. GST)%0A%0A— Visual Rhyme Pvt. Ltd.`;window.open("https://wa.me/?text="+t,"_blank");},[results,quoteRef,quoteDate,form.name,form.co]);

  const inp=(err)=>({width:"100%",padding:"11px 13px",background:"rgba(9,9,11,0.9)",border:`1px solid ${err?"#ef4444":"rgba(147,51,234,0.2)"}`,borderRadius:10,color:"#fff",fontSize:14,outline:"none",fontFamily:FONT,boxSizing:"border-box",transition:"border-color 0.3s"});
  const lbl={fontSize:10,color:"rgba(161,161,170,0.6)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:4,display:"block",fontWeight:600,fontFamily:FONT};
  const btnP={padding:"12px 30px",background:"linear-gradient(135deg,#7C3AED,#9333EA)",color:"#fff",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:0.8,textTransform:"uppercase",fontFamily:FONT,boxShadow:"0 4px 18px rgba(147,51,234,0.35)"};
  const btnS={...btnP,background:"transparent",border:"1px solid rgba(147,51,234,0.25)",boxShadow:"none"};
  const steps=["Contact","Display","Size","Quote"];

  return(
    <div className="pqp-root" style={{fontFamily:FONT,color:"#fff",display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 10px"}}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet"/>
      <style>{`@media print{.pqp-noprint{display:none!important}body,.pqp-root{background:#fff!important;color:#1a1a1a!important}.pqp-root *{color:#1a1a1a!important;border-color:rgba(147,51,234,0.3)!important;background:transparent!important}}`}</style>

      <div className="pqp-noprint" style={{textAlign:"center",marginBottom:4,width:"100%",maxWidth:720}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:9,marginBottom:1}}>
          <VRLogo size={40}/>
          <div>
            <div style={{fontSize:8,letterSpacing:4,color:"rgba(168,85,247,0.5)",textTransform:"uppercase",fontWeight:600,fontFamily:FONT}}>Visual Rhyme Pvt. Ltd.</div>
            <div style={{fontSize:21,fontWeight:800,fontFamily:FONT,letterSpacing:-0.5,background:`linear-gradient(135deg,#fff,${BL})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PIXEL QUOTE PRO</div>
          </div>
        </div>
        <p style={{fontSize:10,color:"rgba(161,161,170,0.3)",margin:0,letterSpacing:1.5,fontFamily:FONT}}>LED Display Configuration & Instant Quotation</p>
      </div>

      <div className="pqp-noprint" style={{display:"flex",alignItems:"center",gap:0,marginBottom:16,maxWidth:380,width:"100%"}}>
        {steps.map((l,i)=>(<div key={i} style={{display:"flex",alignItems:"center",flex:1}}>
          <div onClick={()=>goToStep(i)} style={{width:24,height:24,borderRadius:"50%",background:i<=step?"linear-gradient(135deg,#7C3AED,#9333EA)":"rgba(46,16,101,0.3)",border:`2px solid ${i<=step?BL:"rgba(147,51,234,0.12)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:i<=step?"#fff":"rgba(161,161,170,0.25)",flexShrink:0,transition:"all 0.4s",cursor:i<step?"pointer":"default",fontFamily:FONT}}>{i<step?"✓":i+1}</div>
          <div style={{fontSize:7.5,color:i<=step?"rgba(212,212,216,0.55)":"rgba(161,161,170,0.15)",marginLeft:2,marginRight:2,textTransform:"uppercase",letterSpacing:1,fontWeight:600,whiteSpace:"nowrap",fontFamily:FONT}}>{l}</div>
          {i<steps.length-1&&<div style={{flex:1,height:1,background:i<step?BRAND:"rgba(147,51,234,0.08)",transition:"background 0.4s"}}/>}
        </div>))}
      </div>

      <div style={{maxWidth:720,width:"100%",background:"linear-gradient(180deg,rgba(13,13,18,0.95),rgba(9,9,11,0.98))",border:"1px solid rgba(147,51,234,0.12)",borderRadius:16,padding:step===3?"20px 16px":"24px 20px",opacity:anim?1:0,transform:anim?"translateY(0)":"translateY(6px)",transition:"opacity 0.18s,transform 0.18s",boxShadow:"0 0 40px rgba(147,51,234,0.04)"}}>

        {step===0&&(<div>
          <h2 style={{fontSize:16,fontWeight:700,margin:"0 0 16px",fontFamily:FONT}}>Contact Details</h2>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div><label style={lbl}>Full Name *</label><input style={inp(errors.name)} placeholder="Your full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} onFocus={e=>e.target.style.borderColor=BL} onBlur={e=>e.target.style.borderColor="rgba(147,51,234,0.2)"}/>{errors.name&&<div style={{color:"#ef4444",fontSize:9,marginTop:2}}>{errors.name}</div>}</div>
            <div><label style={lbl}>Company / Business Name</label><input style={inp()} placeholder="Company name (optional)" value={form.co} onChange={e=>setForm({...form,co:e.target.value})} onFocus={e=>e.target.style.borderColor=BL} onBlur={e=>e.target.style.borderColor="rgba(147,51,234,0.2)"}/></div>
            <div><label style={lbl}>Email Address *</label><input style={inp(errors.email)} placeholder="you@company.com" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} onFocus={e=>e.target.style.borderColor=BL} onBlur={e=>e.target.style.borderColor="rgba(147,51,234,0.2)"}/>{errors.email&&<div style={{color:"#ef4444",fontSize:9,marginTop:2}}>{errors.email}</div>}</div>
            <div><label style={lbl}>Phone Number *</label><div style={{display:"flex",gap:7}}><select style={{...inp(),width:82,flexShrink:0,cursor:"pointer"}} value={form.cc} onChange={e=>setForm({...form,cc:e.target.value})}>{["+91","+1","+44","+971","+65","+86","+61"].map(c=><option key={c} value={c} style={{background:"#18181B",color:"#fff"}}>{c}</option>)}</select><input style={inp(errors.phone)} placeholder="10-digit number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value.replace(/\D/g,"").slice(0,12)})} onFocus={e=>e.target.style.borderColor=BL} onBlur={e=>e.target.style.borderColor="rgba(147,51,234,0.2)"}/></div>{errors.phone&&<div style={{color:"#ef4444",fontSize:9,marginTop:2}}>{errors.phone}</div>}</div>
          </div>
        </div>)}

        {step===1&&(<div>
          <h2 style={{fontSize:16,fontWeight:700,margin:"0 0 16px",fontFamily:FONT}}>Display Configuration</h2>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div><label style={lbl}>Environment *</label>
              <div style={{display:"flex",gap:9}}>{[{v:"outdoor",l:"Outdoor",i:"☀️"},{v:"indoor",l:"Indoor",i:"🏢"}].map(e=>(<button key={e.v} onClick={()=>setForm({...form,env:e.v,pp:"",cp:false,ci:0})} style={{flex:1,padding:"12px",background:form.env===e.v?"rgba(147,51,234,0.12)":"rgba(9,9,11,0.7)",border:`1.5px solid ${form.env===e.v?BL:"rgba(147,51,234,0.1)"}`,borderRadius:11,cursor:"pointer",color:form.env===e.v?"#fff":"rgba(161,161,170,0.35)",fontSize:12,fontWeight:600,fontFamily:FONT,transition:"all 0.3s"}}><span style={{fontSize:18,display:"block",marginBottom:2}}>{e.i}</span>{e.l}</button>))}</div>
            </div>
            <div><label style={lbl}>Min Viewing Distance (meters) *</label><input style={inp(errors.vd)} type="number" step="0.1" min="0.5" placeholder="e.g. 3.0" value={form.vd} onChange={e=>setForm({...form,vd:e.target.value})} onFocus={e=>e.target.style.borderColor=BL} onBlur={e=>e.target.style.borderColor="rgba(147,51,234,0.2)"}/>{errors.vd&&<div style={{color:"#ef4444",fontSize:9,marginTop:2}}>{errors.vd}</div>}
              {sug&&!form.cp&&<div style={{marginTop:6,padding:"8px 12px",background:"rgba(147,51,234,0.06)",border:"1px solid rgba(147,51,234,0.15)",borderRadius:9,fontSize:11,fontFamily:FONT}}><span style={{color:BL,fontWeight:700}}>Suggested:</span> <span style={{fontFamily:FONT_MONO,fontWeight:600}}>{sug.l}</span><span style={{color:"rgba(161,161,170,0.4)",marginLeft:5}}>for {form.vd}m</span></div>}
            </div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><label style={{...lbl,marginBottom:0}}>Pixel Pitch *</label><label style={{fontSize:9,color:"rgba(161,161,170,0.4)",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:FONT}}><input type="checkbox" checked={form.cp} onChange={e=>setForm({...form,cp:e.target.checked,pp:e.target.checked?form.pp:(sug?String(sug.pp):"")})} style={{accentColor:BRAND}}/>Custom</label></div>
              {!form.cp?<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{pitches.map(p=>(<button key={p.pp} onClick={()=>setForm({...form,pp:String(p.pp),ci:0})} style={{padding:"8px 14px",background:form.pp===String(p.pp)?"linear-gradient(135deg,#7C3AED,#9333EA)":"rgba(9,9,11,0.8)",border:`1px solid ${form.pp===String(p.pp)?BL:"rgba(147,51,234,0.12)"}`,borderRadius:9,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT_MONO,transition:"all 0.2s",boxShadow:form.pp===String(p.pp)?"0 0 20px rgba(147,51,234,0.3)":"none"}}>{p.l}</button>))}</div>
              :<input style={inp(errors.pp)} type="number" step="0.01" min="0.5" max="10" placeholder="mm" value={form.pp} onChange={e=>setForm({...form,pp:e.target.value,ci:0})} onFocus={e=>e.target.style.borderColor=BL} onBlur={e=>e.target.style.borderColor="rgba(147,51,234,0.2)"}/>}
              {errors.pp&&<div style={{color:"#ef4444",fontSize:9,marginTop:2}}>{errors.pp}</div>}
            </div>
            {cat&&<div style={{padding:"8px 12px",borderRadius:9,background:"rgba(147,51,234,0.04)",border:"1px solid rgba(147,51,234,0.1)",fontSize:10,fontFamily:FONT}}><span style={{color:"rgba(161,161,170,0.4)"}}>Series: </span><span style={{color:BL,fontWeight:700}}>{cat.series}</span> <span style={{color:"rgba(161,161,170,0.25)",fontSize:9}}>({cat.type})</span></div>}
          </div>
        </div>)}

        {step===2&&(<div>
          <h2 style={{fontSize:16,fontWeight:700,margin:"0 0 16px",fontFamily:FONT}}>Screen Dimensions</h2>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><label style={lbl}>Width (ft) *</label><input style={inp(errors.w)} type="number" step="0.1" min="0.5" placeholder="e.g. 12" value={form.w} onChange={e=>setForm({...form,w:e.target.value})} onFocus={e=>e.target.style.borderColor=BL} onBlur={e=>e.target.style.borderColor="rgba(147,51,234,0.2)"}/>{errors.w&&<div style={{color:"#ef4444",fontSize:9,marginTop:2}}>{errors.w}</div>}</div>
              <div style={{flex:1}}><label style={lbl}>Height (ft) *</label><input style={inp(errors.h)} type="number" step="0.1" min="0.5" placeholder="e.g. 8" value={form.h} onChange={e=>setForm({...form,h:e.target.value})} onFocus={e=>e.target.style.borderColor=BL} onBlur={e=>e.target.style.borderColor="rgba(147,51,234,0.2)"}/>{errors.h&&<div style={{color:"#ef4444",fontSize:9,marginTop:2}}>{errors.h}</div>}</div>
            </div>
            {cat&&cat.cabs.length>1&&<div><label style={lbl}>Cabinet Size</label><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{cat.cabs.map((c,i)=>(<button key={i} onClick={()=>setForm({...form,ci:i})} style={{padding:"8px 13px",background:form.ci===i?"linear-gradient(135deg,#7C3AED,#9333EA)":"rgba(9,9,11,0.8)",border:`1px solid ${form.ci===i?BL:"rgba(147,51,234,0.12)"}`,borderRadius:9,color:"#fff",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:FONT_MONO,boxShadow:form.ci===i?"0 0 20px rgba(147,51,234,0.3)":"none"}}>{c.l}</button>))}</div></div>}
          </div>
        </div>)}

        {step===3&&results&&(<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <VRLogo size={30}/>
              <div>
                <div style={{fontSize:14,fontWeight:800,fontFamily:FONT}}>Quotation — PIXEL QUOTE PRO</div>
                <div style={{fontSize:9,color:"rgba(161,161,170,0.4)",fontFamily:FONT}}>For <span style={{color:BL,fontWeight:600}}>{form.name}</span>{form.co&&<span> | {form.co}</span>} | {form.email} | {form.cc} {form.phone}</div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,fontFamily:FONT_MONO,color:BL,fontWeight:700}}>{quoteRef}</div>
              <div style={{fontSize:9,color:"rgba(161,161,170,0.4)",fontFamily:FONT}}>{quoteDate}</div>
            </div>
          </div>
          <div style={{height:1,background:`linear-gradient(90deg,${BRAND},transparent)`,margin:"8px 0 14px"}}/>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {results.smaller&&<ResultCard d={results.smaller} rec={false}/>}
            <ResultCard d={results.larger} rec={true}/>
          </div>
          {!results.smaller&&<div style={{marginTop:8,padding:"8px 12px",background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.12)",borderRadius:9,fontSize:10,color:"rgba(239,68,68,0.6)",fontFamily:FONT}}>Requested size is smaller than a single cabinet — only Optimal Fit shown.</div>}
          <div style={{marginTop:16,padding:"13px 15px",background:"rgba(147,51,234,0.04)",border:"1px solid rgba(147,51,234,0.1)",borderRadius:11}}>
            <div style={{fontSize:9,color:"rgba(161,161,170,0.5)",textTransform:"uppercase",letterSpacing:1.5,fontWeight:700,marginBottom:7,fontFamily:FONT}}>Important Notes</div>
            <div style={{fontSize:11,color:"rgba(212,212,216,0.6)",lineHeight:1.7,fontFamily:FONT}}>
              {[["•","ACP, Scaffolding, H-frame, Prices will be as actual.","#D4D4D8"],["•","This quote is valid only for 7 working days.","#ef4444"],["•","All prices inclusive of GST as itemised above.",""],["•","Transportation, Fabrication & Electrical work charges additional unless specified.",""]].map(([b,t,c],i)=>(
                <div key={i} style={{display:"flex",gap:7,marginBottom:4}}><span style={{color:BL,fontWeight:700,flexShrink:0}}>{b}</span><span>{c?<strong style={{color:c}}>{t}</strong>:t}</span></div>
              ))}
            </div>
          </div>
          <div style={{marginTop:14,textAlign:"center"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"7px 18px",borderRadius:28,border:"1px solid rgba(147,51,234,0.1)",background:"rgba(9,9,11,0.5)"}}>
              <VRLogo size={18}/><div style={{fontSize:9,color:"rgba(161,161,170,0.4)",letterSpacing:1.5,fontFamily:FONT}}>VISUAL RHYME PVT. LTD. — <span style={{color:BL}}>visualrhyme.digital</span></div>
            </div>
            <div style={{fontSize:8,color:"rgba(161,161,170,0.15)",marginTop:5,fontFamily:FONT}}>913, Avirat Silver Radiance 4, SG Hwy, Gota, Ahmedabad-382481</div>
          </div>
        </div>)}

        <div className="pqp-noprint" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:20,flexWrap:"wrap",gap:8}}>
          {step>0&&step<3?<button onClick={back} style={btnS}>← Back</button>:step===3?<button onClick={reset} style={btnS}>↺ New Quote</button>:<div/>}
          {step===3&&<div style={{display:"flex",gap:8}}>
            <button onClick={handlePrint} style={{...btnS,fontSize:11,padding:"10px 18px"}}>🖨 Print</button>
            <button onClick={handleShare} style={{...btnP,fontSize:11,padding:"10px 18px"}}>💬 Share</button>
          </div>}
          {step<3&&<button onClick={next} style={btnP}>{step===2?"Generate Quote →":"Next →"}</button>}
        </div>
      </div>
      <div className="pqp-noprint" style={{marginTop:12,fontSize:8,color:"rgba(161,161,170,0.15)",textAlign:"center",letterSpacing:1,fontFamily:FONT}}>© Visual Rhyme Pvt. Ltd. {new Date().getFullYear()}</div>
    </div>
  );
}
