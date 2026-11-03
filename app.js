const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
if('scrollRestoration' in history)history.scrollRestoration='manual';
if(!location.hash)scrollTo({top:0,left:0,behavior:'instant'});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const clamp=(v,min=0,max=1)=>Math.min(max,Math.max(min,v));
const opening=$('.opening'),heroImage=$('.hero-image'),heroVideo=$('.hero-media'),heroCopy=$('.hero-copy'),portal=$('.portal'),story=$('.story'),caseStory=$('.case-story');
const phases=[{word:'RESTORE',title:'留住故事，焕新质感。',description:'从结构修复到布艺更换，让喜爱的家具继续陪伴日常。',image:'lounge-chair.jpg',alt:'木框布艺休闲椅的结构与质感'},{word:'REIMAGINE',title:'重想布局，重新感受。',description:'从色彩、材料与布局出发，让空间更贴近你的生活。',image:'living-room.jpg',alt:'温暖明亮的现代客厅空间'},{word:'RENEW',title:'家具与空间，一同焕新。',description:'将已有的美好与新的设计结合，为家开启完整的新篇章。',image:'dining-room.jpg',alt:'自然材质与柔和光线组成的餐厅'}];
let activePhase=-1,queued=false;
let desiredVideoTime=0;
function seekHero(){
 if(!Number.isFinite(heroVideo.duration)||reduced.matches)return;
 const target=Math.min(desiredVideoTime,Math.max(0,heroVideo.duration-.04));
 if(!heroVideo.seeking&&Math.abs(heroVideo.currentTime-target)>(target===0?.001:.025))heroVideo.currentTime=target;
}
heroVideo.autoplay=false;
heroVideo.loop=false;
heroVideo.pause();
heroVideo.addEventListener('play',()=>heroVideo.pause());
heroVideo.addEventListener('seeked',seekHero);
heroVideo.addEventListener('loadedmetadata',()=>{heroVideo.pause();schedule();});
heroVideo.addEventListener('loadeddata',schedule);

