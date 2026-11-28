(function(){
'use strict';
var d=document,w=window,html=d.documentElement;
var $=function(s,c){return (c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
var reduce=w.matchMedia('(prefers-reduced-motion: reduce)').matches;
var hasGsap=!!w.gsap;
var EASE='power3.out';
var clamp=function(v,a,b){return v<a?a:v>b?b:v};
var c01=function(v){return clamp(v,0,1)};
var eOut=function(t){return 1-Math.pow(1-t,3)};
var eIO=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
var PHONE='77777774969';

/* ---------- языки ---------- */
var WA_RU={
 'wa.gen':'Здравствуйте. Нужен ремонт под ключ в Алматы, прошу связаться для выезда на замер.',
 'wa.kv':'Здравствуйте. Нужен ремонт квартиры под ключ в Алматы, прошу связаться для выезда на замер.',
 'wa.dom':'Здравствуйте. Нужен ремонт дома под ключ в Алматы, прошу связаться для выезда на замер.',
 'wa.of':'Здравствуйте. Нужен ремонт офиса под ключ в Алматы, прошу связаться для выезда на замер.',
 'wa.rest':'Здравствуйте. Нужен ремонт ресторана или бара под ключ в Алматы, прошу связаться для выезда на замер.',
 'wa.str':'Здравствуйте. Планирую строительство дома в Алматы, прошу связаться для выезда на участок.',
 'wa.form':'Здравствуйте. Заявка на замер: {type}{area}. Имя: {name}, телефон: {phone}.',
 'wa.area':', {n} м²'
};
var RU={},dict=null,lang='ru';
var me=d.currentScript,ver=(me&&me.src.split('?v=')[1])||'1';
$$('[data-i18n]').forEach(function(el){RU[el.getAttribute('data-i18n')]=el.innerHTML});
var metaD=$('meta[name="description"]'),ogT=$('meta[property="og:title"]');
RU['meta.desc']=metaD.content;RU['meta.og']=ogT.content;
function tr(k){return (dict&&dict[k]!=null)?dict[k]:(RU[k]!=null?RU[k]:WA_RU[k])}
function applyLang(){
  $$('[data-i18n]').forEach(function(el){var v=tr(el.getAttribute('data-i18n'));if(v!=null&&el.innerHTML!==v)el.innerHTML=v});
  metaD.content=tr('meta.desc');ogT.content=tr('meta.og');
  $$('[data-wa]').forEach(function(a){a.href='https://wa.me/'+PHONE+'?text='+encodeURIComponent(tr(a.getAttribute('data-wa')))});
  html.lang=lang;
  $$('.lang button').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-lang')===lang))});
  if(w.__remeasure)w.__remeasure();
}
function setLang(l,save){
  if(save){try{localStorage.setItem('lang',l)}catch(e){}}
  if(l==='ru'){lang='ru';dict=null;applyLang();return}
  var g=l==='kk'?'SITE_KK':'SITE_EN';
  var done=function(){lang=l;dict=w[g]||null;applyLang()};
  if(w[g])return done();
  var s=d.createElement('script');s.src='assets/lang/'+l+'.js?v='+ver;s.onload=done;d.head.appendChild(s);
}
$$('.lang button').forEach(function(b){b.addEventListener('click',function(){setLang(b.getAttribute('data-lang'),true)})});
(function(){
  var q=(location.search.match(/[?&]lang=(ru|kk|en)/)||[])[1],s=null;
  try{s=localStorage.getItem('lang')}catch(e){}
  var l=q||s||'ru';
  if(l!=='ru')setLang(l,false);
})();

/* ---------- меню ---------- */
var burger=$('#burger');
function menu(open){html.classList.toggle('menu-open',open);burger.setAttribute('aria-expanded',String(open));if(lenis){open?lenis.stop():lenis.start()}}
burger.addEventListener('click',function(){menu(!html.classList.contains('menu-open'))});

/* ---------- плавная прокрутка ---------- */
var lenis=null;
if(w.Lenis&&!reduce){
  lenis=new w.Lenis({lerp:.095,wheelMultiplier:1});
  if(hasGsap){gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);if(w.ScrollTrigger)lenis.on('scroll',ScrollTrigger.update)}
  else{(function loop(t){lenis.raf(t);requestAnimationFrame(loop)})(0)}
}
$$('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){
  var id=a.getAttribute('href');if(id.length<2)return e.preventDefault();
  var t=$(id);if(!t)return;e.preventDefault();menu(false);
  var inJourney=(id==='#top'||id==='#kvartira');
  var y=t.getBoundingClientRect().top+w.pageYOffset-(inJourney?0:hdr.offsetHeight-1);
  if(id==='#top')y=0;
  if(lenis)lenis.scrollTo(y,{duration:1.4});else w.scrollTo({top:y,behavior:reduce?'auto':'smooth'});
  history.replaceState(null,'',id);
})});

