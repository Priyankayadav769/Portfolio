/* Review controller: control panel wiring, documented states, live state and jumps */
/* ===== Review controller: wiring for the control panel (documented states, live state, jumps) ===== */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const P=()=>window.__py,root=document.documentElement,ctl=$('#controls');
const sync=()=>{root.classList.toggle('ctl-min',ctl.classList.contains('min'));setTimeout(()=>dispatchEvent(new Event('resize')),320)};
new MutationObserver(sync).observe(ctl,{attributes:true,attributeFilter:['class']});sync();
const NAMES={cur:'Current',o1:'Option 1 · Work first',o2:'Option 2 · Pick your path'};
const DEV_STATES=[
 ['Current','cur',[['loader','Loader'],['picker','Edition picker'],['hero','Hero, first screen'],['links','Sticker links, scroll 1'],['work','Work, 4 scrolls down']]],
 ['Option 1 · Work first','o1',[['first','First screen'],['p1','Scroll 1 · NoiseFit sleep'],['p2','Scroll 2 · Noise Junior'],['p3','Scroll 3 · Master Buds'],['after','After the reel']]],
 ['Option 2 · Pick your path','o2',[['first','First screen'],['word','Word re-sprayed: design systems'],['hire','Path · I’m hiring'],['proj','Path · I’ve got a project'],['look','Path · Just looking around'],['scroll','No click · normal scroll']]],
 ['Normal mode','gold',[['prologue','Prologue title'],['hero','Hero']]],
 ['Experience','xp',[['1','Option 1 · Timeline'],['2','Option 2 · Paper notes'],['3','Option 3 · Job board'],['3all','Option 3 · every row open']]]];
let devCur=null;
function ensureStreet(then){const p=P();if(p.state.edition==='street'){then();return}p.setEdition('street');setTimeout(then,120)}
function el(id){return document.getElementById(id)}
function go(key){const[o,k]=key.split(':');devCur=key;const p=P();if(key!=='cur:picker'&&window.__closeChooser)window.__closeChooser();
  if(o==='xp'){ensureStreet(()=>{p.setXp(k==='3all'?3:+k);setTimeout(()=>{if(k==='3all')p.openAllJobs();p.goTo(el('experience'),{immediate:true,force:true,offset:-40});upd()},80)});upd();return}
  if(o==='gold'){p.setEdition('gold');setTimeout(()=>{if(k==='prologue')p.top();else p.goTo(el('home'))},120);upd();return}
  p.setIntro(o);
  ensureStreet(()=>{
    if(o==='cur'){if(k==='loader'){p.top();p.replayLoader()}else if(k==='picker'){p.top();p.openChooser()}else if(k==='hero')p.top();else if(k==='links')p.goTo(el('links'));else if(k==='work')p.goTo(el('work'))}
    if(o==='o1'){if(k==='after')p.goTo($('.o1-after'),{immediate:true,force:true,offset:-40});else p.reelGo({first:0,p1:1,p2:2,p3:3}[k],false)}
    if(o==='o2'){p.setPath(null,false);if(k==='first'){p.top();p.wordLoop(true)}else if(k==='word'){p.top();p.sprayWord(1)}else if(k==='scroll'){p.goTo(el('pHire'))}else{p.setPath(k,false);p.goTo(el({hire:'pHire',proj:'contact',look:'wall'}[k]),{immediate:true,force:true,offset:-70})}}
    setTimeout(upd,60)});
  upd()}
function upd(){const p=P();if(!p)return;const st=p.state;
  $$('#optSeg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.intro===st.intro));
  $$('#edSeg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ed===st.edition));
  $$('#xpSeg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.xpo===st.xp));
  $$('#cmpSeg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.cmpl===root.dataset.cmpl));
  const max=document.documentElement.scrollHeight-innerHeight,pct=max>0?Math.round(scrollY/max*100):0;
  const rows=[['intro',{cur:'Current',o1:'Option 1',o2:'Option 2'}[st.intro]],['experience','Option '+st.xp],['edition',st.edition],['section',st.section],['scroll',pct+'%']];
  if(st.intro==='o1'&&st.edition==='street')rows.push(['reel',st.reel===null?'n/a':st.reel===0?'intro':'project '+st.reel+' of 3']);
  if(st.intro==='o2'&&st.edition==='street')rows.push(['word',st.word.replace('.','')],['path',st.path||'none']);
  $('#devst').innerHTML=rows.map(([a,b])=>`<div><span>${a}</span><b>${b}</b></div>`).join('');
  const btn=(p2,k,n)=>`<button data-dstate="${p2}:${k}" ${devCur===p2+':'+k?'aria-current="true"':''}>${n}</button>`;
  $('#devstates').innerHTML=DEV_STATES.map(([t,p2,l])=>`<div class="dvg">${t}</div>`+l.map(([k,n])=>btn(p2,k,n)).join('')).join('');
  const g=st.edition==='gold'?DEV_STATES[3]:DEV_STATES.find(x=>x[1]===st.intro);
  $('#steps').innerHTML=g[2].map(([k,n])=>btn(g[1],k,n)).join('')}
let t=0;window.__ctlUpd=()=>{if(t)return;t=requestAnimationFrame(()=>{t=0;upd()})};
addEventListener('py:edition',()=>window.__ctlUpd());
ctl.addEventListener('click',e=>{
  const ds=e.target.closest('[data-dstate]');if(ds){go(ds.dataset.dstate);return}
  const ob=e.target.closest('#optSeg [data-intro]');if(ob){go(ob.dataset.intro+':'+(ob.dataset.intro==='cur'?'hero':'first'));return}
  const xb=e.target.closest('#xpSeg [data-xpo]');if(xb){go('xp:'+xb.dataset.xpo);return}
  const cb=e.target.closest('#cmpSeg [data-cmpl]');if(cb){root.dataset.cmpl=cb.dataset.cmpl;try{localStorage.setItem('py:cmpl',cb.dataset.cmpl)}catch(_){}requestAnimationFrame(()=>dispatchEvent(new Event('resize')));const c=document.getElementById('csCompare');if(c&&document.documentElement.classList.contains('case-open'))c.scrollIntoView({block:'start'});upd();return}
  const eb=e.target.closest('#edSeg [data-ed]');if(eb){P().sprayTo(eb.dataset.ed);return}
  if(e.target.closest('#resetFlow')){const st=P().state;go(st.edition==='gold'?'gold:prologue':st.intro+':'+(st.intro==='cur'?'hero':'first'))}});
window.__fit=()=>{};
upd();
})();
