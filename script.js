/* SkillCraft Pro - script.js
   Features: typewriter, counters, scroll spy, filters, carousel, dark mode, contact validation
*/

// ---------- util ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// ---------- theme toggle ----------
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

/* hamburger */
const hamburger = $('#hamburger');
const navLinks = $('#nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// close mobile menu on link click
$$('.nav-link').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ---------- typewriter ----------
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

// ---------- counters (animate on view) ----------
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

// ---------- scroll spy + navbar change ----------
const nav = $('#navbar');
const sections = $$('section[id]');
const navHeight = nav.getBoundingClientRect().height;
function onScrollSpy(){
  // navbar glass elevation
  nav.classList.toggle('scrolled', window.scrollY > 20);

  // active link
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

// ---------- reveal on scroll (intersection observer) ----------
const revealEls = $$('.fade-up');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // animate counters once when hero becomes visible
      if (!countersDone && entry.target.id === 'home') {
        animateCounters();
        countersDone = true;
      }
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// also ensure hero stats animate when home in view
revealObserver.observe($('#home'));

// ---------- portfolio filter ----------
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

// ---------- testimonials carousel ----------
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

// show initial
window.addEventListener('load', ()=> {
  // ensure slides layout
  showSlide(0);
});

// ---------- contact form validation (demo) ----------
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

// ---------- newsletter (demo) ----------
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

// ---------- small UI niceties ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ensure progress bars animate into view
const progSpans = $$('.progress span');
progSpans.forEach(s => s.style.width = s.style.width || s.getAttribute('style')?.match(/width:\s*(\d+%)/)?.[1] || '40%');

// keyboard accessibility: close mobile nav with Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') navLinks.classList.remove('open');
});

// very small: adjust carousel on resize
window.addEventListener('resize', ()=> showSlide(currentIndex));