/* ---------- герой ---------- */
var hdr=$('#hdr'),hero=$('#top'),heroV=$('#heroV'),mobQ=w.matchMedia('(max-width:760px)'),heroIn=true;
function heroPlay(){
  if(!mobQ.matches||reduce)return;
  if(!heroV.src){heroV.src=heroV.getAttribute('data-src');heroV.load()}
  if(heroIn&&heroV.paused){var p=heroV.play();if(p&&p.catch)p.catch(function(){})}
}
if('IntersectionObserver' in w){
  new IntersectionObserver(function(en){heroIn=en[0].isIntersecting;if(heroIn)heroPlay();else if(!heroV.paused)heroV.pause()}).observe(hero);
}
heroPlay();
if(mobQ.addEventListener)mobQ.addEventListener('change',heroPlay);
function onScroll(){hdr.classList.toggle('solid',w.pageYOffset>hero.offsetHeight-hdr.offsetHeight-10)}
onScroll();
w.addEventListener('scroll',onScroll,{passive:true});

/* ---------- анфилада: листается ползунком ---------- */
var stage=$('#stage'),room=$('#room'),track=$('#track'),
    scrub=$('#scrub'),scrubR=$('#scrubR'),sPrev=$('#scrubPrev'),sNext=$('#scrubNext');
var frames=$$('.fr',track).map(function(el){return {el:el,leaf:$('.leaf',el),r:el.getAttribute('data-hinge')==='r',x:0,w:0,on:false}});
var G={vw:0,travel:0,mob:false};
var st={x:0,xT:0};
var lastW=0;
function measure(){
  G.vw=html.clientWidth;G.mob=G.vw<=760;
  var endc=$('.endc',track);G.travel=Math.max(0,endc?Math.round(endc.offsetLeft+endc.offsetWidth/2-G.vw/2):track.scrollWidth-G.vw);
  st.xT=clamp(st.xT,0,G.travel);st.x=clamp(st.x,0,G.travel);
  frames.forEach(function(f){f.x=f.el.offsetLeft;f.w=f.el.offsetWidth});
  lastW=G.vw;
  if(w.ScrollTrigger)ScrollTrigger.refresh();
  render();
}
function render(){
  var x=st.x;
  track.style.transform='translate3d('+(-x).toFixed(1)+'px,0,0)';
  for(var i=0;i<frames.length;i++){
    var f=frames[i],left=f.x-x;
    var o=eIO(c01((G.vw*(G.mob?1.0:.96)-left)/(G.vw*(G.mob?.8:.5))));
    var a=o*94;
    f.leaf.style.transform='rotateY('+(f.r?a:-a).toFixed(2)+'deg)';
    f.leaf.style.opacity=(1-c01((o-.86)/.14)).toFixed(3);
    var on=o>.45;if(on!==f.on){f.on=on;f.el.classList.toggle('on',on)}
  }
  syncScrub();
}
/* ползунок анфилады */
var glide=0;
function syncScrub(){
  var p=G.travel?st.xT/G.travel:0;
  if(d.activeElement!==scrubR||!scrubR.matches(':active'))scrubR.value=Math.round(p*1000);
  scrubR.style.setProperty('--p',(p*100).toFixed(2)+'%');
  sPrev.disabled=st.xT<=2;sNext.disabled=st.xT>=G.travel-2;
}
function tick(){
  var dx=st.xT-st.x;
  if(Math.abs(dx)<.4||reduce){st.x=st.xT;glide=0;render();return}
  st.x+=dx*.12;render();glide=requestAnimationFrame(tick);
}
function goX(v){scrub.classList.add('used');st.xT=clamp(v,0,G.travel);syncScrub();if(!glide)glide=requestAnimationFrame(tick)}
function stops(){
  var a=[0];frames.forEach(function(f){a.push(clamp(f.x+f.w/2-G.vw/2,0,G.travel))});a.push(G.travel);a.sort(function(p,q){return p-q});
  return a;
}
function stepTo(dir){
  var a=stops(),cur=st.xT,t=dir>0?G.travel:0;
  for(var i=0;i<a.length;i++){if(dir>0&&a[i]>cur+8){t=a[i];break}}
  if(dir<0)for(var j=a.length-1;j>=0;j--){if(a[j]<cur-8){t=a[j];break}}
  goX(t);
}
scrubR.addEventListener('input',function(){goX(scrubR.value/1000*G.travel)});
sPrev.addEventListener('click',function(){stepTo(-1)});
sNext.addEventListener('click',function(){stepTo(1)});
(function(){
  var down=null,sx=0,x0=0,moved=false;
  room.addEventListener('pointerdown',function(e){
    if(!scrub.classList.contains('on')||e.button>0||e.target.closest('.scrub,.vplay,a,button'))return;
    down=e.pointerId;sx=e.clientX;x0=st.xT;moved=false;
  });
  room.addEventListener('pointermove',function(e){
    if(down!==e.pointerId)return;
    var dx=e.clientX-sx;
    if(!moved&&Math.abs(dx)>6){moved=true;room.classList.add('drag');try{room.setPointerCapture(e.pointerId)}catch(err){}}
    if(moved)goX(x0-dx*1.3);
  });
  var up=function(e){if(down!==e.pointerId)return;down=null;room.classList.remove('drag')};
  room.addEventListener('pointerup',up);room.addEventListener('pointercancel',up);
  room.addEventListener('wheel',function(e){
    if(!scrub.classList.contains('on')||Math.abs(e.deltaX)<=Math.abs(e.deltaY))return;
    e.preventDefault();goX(st.xT+e.deltaX);
  },{passive:false});
})();
w.__remeasure=function(){requestAnimationFrame(measure)};
measure();
w.addEventListener('resize',function(){if(html.clientWidth!==lastW)measure()});
w.addEventListener('load',measure);
if(d.fonts&&d.fonts.ready)d.fonts.ready.then(measure);

