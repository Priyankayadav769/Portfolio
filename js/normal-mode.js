/* Normal mode behaviour: letter reveals, headline lens and scatter, word-by-word statement,
   pinned "how I work" lines, timeline rail, reveals. Runs next to js/main.js and only
   touches the Normal-only (n-) blocks, so Street mode is unaffected. */
(function(){
"use strict";
const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
const isNormal=()=>root.dataset.edition!=='street';
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const rnd=(a,b)=>a+Math.random()*(b-a);
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

/* split text into words > letters: .w (no mid-word wraps) > .c (scroll scatter) > .ci (reveal) */
function splitChars(el){
  let i=0;
  const walk=node=>{[...node.childNodes].forEach(n=>{
    if(n.nodeType===3){
      const frag=document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part=>{
        if(!part)return;
        if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(' '));return}
        const w=document.createElement('span');w.className='w';
        [...part].forEach(ch=>{
          const c=document.createElement('span');c.className='c';
          c.style.setProperty('--dy',rnd(-260,260).toFixed(0));c.style.setProperty('--dr',rnd(-40,40).toFixed(0));
          const ci=document.createElement('span');ci.className='ci';ci.textContent=ch;
          ci.style.setProperty('--i',i++);ci.style.setProperty('--r',rnd(-14,14).toFixed(1));
          c.appendChild(ci);w.appendChild(c)});
        frag.appendChild(w)});
      n.replaceWith(frag);
    }else if(n.nodeType===1)walk(n)})};
  const text=el.textContent.replace(/\s+/g,' ').trim();
  walk(el);
  /* screen readers get the plain sentence, not one letter at a time */
  $$('.w',el).forEach(w=>w.setAttribute('aria-hidden','true'));
  const sr=document.createElement('span');sr.className='sr';sr.textContent=text;el.appendChild(sr);
}
const heroH1=$('.n-h1');const heroHTML=heroH1?heroH1.innerHTML:'';
$$('[data-nchars]').forEach(splitChars);

/* magnifying lens over the hero headline */
if(heroH1&&!reduce&&fine){
  const lens=$('#nLens'),lensIn=$('#nLensIn');
  if(lens&&lensIn){
    lensIn.innerHTML=heroHTML;heroH1.classList.add('lensed');
    const Z=2.1;
    const move=e=>{const r=heroH1.getBoundingClientRect(),R=lens.offsetWidth/2;lensIn.style.width=r.width+'px';
      const px=e.clientX-r.left,py=e.clientY-r.top;lens.style.left=e.clientX+'px';lens.style.top=e.clientY+'px';
      lensIn.style.transform=`translate(${(R-px*Z).toFixed(1)}px,${(R-py*Z).toFixed(1)}px) scale(${Z})`};
    heroH1.addEventListener('mouseenter',e=>{move(e);lens.classList.add('on')});
    heroH1.addEventListener('mousemove',move);
    heroH1.addEventListener('mouseleave',()=>lens.classList.remove('on'));
    addEventListener('scroll',()=>lens.classList.remove('on'),{passive:true});
  }
}

/* statement: words sharpen into place as you scroll, the newest one reads in pink */
const about=$('[data-nwords]');let words=[];
if(about){
  const walk=node=>{[...node.childNodes].forEach(n=>{
    if(n.nodeType===3){const frag=document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part=>{if(!part)return;if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(' '));return}
        const s=document.createElement('span');s.className='nw';s.textContent=part;frag.appendChild(s)});
      n.replaceWith(frag)}else if(n.nodeType===1)walk(n)})};
  walk(about);words=$$('.nw',about);
}
function paintWords(){if(!about||!words.length)return;const r=about.getBoundingClientRect(),vh=innerHeight;
  const p=reduce?1:clamp((vh*.85-r.top)/(r.height+vh*.25),0,1),n=Math.round(p*words.length);
  words.forEach((w,i)=>{w.classList.toggle('on',i<n);w.classList.toggle('cur',!reduce&&i===n-1&&n<words.length)})}

/* hero headline scatters apart as you scroll past it */
const scatter=$('[data-scatter]');
function scatterTick(){if(!scatter||reduce)return;const r=scatter.getBoundingClientRect();
  scatter.style.setProperty('--p',clamp(-(r.top-innerHeight*.22)/(innerHeight*.6),0,1).toFixed(3))}

/* reveals: cards fire once; text replays each time it comes back */
const once=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');once.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
const replay=new IntersectionObserver(es=>es.forEach(e=>{const t=e.target;
  if(e.isIntersecting){t.classList.remove('out');t.classList.add('in')}
  else if(t.classList.contains('in')){t.classList.add('out');t.classList.remove('in')}}),{threshold:0,rootMargin:'0px 0px -10% 0px'});
$$('[data-nr]').forEach(el=>(el.closest('.n-grid,.n-stats,.n-kit,.n-bottom,.n-line,.n-quick,.n-logo-row')?once:replay).observe(el));
$$('[data-nchars]:not([data-nchars="manual"])').forEach(el=>replay.observe(el));
if(reduce)$$('[data-nr],[data-nchars]').forEach(el=>el.classList.add('in'));

/* how I work: the section pins and the three lines take turns */
const slSec=$('.n-slogans'),slides=slSec?$$('.n-sl',slSec):[],slDots=slSec?$$('.n-sl-dots i',slSec):[];let slCur=-2;
function slogans(){if(!slSec||!slides.length)return;
  if(reduce){slides.forEach(s=>s.classList.add('in'));return}
  const r=slSec.getBoundingClientRect(),len=slSec.offsetHeight-innerHeight;
  let idx=-1;
  if(r.top<innerHeight*.5&&r.bottom>innerHeight*.35){const p=len>0?clamp(-r.top/len,0,.9999):0;idx=Math.floor(p*slides.length)}
  if(idx===slCur)return;slCur=idx;
  slides.forEach((s,i)=>{if(i===idx){s.classList.remove('out');s.classList.add('in')}else if(s.classList.contains('in')){s.classList.remove('in');s.classList.add('out')}});
  slDots.forEach((d,i)=>d.classList.toggle('on',i===Math.max(0,idx)))}

/* experience: the rail fills pink as you scroll, lighting each role */
const xp=$('#nXp'),fill=$('#nRailFill'),items=xp?$$('.n-xi',xp):[];
function rail(){if(!xp)return;const r=xp.getBoundingClientRect(),mark=innerHeight*.6;
  fill.style.setProperty('--f',(reduce?1:clamp((mark-r.top)/r.height,0,1)).toFixed(3));
  items.forEach(it=>{const n=it.querySelector('.n-node').getBoundingClientRect();it.classList.toggle('lit',reduce||n.top+n.height/2<mark)})}

/* phone tilts toward the cursor while zoomed */
if(!reduce&&fine)$$('.n-project').forEach(card=>{const phone=$('.n-phone',card);if(!phone)return;
  card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    phone.style.transform=`scale(1.12) translateY(-2.5%) perspective(900px) rotateX(${(-y*7).toFixed(2)}deg) rotateY(${(x*9).toFixed(2)}deg)`});
  card.addEventListener('mouseleave',()=>{phone.style.transform=''})});

let ticking=false;
function frame(){ticking=false;if(!isNormal())return;
  root.classList.toggle('n-scrolled',scrollY>24);
  paintWords();scatterTick();slogans();rail()}
const req=()=>{if(!ticking){ticking=true;requestAnimationFrame(frame)}};
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);
addEventListener('py:edition',()=>{slCur=-2;setTimeout(req,60)});
frame();
})();
