const $ = (selector) => document.querySelector(selector);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const opening = $('.opening');
const heroImage = $('.hero-image');
const heroPhoto = $('.hero-media');
function syncHeroPlayback(){
  if(reduced.matches){heroPhoto.pause();return;}
  heroPhoto.play().catch(()=>{});
}
reduced.addEventListener('change',syncHeroPlayback);
syncHeroPlayback();
const heroTitle = $('.hero-title');
const craft = $('.craft');
let queued = false;
function draw() {
  queued = false;
  const height = innerHeight;
  const progress = clamp(-opening.getBoundingClientRect().top / (opening.offsetHeight - height));
  $('.header').classList.toggle('scrolled', scrollY > height * 1.4);
  const stageRect = $('.service-stage').getBoundingClientRect();
  const footerRect = $('footer').getBoundingClientRect();
  const onDark = (stageRect.top < 75 && stageRect.bottom > 75) || footerRect.top < 75;
  $('.header').classList.toggle('on-dark', onDark);
  if(onDark) $('.header').classList.remove('scrolled');
  if (reduced.matches) return;
  const expand = clamp(progress / .58);
  const smooth = expand * expand * (3 - 2 * expand);
  heroImage.style.clipPath = `inset(${(innerWidth <= 700 ? 32 : 29) * (1-smooth)}% ${(innerWidth <= 700 ? 16 : 28) * (1-smooth)}%)`;
  heroPhoto.style.width = `${(innerWidth<=700?68:44)+(innerWidth<=700?32:56)*smooth}%`;
  heroPhoto.style.height = `${(innerWidth<=700?36:42)+(innerWidth<=700?64:58)*smooth}%`;
  heroPhoto.style.transform = 'translate(-50%,-50%)';
  const appear = clamp((progress - .44) / .26);
  heroTitle.style.opacity = appear;
  heroTitle.style.transform = `translateY(${35*(1-appear)}px)`;
  $('.hero-shade').style.opacity = appear;
  $('.hero-index').style.opacity = appear;
  $('.scroll-cue').style.opacity = 1 - clamp(progress / .25) * .7;
  const rect = craft.getBoundingClientRect();
  const cp = clamp(-rect.top / (craft.offsetHeight - height));
  $('.craft-image').style.transform = `translateY(${(cp-.5)*12}%) scale(${1.04 + cp*.05})`;
  const word = $('.giant-word');
  word.style.transform = `translateX(${clamp((height-word.getBoundingClientRect().top)/height,-1,1)*-20}px)`;
  const signature = $('.signature');
  const sp = clamp(-signature.getBoundingClientRect().top / (signature.offsetHeight-height));
  signature.style.setProperty('--mask-scale', 1.8 - .8 * clamp(sp/.65));
  signature.style.setProperty('--signature-opacity', clamp((sp-.1)/.45));
  signature.style.setProperty('--chevron-offset', `${(1-clamp(sp/.8))*-35}px`);
  $('footer').style.setProperty('--footer-rise', `${(1-clamp((height-footerRect.top)/height))*65}px`);
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(draw);}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);draw();
const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}), {threshold:.12});
document.querySelectorAll('h2').forEach(heading=>{
  if(heading.closest('dialog')) return;
  const nodes=[...heading.childNodes];
  let line=document.createElement('span');line.className='line-clip';let inner=document.createElement('span');line.append(inner);
  const lines=[line];
  for(const node of nodes){if(node.nodeName==='BR'){line=document.createElement('span');line.className='line-clip';inner=document.createElement('span');line.append(inner);lines.push(line);}else inner.append(node);}
  heading.replaceChildren(...lines);lines.forEach((el,i)=>el.style.setProperty('--line-index',i));
  heading.classList.add('line-reveal');observer.observe(heading);
});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const menu = $('.menu');
const toggle = $('.menu-toggle');
function setMenu(open){document.body.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'关闭导航':'打开导航');menu.inert=!open;if(open)menu.querySelector('a').focus();}
toggle.addEventListener('click',()=>setMenu(!document.body.classList.contains('menu-open')));
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('menu-open')){setMenu(false);toggle.focus();}if(event.key==='Tab'&&document.body.classList.contains('menu-open')){const items=[toggle,...menu.querySelectorAll('a')];const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
const services={restoration:{label:'01 / FURNITURE RESTORATION',title:'留住故事，焕新质感。',copy:'从布艺更换、坐垫更新，到木质表面修复与重新饰面，我们会根据家具的材质、结构和实际状况，为你整理适合的翻新方向。欢迎准备家具照片、尺寸及期望效果，方便进一步评估。'},interiors:{label:'02 / INTERIOR DESIGN',title:'让空间，更懂生活。',copy:'从整体风格、色彩与材料，到家具搭配和空间布局，将你的生活习惯转化为舒适的空间。欢迎分享户型、现场照片及喜欢的风格，一起讨论适合你的装潢方案。'},bespoke:{label:'03 / COMPLETE TRANSFORMATION',title:'为家，开启新的篇章。',copy:'将现有家具与新的空间设计一同考虑，让家具翻新、配色和整体装潢自然衔接。根据现场条件、预算与时间安排，逐步明确适合的焕新范围。'}};
const dialog=$('#service-dialog');let selected='restoration';
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.service;const service=services[selected];$('#dialog-eyebrow').textContent=service.label;$('#dialog-title').textContent=service.title;$('#dialog-copy').textContent=service.copy;dialog.showModal();}));
const rows=[...document.querySelectorAll('.service-row')];
rows.forEach(row=>['pointerenter','focus'].forEach(type=>row.addEventListener(type,()=>rows.forEach(other=>other.classList.toggle('active',other===row)))));
$('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
$('#dialog-contact').addEventListener('click',()=>{dialog.close();$('select[name=service]').value=selected;});
$('#year').textContent=new Date().getFullYear();
$('#contact-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const service=$('select[name=service]').selectedOptions[0].textContent;$('#inquiry-output').value=`咨询项目：${service}\n姓名：${data.get('name').trim()}\n邮箱：${data.get('email').trim()}\n需求：${data.get('message').trim()}`;$('#form-result').hidden=false;$('#form-result').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'nearest'});});
$('#copy-inquiry').addEventListener('click',async event=>{try{await navigator.clipboard.writeText($('#inquiry-output').value);event.currentTarget.textContent='已复制 ✓';}catch{$('#inquiry-output').focus();$('#inquiry-output').select();event.currentTarget.textContent='请复制已选中的内容';}});