/* ---------- полный ролик ---------- */
var vmodal=$('#vmodal'),vfull=$('#vfull');
$('#vplay').addEventListener('click',function(){
  if(!vfull.src)vfull.src=vfull.getAttribute('data-src');
  vmodal.hidden=false;if(lenis)lenis.stop();if(!heroV.paused)heroV.pause();var p=vfull.play();if(p&&p.catch)p.catch(function(){});
});
function closeV(){vfull.pause();vmodal.hidden=true;if(lenis)lenis.start();heroPlay()}
$('#vclose').addEventListener('click',closeV);
vmodal.addEventListener('click',function(e){if(e.target===vmodal)closeV()});
d.addEventListener('keydown',function(e){if(e.key==='Escape'){if(!vmodal.hidden)closeV();menu(false)}});

/* ---------- появления и раскрытия ---------- */
if(hasGsap&&w.ScrollTrigger&&!reduce){
  gsap.registerPlugin(ScrollTrigger);
  if(w.SplitText){
    gsap.registerPlugin(SplitText);
    $$('.sec .h2.rv').forEach(function(h){
      h.classList.remove('rv');
      ScrollTrigger.create({trigger:h,start:'top 88%',once:true,onEnter:function(){
        try{
          var L=lang,sp=new SplitText(h,{type:'lines',mask:'lines',linesClass:'ln',aria:'none'});
          gsap.from(sp.lines,{yPercent:112,duration:1.15,stagger:.1,ease:'power4.out',onComplete:function(){if(L===lang)sp.revert()}});
        }catch(err){}
      }});
    });
  }
  ScrollTrigger.batch('.rv',{start:'top 90%',once:true,onEnter:function(b){b.forEach(function(el){el.classList.add('in')});gsap.to(b,{opacity:1,y:0,duration:.95,stagger:.08,ease:EASE,overwrite:true})}});
  var mm=gsap.matchMedia();
  mm.add('(min-width:761px)',function(){
    $$('.obj-media').forEach(function(m){
      gsap.to($$('.b',m),{yPercent:-6,ease:'none',scrollTrigger:{trigger:m,start:'top bottom',end:'bottom top',scrub:.6}});
    });
  });
  ScrollTrigger.create({trigger:'#mq',start:'top bottom',end:'bottom top',onToggle:function(s){$('#mq').classList.toggle('run',s.isActive)}});
  $$('.dr').forEach(function(dr,i){
    var leaf=$('.leaf',dr),r=dr.getAttribute('data-hinge')==='r',img=$('img',dr);
    ScrollTrigger.create({trigger:dr,start:'top 78%',once:true,onEnter:function(){
      gsap.to(leaf,{rotationY:r?93:-93,duration:1.5,ease:'power3.inOut'});
      gsap.to(leaf,{opacity:0,duration:.25,delay:1.2});
    }});
  });
  ScrollTrigger.create({trigger:'.doors',start:'top 72%',once:true,onEnter:function(){
    $$('.svc').forEach(function(el,i){setTimeout(function(){el.classList.add('is-open')},i*160)});
  }});
  if(w.matchMedia('(max-width:760px)').matches){
    $$('.step').forEach(function(el){ScrollTrigger.create({trigger:el,start:'top 74%',once:true,onEnter:function(){el.classList.add('on')}})});
  }else{
    ScrollTrigger.create({trigger:'#trk',start:'top 70%',once:true,onEnter:function(){
      $$('.step').forEach(function(el,i){setTimeout(function(){el.classList.add('on')},i*420)});
    }});
  }
  var draw=function(sel,trigger,dur,stg){
    var ps=$$(sel);
    ps.forEach(function(p){var L=p.getTotalLength();p.style.strokeDasharray=p.getAttribute('stroke-dasharray')?p.getAttribute('stroke-dasharray'):L;if(!p.getAttribute('stroke-dasharray')){p.style.strokeDashoffset=L}else{p.style.opacity=0}});
    ScrollTrigger.create({trigger:trigger,start:'top 70%',once:true,onEnter:function(){
      ps.forEach(function(p,i){if(p.getAttribute('stroke-dasharray'))gsap.to(p,{opacity:1,duration:1,delay:i*stg+.4});else gsap.to(p,{strokeDashoffset:0,duration:dur,delay:i*stg,ease:'power2.inOut'})});
    }});
  };
  draw('#coveLine','#kontakty',2.2,0);
  gsap.set('.cove-glow',{opacity:0});
  ScrollTrigger.create({trigger:'#kontakty',start:'top 70%',once:true,onEnter:function(){gsap.to('.cove-glow',{opacity:1,duration:1.6,delay:1.4})}});
}else{
  $$('.rv').forEach(function(el){el.style.opacity=1;el.style.transform='none';el.classList.add('in')});
  $$('.dr .leaf').forEach(function(el){el.style.display='none'});
  $$('.svc').forEach(function(el){el.classList.add('is-open')});
  $$('.step').forEach(function(el){el.classList.add('on')});
}

