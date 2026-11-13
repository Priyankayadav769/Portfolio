/* Site behaviour: loader, editions, navigation, reveals, cursor, work cards, case study, contact */
(function(){
"use strict";
const $=(s,r=document)=>r?r.querySelector(s):null, $$=(s,r=document)=>r?[...r.querySelectorAll(s)]:[];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(pointer: fine)').matches;
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const sess={get(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}};
const root=document.documentElement;
{const REVIEW=/[?&]review\b/.test(location.search);const rv=k=>{if(!REVIEW)return null;try{return localStorage.getItem(k)}catch(e){return null}};let it=rv("py:intro");root.dataset.intro=(it==="o1"||it==="o2"||it==="cur")?it:"cur";{let cf=rv("py:cf");root.dataset.cf=(cf==="2"||cf==="3")?cf:"1"}{let xp=rv("py:xp");root.dataset.xp=(xp==="2"||xp==="3")?xp:"1"}{let cl=rv("py:cmpl");root.dataset.cmpl=(cl==="2"||cl==="3"||cl==="4")?cl:"1"}if(REVIEW){root.classList.add("ctl");if(innerWidth<900)root.classList.add("ctl-min")}}
{const se=(()=>{try{return localStorage.getItem("py:edition")}catch(e){return null}})();root.dataset.edition=(se==="street"||se==="gold")?se:"gold"}

/* ---------- toast ---------- */
const toastEl=$('#toast');let tt;
function toast(m){toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('show'),1800)}
document.addEventListener('click',e=>{const r=e.target.closest('[data-resume]');if(r&&(r.getAttribute('href')||'#')==='#'){e.preventDefault();toast('Resume download coming soon')}});

/* ---------- sound (off by default) ---------- */
let actx=null,soundOn=false;
const sndBtn=$('#sndBtn');
function ac(){if(!actx){try{actx=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(actx&&actx.state==='suspended')actx.resume();return actx}
function pluck(freq,vol=.16){if(!soundOn)return;const a=ac();if(!a)return;const t=a.currentTime;
  const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+1.1);
  const f=a.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(freq*6,t);f.frequency.exponentialRampToValueAtTime(freq*1.2,t+.6);
  [1,2.01].forEach((m,i)=>{const o=a.createOscillator();o.type=i?'sine':'triangle';o.frequency.value=freq*m;const og=a.createGain();og.gain.value=i?.25:1;o.connect(og).connect(f);o.start(t);o.stop(t+1.2)});
  f.connect(g).connect(a.destination)}
function tick(){pluck(1760,.05)}
function setSound(on){soundOn=on;sndBtn.setAttribute('aria-pressed',on);store.set('py:sound',on?'1':'0');if(on){ac();pluck(523.25,.12)}}
sndBtn.setAttribute('aria-pressed',soundOn);
sndBtn.addEventListener('click',()=>{setSound(!soundOn);toast(soundOn?'Sound on':'Sound off')});

/* ---------- split headings into characters ---------- */
$$('.split')?.forEach(el=>{let i=0;const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const fr=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){fr.appendChild(document.createTextNode(' '));return}const ws=document.createElement('span');ws.style.whiteSpace='nowrap';ws.style.display='inline-block';[...w].forEach(ch=>{const o=document.createElement('span');o.className='ch';const s=document.createElement('span');s.textContent=ch;s.style.setProperty('--i',i++);o.appendChild(s);ws.appendChild(o)});fr.appendChild(ws)});c.replaceWith(fr)}else if(c.nodeType===1)walk(c)})};walk(el)});

