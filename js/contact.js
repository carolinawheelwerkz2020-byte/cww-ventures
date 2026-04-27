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
ham.addEventListener('click',()=>{ham.classList.toggle('open');mob.classList.toggle('open');document.body.style.overflow=mob.classList.contains('open')?'hidden':'';});
mob.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ham.classList.remove('open');mob.classList.remove('open');document.body.style.overflow='';}));

// BUDGET CHIPS
const chips=document.querySelectorAll('.chip');
const budgetInput=document.getElementById('budget');
chips.forEach(chip=>{
  chip.addEventListener('click',()=>{
    chips.forEach(c=>c.classList.remove('on'));
    chip.classList.add('on');
    budgetInput.value=chip.dataset.val;
  });
});

// FIREBASE
firebase.initializeApp({
  apiKey:"AIzaSyCVhNqBM_ZLcDW_4tV7VESU_iJZgXUsTiA",
  authDomain:"cwwventures.firebaseapp.com",
  projectId:"cwwventures",
  storageBucket:"cwwventures.firebasestorage.app",
  messagingSenderId:"455081884418",
  appId:"1:455081884418:web:b7f2b5e253e1460ff0a01b"
});
const db=firebase.firestore();

// FORM — reCAPTCHA v3 protected
const RECAPTCHA_SITE_KEY = '6LfgUKwsAAAAAEDCu_aAL_vK0kkj98cz3oOOVGnu';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = {
  name: 120,
  email: 180,
  company: 180,
  service: 40,
  budget: 40,
  message: 2500
};

const clean = (value, max) => value.trim().slice(0, max);

document.getElementById('contact-form').addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.target;
  const name=clean(document.getElementById('name').value,MAX_LEN.name);
  const email=clean(document.getElementById('email').value,MAX_LEN.email).toLowerCase();
  const company=clean(document.getElementById('company').value,MAX_LEN.company);
  const service=clean(document.getElementById('service').value,MAX_LEN.service);
  const budget=clean(document.getElementById('budget').value,MAX_LEN.budget);
  const message=clean(document.getElementById('message').value,MAX_LEN.message);
  const website=document.getElementById('website')?.value.trim();

  if(website){return;}
  if(!name||!email){alert('Name and email required.');return;}
  if(!EMAIL_RE.test(email)){alert('Please enter a valid email address.');return;}

  form.style.opacity='.4';form.style.pointerEvents='none';
  const btn=form.querySelector('.btn-submit');
  btn.textContent='Verifying...';

  try{
    let recaptchaToken = '';
    if(typeof grecaptcha !== 'undefined' && RECAPTCHA_SITE_KEY !== 'RECAPTCHA_SITE_KEY'){
      recaptchaToken = await new Promise((resolve,reject)=>{
        grecaptcha.ready(()=>{
          grecaptcha.execute(RECAPTCHA_SITE_KEY,{action:'contact'}).then(resolve).catch(reject);
        });
      });
    }

    btn.textContent='Sending...';

    await db.collection('contacts').add({
      name,email,company,service,budget,message,
      recaptchaToken,
      source:'cwwventures.com',
      userAgent:navigator.userAgent.slice(0,240),
      createdAt:firebase.firestore.FieldValue.serverTimestamp()
    });
    form.style.display='none';
    document.getElementById('success-state').classList.add('show');
  }catch(err){
    console.error(err);
    form.style.opacity='1';form.style.pointerEvents='auto';
    btn.textContent='Send Message';
    alert('Error submitting form. Try again or email us directly.');
  }
});

// SCROLL REVEAL
const ro=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on');}),{threshold:0,rootMargin:'0px 0px -60px 0px'});
document.querySelectorAll('[data-reveal]').forEach(el=>ro.observe(el));

// MAGNETIC
document.querySelectorAll('.btn-submit,.nav-cta,.chip').forEach(el=>{
  el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const dx=e.clientX-r.left-r.width/2;const dy=e.clientY-r.top-r.height/2;el.style.transform=`translate(${dx*.25}px,${dy*.25}px)`;});
  el.addEventListener('mouseleave',()=>el.style.transform='');
});
