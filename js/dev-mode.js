/* Dev mode inspector: click any element to see size, spacing, colours mapped to tokens, type and code */
/* ===== Dev mode (inspect): click any element to see size, spacing, radii, colours (mapped to DLS tokens), typography, strokes, effects, code ===== */
(function(){
const BASE={Street:{'Red':'#e3242b','Yellow':'#f4dc1f','Green':'#3cff52','Blue':'#2f5bff','Orange':'#ff7a1a','Cream':'#f1ece2','Paper':'#e6e0d2','Tape':'#d8cfb6','Ink':'#121110','Wall':'#151413','Sticker dark':'#141312','Slab':'#1a1817','Maroon':'#3a0f1c','Yellow paper':'#e5cf1c','Navbar':'#0f0e0d'},
Gold:{'Background':'#0b0907','Surface':'#14100b','Text':'#f3ead9','Accent':'#dcb66c','Accent light':'#f4dba0','Muted':'#a2968a'},
Basics:{'White':'#ffffff','Black':'#000000'}};
const HEX={};for(const f in BASE)for(const k in BASE[f])(HEX[BASE[f][k]]=HEX[BASE[f][k]]||[]).push(f+'/'+k);
const SEM={'#151413':'Surface/Wall (page background)','#141312':'Surface/Sticker dark','#121110':'Text/Ink on paper','#f1ece2':'Text/Cream · Sticker border','#e6e0d2':'Surface/Paper','#e5cf1c':'Surface/Yellow paper','#d8cfb6':'Surface/Tape label','#e3242b':'Accent/Red · Primary CTA','#f4dc1f':'Accent/Yellow','#3cff52':'Accent/Green','#2f5bff':'Accent/Blue','#ff7a1a':'Accent/Orange','#1a1817':'Surface/Stencil slab','#0f0e0d':'Surface/Strip'};
const SP={4:'xs',6:'xs+',8:'s',10:'s+',12:'m',14:'m+',16:'l',18:'l+',20:'xl',22:'xl+',24:'2xl',28:'2xl+',30:'3xl',32:'3xl+',40:'4xl',64:'nav height'};
const RAD={4:'Wall / slab',6:'Tag',8:'Card',9:'Sticker small',10:'Logo sticker',11:'Sticker',12:'Screen frame',16:'Path card',18:'Sticker board',20:'Chooser card',38:'Phone screen',46:'Phone frame',1000:'Pill'};
const SFS=[];
const NUM=[];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const n=v=>String(Math.round(v*10)/10);
const hex2=v=>('0'+Math.round(v).toString(16)).slice(-2);
function parseCol(s){if(!s)return null;const m=String(s).match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);if(p.length<3)return null;const a=p.length>3?p[3]:1;if(a===0)return null;return {hex:'#'+hex2(p[0])+hex2(p[1])+hex2(p[2]),a}}
function tokOf(hex){const o=[];if(SEM[hex])o.push(SEM[hex]);if(HEX[hex])o.push(HEX[hex].join(' = '));return o}
function colRow(label,str){const c=parseCol(str);if(!c)return '';const t=tokOf(c.hex),pct=c.a<1?' · '+Math.round(c.a*100)+'%':'';
  return `<div class="cl"><span class="lb">${label}</span><span class="sw" data-copy="${c.hex}" title="Click to copy" style="background:${esc(str)}"></span><span class="vl">${c.hex.toUpperCase()}${pct}${t.length?`<small>${esc(t.join(' · '))}</small>`:'<small class="no">No DLS match</small>'}</span></div>`}
const spTok=v=>v===0?'':(SP[v]?`<small>Paddings/${SP[v]}</small>`:`<small class="no">no DLS match</small>`);
const rw=(k,v,sub)=>`<div class="rw"><span>${k}</span><span>${v}${sub||''}</span></div>`;
function ownText(el){return Array.from(el.childNodes).filter(x=>x.nodeType===3).map(x=>x.textContent.trim()).join(' ').trim()}
function splitShadows(s){const out=[];let d=0,cur='';for(const ch of s){if(ch==='(')d++;if(ch===')')d--;if(ch===','&&!d){out.push(cur.trim());cur=''}else cur+=ch}if(cur.trim())out.push(cur.trim());return out}
function parseShadow(s){const cm=s.match(/rgba?\([^)]*\)/);const col=cm?cm[0]:'';const rest=s.replace(col,'').trim();const inset=/inset/.test(rest);const nums=rest.replace('inset','').trim().split(/\s+/).map(parseFloat);return {col,inset,x:nums[0]||0,y:nums[1]||0,blur:nums[2]||0,spread:nums[3]||0}}
function txtStyle(cs){const fam=cs.fontFamily.split(',')[0].replace(/["']/g,'').trim(),size=parseFloat(cs.fontSize),w=parseInt(cs.fontWeight,10);
  let name=null;
  if(/Sedgwick Ave Display/i.test(fam))name=size>=60?'Graffiti / Display':size>=34?'Graffiti / Heading':'Graffiti / Small';
  else if(/Sedgwick Ave/i.test(fam))name='Hand / Label';
  else if(/Big Shoulders/i.test(fam))name=size>=26?'Stencil / Heading':size>=15?'Stencil / Button and nav':'Stencil / Caption';
  else if(/Hanken/i.test(fam))name=size>=16?'Body':'Body small';
  else if(/Bodoni/i.test(fam))name='Gold / Serif';
  return {fam,name}}
const ph=document.getElementById('phone');
const roots=[ph];
const rootOf=el=>el&&el.closest?el.closest('#phone'):null;
const scaleOf=el=>ph.getBoundingClientRect().width/ph.offsetWidth||1;
let DEV=false,sel=null,hov=null,selPath=null,crumbs=[],codeTab='css';
const pathOf=el=>{const r=rootOf(el),p=[];let e=el;while(e&&e!==r){const par=e.parentNode;p.unshift(Array.prototype.indexOf.call(par.children,e));e=par}return {root:r&&r.id,p}};
const fromPath=pp=>{let e=document.getElementById(pp.root);for(const i of pp.p){if(!e||!e.children[i])return null;e=e.children[i]}return e};
function pick(t){if(!t||!t.closest)return null;if(t===ph)return null;
  const svg=t.ownerSVGElement;if(svg&&t!==svg){const r=svg.getBoundingClientRect();if(r.width/scaleOf(svg)<=48)return svg}return t}
const ov=document.createElement('div');ov.id='devov';document.body.appendChild(ov);
const pn=document.createElement('aside');pn.id='devp';document.body.appendChild(pn);
const rs=r=>`left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;
function dist(S,H,s){const L=[];const ln=(x,y,w,h,v)=>{if(v<.5)return;L.push(`<div class="ln" style="left:${x}px;top:${y}px;width:${Math.max(w,1)}px;height:${Math.max(h,1)}px"></div><div class="dl" style="left:${x+w/2}px;top:${y+h/2}px">${n(v/s)}</div>`)};
  const inside=(a,b)=>a.left>=b.left-.5&&a.right<=b.right+.5&&a.top>=b.top-.5&&a.bottom<=b.bottom+.5;
  if(inside(H,S)||inside(S,H)){const i=inside(H,S)?H:S,o=i===H?S:H,cx=(i.left+i.right)/2,cy=(i.top+i.bottom)/2;
    ln(cx,o.top,0,i.top-o.top,i.top-o.top);ln(cx,i.bottom,0,o.bottom-i.bottom,o.bottom-i.bottom);ln(o.left,cy,i.left-o.left,0,i.left-o.left);ln(i.right,cy,o.right-i.right,0,o.right-i.right)}
  else{const ox=Math.max(S.left,H.left),ox2=Math.min(S.right,H.right),oy=Math.max(S.top,H.top),oy2=Math.min(S.bottom,H.bottom);
    if(S.right<=H.left)ln(S.right,oy2>oy?(oy+oy2)/2:(S.top+S.bottom)/2,H.left-S.right,0,H.left-S.right);
    if(H.right<=S.left)ln(H.right,oy2>oy?(oy+oy2)/2:(S.top+S.bottom)/2,S.left-H.right,0,S.left-H.right);
    if(S.bottom<=H.top)ln(ox2>ox?(ox+ox2)/2:(S.left+S.right)/2,S.bottom,0,H.top-S.bottom,H.top-S.bottom);
    if(H.bottom<=S.top)ln(ox2>ox?(ox+ox2)/2:(S.left+S.right)/2,H.bottom,0,S.top-H.bottom,S.top-H.bottom)}
  return L.join('')}
function nameOf(el){const tag=el.tagName.toLowerCase(),cn=typeof el.className==='string'?el.className:(el.className&&el.className.baseVal)||'';const c=cn.trim().split(/\s+/).filter(Boolean);
  let t='';if(!el.children.length&&el.textContent.trim())t=' "'+el.textContent.trim().slice(0,20)+'"';
  return (el.id?'#'+el.id:c.length?'.'+c.slice(0,2).join('.'):tag)+t}
function selOf(el){const tag=el.tagName.toLowerCase(),cn=typeof el.className==='string'?el.className:(el.className&&el.className.baseVal)||'';return tag+(el.id?'#'+el.id:'')+cn.trim().split(/\s+/).filter(Boolean).map(c=>'.'+c).join('')}
function draw(){
  if(!DEV){ov.innerHTML='';return}
  let h='';
  if(hov&&hov.isConnected&&hov!==sel){const r=hov.getBoundingClientRect();h+=`<div class="b hv" style="${rs(r)}"></div><div class="nm" style="left:${r.left}px;top:${r.top}px">${esc(nameOf(hov))}</div>`}
  if(sel&&sel.isConnected){const r=sel.getBoundingClientRect(),s=scaleOf(sel),cs=getComputedStyle(sel);
    const P=['Top','Right','Bottom','Left'].map(k=>(parseFloat(cs['padding'+k])||0)*s),M=['Top','Right','Bottom','Left'].map(k=>(parseFloat(cs['margin'+k])||0)*s);
    h+=`<div class="b pd" style="left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${P[0]}px"></div><div class="b pd" style="left:${r.left}px;top:${r.bottom-P[2]}px;width:${r.width}px;height:${P[2]}px"></div><div class="b pd" style="left:${r.left}px;top:${r.top+P[0]}px;width:${P[3]}px;height:${Math.max(0,r.height-P[0]-P[2])}px"></div><div class="b pd" style="left:${r.right-P[1]}px;top:${r.top+P[0]}px;width:${P[1]}px;height:${Math.max(0,r.height-P[0]-P[2])}px"></div>`;
    h+=`<div class="b mg" style="left:${r.left}px;top:${r.top-M[0]}px;width:${r.width}px;height:${M[0]}px"></div><div class="b mg" style="left:${r.left}px;top:${r.bottom}px;width:${r.width}px;height:${M[2]}px"></div><div class="b mg" style="left:${r.left-M[3]}px;top:${r.top}px;width:${M[3]}px;height:${r.height}px"></div><div class="b mg" style="left:${r.right}px;top:${r.top}px;width:${M[1]}px;height:${r.height}px"></div>`;
    h+=`<div class="b sl" style="${rs(r)}"></div><div class="ch" style="left:${r.left+r.width/2}px;top:${r.bottom+4}px">${n(r.width/s)} × ${n(r.height/s)}</div>`;
    if(hov&&hov.isConnected&&hov!==sel)h+=dist(r,hov.getBoundingClientRect(),s)}
  ov.innerHTML=h}
function panel(){
  if(!sel||!sel.isConnected){pn.innerHTML=`<div class="empty"><b>Dev mode</b>Click any element in the prototype to inspect it.<br><br>Hover another element while one is selected to see the distance between them.<br><br><kbd>Esc</kbd> deselect · <kbd>↑</kbd> parent · <kbd>↓</kbd> child · <kbd>←</kbd><kbd>→</kbd> siblings<br><br>Click a colour swatch or “Copy code” to copy. Code is available as CSS, SwiftUI and Android XML.<br><br>Use the control panel (top left) to jump to any documented state while inspecting.</div>`;return}
  const el=sel,cs=getComputedStyle(el),s=scaleOf(el),r=el.getBoundingClientRect(),rr=rootOf(el).getBoundingClientRect(),isSvg=el instanceof SVGElement;
  crumbs=[];let e=el.parentElement;while(e&&e!==rootOf(el)){crumbs.unshift(e);e=e.parentElement}
  const cr=crumbs.slice(-5).map((c,i,a)=>`<button data-c="${crumbs.length-a.length+i}">${esc(nameOf(c))}</button>`).join('');
  let h=`<div class="hd"><div class="tt">${esc(nameOf(el))}</div><div class="sub">${esc(selOf(el))}</div>${cr?`<div class="cr">${cr}</div>`:''}</div><div class="bd">`;
  const fx=/flex|grid/.test(cs.display),pad=['Top','Right','Bottom','Left'].map(k=>parseFloat(cs['padding'+k])||0),mar=['Top','Right','Bottom','Left'].map(k=>parseFloat(cs['margin'+k])||0);
  h+=`<div class="sc"><h6>Layout</h6>${rw('Size',`${n(r.width/s)} × ${n(r.height/s)}`)}${rw('Position',`${n((r.left-rr.left)/s)}, ${n((r.top-rr.top)/s)}`,'<small>x, y from the screen frame</small>')}`;
  if(!isSvg){h+=rw('Display',esc(cs.display)+(cs.position!=='static'?' · '+esc(cs.position):''));
    if(fx){const g=parseFloat(cs.rowGap)||0,cg=parseFloat(cs.columnGap)||0;
      h+=rw('Direction',cs.display.indexOf('grid')>=0?'Grid':(/column/.test(cs.flexDirection)?'Vertical':'Horizontal'));
      if(g||cg)h+=rw('Gap',(g===cg?n(g):n(g)+' / '+n(cg))+' px',spTok(g||cg));
      h+=rw('Align',esc(cs.alignItems)+' · '+esc(cs.justifyContent))+(cs.flexWrap!=='nowrap'?rw('Wrap',esc(cs.flexWrap)):'')}
    h+=`<div class="bm"><div class="m"><i class="t">${n(mar[0])}</i><i class="r">${n(mar[1])}</i><i class="b">${n(mar[2])}</i><i class="l">${n(mar[3])}</i><div class="p"><i class="t">${n(pad[0])}</i><i class="r">${n(pad[1])}</i><i class="b">${n(pad[2])}</i><i class="l">${n(pad[3])}</i><div class="c">${n(r.width/s-pad[1]-pad[3])} × ${n(r.height/s-pad[0]-pad[2])}</div></div></div></div>`;
    if(pad.some(v=>v))h+=rw('Padding',pad.map(n).join(' · '),'<small>'+pad.map(v=>v===0?'0':SP[v]?SP[v]:'✕').join(' · ')+(pad.some(v=>v&&!SP[v])?' (✕ = no DLS match)':'')+'</small>');
    if(mar.some(v=>v))h+=rw('Margin',mar.map(n).join(' · '))}
  h+='</div>';
  let ap='';
  if(!isSvg){const R=['TopLeft','TopRight','BottomRight','BottomLeft'].map(k=>parseFloat(cs['border'+k+'Radius'])||0);
    if(R.some(v=>v)){const u=R.every(v=>v===R[0]);const t=v=>{const q=v>=500?1000:v;return RAD[q]?`<small>${RAD[q]}</small>`:`<small class="no">no DLS match</small>`};ap+=rw('Corner radius',u?(R[0]>=500?'Full (pill)':n(R[0])):R.map(n).join(' · '),u?t(R[0]):'')}}
  if(+cs.opacity!==1)ap+=rw('Opacity',Math.round(cs.opacity*100)+'%');
  if(cs.overflow==='hidden')ap+=rw('Clip content','on');
  if(ap)h+=`<div class="sc"><h6>Appearance</h6>${ap}</div>`;
  let fl='';
  if(isSvg){const f=cs.fill;if(f&&f!=='none'&&!/url\(/.test(f))fl+=colRow('Fill',f);else if(/url\(/.test(f))fl+=rw('Fill','Gradient / pattern','<small class="no">Gradients are not linked to the DLS</small>')}
  else{fl+=colRow('Fill',cs.backgroundColor);if(cs.backgroundImage&&cs.backgroundImage!=='none'){const gs=(cs.backgroundImage.match(/rgba?\([^)]*\)/g)||[]);fl+=rw(/gradient/.test(cs.backgroundImage)?'Gradient':'Image',gs.length?gs.length+' colour stops':'url(…)','<small class="no">Gradients are not linked to the DLS</small>')+gs.map(g=>colRow('',g)).join('')}}
  if(fl)h+=`<div class="sc"><h6>Fill</h6>${fl}</div>`;
  let st='';
  if(isSvg){const sc=cs.stroke;if(sc&&sc!=='none'&&!/url\(/.test(sc)){st+=colRow('Stroke',sc)+rw('Weight',n(parseFloat(cs.strokeWidth))+' px')+(cs.strokeDasharray&&cs.strokeDasharray!=='none'?rw('Dash',esc(cs.strokeDasharray)):'');if(cs.strokeOpacity!=='1')st+=rw('Stroke opacity',Math.round(cs.strokeOpacity*100)+'%')}}
  else{const sides=['Top','Right','Bottom','Left'].map(k=>({w:parseFloat(cs['border'+k+'Width'])||0,c:cs['border'+k+'Color'],s:cs['border'+k+'Style']}));
    if(sides.some(x=>x.w&&x.s!=='none')){if(sides.every(x=>x.w===sides[0].w&&x.c===sides[0].c&&x.s===sides[0].s))st+=colRow('Border',sides[0].c)+rw('Weight',n(sides[0].w)+' px · '+sides[0].s);else sides.forEach((x,i)=>{if(x.w&&x.s!=='none')st+=colRow(['Top','Right','Bottom','Left'][i],x.c)+rw('Weight',n(x.w)+' px · '+x.s)})}
    if(cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth))st+=colRow('Outline',cs.outlineColor)+rw('Weight',n(parseFloat(cs.outlineWidth))+' px');
    if(cs.boxShadow&&cs.boxShadow!=='none')splitShadows(cs.boxShadow).map(parseShadow).forEach(sh=>{if(!sh.blur&&!sh.x&&!sh.y&&sh.spread>0)st+=colRow(sh.inset?'Inner stroke':'Outer stroke',sh.col)+rw('Weight',n(sh.spread)+' px','<small>drawn as '+(sh.inset?'inset ':'')+'box-shadow</small>')})}
  if(st)h+=`<div class="sc"><h6>Stroke</h6>${st}</div>`;
  const tx=!isSvg?ownText(el):'';
  if(tx){const ts=txtStyle(cs),ls=parseFloat(cs.letterSpacing)||0;
    h+=`<div class="sc"><h6>Typography</h6>${rw('Text',esc(tx.length>60?tx.slice(0,60)+'…':tx))}${rw('Style',ts.name?esc(ts.name):'No DLS style',ts.name?'<small>Portfolio text style</small>':`<small class="no">no DLS match</small>`)}${rw('Font',esc(ts.fam))}${rw('Weight',esc(cs.fontWeight))}${rw('Size / line',n(parseFloat(cs.fontSize))+' / '+(isNaN(parseFloat(cs.lineHeight))?'auto':n(parseFloat(cs.lineHeight)))+' px')}${rw('Letter spacing',ls?n(ls)+' px':'0')}${cs.textTransform!=='none'?rw('Case',esc(cs.textTransform)):''}${rw('Align',esc(cs.textAlign))}${colRow('Colour',cs.color)}</div>`}
  let fx2='';
  if(!isSvg&&cs.boxShadow&&cs.boxShadow!=='none')splitShadows(cs.boxShadow).map(parseShadow).forEach(sh=>{if(sh.blur||sh.x||sh.y||!sh.spread)fx2+=rw(sh.inset?'Inner shadow':'Drop shadow',`${n(sh.x)}, ${n(sh.y)}, blur ${n(sh.blur)}${sh.spread?', spread '+n(sh.spread):''}`)+colRow('',sh.col)});
  if(cs.filter&&cs.filter!=='none')fx2+=rw('Filter',esc(cs.filter));
  if(cs.backdropFilter&&cs.backdropFilter!=='none')fx2+=rw('Backdrop blur',esc(cs.backdropFilter));
  if(cs.transform&&cs.transform!=='none'&&el!==ph)fx2+=rw('Transform',esc(cs.transform));
  if(fx2)h+=`<div class="sc"><h6>Effects</h6>${fx2}</div>`;
  const css=[];const add=(k,v)=>css.push(`  ${k}: ${v};`);
  const hx=str=>{const c=parseCol(str);return c?c.hex+(c.a<1?' /* '+Math.round(c.a*100)+'% */':''):''};
  add('width',n(r.width/s)+'px');add('height',n(r.height/s)+'px');
  if(!isSvg){if(fx){add('display',cs.display);add('flex-direction',cs.flexDirection);const g=parseFloat(cs.rowGap);if(g)add('gap',n(g)+'px');add('align-items',cs.alignItems);add('justify-content',cs.justifyContent)}
    if(pad.some(v=>v))add('padding',pad.map(v=>n(v)+'px').join(' '));if(mar.some(v=>v))add('margin',mar.map(v=>n(v)+'px').join(' '));
    const bg=hx(cs.backgroundColor);if(bg)add('background',bg);if(cs.backgroundImage!=='none')add('background-image',cs.backgroundImage);
    if(parseFloat(cs.borderTopLeftRadius))add('border-radius',[cs.borderTopLeftRadius,cs.borderTopRightRadius,cs.borderBottomRightRadius,cs.borderBottomLeftRadius].join(' '));
    if(parseFloat(cs.borderTopWidth)&&cs.borderTopStyle!=='none')add('border',n(parseFloat(cs.borderTopWidth))+'px '+cs.borderTopStyle+' '+hx(cs.borderTopColor));
    if(cs.boxShadow!=='none')add('box-shadow',cs.boxShadow);
    if(+cs.opacity!==1)add('opacity',cs.opacity);
    if(tx){add('color',hx(cs.color));add('font-family',cs.fontFamily.split(',')[0]);add('font-size',n(parseFloat(cs.fontSize))+'px');add('font-weight',cs.fontWeight);add('line-height',cs.lineHeight);if(parseFloat(cs.letterSpacing))add('letter-spacing',cs.letterSpacing);if(cs.textTransform!=='none')add('text-transform',cs.textTransform)}}
  else{const f=hx(cs.fill);if(f)add('fill',f);const sc=hx(cs.stroke);if(sc){add('stroke',sc);add('stroke-width',n(parseFloat(cs.strokeWidth))+'px')}}
  const code=css.join('\n'),nat=genNative(el,cs,r,s,pad,mar,tx,isSvg,fx);
  h+=`<div class="sc"><h6>Code</h6><div class="tabs"><button data-tab="css">CSS</button><button data-tab="ios">iOS · SwiftUI</button><button data-tab="and">Android · XML</button></div><button class="cp" data-copy-code="1">Copy code</button><pre class="codebox"></pre></div></div>`;
  pn.innerHTML=h;pn._code={css:code,ios:nat.ios,and:nat.and};renderCode()}

/* ---- native code generation: SwiftUI (iOS) and Android XML, values straight from the prototype (pt/dp/sp = css px) ---- */
const IND='    ';
const swCol=str=>{const c=parseCol(str);if(!c)return null;const t=tokOf(c.hex)[0];return {s:`Color(hex: 0x${c.hex.slice(1).toUpperCase()})`+(c.a<1?`.opacity(${+c.a.toFixed(2)})`:''),t:t?'  // '+t:''}};
const ktCol=str=>{const c=parseCol(str);if(!c)return null;const t=tokOf(c.hex)[0];return {s:'#'+hex2(c.a*255).toUpperCase()+c.hex.slice(1).toUpperCase(),t:t?'  <!-- '+t+' -->':''}};
function gradOf(cs){const bi=cs.backgroundImage;if(!bi||bi==='none'||!/gradient/.test(bi))return null;const cols=(bi.match(/rgba?\([^)]*\)/g)||[]);let dir='b';const m=bi.match(/linear-gradient\(\s*([^,]+),/);if(m&&!/rgba?/.test(m[1])){const d=m[1].trim();if(/to right|^90deg/.test(d))dir='r';else if(/to left|^270deg/.test(d))dir='l';else if(/to top|^0deg/.test(d))dir='t'}return {cols,radial:/radial/.test(bi),dir}}
function padLines(pad,os){const [t,r,b,l]=pad;if(!(t||r||b||l))return [];
  if(os==='ios'){if(t===r&&r===b&&b===l)return [`.padding(${n(t)})`];const o=[];if(t===b&&l===r){if(t)o.push(`.padding(.vertical, ${n(t)})`);if(l)o.push(`.padding(.horizontal, ${n(l)})`);return o}if(t)o.push(`.padding(.top, ${n(t)})`);if(l)o.push(`.padding(.leading, ${n(l)})`);if(b)o.push(`.padding(.bottom, ${n(b)})`);if(r)o.push(`.padding(.trailing, ${n(r)})`);return o}
  if(t===r&&r===b&&b===l)return [`.padding(${n(t)}.dp)`];const p=[];if(t===b&&l===r){if(l)p.push(`horizontal = ${n(l)}.dp`);if(t)p.push(`vertical = ${n(t)}.dp`)}else{if(l)p.push(`start = ${n(l)}.dp`);if(t)p.push(`top = ${n(t)}.dp`);if(r)p.push(`end = ${n(r)}.dp`);if(b)p.push(`bottom = ${n(b)}.dp`)}return [`.padding(${p.join(', ')})`]}
function genNative(el,cs,r,s,pad,mar,tx,isSvg,fx){
  const W=n(r.width/s),H=n(r.height/s),kids=el.children.length,tag=el.tagName.toLowerCase();
  const hdI='// SwiftUI · pt = prototype px · Color(hex:) is a small helper extension\n',hdA='<!-- Android XML · dp / sp = prototype px · fonts: Sedgwick Ave Display, Big Shoulders Stencil, Hanken Grotesk -->\n';
  if(isSvg&&tag!=='svg'){
    const f=swCol(cs.fill),sk=swCol(cs.stroke),fk=ktCol(cs.fill),sKk=ktCol(cs.stroke),sw=n(parseFloat(cs.strokeWidth)||0);
    return {ios:hdI+`// SVG <${tag}> – draw with a Shape / Path\n`+(f?`// fill    ${f.s}${f.t}\n`:'')+(sk?`// stroke  ${sk.s}${sk.t}\n// weight  ${sw}\n`:''),
            and:hdA+`<!-- SVG <${tag}> – part of a VectorDrawable <path> -->\n`+(fk?`<!-- android:fillColor="${fk.s}"${fk.t} -->\n`:'')+(sKk?`<!-- android:strokeColor="${sKk.s}"${sKk.t} -->\n<!-- android:strokeWidth="${sw}" -->\n`:'')};
  }
  if(isSvg){return {ios:hdI+`Image("icon_name")  // exported SVG asset\n${IND}.resizable()\n${IND}.frame(width: ${W}, height: ${H})`,
                    and:hdA+`<!-- icon_name = exported SVG asset (VectorDrawable) -->\n<ImageView\n${IND}android:layout_width="${W}dp"\n${IND}android:layout_height="${H}dp"\n${IND}android:src="@drawable/icon_name"\n${IND}android:contentDescription="@null" />`}}
  const R=['TopLeft','TopRight','BottomRight','BottomLeft'].map(k=>parseFloat(cs['border'+k+'Radius'])||0);
  const hasR=R.some(v=>v),uni=R.every(v=>v===R[0]),pill=hasR&&uni&&R[0]>=Math.min(r.width,r.height)/s/2-.5,circ=pill&&Math.abs(r.width-r.height)<1;
  const bg=parseCol(cs.backgroundColor),g=gradOf(cs);
  let stroke=null;{const sd=['Top','Right','Bottom','Left'].map(k=>({w:parseFloat(cs['border'+k+'Width'])||0,c:cs['border'+k+'Color'],st:cs['border'+k+'Style']}));
    if(sd[0].w&&sd[0].st!=='none')stroke={w:sd[0].w,c:sd[0].c};else if(cs.boxShadow&&cs.boxShadow!=='none'){const o=splitShadows(cs.boxShadow).map(parseShadow).find(x=>!x.blur&&!x.x&&!x.y&&x.spread>0);if(o)stroke={w:o.spread,c:o.col}}}
  const shadow=cs.boxShadow&&cs.boxShadow!=='none'?splitShadows(cs.boxShadow).map(parseShadow).find(x=>!x.inset&&(x.blur||x.x||x.y)):null;
  const op=+cs.opacity,isText=!!tx&&!kids,al=cs.alignItems,jc=cs.justifyContent,gap=parseFloat(cs.rowGap)||0,col=!fx||/column/.test(cs.flexDirection);
  const shI=pill?(circ?'Circle()':'Capsule()'):uni?`RoundedRectangle(cornerRadius: ${n(R[0])})`:`UnevenRoundedRectangle(topLeadingRadius: ${n(R[0])}, bottomLeadingRadius: ${n(R[3])}, bottomTrailingRadius: ${n(R[2])}, topTrailingRadius: ${n(R[1])})`;
  const shA=pill?(circ?'CircleShape':'RoundedCornerShape(50)'):uni?`RoundedCornerShape(${n(R[0])}.dp)`:`RoundedCornerShape(topStart = ${n(R[0])}.dp, topEnd = ${n(R[1])}.dp, bottomEnd = ${n(R[2])}.dp, bottomStart = ${n(R[3])}.dp)`;
  const ts=isText?txtStyle(cs):null,size=parseFloat(cs.fontSize),w=parseInt(cs.fontWeight,10),lh=parseFloat(cs.lineHeight),ls=parseFloat(cs.letterSpacing)||0;
  const sat=ts&&/Satoshi|DM Sans/i.test(ts.fam),ta=cs.textAlign;
  /* ---------- iOS ---------- */
  let head,mods=[];
  if(isText){head=`Text(${JSON.stringify(tx.slice(0,80))})`+(ts.name?`  // DLS: ${ts.name}`:'');
    mods.push(sat?`.font(.custom("Satoshi-${w>=700?'Bold':w>=500?'Medium':'Regular'}", size: ${n(size)}))`:`.font(.system(size: ${n(size)}, weight: ${w>=700?'.bold':w>=600?'.semibold':w>=500?'.medium':w<=300?'.light':'.regular'}))`);
    if(!isNaN(lh))mods.push(`.lineSpacing(${n(Math.max(0,lh-size*1.19))})  // line height ${n(lh)}`);
    if(ls)mods.push(`.tracking(${n(ls)})`);
    if(cs.textTransform==='uppercase')mods.push('.textCase(.uppercase)');
    if(ta==='center')mods.push('.multilineTextAlignment(.center)');else if(ta==='right'||ta==='end')mods.push('.multilineTextAlignment(.trailing)');
    const c=swCol(cs.color);if(c)mods.push(`.foregroundColor(${c.s})${c.t}`)}
  else if(kids){const a=col?(/center/.test(al)?'.center':/end/.test(al)?'.trailing':'.leading'):(/center/.test(al)?'.center':/end/.test(al)?'.bottom':/baseline/.test(al)?'.firstTextBaseline':'.top');
    head=`${col?'VStack':'HStack'}(alignment: ${a}, spacing: ${n(gap)}) {\n${IND}// ${kids} child${kids>1?'ren':''}${/between/.test(jc)?' · justify: space-between → add Spacer() between them':/center/.test(jc)?' · justify: center → wrap in Spacer() on both sides':''}\n}`}
  else head='Color.clear';
  mods.push(...padLines(pad,'ios'));
  if(!isText)mods.push(`.frame(width: ${W}, height: ${H})`);
  if(g){const cl=g.cols.map(c=>swCol(c).s).join(', ');mods.push(g.radial?`.background(RadialGradient(colors: [${cl}], center: .center, startRadius: 0, endRadius: ${n(Math.max(W,H)/2)}))  // gradient – not linked to the DLS`:`.background(LinearGradient(colors: [${cl}], startPoint: ${{b:'.top',t:'.bottom',r:'.leading',l:'.trailing'}[g.dir]}, endPoint: ${{b:'.bottom',t:'.top',r:'.trailing',l:'.leading'}[g.dir]}))  // gradient – not linked to the DLS`)}
  else if(bg){const c=swCol(cs.backgroundColor);mods.push(`.background(${c.s})${c.t}`)}
  if(hasR)mods.push(`.clipShape(${shI})`);else if(cs.overflow==='hidden')mods.push('.clipped()');
  if(stroke){const c=swCol(stroke.c);if(c)mods.push(`.overlay(${hasR?shI:'Rectangle()'}.strokeBorder(${c.s}, lineWidth: ${n(stroke.w)}))${c.t}`)}
  if(op!==1)mods.push(`.opacity(${+op.toFixed(2)})`);
  if(shadow){const c=swCol(shadow.col);if(c)mods.push(`.shadow(color: ${c.s}, radius: ${n(shadow.blur/2)}, x: ${n(shadow.x)}, y: ${n(shadow.y)})`)}
  if(mar.some(v=>v))mods.push(`// margin ${mar.map(n).join(' / ')} → set as spacing / padding on the parent`);
  const ios=hdI+head+(mods.length?'\n'+mods.map(m=>IND+m).join('\n'):'');
  /* ---------- Android XML ---------- */
  const A=[],pr=[];const NOTES=[];const att=(k,v,cm)=>{A.push(`android:${k}="${v}"`);if(cm)NOTES.push(k+': '+cm)};
  const dpx=v=>n(v)+'dp';
  const tcol=ktCol(cs.color);
  const drawName='bg_'+(((typeof el.className==='string'?el.className:'').trim().split(/\s+/)[0])||tag).replace(/[^a-zA-Z0-9]/g,'_').toLowerCase();
  let drawable='';
  const needShape=!isText&&(hasR||stroke||g);
  if(needShape){
    const bgc=bg?ktCol(cs.backgroundColor):null;
    drawable=`<!-- res/drawable/${drawName}.xml -->\n<shape xmlns:android="http://schemas.android.com/apk/res/android"\n${IND}android:shape="${circ?'oval':'rectangle'}">\n`
      +(g?`${IND}<gradient android:type="${g.radial?'radial':'linear'}" android:angle="${{b:270,t:90,r:0,l:180}[g.dir]}" ${g.cols.map((c,i)=>`android:${['startColor','centerColor','endColor'][g.cols.length===2?(i?2:0):i]}="${ktCol(c).s}"`).join(' ')}${g.radial?` android:gradientRadius="${n(Math.max(W,H)/2)}dp"`:''} />  <!-- gradient – not linked to the DLS -->\n`:(bgc?`${IND}<solid android:color="${bgc.s}" />${bgc.t}\n`:''))
      +(hasR&&!circ?(uni?`${IND}<corners android:radius="${pill?'1000dp':dpx(R[0])}" />\n`:`${IND}<corners android:topLeftRadius="${dpx(R[0])}" android:topRightRadius="${dpx(R[1])}" android:bottomRightRadius="${dpx(R[2])}" android:bottomLeftRadius="${dpx(R[3])}" />\n`):'')
      +(stroke?(()=>{const c=ktCol(stroke.c);return c?`${IND}<stroke android:width="${dpx(stroke.w)}" android:color="${c.s}" />${c.t}\n`:''})():'')
      +`</shape>`;
  }
  const lay=isText?'TextView':(kids?'LinearLayout':'View');
  att('layout_width',isText?'wrap_content':dpx(r.width/s));att('layout_height',isText?'wrap_content':dpx(r.height/s));
  if(!isText&&kids){att('orientation',col?'vertical':'horizontal');
    const gv=/center/.test(jc)&&/center/.test(al)?'center':col?((/center/.test(al)?'center_horizontal':/end/.test(al)?'right':'left')+(/center/.test(jc)?'|center_vertical':/end/.test(jc)?'|bottom':'')):((/center/.test(jc)?'center_horizontal':/end/.test(jc)?'right':'left')+(/center/.test(al)?'|center_vertical':/end/.test(al)?'|bottom':''));
    if(gv!=='left')att('gravity',gv,/between/.test(jc)?'justify: space-between → give a child layout_weight / Space between children':'');
    if(gap)att('divider','@drawable/space_'+n(gap),'gap '+n(gap)+'dp → LinearLayout divider (showDividers="middle") or margins on children')}
  if(needShape)att('background','@drawable/'+drawName);else if(bg){const c=ktCol(cs.backgroundColor);att('background',c.s,(c.t||'').replace(/^\s*<!--\s*|\s*-->$/g,''))}
  if(pad.some(v=>v)){if(pad.every(v=>v===pad[0]))att('padding',dpx(pad[0]));else{if(pad[3])att('paddingStart',dpx(pad[3]));if(pad[0])att('paddingTop',dpx(pad[0]));if(pad[1])att('paddingEnd',dpx(pad[1]));if(pad[2])att('paddingBottom',dpx(pad[2]))}}
  if(mar.some(v=>v)){if(mar.every(v=>v===mar[0]))att('layout_margin',dpx(mar[0]));else{if(mar[3])att('layout_marginStart',dpx(mar[3]));if(mar[0])att('layout_marginTop',dpx(mar[0]));if(mar[1])att('layout_marginEnd',dpx(mar[1]));if(mar[2])att('layout_marginBottom',dpx(mar[2]))}}
  if(op!==1)att('alpha',String(+op.toFixed(2)));
  if(shadow)att('elevation',dpx(shadow.blur/2),'approximates the css box-shadow');
  if(!needShape&&(hasR||cs.overflow==='hidden'))att('clipToOutline','true','clip content');
  if(isText){att('text',JSON.stringify(tx.slice(0,80)).slice(1,-1));
    if(tcol)att('textColor',tcol.s,(tcol.t||'').replace(/^\s*<!--\s*|\s*-->$/g,''));
    att('textSize',n(size)+'sp');if(!isNaN(lh))att('lineHeight',n(lh)+'sp');
    att('fontFamily',sat?'@font/satoshi':'@font/inter',ts.name?'DLS: '+ts.name:'');
    att('textStyle',w>=700?'bold':'normal');if(w>=500&&w<700)att('fontWeight',String(w),'API 28+');
    if(ls)att('letterSpacing',n(ls/size));
    if(cs.textTransform==='uppercase')att('textAllCaps','true');
    if(ta==='center')att('textAlignment','center');else if(ta==='right'||ta==='end')att('textAlignment','viewEnd')}
  let and=(NOTES.length?NOTES.map(x=>`<!-- ${x} -->`).join('\n')+'\n':'')+`<${lay} xmlns:android="http://schemas.android.com/apk/res/android"\n`+A.map(x=>IND+x).join('\n')+(kids&&!isText?`>\n${IND}<!-- ${kids} child${kids>1?'ren':''} -->\n</${lay}>`:' />');
  if(drawable)and+='\n\n'+drawable;
  return {ios,and:hdA+and}}
