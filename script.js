
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));


const themeBtn = $('#theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') body.classList.add('dark');
updateThemeIcon();

themeBtn.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
  updateThemeIcon();
});
function updateThemeIcon(){
  const icon = themeBtn.querySelector('i');
  if (!icon) return;
  icon.className = body.classList.contains('dark') ? 'fa-regular fa-sun' : 'fa-regular fa-moon';
}


const hamburger = $('#hamburger');
const navLinks = $('#nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

$$('.nav-link').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

const words = ['Developer', 'Designer', 'Creator', 'Problem Solver'];
const typeEl = $('#typewriter');
let twIndex = 0, chIndex = 0, forward = true;
function typeLoop(){
  const word = words[twIndex];
  if (forward){
    chIndex++;
    if (chIndex > word.length) { forward = false; setTimeout(typeLoop, 900); return; }
  } else {
    chIndex--;
    if (chIndex < 0) { forward = true; twIndex = (twIndex+1)%words.length; setTimeout(typeLoop,400); return; }
  }
  typeEl.textContent = word.substring(0,chIndex);
  setTimeout(typeLoop, forward ? 120 : 60);
}
if (typeEl) typeLoop();

const counters = $$('.stat-num');
function animateCounters(){
  counters.forEach(el => {
    const target = +el.dataset.target;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 80));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { el.textContent = target; clearInterval(timer); }
      else el.textContent = current;
    }, 16);
  });
}
let countersDone = false;

const nav = $('#navbar');
const sections = $$('section[id]');
const navHeight = nav.getBoundingClientRect().height;
function onScrollSpy(){
  nav.classList.toggle('scrolled', window.scrollY > 20);

  const fromTop = window.scrollY + navHeight + 20;
  sections.forEach(section => {
    const id = section.id;
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const link = $(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (fromTop >= top && fromTop < top + height) {
      $$('.nav-link').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}
window.addEventListener('scroll', onScrollSpy);
onScrollSpy();

const revealEls = $$('.fade-up');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (!countersDone && entry.target.id === 'home') {
        animateCounters();
        countersDone = true;
      }
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

revealObserver.observe($('#home'));

const filterBtns = $$('.filter-btn');
const portGrid = $('#portfolio-grid');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  const items = $$('.port-item');
  items.forEach(it => {
    if (filter === 'all' || it.dataset.type === filter) {
      it.style.display = '';
      setTimeout(()=> it.classList.add('visible'), 20);
    } else {
      it.style.display = 'none';
      it.classList.remove('visible');
    }
  });
}));

const track = document.querySelector('.carousel-track');
const slides = $$('.testimonial');
let currentIndex = 0;
const prevBtn = $('#prev'), nextBtn = $('#next');

function showSlide(idx){
  const width = slides[0].getBoundingClientRect().width + 12; // gap
  track.style.transform = `translateX(-${idx * width}px)`;
}
function nextSlide(){
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}
function prevSlide(){
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
}
nextBtn.addEventListener('click', ()=>{ nextSlide(); resetAuto(); });
prevBtn.addEventListener('click', ()=>{ prevSlide(); resetAuto(); });

let autoCarousel = setInterval(nextSlide, 4000);
function resetAuto(){
  clearInterval(autoCarousel);
  autoCarousel = setInterval(nextSlide, 4000);
}

window.addEventListener('load', ()=> {
  showSlide(0);
});

const contactForm = $('#contact-form');
if (contactForm) {
  const errName = $('#err-name'),
        errEmail = $('#err-email'),
        errMsg = $('#err-message'),
        formFeedback = $('#form-feedback');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();

    [errName, errEmail, errMsg].forEach(x=>x.textContent='');

    if (name.length < 2) { errName.textContent = 'Please enter your name'; ok=false; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { errEmail.textContent = 'Please enter a valid email'; ok=false; }
    if (message.length < 8) { errMsg.textContent = 'Message must be at least 8 characters'; ok=false; }

    if (!ok) return;

    formFeedback.hidden = false;
    formFeedback.textContent = 'Sending…';
    setTimeout(()=>{
      formFeedback.textContent = 'Thanks! Your message has been received (demo).';
      contactForm.reset();
      setTimeout(()=> formFeedback.hidden = true, 3000);
    }, 1000);
  });
}

const newsletterForm = $('#newsletter-form');
if (newsletterForm) {
  const newsMsg = $('#newsletter-msg');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsMsg.hidden = false;
    newsMsg.textContent = 'Subscribed successfully! (demo)';
    newsletterForm.reset();
    setTimeout(()=> newsMsg.hidden = true, 3000);
  });}

document.getElementById('year').textContent = new Date().getFullYear();

const progSpans = $$('.progress span');
progSpans.forEach(s => s.style.width = s.style.width || s.getAttribute('style')?.match(/width:\s*(\d+%)/)?.[1] || '40%');

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') navLinks.classList.remove('open');
});

window.addEventListener('resize', ()=> showSlide(currentIndex));

