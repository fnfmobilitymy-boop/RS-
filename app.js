const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
if('scrollRestoration' in history)history.scrollRestoration='manual';
if(!location.hash)scrollTo({top:0,left:0,behavior:'instant'});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const tx=s=>window.rsTranslate?window.rsTranslate(s):s;
const clamp=(v,min=0,max=1)=>Math.min(max,Math.max(min,v));
const opening=$('.opening'),heroImage=$('.hero-image'),heroVideo=$('.hero-media'),heroCopy=$('.hero-copy');
let queued=false;
let desiredVideoTime=0;
function seekHero(){
 if(!Number.isFinite(heroVideo.duration)||reduced.matches)return;
 const target=Math.min(desiredVideoTime,Math.max(0,heroVideo.duration-.04));
 if(!heroVideo.seeking&&Math.abs(heroVideo.currentTime-target)>(target===0?.001:.025))heroVideo.currentTime=target;
}
heroVideo.autoplay=false;heroVideo.loop=false;heroVideo.pause();
heroVideo.addEventListener('play',()=>heroVideo.pause());heroVideo.addEventListener('seeked',seekHero);
heroVideo.addEventListener('loadedmetadata',()=>{heroVideo.pause();schedule();});heroVideo.addEventListener('loadeddata',schedule);
function progress(el){return clamp(-el.getBoundingClientRect().top/Math.max(1,el.offsetHeight-innerHeight));}
function draw(){queued=false;const mobile=innerWidth<=700;$('.header').classList.toggle('scrolled',scrollY>innerHeight*.3);$('.page-progress').style.transform=`scaleX(${clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))})`;
 window.drawReferenceMotion?.();
 window.drawReviews?.();
 if(reduced.matches)return;
 const p=progress(opening);
 if(Number.isFinite(heroVideo.duration)){desiredVideoTime=clamp(p/.88)*heroVideo.duration;seekHero();}
 heroImage.style.clipPath='none';
 heroVideo.style.width='100%';
 heroVideo.style.height='100%';
 heroVideo.style.transform='translate(-50%,-50%)';
 const fade=clamp((p-.65)/.3);heroCopy.style.opacity=1-fade;heroCopy.style.transform=`translateY(${-fade*70}px)`;
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(draw);}}
addEventListener('pageshow',()=>{heroVideo.pause();if(!location.hash){scrollTo({top:0,left:0,behavior:'instant'});desiredVideoTime=0;seekHero();}schedule();});
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('rs-language-change',schedule);addEventListener('load',schedule);
function syncPlayback(){heroVideo.pause();schedule();}reduced.addEventListener('change',syncPlayback);syncPlayback();draw();
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.1});$$('.reveal').forEach(el=>observer.observe(el));
const menu=$('.mobile-menu'),toggle=$('.menu-toggle');function setMenu(open){document.body.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',tx(open?'关闭导航':'打开导航'));menu.inert=!open;if(open)menu.querySelector('a').focus();else toggle.focus();}toggle.addEventListener('click',()=>setMenu(!document.body.classList.contains('menu-open')));$$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open'))setMenu(false);if(e.key==='Tab'&&document.body.classList.contains('menu-open')){const items=[toggle,...menu.querySelectorAll('a')],first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
const services={restoration:{label:'01 / FURNITURE RESTORATION',title:'留住故事，焕新质感。',copy:'从布艺更换、坐垫更新，到木质表面修复与重新饰面，我们会根据家具的材质、结构和实际状况，整理适合的翻新方向。请准备家具照片、尺寸及期望效果，方便进一步评估。'},interiors:{label:'02 / INTERIOR DESIGN',title:'让空间，更懂生活。',copy:'从整体风格、色彩与材料，到家具搭配和空间布局，将你的生活习惯转化为舒适的空间。欢迎分享户型、现场照片及喜欢的风格，一起讨论适合你的装潢方案。'},bespoke:{label:'03 / COMPLETE TRANSFORMATION',title:'为家，开启新的篇章。',copy:'将现有家具与新的空间设计一同考虑，让家具翻新、配色和整体装潢自然衔接。根据现场条件、预算与时间安排，明确适合的焕新范围。'}};
const serviceDialog=$('#service-dialog'),inquiryDialog=$('#inquiry-dialog');let selected='restoration';
$$('[data-service]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.service;const service=services[selected];$('#dialog-eyebrow').textContent=tx(service.label);$('#dialog-title').textContent=tx(service.title);$('#dialog-copy').textContent=tx(service.copy);serviceDialog.showModal();}));
function openInquiry(){inquiryDialog.querySelector('select').value=selected;inquiryDialog.showModal();}$('#open-inquiry').addEventListener('click',openInquiry);$('#dialog-contact').addEventListener('click',()=>{serviceDialog.close();openInquiry();});
$$('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});});
if($('#year'))$('#year').textContent=new Date().getFullYear();$('#contact-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget),service=$('select[name=service]').selectedOptions[0].textContent;$('#inquiry-output').value=`${tx('咨询项目')}：${service}\n${tx('姓名')}：${data.get('name').trim()}\n${tx('邮箱')}：${data.get('email').trim()}\n${tx('你的想法')}：${data.get('message').trim()}`;$('#copy-inquiry').textContent=tx('复制内容 ↗');$('#send-whatsapp').href='https://wa.me/60177377113?text='+encodeURIComponent($('#inquiry-output').value);$('#form-result').hidden=false;$('#form-result').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'nearest'});});$('#copy-inquiry').addEventListener('click',async event=>{try{await navigator.clipboard.writeText($('#inquiry-output').value);event.currentTarget.textContent=tx('已复制 ✓');}catch{$('#inquiry-output').focus();$('#inquiry-output').select();event.currentTarget.textContent=tx('请复制已选中的内容');}});
const gallery=[['living-room.jpg','LIVING, REIMAGINED. / 客厅灵感'],['dining-room.jpg','A PLACE TO GATHER. / 餐厅灵感'],['lounge-chair.jpg','THE DETAILS. / 家具与材质'],['details.jpg','THE TEXTURE. / 木质与细节'],['architecture.jpg','THE PERSPECTIVE. / 线条与光影']];let galleryIndex=0;function showGallery(index){galleryIndex=(index+gallery.length)%gallery.length;const [image,caption]=gallery[galleryIndex];$('#gallery-image').src=`./public/images/${image}`;$('#gallery-image').alt=caption;$('#gallery-caption').textContent=caption;$('#gallery-count').textContent=`0${galleryIndex+1} / 05`;}$$('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{showGallery(Number(button.dataset.gallery));$('#gallery-dialog').showModal();}));$('#gallery-prev').addEventListener('click',()=>showGallery(galleryIndex-1));$('#gallery-next').addEventListener('click',()=>showGallery(galleryIndex+1));$('#gallery-dialog').addEventListener('keydown',e=>{if(e.key==='ArrowLeft')showGallery(galleryIndex-1);if(e.key==='ArrowRight')showGallery(galleryIndex+1);});