function renderCode(){const box=pn.querySelector('.codebox');if(!box||!pn._code)return;box.textContent=pn._code[codeTab]||'';pn.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab===codeTab))}
function setSel(el){sel=el;selPath=el?pathOf(el):null;panel();draw()}
function flash(t){const d=document.createElement('div');d.className='dt';d.textContent=t;pn.appendChild(d);setTimeout(()=>d.remove(),900)}
async function copy(t){let ok=false;try{await navigator.clipboard.writeText(t);ok=true}catch(e){try{const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();ok=document.execCommand('copy');a.remove()}catch(e2){}}flash(ok?'Copied':'Copy failed')}
pn.addEventListener('click',e=>{const c=e.target.closest('[data-c]');if(c){setSel(crumbs[+c.dataset.c]);return}const k=e.target.closest('[data-copy]');if(k){copy(k.dataset.copy);return}const tb=e.target.closest('[data-tab]');if(tb){codeTab=tb.dataset.tab;renderCode();return}if(e.target.closest('[data-copy-code]'))copy((pn._code||{})[codeTab]||'')});
const stop=e=>{if(!DEV)return;e.stopPropagation();if(e.cancelable)e.preventDefault()};
roots.forEach(R=>{
  ['pointerdown','pointerup','mousedown','mouseup','touchstart','touchend','dblclick','contextmenu','pointercancel'].forEach(t=>R.addEventListener(t,stop,true));
  R.addEventListener('click',e=>{if(!DEV)return;e.stopPropagation();e.preventDefault();const t=pick(e.target);if(t)setSel(t)},true);
  R.addEventListener('pointermove',e=>{if(!DEV)return;e.stopPropagation();const t=pick(e.target);if(t!==hov){hov=t;draw()}},true);
  R.addEventListener('pointerleave',()=>{if(!DEV)return;hov=null;draw()});
  R.addEventListener('scroll',()=>{if(DEV)draw()},true)});
