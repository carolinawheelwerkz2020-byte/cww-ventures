// CURSOR
const cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function anim(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(anim);})();

// CURTAIN
window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.getElementById('curtain').classList.add('gone');
    setTimeout(()=>{const c=document.getElementById('curtain');if(c)c.remove();},1400);
  },1800);
});

// NAV SCROLL
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{nav.classList.toggle('scrolled',window.scrollY>60);},{passive:true});

// HAMBURGER
const ham=document.getElementById('hamburger'),mob=document.getElementById('mobile-menu');
ham.addEventListener('click',()=>{ham.classList.toggle('open');mob.classList.toggle('open');});
mob.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ham.classList.remove('open');mob.classList.remove('open');}));

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

// REVEAL
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on');});},{threshold:.12});
document.querySelectorAll('[data-reveal]').forEach(el=>obs.observe(el));

// FAQ
document.querySelectorAll('.faq-item').forEach(item=>{
  item.querySelector('.faq-q').addEventListener('click',()=>{
    const wasOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!wasOpen)item.classList.add('open');
  });
});

// MAGNETIC BUTTONS
document.querySelectorAll('.price-cta,.cta-strip-btn,.sr-btn').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const dx=(e.clientX-r.left-r.width/2)*.25;
    const dy=(e.clientY-r.top-r.height/2)*.25;
    btn.style.transform=`translate(${dx}px,${dy}px)`;
  });
  btn.addEventListener('mouseleave',()=>{btn.style.transform='';});
});