/* ---------- street pieces: portrait, drips, dust ---------- */
$$('img[data-portrait]')?.forEach(i=>{i.src=$('.arch img')?.src});
/* ---------- drips: each one runs from the real lowest ink of a letter (measured in context, whole line) ---------- */
const dripCv=document.createElement('canvas'),dctx=dripCv.getContext('2d',{willReadFrequently:true});
function seeded(n){let x=Math.sin(n*9301+49297)*233280;return x-Math.floor(x)}
function totalTurn(el){let a=0,s=1;for(let e=el;e&&e!==document.body;e=e.parentElement){const t=getComputedStyle(e).transform;if(t&&t!=='none'){const m=t?.match(/matrix\(([^)]+)\)/);if(m){const v=m[1].split(',').map(Number);a+=Math.atan2(v[1],v[0]);s*=Math.hypot(v[0],v[1])}}}return{a,s}}
function renderLine(str,cs){
  const font=`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;dctx.font=font;try{dctx.letterSpacing=cs.letterSpacing==='normal'?'0px':cs.letterSpacing;dctx.fontKerning='normal'}catch(e){}
  const m=dctx.measureText(str),asc=m.fontBoundingBoxAscent||m.actualBoundingBoxAscent,desc=m.fontBoundingBoxDescent||m.actualBoundingBoxDescent,pad=Math.ceil(parseFloat(cs.fontSize)*.3);
  const W=Math.ceil(m.width+pad*2),H=Math.ceil(asc+desc+pad*2);dripCv.width=W;dripCv.height=H;
  dctx.font=font;try{dctx.letterSpacing=cs.letterSpacing==='normal'?'0px':cs.letterSpacing;dctx.fontKerning='normal'}catch(e){}
  dctx.textBaseline='alphabetic';dctx.fillStyle='#000';dctx.fillText(str,pad,pad+asc);
  return {data:dctx.getImageData(0,0,W,H).data,W,H,pad,width:m.width,height:asc+desc,measure:s=>{dctx.font=font;return dctx.measureText(s).width}}}
function feetIn(L,x0,x1){
  const{data,W,H}=L,on=(x,y)=>data[(y*W+x)*4+3]>140;x0=Math.max(0,Math.floor(x0));x1=Math.min(W-1,Math.ceil(x1));
  let bottom=-1;for(let y=H-1;y>=0&&bottom<0;y--)for(let x=x0;x<=x1;x++)if(on(x,y)){bottom=y;break}
  if(bottom<0)return null;const band=Math.max(2,Math.round(L.height*.07)),cols=[];
  for(let x=x0;x<=x1;x++){for(let y=bottom;y>=bottom-band;y--)if(on(x,y)){cols.push(x);break}}
  const runs=[];cols.forEach(x=>{const r=runs[runs.length-1];if(r&&x-r[1]<=1)r[1]=x;else runs.push([x,x])});
  return {runs:runs.map(r=>({x:(r[0]+r[1])/2,w:r[1]-r[0]+1})),bottom}}
function placeDrips(el,fresh){
  if(!el?.getClientRects().length)return false;
  const n=+el?.dataset.drips||3,dc=el?.dataset.dc;
  const chars=[];const tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:t=>t?.parentElement.closest('.dp')?2:1});
  for(let t;(t=tw.nextNode());){for(let i=0;i<t?.nodeValue.length;i++){const rg=document.createRange();rg.setStart(t,i);rg.setEnd(t,i+1);const rr=rg.getBoundingClientRect();if(!rr.width)continue;chars.push({t,i,rr,sp:/\s/.test(t?.nodeValue[i])})}}
  // group consecutive chars of the same text node that sit on the same line
  const groups=[];chars.forEach(c=>{const g=groups[groups.length-1];const fs=parseFloat(getComputedStyle(c.t.parentElement).fontSize);if(g&&g.t===c.t&&c.i===g.end+1&&Math.abs(c.rr.top-g.top)<fs*.35){g.end=c.i;c.g=g}else{const ng={t:c.t,start:c.i,end:c.i,top:c.rr.top};groups.push(ng);c.g=ng}});
  groups.forEach(g=>{while(g.end>g.start&&/\s/.test(g.t.nodeValue[g.end]))g.end--;while(g.start<g.end&&/\s/.test(g.t.nodeValue[g.start]))g.start++});
  const pick=chars.filter(c=>!c.sp&&c.i>=c.g.start&&c.i<=c.g.end);if(!pick.length)return false;
  const er=el?.getBoundingClientRect(),{a,s}=totalTurn(el),cos=Math.cos(-a),sin=Math.sin(-a);
  const cx=er.left+er.width/2,cy=er.top+er.height/2,lx=el?.offsetWidth/2,ly=el?.offsetHeight/2;
  const toLocal=(x,y)=>{const dx=(x-cx)/s,dy=(y-cy)/s;return[lx+dx*cos-dy*sin,ly+dx*sin+dy*cos]};
  if(fresh||!el?._dp||el?._dp.length!==Math.min(n,pick.length)){
    const seed=(el?.textContent.length*31+n*7+(el?.className.length||1))%997;const idx=pick.map((_,i)=>i);
    for(let i=idx.length-1;i>0;i--){const j=Math.floor(seeded(seed+i)*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]]}
    el._dp=idx.slice(0,Math.min(n,pick.length)).sort((p,q)=>p-q).map((pi,k)=>({pi,r:seeded(seed+50+k),len:seeded(seed+90+k),dl:seeded(seed+130+k)}))}
  const old=$$(':scope > .dp',el);const cache=new Map();
  el?._dp.forEach((p,k)=>{
    const c=pick[p.pi];if(!c)return;const g=c.g,t=g.t,pe=t?.parentElement,cs=getComputedStyle(pe);
    const tt=cs.textTransform,tr=x=>tt==='uppercase'?x.toUpperCase():tt==='lowercase'?x.toLowerCase():x;
    const str=tr(t?.nodeValue.slice(g.start,g.end+1));
    let L=cache.get(g);if(!L){L=renderLine(str,cs);const rg=document.createRange();rg.setStart(t,g.start);rg.setEnd(t,g.end+1);const r=rg.getBoundingClientRect();const[mx,my]=toLocal(r.left+r.width/2,r.top+r.height/2);L.left=mx-L.width/2;L.top=my-L.height/2;L.img={data:L.data,W:L.W,H:L.H,height:L.height};cache.set(g,L)}
    else{renderLine(str,cs)}
    const pre=L.measure(str.slice(0,c.i-g.start)),cw=L.measure(str.slice(0,c.i-g.start+1))-pre;
    const f=feetIn(L.img,L.pad+pre+cw*.08,L.pad+pre+cw*.92);if(!f||!f.runs.length)return;
    const run=f.runs[Math.floor(p.r*f.runs.length)],fs=parseFloat(cs.fontSize);
    const w=Math.max(2.5,Math.min(run.w*.6,fs*.045)),h=fs*(.14+p.len*.42);
    const d=old[k]||document.createElement('i');d.className='dp';d.setAttribute('aria-hidden','true');
    d.style.left=(L.left+run.x-L.pad-w/2).toFixed(1)+'px';d.style.top=(L.top+f.bottom-L.pad-w*.9).toFixed(1)+'px';
    d.style.setProperty('--w',w?.toFixed(1)+'px');d.style.setProperty('--h',h.toFixed(0)+'px');if(dc)d.style.setProperty('--dc',dc);
    if(!old[k]){d.style.animationDelay=(.45+p.dl*1.1).toFixed(2)+'s';el?.appendChild(d)}});
  old.slice(el?._dp.length).forEach(d=>d.remove());
  return true}
const dripEls=$$('[data-drips]');
const dripIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!e.target._placed){e.target._placed=placeDrips(e.target)}}),{rootMargin:'200px 0px'});
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>dripEls.forEach(el=>dripIO.observe(el)));
let dripT;const redrip=()=>{clearTimeout(dripT);dripT=setTimeout(()=>dripEls.forEach(el=>{if(el?.getClientRects().length)el._placed=placeDrips(el);else el._placed=false}),180)};
addEventListener('resize',redrip);addEventListener('py:edition',()=>setTimeout(redrip,400));
if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener('loadingdone',redrip);
/* re-place whenever a heading's own size changes (font swap, reflow, counter finishing) */
const dripRO=new ResizeObserver(es=>es.forEach(e=>{const el=e.target;if(el?._placed){clearTimeout(el?._rt);el._rt=setTimeout(()=>{el._placed=placeDrips(el)},60)}}));
dripEls.forEach(el=>dripRO.observe(el));
window.__placeDrips=placeDrips;


(function(){const d=$('#dust');if(!d||reduce)return;for(let i=0;i<46;i++){const s=document.createElement('i');s.style.left=(Math.random()*100).toFixed(2)+'%';s.style.top=(Math.random()*100).toFixed(2)+'%';s.style.setProperty('--s',(1+Math.random()*2.4).toFixed(1)+'px');s.style.setProperty('--a',(.2+Math.random()*.6).toFixed(2));s.style.setProperty('--d',(10+Math.random()*16).toFixed(1)+'s');s.style.setProperty('--dl',(-Math.random()*20).toFixed(1)+'s');s.style.setProperty('--dx',((Math.random()-.5)*60).toFixed(0)+'px');d.appendChild(s)}})();
function splitWords(el,boldCls){const out=[];if(!el)return out;const walk=(n,bold)=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const fr=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){fr.appendChild(document.createTextNode(' '));return}const sp=document.createElement('span');sp.className='w'+(bold?' '+boldCls:'');sp.textContent=w;fr.appendChild(sp);out.push(sp)});c.replaceWith(fr)}else if(c.nodeType===1){walk(c,c.tagName==='B');c.replaceWith(...c.childNodes)}})};walk(el,false);return out}
const sst=$('#stStatement'),swords=splitWords(sst,'r');
function stStatement(){if(root.dataset.edition!=='street'||!sst)return;const r=sst?.getBoundingClientRect();const p=clamp((innerHeight*.85-r.top)/(r.height+innerHeight*.3),0,1);const n=reduce?swords.length:Math.round(p*swords.length);swords.forEach((w,i)=>w?.classList.toggle('on',i<n))}
const sten=$('#onTheWay'),slides=$$('.slide',sten);
function stencil(){if(root.dataset.edition!=='street')return;const r=sten?.getBoundingClientRect(),len=sten?.offsetHeight-innerHeight;if(len<=0)return;const p=clamp(-r.top/len,0,1),n=slides.length;
  slides.forEach((sl,i)=>{const l=reduce?.95:p*n-i;let o=Math.min(i===0?1:clamp((l+.02)/.06,0,1),i===n-1?1:clamp((1-l)/.06,0,1));if(l<-.1||l>1.1)o=0;
    const sp=clamp((l-.05)/.3,0,1),lift=clamp((l-.4)/.14,0,1),gw=clamp((l-.54)/.2,0,1),gw2=clamp((l-.68)/.2,0,1);
    sl.style.setProperty('--o',o.toFixed(3));sl.classList.toggle('vis',o>0);sl.style.setProperty('--sp',sp.toFixed(3));sl.style.setProperty('--lift',lift.toFixed(3));sl.style.setProperty('--gw',gw.toFixed(3));sl.style.setProperty('--gw2',gw2.toFixed(3));sl.style.setProperty('--sy',(Math.sin(sp*Math.PI*3)*50).toFixed(1));
    if(sp>0&&sp<1&&!sl._h){sl._h=1;const h=hiss(.9,.06)}if(sp===0)sl._h=0})}

$$('.wk-a,.wk-b')?.forEach(w=>{const t=w?.textContent;w.textContent='';[...t].forEach((c,k)=>{const sp=document.createElement('span');sp.className='wl';sp.style.setProperty('--k',k);sp.textContent=c;w?.appendChild(sp)})});
/* ---------- reveal ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
function arm(){$$('[data-rv],.split,.spr')?.forEach(el=>{if(el?.id!=='megaTitle')io.observe(el)})}

/* ---------- loader ---------- */
const loader=$('#loader');const loaderTpl=loader.outerHTML;
function replayLoader(){const old=$('#loader');if(old)old.remove();document.body.insertAdjacentHTML('afterbegin',loaderTpl);const L=$('#loader');const g=$$('.greet span',L);let k=0;requestAnimationFrame(()=>L.classList.add('go'));const step=()=>{g.forEach((s,j)=>{s.classList.toggle('on',j===k);s.classList.toggle('off',j<k)});k++;if(k<g.length)setTimeout(step,640);else setTimeout(()=>{L.classList.add('done');setTimeout(()=>L.remove(),1200)},780)};setTimeout(step,120)}
function startPage(){arm();setTimeout(()=>$('#megaTitle')?.classList.add('in'),120);const se=store.get('py:edition');if(se!=='gold'&&se!=='street'&&!reduce&&root.dataset.intro==='cur'&&root.dataset.page!=='case')setTimeout(()=>window.__openChooser&&window.__openChooser(),400)}
if(reduce||sess.get('py:seen')||root.dataset.page==='case'){loader.remove();startPage()}
else{
  sess.set('py:seen','1');
  const g=$$('.greet span',loader);let k=0;
  requestAnimationFrame(()=>loader.classList.add('go'));
  const step=()=>{g.forEach((s,j)=>{s.classList.toggle('on',j===k);s.classList.toggle('off',j<k)});k++;if(k<g.length)setTimeout(step,640);else setTimeout(()=>{loader.classList.add('done');startPage();setTimeout(()=>loader.remove(),1200)},780)};
  setTimeout(step,120);
}

/* ---------- smooth scroll ---------- */
let lenis=null;
if(!reduce&&window.Lenis){try{lenis=new Lenis({lerp:.09,smoothWheel:true,wheelMultiplier:1});const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)}catch(e){lenis=null}}
function goTo(target,opts={}){if(lenis)lenis.scrollTo(target,Object.assign({offset:0,duration:1.4},opts));else{const y=typeof target==='number'?target:target.getBoundingClientRect().top+scrollY;scrollTo({top:y,behavior:reduce||opts.immediate?'auto':'smooth'});if(opts.onComplete)setTimeout(opts.onComplete,reduce?0:900)}}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href').slice(1);let t=id?document.getElementById(id):null;if(root.dataset.edition==='street'&&(id==='home'||id==='prologue'))t=introHero();if(!t&&id!=='top')return;e.preventDefault();closeMenu();stopIntro();goTo(id==='top'?0:t);if(id&&id!=='top'&&location.hash!=='#'+id){try{history.replaceState(null,'','#'+id)}catch(_){}}});

/* ---------- menu ---------- */
const burger=$('#burger');
function closeMenu(){document.body.classList.remove('menu-open');burger.setAttribute('aria-expanded','false');if(lenis)lenis.start()}
burger.addEventListener('click',()=>{const o=!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',o);burger.setAttribute('aria-expanded',o);if(lenis)o?lenis.stop():lenis.start()});

/* ---------- cursor + magnetic ---------- */
const cur=$('#cur'),dot=$('#curDot'),curLabel=$('#curLabel');
let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
if(fine&&!reduce){
  addEventListener('pointermove',e=>{if(e.pointerType==='mouse')document.body.classList.add('has-cursor');mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx}px,${my}px)`},{passive:true});
  (function loop(){cx+=(mx-cx)*.18;cy+=(my-cy)*.18;cur.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)})();
  document.addEventListener('pointerover',e=>{const v=e.target.closest('[data-cursor]');const h=e.target.closest('a,button,.chip,canvas');cur.classList.toggle('big',!!v&&!h);cur.classList.toggle('hover',!!h);if(v)curLabel.textContent=v.dataset.cursor});
  $$('[data-magnet]')?.forEach(el=>{el?.addEventListener('pointermove',e=>{const r=el?.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.3}px)`});el?.addEventListener('pointerleave',()=>{el.style.transform=''});el?.addEventListener('click',tick)});
}

/* ---------- prologue ---------- */
const track=$('#proTrack'),pts=$$('.pt'),pvs=$$('.pv'),N=pts.length,rail=$('#proRail');
const names=pts.map(p=>p.querySelector('.ch-no').lastChild.textContent.trim());
names.forEach((n,i)=>{const b=document.createElement('button');b.innerHTML=`<i></i><span>${n}</span>`;b.setAttribute('aria-label','Chapter '+(i+1)+', '+n);b.addEventListener('click',()=>{stopIntro();goTo(trackTop()+(i+.32)/N*trackLen())});rail?.appendChild(b)});
const railBtns=$$('button',rail);
const trackTop=()=>track?.getBoundingClientRect().top+scrollY;
const trackLen=()=>track?.offsetHeight-innerHeight;
let lastCh=-1;
function prologue(){
  const p=(scrollY-trackTop())/trackLen();
  for(let i=0;i<N;i++){
    const l=p*N-i;
    let o=Math.min(i===0?1:clamp((l+.05)/.13,0,1),i===N-1?1:clamp((1.05-l)/.13,0,1));
    if(l<-.2||l>1.2)o=0;
    const lv=clamp(l+.06,0,1).toFixed(3);
    [pts[i],pvs[i]].forEach(el=>{el?.style.setProperty('--l',lv);el?.style.setProperty('--o',o.toFixed(3));el?.classList.toggle('vis',o>0.001)});
    railBtns[i].style.setProperty('--p',lv);
  }
  const ch=clamp(Math.floor(p*N),0,N-1);
  if(ch!==lastCh){railBtns.forEach((b,j)=>b.classList.toggle('on',j===ch));if(lastCh!==-1&&p>0&&p<1)pluck([392,440,523.25,587.33,659.25,783.99][ch],.07);lastCh=ch}
}
/* play the intro: a slow, steady scroll through the chapters */
let playing=false,manualRaf=0;
const sticky=$('.pro-sticky');
function stopIntro(){if(!playing)return;playing=false;sticky.classList.remove('playing');cancelAnimationFrame(manualRaf);if(lenis)lenis.scrollTo(lenis.scroll,{immediate:true})}
function playIntro(){
  ac&&soundOn&&ac();
  const start=trackTop(),end=start+trackLen()+innerHeight*.98;
  playing=true;sticky.classList.add('playing');
  if(scrollY<start-4){goTo(start,{duration:1.6,onComplete:run})}else run();
  function run(){if(!playing)return;const dur=Math.max(4,(end-scrollY)/trackLen()*N*5.2);
    if(lenis)lenis.scrollTo(end,{duration:dur,easing:t=>t,lock:false,onComplete:()=>{playing=false;sticky.classList.remove('playing')}});
    else{const y0=scrollY,t0=performance.now();const f=t=>{if(!playing)return;const k=Math.min(1,(t-t0)/(dur*1000));scrollTo(0,y0+(end-y0)*k);if(k<1)manualRaf=requestAnimationFrame(f);else stopIntro()};manualRaf=requestAnimationFrame(f)}}
}
$('#playIntro')?.addEventListener('click',playIntro);
$('#pauseIntro')?.addEventListener('click',stopIntro);
['wheel','touchstart','keydown'].forEach(ev=>addEventListener(ev,e=>{if(playing&&!(e.target.closest&&e.target.closest('.pro-ctrl')))stopIntro()},{passive:true}));

/* ---------- strum the name ---------- */
const strum=$('#strum');const letters=[];
$$('.ln',strum)?.forEach((ln,li)=>{const host=ln.querySelector('em')||ln;const txt=host.textContent;host.textContent='';[...txt].forEach(ch=>{const s=document.createElement('span');s.className='lt';s.textContent=ch;s.setAttribute('aria-hidden','true');host.appendChild(s);letters.push({el:s,y:0,v:0,r:0,vr:0})})});
const scale=[261.63,293.66,329.63,392,440,523.25,587.33,659.25,783.99,880,1046.5,1174.66,1318.5];
let strumRaf=0,lastPY=0;
function strumLoop(){let active=false;letters.forEach(L=>{L.v+=(-.12*L.y)-.12*L.v;L.y+=L.v;L.vr+=(-.1*L.r)-.12*L.vr;L.r+=L.vr;if(Math.abs(L.y)>.05||Math.abs(L.v)>.05||Math.abs(L.r)>.05)active=true;L.el.style.transform=`translateY(${L.y.toFixed(2)}px) rotate(${L.r.toFixed(2)}deg)`});strumRaf=active?requestAnimationFrame(strumLoop):0}
function hit(i,dy){const L=letters[i];if(!L)return;const f=clamp(dy,-18,18)||(Math.random()>.5?8:-8);L.v+=f*1.3;L.vr+=f*.5;if(!strumRaf)strumRaf=requestAnimationFrame(strumLoop);pluck(scale[i%scale.length],.1)}
letters.forEach((L,i)=>{L.el.addEventListener('pointerenter',e=>{if(reduce)return;hit(i,(e.clientY-lastPY)*1.6)});L.el.addEventListener('click',()=>hit(i,-14))});
strum?.addEventListener('pointermove',e=>{lastPY=e.clientY},{passive:true});
/* touch: strum by sliding a finger across */
strum?.addEventListener('touchmove',e=>{const t=e.touches[0];const el=document.elementFromPoint(t?.clientX,t?.clientY);const i=letters.findIndex(L=>L.el===el);if(i>-1&&letters[i].last!==Math.round(t?.clientX/8)){letters[i].last=Math.round(t?.clientX/8);hit(i,-10)}},{passive:true});

/* ---------- smudge the picture ---------- */
(function(){
  const fig=$('#smudgeFig'),cv=$('#smudge'),ctx=cv?.getContext('2d');if(!cv)return;
  const img=new Image();img.src=$('.arch img')?.src;
  const base=document.createElement('canvas'),bctx=base.getContext('2d');
  const inv=document.createElement('canvas'),ictx=inv.getContext('2d');
  const brush=document.createElement('canvas'),brctx=brush.getContext('2d');
  let W=0,H=0,dpr=1,R=40,down=false,px=0,py=0,dirty=false,lastMove=0,healFrames=0,raf=0;
  if(store.get('py:smudged'))fig?.classList.add('used');
  function layout(){if(!img.complete||!img.naturalWidth)return;const r=cv?.getBoundingClientRect();if(!r.width)return;dpr=Math.min(2,devicePixelRatio||1);W=Math.round(r.width*dpr);H=Math.round(r.height*dpr);[cv,base,inv].forEach(c=>{c.width=W;c.height=H});
    const s=Math.min(W/img.naturalWidth,H*.96/img.naturalHeight)*1.02,w=img.naturalWidth*s,h=img.naturalHeight*s;
    bctx.clearRect(0,0,W,H);bctx.drawImage(img,(W-w)/2,H-h,w,h);
    ictx.globalCompositeOperation='source-over';ictx.fillStyle='#000';ictx.fillRect(0,0,W,H);ictx.globalCompositeOperation='destination-out';ictx.drawImage(base,0,0);
    R=Math.round(Math.max(26,W*.075));brush.width=brush.height=R*2;
    ctx.clearRect(0,0,W,H);ctx.drawImage(base,0,0)}
  img.onload=layout;if(img.complete)layout();
  new ResizeObserver(layout).observe(cv);
  function pos(e){const r=cv?.getBoundingClientRect();return[(e.clientX-r.left)*dpr,(e.clientY-r.top)*dpr]}
  function smear(x0,y0,x1,y1){
    const d=Math.hypot(x1-x0,y1-y0),steps=Math.max(1,Math.ceil(d/(R*.18)));
    for(let s=1;s<=steps;s++){const ax=x0+(x1-x0)*(s-1)/steps,ay=y0+(y1-y0)*(s-1)/steps,bx=x0+(x1-x0)*s/steps,by=y0+(y1-y0)*s/steps;
      brctx.globalCompositeOperation='copy';brctx.drawImage(cv,ax-R,ay-R,R*2,R*2,0,0,R*2,R*2);
      brctx.globalCompositeOperation='destination-in';const g=brctx.createRadialGradient(R,R,0,R,R,R);g.addColorStop(0,'rgba(0,0,0,.95)');g.addColorStop(.6,'rgba(0,0,0,.55)');g.addColorStop(1,'rgba(0,0,0,0)');brctx.fillStyle=g;brctx.fillRect(0,0,R*2,R*2);
      ctx.drawImage(brush,bx-R,by-R)}
    dirty=true;lastMove=performance.now();healFrames=0;if(!raf)raf=requestAnimationFrame(heal)}
  function heal(t){raf=0;if(!dirty)return;
    if(!down&&t-lastMove>1400){healFrames++;ctx.globalCompositeOperation='destination-out';ctx.globalAlpha=.06;ctx.drawImage(inv,0,0);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.06;ctx.drawImage(base,0,0);ctx.globalAlpha=1;
      if(healFrames>150){ctx.clearRect(0,0,W,H);ctx.drawImage(base,0,0);dirty=false;return}}
    raf=requestAnimationFrame(heal)}
  cv?.addEventListener('pointerdown',e=>{down=true;[px,py]=pos(e);cv?.setPointerCapture(e.pointerId);if(!fig?.classList.contains('used')){fig?.classList.add('used');store.set('py:smudged','1')}});
  cv?.addEventListener('pointermove',e=>{if(!down)return;const[x,y]=pos(e);smear(px,py,x,y);px=x;py=y});
  const up=()=>{down=false;lastMove=performance.now()};
  cv?.addEventListener('pointerup',up);cv?.addEventListener('pointercancel',up);
})();

/* ---------- statement fills word by word ---------- */
const st=$('#statement');const words=[];
(function(){const walk=(n,bold)=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const fr=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){fr.appendChild(document.createTextNode(' '));return}const s=document.createElement('span');s.className='w'+(bold?' b':'');s.textContent=w;fr.appendChild(s);words.push(s)});c.replaceWith(fr)}else if(c.nodeType===1){walk(c,c.tagName==='B');c.replaceWith(...c.childNodes)}})};if(st)walk(st,false)})();
function statement(){const r=st?.getBoundingClientRect();const p=clamp((innerHeight*.85-r.top)/(r.height+innerHeight*.35),0,1);const n=reduce?words.length:Math.round(p*words.length);words.forEach((w,i)=>w?.classList.toggle('on',i<n))}

/* fade the film grain while a yellow paper is on screen, so the paper stays clean */
(function(){const vis=new Set(),io2=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)vis.add(e.target);else vis.delete(e.target)});root.classList.toggle('nograin',vis.size>0)},{threshold:.2});$$('.paper.yellow')?.forEach(el=>io2.observe(el))})();
/* ---------- counters ---------- */
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);const el=e.target,to=+el?.dataset.count,from=to>1000?to-24:0,t0=performance.now(),d=reduce?1:1600;const f=t=>{const k=Math.min(1,(t-t0)/d),v=Math.round(from+(to-from)*(1-Math.pow(1-k,4)));if(el?.firstChild&&el?.firstChild.nodeType===3)el.firstChild.nodeValue=v;else el.textContent=v;if(k<1)requestAnimationFrame(f);else if(el?.dataset.drips&&window.__placeDrips)el._placed=window.__placeDrips(el)};requestAnimationFrame(f)}),{threshold:.6});
$$('[data-count]')?.forEach(el=>cio.observe(el));

/* ---------- work cards: stack, tilt, video ---------- */
const cards=$$('.card');
function stack(){const vh=innerHeight;cards.forEach((c,i)=>{const nx=cards[i+1];const inner=c.firstElementChild;if(!nx){inner.style.setProperty('--s',1);inner.style.setProperty('--b',1);return}const top=parseFloat(getComputedStyle(nx).top)||0;const k=clamp(1-(nx.getBoundingClientRect().top-top)/(vh*.85),0,1);inner.style.setProperty('--s',(1-k*.07).toFixed(4));inner.style.setProperty('--b',(1-k*.35).toFixed(3))})}
if(fine&&!reduce)$$('[data-tilt]')?.forEach(s=>{s.addEventListener('pointermove',e=>{const r=s.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;s.style.setProperty('--ry',(x*22).toFixed(2)+'deg');s.style.setProperty('--rx',(-y*16).toFixed(2)+'deg')});s.addEventListener('pointerleave',()=>{s.style.setProperty('--ry','0deg');s.style.setProperty('--rx','0deg')})});
const vio=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting&&!reduce){const p=v.play();p&&p.catch(()=>{})}else v.pause()}),{threshold:.25});
$$('video')?.forEach(v=>vio.observe(v));

/* ---------- experience ---------- */
const now=new Date();
const mIdx=v=>v==='now'?now.getFullYear()*12+now.getMonth()+now.getDate()/31:(+v.slice(0,4))*12+(+v.slice(5,7)-1);
const fmt=m=>{m=Math.max(1,Math.round(m));const y=Math.floor(m/12),r=m%12;return(y?y+(y>1?' years':' year'):'')+(y&&r?' ':'')+(r?r+(r>1?' months':' month'):'')};
$$('[data-start]')?.forEach(el=>{const a=mIdx(el?.dataset.start),b=el?.dataset.end==='now'?mIdx('now'):mIdx(el?.dataset.end)+1;el.textContent=fmt(b-a)});
const xp=$('#xp'),railFill=$('#railFill'),xis=$$('.xi',xp);
function timeline(){const r=xp?.getBoundingClientRect(),mark=innerHeight*.62;railFill?.style.setProperty('--f',(reduce?1:clamp((mark-r.top)/r.height,0,1)).toFixed(3));xis.forEach(x=>{const n=x.querySelector('.node').getBoundingClientRect();x.classList.toggle('lit',reduce||n.top<mark)})}

/* ---------- nav state + scroll loop ---------- */
const nav=$('#nav'),prog=$('#progress'),navLinks=$$('.links a');
const secIds=['home','work','experience','toolbox','contact'];
let lastY=scrollY,vel=0,ticking=false;
function onScroll(){
  const y=scrollY,max=root.scrollHeight-innerHeight;
  prog.style.transform=`scaleX(${max>0?y/max:0})`;
  const dy=y-lastY;lastY=y;
  if(!document.body.classList.contains('menu-open'))nav.classList.toggle('hide',dy>6&&y>innerHeight&&!playing);
  if(dy<-4)nav.classList.remove('hide');
  vel=clamp(vel+dy*.06,-8,8);
  let cur='';secIds.forEach(id=>{const el=root.dataset.edition==='street'&&id==='home'?introHero():document.getElementById(id);if(el&&el?.getBoundingClientRect().top<innerHeight*.45)cur=id});
  navLinks.forEach(a=>a.classList.toggle('on',a.dataset.sec===cur));
  if(root.dataset.page!=='case'){if(root.dataset.edition==='street'){stStatement();stencil();reel()}else{prologue();statement()}stack();timeline()}if(window.__ctlUpd)window.__ctlUpd();
  ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
addEventListener('resize',onScroll);
(function settle(){vel*=.86;root.style.setProperty('--vskew',(Math.abs(vel)<.02?0:vel).toFixed(2)+'deg');requestAnimationFrame(settle)})();
/* ---------- edition: gold or street, with a spray-paint changeover ---------- */
function hiss(d,vol=.1){if(!soundOn)return null;const a=ac();if(!a)return null;const t=a.currentTime,len=Math.floor(a.sampleRate*Math.max(.2,d||2));const buf=a.createBuffer(1,len,a.sampleRate),ch=buf.getChannelData(0);for(let i=0;i<len;i++)ch[i]=Math.random()*2-1;
  const s=a.createBufferSource();s.buffer=buf;s.loop=!d;const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=4600;f.Q.value=.7;const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.05);
  if(d){g.gain.setValueAtTime(vol,t+d-.18);g.gain.linearRampToValueAtTime(0,t+d)}s.connect(f).connect(g).connect(a.destination);s.start(t);if(d)s.stop(t+d);
  return {stop(){const n=a.currentTime;g.gain.cancelScheduledValues(n);g.gain.setValueAtTime(g.gain.value,n);g.gain.linearRampToValueAtTime(0,n+.08);s.stop(n+.1)}}}
function rattle(){if(!soundOn)return;[0,110,220].forEach(ms=>setTimeout(()=>pluck(2400+Math.random()*400,.05),ms))}
function setEdition(e,announce){root.dataset.edition=e;store.set('py:edition',e);dispatchEvent(new Event('py:edition'));if(announce)toast(e==='gold'?'Normal mode':'Street mode')}
const savedEd=store.get('py:edition');
root.dataset.edition=(savedEd==='street'||savedEd==='gold')?savedEd:'gold';
const sprayCv=$('#sprayCv'),sctx=sprayCv.getContext('2d'),can=$('#can');let sprayBusy=false;
function goldBg(){const th=root.dataset.theme;const dark=th?th==='dark':matchMedia('(prefers-color-scheme: dark)').matches;return dark?'#0b0907':'#f2ede5'}
function sprayTo(ed){
  if(sprayBusy||ed===root.dataset.edition)return;
  if(reduce){setEdition(ed,true);return}
  sprayBusy=true;
  const W=innerWidth,H=innerHeight;sprayCv.width=W;sprayCv.height=H;sctx.clearRect(0,0,W,H);
  const col=ed==='street'?'#e0140f':goldBg();
  sprayCv.classList.remove('fade');sprayCv.classList.add('on');can.classList.add('on');
  const rows=W<700?6:5,band=H/(rows-.7),dur=W<700?1050:1250,drips=[];let lx=null,ly=null,switched=false;
  const t0=performance.now();rattle();const hs=setTimeout(()=>{hiss(dur/1000+.1,.12)},180);
  function puff(x,y){
    const r=band*.78;const g=sctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(.55,col);g.addColorStop(1,'rgba(0,0,0,0)');
    sctx.globalAlpha=.42;sctx.fillStyle=g;sctx.beginPath();sctx.arc(x,y,r,0,7);sctx.fill();
    sctx.globalAlpha=.9;sctx.fillStyle=col;
    for(let i=0;i<70;i++){const a=Math.random()*6.283,d=r*1.15*Math.pow(Math.random(),.55),s=.6+Math.random()*2.2;sctx.fillRect(x+Math.cos(a)*d,y+Math.sin(a)*d,s,s)}
    sctx.globalAlpha=1;
    if(Math.random()<.05)drips.push({x:x+(Math.random()-.5)*r*1.2,y:y+r*.45,len:0,max:40+Math.random()*170,w:3+Math.random()*6,v:2.5+Math.random()*3})}
  function frame(now){
    const t=(now-t0)/dur;
    if(t<1){
      const seg=t*rows,row=Math.min(rows-1,Math.floor(seg)),f=seg-row,dir=row%2?-1:1;
      const x=dir>0?-.12*W+f*1.24*W:1.12*W-f*1.24*W,y=band*(row+.3)+Math.sin(f*Math.PI*2)*band*.1;
      if(lx===null||Math.abs(y-ly)>band*.5){lx=x;ly=y}
      const d=Math.hypot(x-lx,y-ly),n=Math.max(1,Math.ceil(d/14));
      for(let i=1;i<=n;i++)puff(lx+(x-lx)*i/n,ly+(y-ly)*i/n);
      lx=x;ly=y;
      can.style.transform=`translate(${x+band*.35}px,${y-40}px) rotate(${dir>0?-14:14}deg)`;
    }else if(!switched){
      sctx.globalAlpha=Math.min(1,(t-1)/.18);sctx.fillStyle=col;sctx.fillRect(0,0,W,H);sctx.globalAlpha=1;
      can.classList.remove('on');
      if(t>1.2){switched=true;let anc=null;['contact','wall','toolbox','experience','work'].some(id=>{const el=document.getElementById(id);if(el&&el?.getBoundingClientRect().top<innerHeight*.5){anc=el;return true}});setEdition(ed,true);if(anc){if(lenis)lenis.scrollTo(anc,{immediate:true,force:true});else scrollTo(0,anc.getBoundingClientRect().top+scrollY)}else{if(lenis)lenis.scrollTo(0,{immediate:true,force:true});else scrollTo(0,0)}
        requestAnimationFrame(()=>requestAnimationFrame(()=>{onScroll();sprayCv.classList.add('fade');setTimeout(()=>{sprayCv.classList.remove('on','fade');sctx.clearRect(0,0,W,H);sprayBusy=false},800)}));return}
    }
    sctx.fillStyle=col;drips.forEach(dp=>{if(dp.len>=dp.max)return;const nl=Math.min(dp.max,dp.len+dp.v);sctx.fillRect(dp.x-dp.w/2,dp.y+dp.len,dp.w,nl-dp.len);dp.len=nl;dp.v*=.99;if(dp.len>=dp.max){sctx.beginPath();sctx.arc(dp.x,dp.y+dp.len,dp.w*.75,0,7);sctx.fill()}});
    requestAnimationFrame(frame)}
  requestAnimationFrame(frame);
}
['#edBtn','#edBtn2'].forEach(s=>$(s).addEventListener('click',()=>{closeMenu&&closeMenu();sprayTo(root.dataset.edition==='gold'?'street':'gold')}));
/* first-visit chooser */
const chooser=$('#chooser');let chooserOpen=false;
window.__openChooser=()=>openChooser();
window.__closeChooser=()=>{if(!chooserOpen)return;chooserOpen=false;chooser.hidden=true;if(lenis)lenis.start();store.set('py:edition',root.dataset.edition)};
function openChooser(){chooser.hidden=false;chooserOpen=true;if(lenis)lenis.stop();setTimeout(()=>$('[data-pick="street"]',chooser)?.focus({preventScroll:true}),400)}
function pick(ed){if(!chooserOpen)return;chooserOpen=false;store.set('py:edition',root.dataset.edition);chooser.hidden=true;if(lenis)lenis.start();tick();if(ed!==root.dataset.edition)setTimeout(()=>sprayTo(ed),250);else store.set('py:edition',ed)}
$$('[data-pick]',chooser)?.forEach(b=>b.addEventListener('click',()=>pick(b.dataset.pick)));
addEventListener('keydown',e=>{if(e.target.closest('input,textarea')||e.metaKey||e.ctrlKey||e.altKey)return;const k=e.key.toLowerCase();const ed=(k==='g'||k==='n')?'gold':k==='s'?'street':null;if(!ed)return;if(chooserOpen)pick(ed);else sprayTo(ed)});

onScroll();
if(location.hash.length>1){const t=document.getElementById(location.hash.slice(1));if(t)setTimeout(()=>goTo(t,{immediate:true}),60)}

/* ---------- toolbox physics ---------- */
(function(){
  const box=$('#box'),chips=$$('.chip',box),modeBtns=$$('.modes button');if(!box)return;
  if(!window.Matter||reduce){box?.classList.add('static');$('.modes').style.display='none';$('#resetBox').style.display='none';return}
  const {Engine,Bodies,Body,Composite,Constraint,Vector}=Matter;
  const engine=Engine.create({enableSleeping:false});engine.gravity.y=1;
  let W=0,H=0,walls=[],bodies=[],mode='fall',running=false,started=false,ptr=null,drag=null,last=0,acc=0;
  function makeWalls(){walls.forEach(w=>Composite.remove(engine.world,w));const t=400;
    walls=[Bodies.rectangle(W/2,H+t/2,W*3,t,{isStatic:true}),Bodies.rectangle(-t/2,H/2,t,H*6,{isStatic:true}),Bodies.rectangle(W+t/2,H/2,t,H*6,{isStatic:true}),Bodies.rectangle(W/2,-t/2,W*3,t,{isStatic:true,isSensor:true})];
    walls[3].isSensor=(mode==='fall');Composite.add(engine.world,walls)}
  function build(){W=box?.clientWidth;H=box?.clientHeight;makeWalls();
    bodies=chips.map((el,i)=>{const w=el?.offsetWidth,h=el?.offsetHeight;const b=Bodies.rectangle(40+Math.random()*(W-80),-h-Math.random()*H*1.4-i*14,w,h,{chamfer:{radius:h/2-1},restitution:.35,friction:.08,frictionAir:.012,density:.0015});Body.setAngle(b,(Math.random()-.5)*.8);b.el=el;b.w=w;b.h=h;return b});
    Composite.add(engine.world,bodies)}
  function setMode(m){
    if(m==='shake'){bodies.forEach(b=>{Body.setVelocity(b,{x:(Math.random()-.5)*28,y:-10-Math.random()*16});Body.setAngularVelocity(b,(Math.random()-.5)*.5)});tick();modeBtns.forEach(x=>x.setAttribute('aria-pressed',x.dataset.mode===mode));return}
    mode=m;engine.gravity.y=m==='fall'?1:0;walls[3].isSensor=(m==='fall');
    bodies.forEach(b=>{b.frictionAir=m==='fall'?.012:.03;if(m==='float')Body.setVelocity(b,{x:(Math.random()-.5)*4,y:-2-Math.random()*4})});
    modeBtns.forEach(x=>x.setAttribute('aria-pressed',x.dataset.mode===m));tick()}
  modeBtns.forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
  $('#resetBox')?.addEventListener('click',()=>{bodies.forEach((b,i)=>{Body.setPosition(b,{x:40+Math.random()*(W-80),y:-b.h-i*30});Body.setVelocity(b,{x:0,y:0});Body.setAngle(b,0)});setMode('fall')});
  function local(e){const r=box?.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
  chips.forEach(el=>el?.addEventListener('pointerdown',e=>{const b=bodies.find(x=>x.el===el);if(!b)return;e.preventDefault();el?.setPointerCapture(e.pointerId);const p=local(e);drag=Constraint.create({pointA:p,bodyB:b,pointB:Vector.sub(p,b.position),stiffness:.18,damping:.08,length:0});Composite.add(engine.world,drag);pluck(scale[chips.indexOf(el)%scale.length]/2,.07)}));
  addEventListener('pointermove',e=>{const r=box?.getBoundingClientRect();ptr={x:e.clientX-r.left,y:e.clientY-r.top,inside:e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom};if(drag)drag.pointA=ptr},{passive:true});
  const release=()=>{if(drag){Composite.remove(engine.world,drag);drag=null}};
  addEventListener('pointerup',release);addEventListener('pointercancel',release);
  function stepForces(){
    if(mode==='float'){bodies.forEach(b=>{Body.applyForce(b,b.position,{x:(Math.random()-.5)*.00004*b.mass*60,y:(Math.random()-.5)*.00004*b.mass*60});if(b.speed<.6)Body.setVelocity(b,{x:b.velocity.x+(Math.random()-.5)*.6,y:b.velocity.y+(Math.random()-.5)*.6})})}
    if(mode==='magnet'){const t=ptr&&ptr.inside?ptr:{x:W/2,y:H/2};bodies.forEach(b=>{const d=Vector.sub(t,b.position),len=Math.max(40,Vector.magnitude(d));Body.applyForce(b,b.position,Vector.mult(Vector.normalise(d),.0009*b.mass*Math.min(1,len/200)))})}
  }
  function frame(t){if(!running){last=0;return}
    const dt=last?Math.min(50,t-last):16.67;last=t;acc+=dt;
    while(acc>=16.67){stepForces();Engine.update(engine,16.67);acc-=16.67}
    bodies.forEach(b=>{const p=b.position;if(p.y>H+300||p.x<-300||p.x>W+300){Body.setPosition(b,{x:W/2,y:-60});Body.setVelocity(b,{x:0,y:0})}
      if(mode!=='fall'&&p.y<-b.h){Body.setPosition(b,{x:p.x,y:b.h})}
      b.el.style.transform=`translate(${(p.x-b.w/2).toFixed(1)}px,${(p.y-b.h/2).toFixed(1)}px) rotate(${b.angle.toFixed(3)}rad)`});
    requestAnimationFrame(frame)}
  addEventListener('py:edition',()=>{if(!started)return;(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(()=>{release();W=box?.clientWidth;H=box?.clientHeight;makeWalls();
    bodies=bodies.map(b=>{const el=b.el,w=el?.offsetWidth,h=el?.offsetHeight,nb=Bodies.rectangle(clamp(b.position.x,w/2,W-w/2),Math.min(b.position.y,H-h),w,h,{chamfer:{radius:Math.min(h/2-1,root.dataset.edition==='street'?8:h/2-1)},restitution:.35,friction:.08,frictionAir:b.frictionAir,density:.0015});Body.setAngle(nb,b.angle);Body.setVelocity(nb,{x:0,y:-4});nb.el=el;nb.w=w;nb.h=h;Composite.remove(engine.world,b);Composite.add(engine.world,nb);return nb})}))});
  chips.forEach(el=>{el.style.transform='translate(-999px,-999px)'});
  new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){if(!started){started=true;(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(build)}if(!running){running=true;requestAnimationFrame(frame)}}else running=false}),{threshold:.2}).observe(box);
  let rt;new ResizeObserver(()=>{if(!started)return;clearTimeout(rt);rt=setTimeout(()=>{W=box?.clientWidth;H=box?.clientHeight;makeWalls();bodies.forEach(b=>Body.setPosition(b,{x:clamp(b.position.x,b.w/2,W-b.w/2),y:Math.min(b.position.y,H-b.h)}))},120)}).observe(box);
})();

/* ---------- the wall: spray paint with drips ---------- */
(function(){
  const box=$('#wallBox'),cv=$('#wallCv'),ctx=cv?.getContext('2d');if(!cv)return;
  const sw=$$('.swatches button'),sz=$$('.sizes button[data-s]');
  let W=0,H=0,dpr=1,color='',size=24,down=false,x=0,y=0,lx=0,ly=0,still=0,drips=[],raf=0,hs=null;
  function defColor(){return root.dataset.edition==='street'?'#3cff52':'#dcb66c'}
  function setColor(c){color=c;sw.forEach(b=>b.setAttribute('aria-pressed',b.dataset.c===c));const b=sw.find(x=>x.dataset.c===c);$('#wtc').style.background=c;$('#wtn').textContent=b?b.getAttribute('aria-label'):''}
  setColor(defColor());
  addEventListener('py:edition',()=>setColor(defColor()));
  sw.forEach(b=>b.addEventListener('click',()=>{setColor(b.dataset.c);tick()}));
  sz.forEach(b=>b.addEventListener('click',()=>{size=+b.dataset.s;sz.forEach(x=>x.setAttribute('aria-pressed',x===b));tick()}));
  function fit(){const r=cv?.getBoundingClientRect();if(!r.width)return;const nd=Math.min(2,devicePixelRatio||1);const nw=Math.round(r.width*nd),nh=Math.round(r.height*nd);if(nw===W&&nh===H)return;
    let old=null;if(W&&H){old=document.createElement('canvas');old.width=W;old.height=H;old.getContext('2d').drawImage(cv,0,0)}
    W=cv.width=nw;H=cv.height=nh;dpr=nd;if(old)ctx.drawImage(old,0,0,W,H)}
  new ResizeObserver(fit).observe(cv);
  function pos(e){const r=cv?.getBoundingClientRect();return[(e.clientX-r.left)*dpr,(e.clientY-r.top)*dpr]}
  function puff(px,py){const r=size*dpr;
    const g=ctx.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');ctx.globalAlpha=.16;ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,r,0,7);ctx.fill();
    ctx.globalAlpha=.75;ctx.fillStyle=color;const n=Math.round(size*1.4);
    for(let i=0;i<n;i++){const a=Math.random()*6.283,d=r*1.3*Math.pow(Math.random(),.7),s=(.5+Math.random()*1.4)*dpr;ctx.fillRect(px+Math.cos(a)*d,py+Math.sin(a)*d,s,s)}
    ctx.globalAlpha=1}
  function loop(){raf=0;let busy=false;
    if(down){const d=Math.hypot(x-lx,y-ly),n=Math.max(1,Math.ceil(d/(size*dpr*.25)));for(let i=1;i<=n;i++)puff(lx+(x-lx)*i/n,ly+(y-ly)*i/n);
      if(d<2*dpr){still++;if(still>22&&still%14===0&&drips.length<60)drips.push({x:x+(Math.random()-.5)*size*dpr*.5,y:y+size*dpr*.3,len:0,max:(30+Math.random()*110)*dpr,w:Math.max(2,size*.16)*dpr,v:(1.2+Math.random()*1.6)*dpr,c:color})}else still=0;
      lx=x;ly=y;busy=true}
    drips.forEach(dp=>{if(dp.len>=dp.max)return;busy=true;const nl=Math.min(dp.max,dp.len+dp.v);ctx.fillStyle=dp.c;ctx.globalAlpha=.85;ctx.fillRect(dp.x-dp.w/2,dp.y+dp.len,dp.w,nl-dp.len);dp.len=nl;dp.v*=.985;if(dp.v<.25*dpr)dp.max=dp.len;if(dp.len>=dp.max){ctx.beginPath();ctx.arc(dp.x,dp.y+dp.len,dp.w*.7,0,7);ctx.fill()}ctx.globalAlpha=1});
    drips=drips.filter(dp=>dp.len<dp.max);
    if(busy)raf=requestAnimationFrame(loop)}
  cv?.addEventListener('pointerdown',e=>{fit();down=true;cv?.setPointerCapture(e.pointerId);[x,y]=pos(e);lx=x;ly=y;still=0;box?.classList.add('used');rattle();hs=hiss(0,.07);if(!raf)raf=requestAnimationFrame(loop)});
  cv?.addEventListener('pointermove',e=>{if(down)[x,y]=pos(e)});
  const up=()=>{if(!down)return;down=false;if(hs){hs.stop();hs=null}};
  cv?.addEventListener('pointerup',up);cv?.addEventListener('pointercancel',up);
  $('#wallClear')?.addEventListener('click',()=>{ctx.clearRect(0,0,W,H);drips=[];box?.classList.remove('used');toast('Clean wall');tick()});
  let tagged=false;
  function autoTag(){if(tagged||reduce)return;fit();if(!W)return;tagged=true;
    const off=document.createElement('canvas');off.width=W;off.height=H;const o=off.getContext('2d');const fs=Math.round(Math.min(H*.3,W*.13));
    o.font=`${fs}px "Sedgwick Ave","Sedgwick Ave Display",cursive`;o.textAlign='center';o.textBaseline='middle';o.fillStyle='#000';o.fillText('Hii folks!',W/2,H*.42);
    const d=o.getImageData(0,0,W,H).data,pts=[],st=Math.max(3,Math.round(fs/30));
    for(let y=0;y<H;y+=st)for(let x=0;x<W;x+=st)if(d[(y*W+x)*4+3]>140)pts.push([x+(Math.random()-.5)*st,y+(Math.random()-.5)*st]);
    pts.sort((a,b)=>a[0]-b[0]);const col=root.dataset.edition==='street'?'#e3242b':'#dcb66c';let i=0;const per=Math.max(1,Math.ceil(pts.length/80));
    (function step(){const end=Math.min(pts.length,i+per);ctx.fillStyle=col;
      for(;i<end;i++){const[px,py]=pts[i];ctx.globalAlpha=.14;ctx.beginPath();ctx.arc(px,py,st*1.5,0,7);ctx.fill();ctx.globalAlpha=.7;for(let k=0;k<3;k++){const a=Math.random()*6.283,rr=st*(.6+Math.random()*1.4);ctx.fillRect(px+Math.cos(a)*rr,py+Math.sin(a)*rr,1.3*dpr,1.3*dpr)}}
      ctx.globalAlpha=1;
      if(i<pts.length)requestAnimationFrame(step);else{for(let k=0;k<7;k++){const p=pts[Math.floor(Math.random()*pts.length)];drips.push({x:p[0],y:p[1],len:0,max:(25+Math.random()*70)*dpr,w:2.4*dpr,v:(1+Math.random())*dpr,c:col})}if(!raf)raf=requestAnimationFrame(loop)}})();
  }
  const go=()=>new IntersectionObserver((es,ob)=>{if(es[0].isIntersecting){ob.disconnect();setTimeout(autoTag,450)}},{threshold:.45}).observe(box);
  (document.fonts&&document.fonts.load?document.fonts.load('40px "Sedgwick Ave"').catch(()=>{}):Promise.resolve()).then(go);
})();

/* ---------- make a mess: draggable stickers ---------- */
(function(){const box=$('#messBox');if(!box)return;const mks=$$('.mk',box);const init=mks.map(m=>m.getAttribute('style'));let z=10;
  mks.forEach((m,idx)=>m.addEventListener('pointerdown',e=>{e.preventDefault();m.setPointerCapture(e.pointerId);const sx=e.clientX,sy=e.clientY,l0=m.offsetLeft,t0=m.offsetTop;m.classList.add('drag');m.style.zIndex=++z;const r0=parseFloat(m.style.getPropertyValue('--r'))||0;let lastX=e.clientX;pluck(scale[idx%scale.length],.06);
    const mv=ev=>{const b=box?.getBoundingClientRect();m.style.left=clamp(l0+ev.clientX-sx,-40,b.width-40)+'px';m.style.top=clamp(t0+ev.clientY-sy,-30,b.height-30)+'px';const vx=ev.clientX-lastX;lastX=ev.clientX;m.style.setProperty('--r',clamp(r0+vx*1.5,-30,30).toFixed(1)+'deg')};
    const upf=()=>{m.classList.remove('drag');m.removeEventListener('pointermove',mv);m.removeEventListener('pointerup',upf);m.removeEventListener('pointercancel',upf);m.style.setProperty('--r',(r0+(Math.random()-.5)*12).toFixed(1)+'deg');tick()};
    m.addEventListener('pointermove',mv);m.addEventListener('pointerup',upf);m.addEventListener('pointercancel',upf)}));
  $('#messReset')?.addEventListener('click',()=>{mks.forEach((m,i)=>m.setAttribute('style',init[i]));tick()})})();

/* ---------- move the light ---------- */
(function(){
  const sec=$('#light'),lit=$('.lt .lit',sec);if(!sec)return;let tx=.5,ty=.5,x=.5,y=.5,touched=false,on=false,t0=performance.now();
  sec?.addEventListener('pointermove',e=>{const r=sec?.getBoundingClientRect();tx=(e.clientX-r.left)/r.width;ty=(e.clientY-r.top)/r.height;touched=true},{passive:true});
  sec?.addEventListener('pointerleave',()=>{touched=false});
  new IntersectionObserver(es=>{on=es[0].isIntersecting;if(on)requestAnimationFrame(loop)}).observe(sec);
  function loop(t){if(!on)return;if(!touched){const k=(t-t0)/1000;tx=.5+Math.sin(k*.5)*.32;ty=.5+Math.sin(k*.8)*.14}
    x+=(tx-x)*.08;y+=(ty-y)*.08;sec?.style.setProperty('--x',(x*100).toFixed(2)+'%');sec?.style.setProperty('--y',(y*100).toFixed(2)+'%');
    const sr=sec?.getBoundingClientRect(),lr=lit.getBoundingClientRect();lit.style.setProperty('--mx',(sr.left+x*sr.width-lr.left).toFixed(1)+'px');lit.style.setProperty('--my',(sr.top+y*sr.height-lr.top).toFixed(1)+'px');
    if(!reduce)requestAnimationFrame(loop)}
})();

/* ---------- contact form ---------- */
(function(){
  const steps=$$('.step'),dots=$$('#fSteps li'),next=$('#fNext'),back=$('#fBack'),send=$('#fSend'),err=$('#fErr'),stepNo=$('#stepNo'),ticket=$('#ticket');if(!next)return;
  const data={name:'',email:'',type:'',when:'',msg:''};let s=0;
  const no=String((new Date().getDate()*37+new Date().getMonth()*11)%9000+1000);$('#tNo').textContent='No. '+no;
  function setT(id,v,ph){const el=$(id);el.textContent=v||ph;el?.classList.toggle('empty',!v)}
  function paint(){steps.forEach((x,i)=>x.classList.toggle('on',i===s));dots.forEach((d,i)=>d.classList.toggle('on',i<=s));if(stepNo)stepNo.textContent=s+1;back.style.visibility=s?'visible':'hidden';next.style.display=s===3?'none':'';send.style.display=s===3?'':'none';err.textContent='';
    setT('#tName',data.name,'Your name');setT('#tType',data.type,'Step 2');setT('#tWhen',data.when,'Step 3');
    const body=`Hi Priyanka,\n\n${data.msg||''}\n\nProject: ${data.type||'-'}\nTiming: ${data.when||'-'}\n\n${data.name}\n${data.email}`;
    send.href='mailto:priyankayadav76047@gmail.com?subject='+encodeURIComponent('Project inquiry No. '+no+(data.name?' from '+data.name:''))+'&body='+encodeURIComponent(body);
    ticket?.classList.toggle('ready',s===3&&data.msg.trim().length>0)}
  function valid(){if(s===0){data.name=$('#fName')?.value.trim();data.email=$('#fEmail')?.value.trim();if(!data.name){err.textContent='Add your name to continue.';return false}if(!/^\S+@\S+\.\S+$/.test(data.email)){err.textContent='Add an email I can reply to, like you@company.com.';return false}}
    if(s===1&&!data.type){err.textContent='Pick what we’re designing.';return false}
    if(s===2&&!data.when){err.textContent='Pick a timing, “Just exploring” is fine.';return false}return true}
  next?.addEventListener('click',()=>{if(!valid())return;s=Math.min(3,s+1);paint();tick();const f=steps[s].querySelector('input,textarea,button');f&&f.focus({preventScroll:true})});
  back?.addEventListener('click',()=>{s=Math.max(0,s-1);paint()});
  $('#fName')?.addEventListener('input',e=>{data.name=e.target.value.trim();setT('#tName',data.name,'Your name')});
  $('#fMsg')?.addEventListener('input',e=>{data.msg=e.target.value;paint()});
  $$('.opts')?.forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('button',g)?.forEach(x=>x.setAttribute('aria-pressed',x===b));data[g.dataset.key]=b.textContent;pluck(659.25,.06);paint()}));
  [$('#fName'),$('#fEmail')].forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter')next?.click()}));
  send?.addEventListener('click',e=>{if(!data.msg.trim()){e.preventDefault();err.textContent='Write a line or two about the project first.';return}toast('Opening your mail app');pluck(783.99,.1)});
  paint();
})();

/* ---------- intro options (review build) ---------- */
$$('[data-from]')?.forEach(el=>{const src=$(el?.dataset.from);if(!src)return;if(el?.tagName==='VIDEO'){const so=src.querySelector('source');el.src=so?so.src:src.currentSrc||src.src;if(src.poster)el.poster=src.poster}else el.src=src.src});
var reelEl=document.getElementById('homeO1');
function introHero(){const i=root.dataset.intro;return i==='o1'?$('#homeO1'):i==='o2'?$('#homeO2'):$('#homeSt')}
let reelPh=-1;
function reel(){if(!reelEl||root.dataset.intro!=='o1'||root.dataset.edition!=='street')return null;
  const r=reelEl.getBoundingClientRect(),len=reelEl.offsetHeight-innerHeight+64;const p=clamp((64-r.top)/len,0,1);const ph=Math.min(3,Math.floor(p*4.0001));
  $$('.lay',reelEl)?.forEach(l=>l.classList.toggle('on',+l.dataset.ph===ph));
  const si=Math.max(0,ph-1);
  if(ph!==reelPh){reelPh=ph;
    $$('.rscr',reelEl)?.forEach(s=>{const i=+s.dataset.s;s.classList.toggle('on',i===si);s.classList.toggle('past',i<si);const v=$('video',s);if(v){if(i===si&&!reduce){const pr=v.play();pr&&pr.catch(()=>{})}else v.pause()}});
    $('.ptag',reelEl).innerHTML=['<span class="sb white sm">● Shipped</span>','<span class="sb yellow sm">Kids product</span>','<span class="sb red sm">Launch page</span>'][si];
    $('.o1-right',reelEl)?.style.setProperty('--glow2',['rgba(132,86,255,.38)','rgba(120,200,255,.32)','rgba(227,36,43,.35)'][si]);
    $('.dev3',reelEl)?.style.setProperty('--prot',[3,-3,4,-2][ph]+'deg');if(ph>0)tick()}
  $$('.o1-rail button',reelEl)?.forEach((b,i)=>{b.querySelector('u').style.setProperty('--f',(ph>i+1?1:clamp(p*4-(i+1),0,1)).toFixed(3));b.classList.toggle('on',si===i&&ph>0)});
  const h=$('.hint2',reelEl);if(h)h.style.opacity=ph===0?1:0;
  return {p,ph}}
function reelGo(ph,smooth){const top=reelEl.getBoundingClientRect().top+scrollY-64,len=reelEl.offsetHeight-innerHeight+64;goTo(top+len*((ph+.5)/4),smooth?{duration:1.1}:{immediate:true,force:true})}
document.addEventListener('click',e=>{const b=e.target.closest('[data-o1]');if(!b)return;const v=b.dataset.o1;reelGo(v==='next'?Math.min(3,reelPh+1):+v,true)});
/* option 2 */
const WORDS=['apps.','design systems.','launch pages.'];let wordI=0,wordT=0;
const PATHS={hire:['hiring','pHire','You’re here for: hiring'],proj:['a project','contact','You’re here for: a project'],look:['a look around','wall','You’re here for: a look around']};
let path=null;
function sprayWord(i){const w=$('#rotWord');if(!w)return;wordI=i;w?.classList.remove('go');$$('.dp',w)?.forEach(d=>d.remove());w.textContent=WORDS[i];void w?.offsetWidth;w?.classList.add('go');w.dataset.drips='3';w._dp=null;requestAnimationFrame(()=>placeDrips(w,true))}
function wordLoop(on){clearInterval(wordT);if(on&&!reduce)wordT=setInterval(()=>{sprayWord((wordI+1)%WORDS.length);if(window.__ctlUpd)window.__ctlUpd()},2600)}
if($('#homeO2'))new IntersectionObserver(es=>wordLoop(es[0].isIntersecting)).observe($('#homeO2'));
function setPath(k,go=true){path=k;$$('.path')?.forEach(b=>b.classList.toggle('chosen',b.dataset.path===k));
  $$('[data-here]')?.forEach(s=>s.removeAttribute('data-here'));
  const chip=$('#pathChip');chip.classList.toggle('on',!!k);$('#projFilled')?.classList.toggle('on',k==='proj');
  if(k){$('b',chip).textContent=PATHS[k][0];const t=document.getElementById(PATHS[k][1]);t?.setAttribute('data-here',PATHS[k][2]);if(go)goTo(t,{offset:-70,duration:1.3})}
  if(window.__ctlUpd)window.__ctlUpd()}
document.addEventListener('click',e=>{const pb=e.target.closest('[data-path]');if(pb){setPath(pb.dataset.path);tick();return}
  const a=e.target.closest('[data-act]');if(!a)return;if(a.dataset.act==='clearpath')setPath(null,false);if(a.dataset.act==='edswap')sprayTo('gold')});
function setIntro(i){root.dataset.intro=i;store.set('py:intro',i);reelPh=-1;if(i!=='o2')setPath(null,false);requestAnimationFrame(()=>{arm();onScroll()});if(window.__ctlUpd)window.__ctlUpd()}
/* API for the review controller */
window.__py={get state(){const r=reel();return{cf:root.dataset.cf,xp:root.dataset.xp,intro:root.dataset.intro,edition:root.dataset.edition,reel:r?r.ph:null,word:WORDS[wordI],path,section:curSection()}},
  setCf:n=>{root.dataset.cf=String(n);store.set('py:cf',String(n));if(window.__openCase)window.__openCase(true);if(window.__ctlUpd)window.__ctlUpd()},
  setXp:n=>{root.dataset.xp=String(n);store.set('py:xp',String(n));requestAnimationFrame(()=>{arm();onScroll();dispatchEvent(new Event('resize'))});if(window.__ctlUpd)window.__ctlUpd()},openAllJobs:()=>$$('.jb-row')?.forEach(d=>d.open=true),
  setIntro,sprayTo:ed=>sprayTo(ed),setEdition:ed=>setEdition(ed,false),goTo:(t,o)=>goTo(t,o||{immediate:true,force:true}),reelGo,setPath,sprayWord:i=>{wordLoop(false);sprayWord(i)},wordLoop,
  replayLoader,openChooser:()=>window.__openChooser&&window.__openChooser(),hero:introHero,top:()=>goTo(0,{immediate:true,force:true})};
function curSection(){let c='top';$$('main section[id],main [id="links"]')?.forEach(s=>{if(s.offsetParent!==null&&s.getBoundingClientRect().top<innerHeight*.45)c=s.id});return c}

/* ---------- case study: NoiseFit sleep revamp (#case-sleep) ---------- */
(function(){
  const cs=$('#case-sleep');
  if(!cs){
    // Home page: the NoiseFit card opens case-studies/noisefit-sleep.html
    const CASE_URL='case-studies/noisefit-sleep.html';
    if(location.hash==='#case-sleep'){location.replace(CASE_URL);return}
    const c1=$('.c1 .card-in');
    if(c1){c1.style.cursor='pointer';c1.addEventListener('click',e=>{if(e.target.closest('a'))return;location.href=CASE_URL})}
    // Card 3 (Bose x Noise Master Buds): the whole card opens the launch page in a new tab
    const c3=$('.c3 .card-in'),c3a=$('.c3 .c-link');
    if(c3&&c3a){c3.style.cursor='pointer';c3.addEventListener('click',e=>{if(e.target.closest('a'))return;window.open(c3a.href,'_blank','noopener')})}
    document.addEventListener('click',e=>{const a=e.target.closest('a[href="#case-sleep"]');if(a){e.preventDefault();location.href=CASE_URL}},true);
    return}
  let lastY=0;
  function openCase(push){if(root.classList.contains('case-open'))return;lastY=scrollY;root.classList.add('case-open');if(push){try{history.pushState(null,'','#case-sleep')}catch(e){location.hash='case-sleep'}}
    if(lenis){lenis.scrollTo(0,{immediate:true,force:true});lenis.resize&&lenis.resize()}else scrollTo(0,0);
    requestAnimationFrame(()=>{arm();dispatchEvent(new Event('resize'));walk()})}
  function closeCase(restore){if(!root.classList.contains('case-open'))return;root.classList.remove('case-open');if(restore){if(lenis){lenis.resize&&lenis.resize();lenis.scrollTo(lastY,{immediate:true,force:true})}else scrollTo(0,lastY)}requestAnimationFrame(()=>{dispatchEvent(new Event('resize'));onScroll()})}
  // The case study lives on its own page: case-studies/noisefit-sleep.html
  const noMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_CASE=root.dataset.page==='case',CASE_URL='case-studies/noisefit-sleep.html';
  function goCase(){location.href=CASE_URL}
  function backToWork(){location.href='../index.html#work'}
  window.__openCase=openCase;window.__closeCase=closeCase;
  if(IS_CASE){
    openCase(false);
    addEventListener('keydown',e=>{if(e.key==='Escape')backToWork()});
  }
  // walkthrough: the phone scrolls the rebuilt Sleep page to each step
  $$('.fg-host',document)?.forEach(h=>{const t=document.getElementById('tplFg'+h.dataset.fg);if(t&&!h.firstChild)h.appendChild(t?.content.cloneNode(true))});
  function fgY(host,txt){if(!txt||!host)return 0;const el=[...host.querySelectorAll('p')].find(p=>p.textContent.trim()===txt);if(!el)return 0;const hr=host.getBoundingClientRect(),sc=hr.width/390;if(!sc)return 0;return Math.max(0,(el?.getBoundingClientRect().top-hr.top)/sc-34)}
  function fgPlace(ui,txt){const host=ui&&ui.querySelector('.fg-host');if(!host)return;const sc=host.getBoundingClientRect().width/390||1;ui.style.translate=`0 ${-fgY(host,txt)*sc}px`}
  const steps=$$('.cs-steps li',cs),page=$('#npPage'),phone=$('#npWalk'),WK={contrib:'Contributors',timeline:'Timeline',analysis:'Sleep analysis',plan:'Improvement plan',trends:'Trends'};let cur=-1;
  function show(i){if(i===cur||!page)return;cur=i;steps.forEach((s,k)=>s.classList.toggle('on',k===i));
    const st=steps[i];fgPlace(page,WK[st?.dataset.at]);phone?.classList.toggle('sheet-on',!!st?.dataset.sheet)}
  function walk(){if(!root.classList.contains('case-open')||!steps.length)return;const mid=innerHeight*(innerWidth<900?.78:.55);let best=0,bd=1e9;steps.forEach((s,k)=>{const r=s.getBoundingClientRect(),d=Math.abs(r.top+r.height/2-mid);if(d<bd){bd=d;best=k}});show(best)}
  addEventListener('scroll',()=>requestAnimationFrame(walk),{passive:true});
  (function(){const fl=$('.fl',cs);if(!fl)return;
    $$('.fg-host[data-nap]',cs)?.forEach(h=>{const t=document.getElementById('tplFgs');if(!h.firstChild&&t)h.appendChild(t?.content.cloneNode(true));
      const P=x=>[...h.querySelectorAll('p')].find(p=>p.textContent.trim()===x),set=(a,b)=>{const e=P(a);if(e)e.textContent=b};
      set('Second sleep','Nap');set('Total sleep: 4h 00min','Total sleep: 2h 13min');set('5:00pm','2:13am');set('1:00pm','12:00am');
      const f=P('First Sleep');let e=f;while(e&&e.parentElement){const sib=[...e.parentElement.children].find(c=>c!==e&&/^Nap/.test(c.textContent.replace(/^[\d:apm]+/,'')));if(sib){e.style.display='none';break}e=e.parentElement}
    });
    $$('.fg-host[data-fg="s"]:not([data-nap])',cs)?.forEach(h=>{const t=document.getElementById('tplFgs');if(!h.firstChild&&t)h.appendChild(t?.content.cloneNode(true))});
    function place(ui,txt,anim){const host=ui&&ui.querySelector('.fg-host');if(!host)return;const hr=host.getBoundingClientRect(),sc=hr.width/390;if(!sc)return;ui.style.transition=anim?'':'none';const y=txt?fgY(host,txt):0;ui.style.translate=`0 ${-y*sc}px`}
    function flFit(){let ws=[];$$('.fl-steps',cs)?.forEach(st=>{const av=st?.clientWidth;if(!av)return;const n=st?.querySelectorAll('.fl-step').length;let w=236;if(innerWidth>1100){const arrows=(n-1)*44,gaps=(2*n-2)*Math.max(6,Math.min(14,innerWidth/100));w=Math.max(130,Math.min(236,Math.floor((av-arrows-gaps)/n-6)))}else w=Math.min(236,av);ws.push(w)});if(ws.length){const m=Math.min(...ws);$$('.fl-steps .np',cs)?.forEach(e=>e.style.setProperty('--pwn',m))}setup()}
    function setup(){place($('#saUi'),'',false);place($('#naUi'),'Timeline',false)}
    flFit();addEventListener('resize',flFit);new MutationObserver(()=>requestAnimationFrame(flFit)).observe(root,{attributes:true,attributeFilter:['class']});if(window.ResizeObserver)$$('.fl-steps',cs)?.forEach(x=>new ResizeObserver(flFit).observe(x));
    let tl=false,loop=null;const tick=()=>{tl=!tl;place($('#saUi'),tl?'Timeline':'',true)};
    if('IntersectionObserver' in window){new IntersectionObserver(es=>{es.forEach(e=>{fl.classList.toggle('on',e.isIntersecting);clearInterval(loop);if(e.isIntersecting){if(noMotion){place($('#saUi'),'',false)}else{tl=false;place($('#saUi'),'',true);loop=setInterval(tick,3800)}}})},{threshold:.15}).observe(fl)}else fl.classList.add('on');
  })();
  function flScale(){$$('.fl-win',cs)?.forEach(w=>{const c=w?.parentElement.clientWidth;if(!c)return;w?.style.setProperty('--s',Math.min(1.15,c/390).toFixed(3))})}
  flScale();addEventListener('resize',flScale);new MutationObserver(()=>requestAnimationFrame(flScale)).observe(root,{attributes:true,attributeFilter:['class']});if(window.ResizeObserver)$$('.fl-v',cs)?.forEach(v=>new ResizeObserver(flScale).observe(v));

  function fitLead(){const h=$('.cs-h1',cs),box=$('.cs-hero-copy',cs);if(!h||!box||!h.offsetParent)return;const sp=[...h.children].filter(e=>e.tagName==='SPAN');if(!sp.length)return;let l=1e9,r=0;sp.forEach(e=>{l=Math.min(l,e.offsetLeft);r=Math.max(r,e.offsetLeft+e.offsetWidth)});box?.style.setProperty('--hw',(r-l)+'px');box.dataset.hl=(sp.length>1&&Math.abs(sp[0].offsetTop-sp[1].offsetTop)>10)?'2':'1'}
  window.__fitLead=fitLead;
  if(window.ResizeObserver){const h=$('.cs-h1',cs);if(h)new ResizeObserver(()=>fitLead()).observe(h)}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitLead);
  addEventListener('resize',()=>requestAnimationFrame(fitLead));
  new MutationObserver(()=>requestAnimationFrame(fitLead)).observe(root,{attributes:true,attributeFilter:['class']});
  show(0);
  addEventListener('resize',()=>{const i=cur;cur=-1;show(Math.max(0,i))});
  // old vs new compare: both phones scroll to the matching section (found by its title)
  const cmpB=$$('.cmp-chips [data-k]',cs),pgOld=$('#pgOld'),pgNew=$('#pgNew'),none=$('#noneOld'),noneTxt=$('#noneTxt');
  const OLDT={why:'Breakdown',naps:'Nap details',trends:'Trends'},NEWT={why:'Contributors',naps:'Timeline',addedit:'Timeline',plan:'Improvement plan',trends:'Trends'},NONE={addedit:'Sleep could only come from the band.',plan:'There was nothing here to plan the night ahead.'};
  function cmp(k){cmpB.forEach(b=>b.setAttribute('aria-selected',b.dataset.k===k));$$('.cmp-text>div',cs)?.forEach(d=>d.classList.toggle('on',d.dataset.t===k));
    clearTimeout(cmp._t);pgNew.style.transition='';fgPlace(pgOld,OLDT[k]);fgPlace(pgNew,NEWT[k]);
    if(k==='trends'&&!noMotion){cmp._t=setTimeout(()=>{const host=pgNew.querySelector('.fg-host'),hr=host.getBoundingClientRect(),sc=hr.width/390;if(!sc)return;const end=[...host.querySelectorAll('p')].find(p=>p.textContent.trim()==='About Sleep');if(!end)return;const y=(end.getBoundingClientRect().top-hr.top)/sc-640;pgNew.style.transition='translate 7s cubic-bezier(.45,0,.25,1)';pgNew.style.translate=`0 ${-y*sc}px`},1300)}
    if(none){none.classList.toggle('on',!!NONE[k]);if(noneTxt&&NONE[k])noneTxt.textContent=NONE[k]}}
  const strip=$('.cmp-chips',cs);
  function chipFade(){if(!strip)return;const m=strip.scrollWidth-strip.clientWidth;strip.style.setProperty('--fl',m>2&&strip.scrollLeft>4?1:0);strip.style.setProperty('--fr',m>2&&strip.scrollLeft<m-4?1:0)}
  function chipCenter(b){if(!strip)return;strip.scrollTo({left:Math.max(0,b.offsetLeft-(strip.clientWidth-b.offsetWidth)/2),behavior:noMotion?'auto':'smooth'})}
  if(strip){strip.addEventListener('scroll',chipFade,{passive:true});addEventListener('resize',chipFade);new MutationObserver(()=>requestAnimationFrame(chipFade)).observe(root,{attributes:true,attributeFilter:['class']});if(window.ResizeObserver)new ResizeObserver(chipFade).observe(strip);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(chipFade)}
  cmpB.forEach(b=>b.addEventListener('click',()=>{cmp(b.dataset.k);chipCenter(b)}));
  addEventListener('resize',()=>{const b=cmpB.find(x=>x.getAttribute('aria-selected')==='true');if(b)cmp(b.dataset.k)});
  cmp('score');
})();

/* ---------- copy email ---------- */
$('#copyBtn')?.addEventListener('click',async()=>{const t=$('#email')?.textContent.trim();try{await navigator.clipboard.writeText(t)}catch(_){const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e){}ta.remove()}toast('Email copied');tick()});

/* ---------- clocks ---------- */
const ist=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:false});
const mine=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false});
function clocks(){if(!$('#istClock'))return;const d=new Date(),a=ist.format(d);$('#istClock').textContent=a;if($('#heroClock'))$('#heroClock').textContent=a;$$('.wkTime')?.forEach(e=>e.textContent=a);{const h=+a.slice(0,2);const part=h>=5&&h<12?['Morning','probably on the first coffee']:h>=12&&h<17?['Afternoon','probably pushing pixels']:h>=17&&h<21?['Evening','probably polishing a prototype']:['Night','probably still pushing pixels'];const wl=$('#wkLine');if(wl)wl.textContent=`It’s ${a} in Gurugram. ${part[0]}, ${part[1]}.`}
  const off=-d.getTimezoneOffset()-330;const y=$('#yourTime');if(off===0)y.innerHTML='Same time zone as you';else{const h=Math.floor(Math.abs(off)/60),m=Math.abs(off)%60;y.innerHTML=`Your time <b>${mine.format(d)}</b>, ${h?h+'h':''}${m?' '+m+'m':''} ${off>0?'ahead':'behind'}`}}
clocks();setInterval(clocks,15000);

/* ---------- footer name ---------- */
(function(){const el=$('#bigname');const parts=[['Priyanka',''],['Yadav','it']];parts.forEach(([w,c],k)=>{const g=document.createElement('span');g.style.display='inline-flex';[...w].forEach(ch=>{const s=document.createElement('span');s.textContent=ch;if(c)s.className=c;s.addEventListener('pointerenter',()=>pluck(scale[(k*8+w?.indexOf(ch))%scale.length]/2,.06));g.appendChild(s)});el?.appendChild(g)})})();
if($('#year'))$('#year').textContent=new Date().getFullYear();
})();

/* ---------- spray wall nozzle pills: fade the edges that have more to scroll ---------- */
(function(){const s=document.querySelector('#wall .sizes');if(!s)return;
  function fade(){const m=s.scrollWidth-s.clientWidth;s.style.setProperty('--fl',m>2&&s.scrollLeft>4?1:0);s.style.setProperty('--fr',m>2&&s.scrollLeft<m-4?1:0)}
  s.addEventListener('scroll',fade,{passive:true});addEventListener('resize',fade);addEventListener('load',fade);fade()})();