/* ---------- форма ---------- */
var form=$('#form');
form.addEventListener('submit',function(e){
  e.preventDefault();
  var f=form.elements,ok=true;
  [f.name,f.phone].forEach(function(i){var bad=!i.value.trim()||(i===f.phone&&i.value.replace(/\D/g,'').length<10);i.parentNode.classList.toggle('err',bad);if(bad)ok=false});
  if(!ok)return;
  var area=f.area.value.trim();
  var text=tr('wa.form').replace('{type}',f.type.options[f.type.selectedIndex].text)
    .replace('{area}',area?tr('wa.area').replace('{n}',area):'').replace('{name}',f.name.value.trim()).replace('{phone}',f.phone.value.trim());
  w.open('https://wa.me/'+PHONE+'?text='+encodeURIComponent(text),'_blank','noopener');
  $('#formOk').hidden=false;
});

/* частые вопросы: плавное раскрытие */
$$('.qa').forEach(function(d){
  var sm=d.querySelector('summary'),a=d.querySelector('.qa-a'),busy=null;
  sm.addEventListener('click',function(e){
    if(reduce||!a.animate)return;
    e.preventDefault();
    if(busy)busy.cancel();
    var opening=!d.open,h0=d.open?a.offsetHeight:0;
    if(opening)d.open=true;
    var h1=opening?a.scrollHeight:0;
    busy=a.animate([{height:h0+'px'},{height:h1+'px'}],{duration:opening?420:320,easing:'cubic-bezier(.2,.7,.2,1)'});
    busy.onfinish=function(){busy=null;if(!opening)d.open=false};
  });
});

applyLang();
})();
