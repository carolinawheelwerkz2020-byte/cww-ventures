// CURSOR
const cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function animRing(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing);})();

// CURTAIN
window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.getElementById('curtain').classList.add('gone');
    setTimeout(()=>{const c=document.getElementById('curtain');if(c)c.remove();},1400);
  },1800);
});

// PARTICLES
(()=>{
  const c=document.getElementById('particles');
  if(!c)return;
  const x=c.getContext('2d');
  let W,H,pts=[];
  const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
  resize();window.addEventListener('resize',resize,{passive:true});
  class P{
    constructor(){this.reset();}
    reset(){this.x=Math.random()*W;this.y=H+10;this.vy=-(0.2+Math.random()*.7);this.vx=(Math.random()-.5)*.3;this.r=.5+Math.random()*1.5;this.life=0;this.max=100+Math.random()*150;this.blue=Math.random()>.4;}
    draw(){this.life++;this.x+=this.vx;this.y+=this.vy;const a=Math.sin(this.life/this.max*Math.PI)*.4;x.beginPath();x.arc(this.x,this.y,this.r,0,Math.PI*2);x.fillStyle=this.blue?`rgba(20,110,245,${a})`:`rgba(56,182,232,${a})`;x.fill();if(this.life>=this.max)this.reset();}
  }
  for(let i=0;i<50;i++){const p=new P();p.life=Math.random()*p.max;pts.push(p);}
  const tick=()=>{x.clearRect(0,0,W,H);if(Math.random()<.4)pts.push(new P());pts=pts.slice(-80);pts.forEach(p=>p.draw());requestAnimationFrame(tick);};
  tick();
})();

// NAV
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60),{passive:true});
const ham=document.getElementById('hamburger'),mob=document.getElementById('mobile-menu');
ham.addEventListener('click',()=>{ham.classList.toggle('open');mob.classList.toggle('open');document.body.style.overflow=mob.classList.contains('open')?'hidden':'';});
mob.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ham.classList.remove('open');mob.classList.remove('open');document.body.style.overflow='';}));

// FILTER PILLS
const pills=document.querySelectorAll('.pill');
const cards=[...document.querySelectorAll('.logo-card')];
pills.forEach(pill=>{
  pill.addEventListener('click',()=>{
    pills.forEach(p=>p.classList.remove('active'));
    pill.classList.add('active');
    const f=pill.dataset.filter;
    cards.forEach(card=>{
      const cats=card.dataset.cat||'';
      const show=f==='all'||cats.split(' ').includes(f);
      if(show){card.classList.remove('hidden');card.style.display='';}
      else{card.classList.add('hidden');card.style.display='none';}
    });
  });
});

// LIGHTBOX
const lb=document.getElementById('lb');
const lbImg=document.getElementById('lb-img');
const lbTitle=document.getElementById('lb-title');
const lbDesc=document.getElementById('lb-desc');
const lbLive=document.getElementById('lb-live');

cards.forEach(card=>{
  if(card.dataset.link){
    const badge=document.createElement('div');
    badge.className='live-badge';
    badge.innerHTML='<span class="live-dot"></span> Live';
    card.style.position='relative';
    card.querySelector('.logo-img-wrap').after(badge);
  }
  card.addEventListener('click',()=>{
    lbImg.src=card.querySelector('img').src;
    lbImg.alt=card.dataset.title;
    lbTitle.textContent=card.dataset.title;
    lbDesc.textContent=card.dataset.desc;
    if(card.dataset.link){
      lbLive.href=card.dataset.link;
      lbLive.classList.add('visible');
    } else {
      lbLive.classList.remove('visible');
      lbLive.href='#';
    }
    lb.classList.add('open');
    document.body.style.overflow='hidden';
  });
});
document.getElementById('lb-close').addEventListener('click',closeLB);
lb.addEventListener('click',e=>{if(e.target===lb)closeLB();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLB();});
function closeLB(){lb.classList.remove('open');document.body.style.overflow='';}

// SCROLL REVEAL
const ro=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on');}),{threshold:0,rootMargin:'0px 0px -60px 0px'});
document.querySelectorAll('[data-reveal]').forEach(el=>ro.observe(el));

// MAGNETIC
document.querySelectorAll('.btn-fill,.nav-cta,.pill').forEach(el=>{
  el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const dx=e.clientX-r.left-r.width/2;const dy=e.clientY-r.top-r.height/2;el.style.transform=`translate(${dx*.25}px,${dy*.25}px)`;});
  el.addEventListener('mouseleave',()=>el.style.transform='');
});