function setPhase(index){if(index===activePhase)return;activePhase=index;const phase=phases[index];$('.story-word').replaceChildren(document.createTextNode(phase.word),Object.assign(document.createElement('span'),{textContent:'.'}));$('.story-copy h3').textContent=phase.title;$('.story-description').textContent=phase.description;$('.story-number').textContent=`RS INTERIORS / 0${index+1}`;$('.story-index').textContent=`0${index+1} / 03`;const image=$('.story-visual img');image.src=`./public/images/${phase.image}`;image.alt=phase.alt;$('.story-sticky').dataset.tone=index;$$('[data-phase]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.phase)===index)));}
function progress(el){return clamp(-el.getBoundingClientRect().top/Math.max(1,el.offsetHeight-innerHeight));}
function draw(){queued=false;const mobile=innerWidth<=700;$('.header').classList.toggle('scrolled',scrollY>innerHeight*.3);$('.page-progress').style.transform=`scaleX(${clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))})`;
 if(reduced.matches){setPhase(0);return;}
 const p=progress(opening);
 if(Number.isFinite(heroVideo.duration)){desiredVideoTime=clamp(p/.88)*heroVideo.duration;seekHero();}
 heroImage.style.clipPath='none';
 heroVideo.style.width='100%';
 heroVideo.style.height='100%';
 heroVideo.style.transform='translate(-50%,-50%)';
 const fade=clamp((p-.65)/.3);heroCopy.style.opacity=1-fade;heroCopy.style.transform=`translateY(${-fade*70}px)`;
 const pp=progress(portal);$('.portal-image').style.clipPath=`inset(${17*(1-pp)}% ${24*(1-pp)}% round ${45*(1-pp)}% ${45*(1-pp)}% 0 0)`;$('.portal-image img').style.transform=`scale(${1.35-.35*pp})`;const titleFade=clamp((pp-.15)/.4);$('.portal-title').style.opacity=1-titleFade;$('.portal-title').style.transform=`translateY(${-70*titleFade}px)`;const end=clamp((pp-.5)/.35);$('.portal-end').style.opacity=end;$('.portal-end').style.transform=`translateY(${40*(1-end)}px)`;
 const sp=progress(story);setPhase(Math.min(2,Math.floor(sp*3)));$('.story-visual').style.transform=`translateY(${Math.sin(sp*Math.PI*2)*20}px) rotate(${-5+10*sp}deg)`;
 const cp=progress(caseStory),cards=$$('.fan-card');if(mobile){const rail=$('.fan-rail'),distance=Math.max(0,rail.scrollWidth-innerWidth);rail.style.transform=`translateX(${-distance*cp}px)`;cards.forEach((card,i)=>card.style.transform=`rotate(${(i%2?1:-1)*(5-3*cp)}deg)`);}else{$('.fan-rail').style.transform='';cards.forEach((card,i)=>{const offset=i-2,spread=.12+.88*cp;card.style.transform=`translate(${offset*Math.min(innerWidth*.17,250)*spread}px,${Math.abs(offset)*28*spread}px) rotate(${offset*13*spread}deg)`;});}}
function schedule(){if(!queued){queued=true;requestAnimationFrame(draw);}}
addEventListener('pageshow',()=>{heroVideo.pause();if(!location.hash){scrollTo({top:0,left:0,behavior:'instant'});desiredVideoTime=0;seekHero();}schedule();});
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('load',schedule);
function syncPlayback(){heroVideo.pause();schedule();}reduced.addEventListener('change',syncPlayback);syncPlayback();draw();
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.1});$$('.reveal').forEach(el=>observer.observe(el));
const menu=$('.mobile-menu'),toggle=$('.menu-toggle');function setMenu(open){document.body.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'关闭导航':'打开导航');menu.inert=!open;if(open)menu.querySelector('a').focus();else toggle.focus();}toggle.addEventListener('click',()=>setMenu(!document.body.classList.contains('menu-open')));$$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open'))setMenu(false);if(e.key==='Tab'&&document.body.classList.contains('menu-open')){const items=[toggle,...menu.querySelectorAll('a')],first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
$$('[data-phase]').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.phase);if(reduced.matches){setPhase(index);return;}scrollTo({top:story.offsetTop+(story.offsetHeight-innerHeight)*((index+.15)/3),behavior:'smooth'});}));
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$$('[data-category]').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter);schedule();}));
const services={restoration:{label:'01 / FURNITURE RESTORATION',title:'留住故事，焕新质感。',copy:'从布艺更换、坐垫更新，到木质表面修复与重新饰面，我们会根据家具的材质、结构和实际状况，整理适合的翻新方向。请准备家具照片、尺寸及期望效果，方便进一步评估。'},interiors:{label:'02 / INTERIOR DESIGN',title:'让空间，更懂生活。',copy:'从整体风格、色彩与材料，到家具搭配和空间布局，将你的生活习惯转化为舒适的空间。欢迎分享户型、现场照片及喜欢的风格，一起讨论适合你的装潢方案。'},bespoke:{label:'03 / COMPLETE TRANSFORMATION',title:'为家，开启新的篇章。',copy:'将现有家具与新的空间设计一同考虑，让家具翻新、配色和整体装潢自然衔接。根据现场条件、预算与时间安排，明确适合的焕新范围。'}};
const serviceDialog=$('#service-dialog'),inquiryDialog=$('#inquiry-dialog');let selected='restoration';
$$('[data-service]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.service;const service=services[selected];$('#dialog-eyebrow').textContent=service.label;$('#dialog-title').textContent=service.title;$('#dialog-copy').textContent=service.copy;serviceDialog.showModal();}));
function openInquiry(){inquiryDialog.querySelector('select').value=selected;inquiryDialog.showModal();}$('#open-inquiry').addEventListener('click',openInquiry);$('#dialog-contact').addEventListener('click',()=>{serviceDialog.close();openInquiry();});
$$('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});});
$('#year').textContent=new Date().getFullYear();$('#contact-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget),service=$('select[name=service]').selectedOptions[0].textContent;$('#inquiry-output').value=`咨询项目：${service}\n姓名：${data.get('name').trim()}\n邮箱：${data.get('email').trim()}\n需求：${data.get('message').trim()}`;$('#copy-inquiry').textContent='复制内容 ↗';$('#form-result').hidden=false;$('#form-result').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'nearest'});});$('#copy-inquiry').addEventListener('click',async event=>{try{await navigator.clipboard.writeText($('#inquiry-output').value);event.currentTarget.textContent='已复制 ✓';}catch{$('#inquiry-output').focus();$('#inquiry-output').select();event.currentTarget.textContent='请复制已选中的内容';}});
const gallery=[['living-room.jpg','LIVING, REIMAGINED. / 客厅灵感'],['dining-room.jpg','A PLACE TO GATHER. / 餐厅灵感'],['lounge-chair.jpg','THE DETAILS. / 家具与材质'],['details.jpg','THE TEXTURE. / 木质与细节'],['architecture.jpg','THE PERSPECTIVE. / 线条与光影']];let galleryIndex=0;function showGallery(index){galleryIndex=(index+gallery.length)%gallery.length;const [image,caption]=gallery[galleryIndex];$('#gallery-image').src=`./public/images/${image}`;$('#gallery-image').alt=caption;$('#gallery-caption').textContent=caption;$('#gallery-count').textContent=`0${galleryIndex+1} / 05`;}$$('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{showGallery(Number(button.dataset.gallery));$('#gallery-dialog').showModal();}));$('#gallery-prev').addEventListener('click',()=>showGallery(galleryIndex-1));$('#gallery-next').addEventListener('click',()=>showGallery(galleryIndex+1));$('#gallery-dialog').addEventListener('keydown',e=>{if(e.key==='ArrowLeft')showGallery(galleryIndex-1);if(e.key==='ArrowRight')showGallery(galleryIndex+1);});