addEventListener('scroll',()=>{if(DEV)draw()},true);addEventListener('resize',()=>{if(DEV)draw()});
document.addEventListener('keydown',e=>{if(!DEV||!sel||(e.target.closest&&e.target.closest('input,textarea')))return;let t=null;
  if(e.key==='Escape'){setSel(null);e.preventDefault();return}
  if(e.key==='ArrowUp'){const p=sel.parentElement;if(p&&p!==rootOf(sel))t=p}else if(e.key==='ArrowDown')t=sel.firstElementChild;else if(e.key==='ArrowLeft')t=sel.previousElementSibling;else if(e.key==='ArrowRight')t=sel.nextElementSibling;
  if(t){e.preventDefault();setSel(t)}});
/* keep the selection after the prototype re-renders */
window.__devAfter=()=>{if(!DEV)return;hov=null;sel=selPath?fromPath(selPath):null;panel();draw()};
const refit=()=>{if(typeof window.__fit==='function')window.__fit()};
const ctl=document.getElementById('controls'),tog=document.createElement('button');
tog.id='ctlToggle';tog.type='button';tog.innerHTML='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#adb5bd" stroke-width="1.5" stroke-linecap="round"><path d="M2 4h12M2 8h12M2 12h12"/><circle cx="5.5" cy="4" r="1.7" fill="#14171a"/><circle cx="10.5" cy="8" r="1.7" fill="#14171a"/><circle cx="6.5" cy="12" r="1.7" fill="#14171a"/></svg>';
const tb2=document.createElement('div');tb2.id='topbar';document.body.appendChild(tb2);tb2.appendChild(tog);
const setTog=()=>{tog.classList.toggle('open',!ctl.classList.contains('min'));tog.title=ctl.classList.contains('min')?'Open controls':'Close controls';tog.setAttribute('aria-label',tog.title)};
tog.onclick=()=>{ctl.classList.toggle('min');setTog();refit();draw()};setTog();
const cb=document.getElementById('dev');
const ms=document.createElement('div');ms.id='modesw';
ms.innerHTML='<button type="button" data-m="view" class="on"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 8s2.3-4.5 6.5-4.5S14.5 8 14.5 8s-2.3 4.5-6.5 4.5S1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg><span>View mode</span></button><button type="button" data-m="dev"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5M9 3.5l-2 9"/></svg><span>Dev mode</span></button>';
tb2.appendChild(ms);
const syncMs=()=>ms.querySelectorAll('button').forEach(b=>{const on=(b.dataset.m==='dev')===DEV;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
ms.onclick=e=>{const b=e.target.closest('button');if(!b)return;const want=b.dataset.m==='dev';if(want===cb.checked)return;cb.checked=want;cb.onchange()};
cb.onchange=()=>{DEV=cb.checked;document.body.classList.toggle('dev',DEV);if(!DEV){sel=null;hov=null;selPath=null;ctl.classList.remove('min');setTog()}else{ctl.classList.add('min');setTog()}syncMs();panel();draw();refit()};
panel();
})();

