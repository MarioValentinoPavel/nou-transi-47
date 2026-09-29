/* Nou Transi 47 — carretera: semáforo de salida, la calzada avanza con el scroll y el velocímetro marca la velocidad */
gsap.registerPlugin(ScrollTrigger);
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- semáforo ---------- */
const lights = $$('.light__box i');
document.documentElement.style.overflow = 'hidden';
let driving = false;
gsap.timeline({ delay: .3 })
  .add(() => lights[0].classList.add('on'))
  .add(() => { lights[0].classList.remove('on'); lights[1].classList.add('on'); }, .6)
  .add(() => { lights[1].classList.remove('on'); lights[2].classList.add('on'); }, 1.1)
  .to('#light', { yPercent: -100, duration: .8, ease: 'power3.in', onStart: () => { driving = true; } }, 1.5)
  .add(() => { $('#light').remove(); document.documentElement.style.overflow = ''; })
  .from('#gantry', { y: -200, opacity: 0, duration: 1, ease: 'back.out(1.4)' }, '-=.3')
  .from('.hero__txt > *', { y: 40, opacity: 0, duration: .8, stagger: .1, ease: 'expo.out' }, '-=.5');

/* ---------- calzada + velocímetro ---------- */
const plane = $('#plane'), needle = $('#needle'), arc = $('#speedArc'), kmh = $('#kmh');
let off = 0, v = 0, shown = 0;
ScrollTrigger.create({ onUpdate: s => { v = Math.abs(s.getVelocity()); } });
gsap.ticker.add((t, dt) => {
  const speed = driving ? 30 + Math.min(110, v / 25) : 0;
  v *= .9;
  shown += (speed - shown) * .08;
  off += shown * dt / 1000 * 14;
  plane.style.setProperty('--off', (off % 170).toFixed(1) + 'px');
  const k = Math.round(shown), f = Math.min(1, shown / 140);
  kmh.textContent = k;
  needle.style.transform = `rotate(${-90 + f * 180}deg)`;
  arc.style.strokeDashoffset = (157 * (1 - f)).toFixed(1);
});

/* ---------- a la brasa ---------- */
const D = [['g02', 'Costillas a la barbacoa', 'La favorita de la casa'], ['g14', 'Entrecot con patatas', 'Buena carne, sin rodeos'], ['g21', 'Parrillada de carne', 'Para compartir (o no)'], ['g06', 'Hamburguesa completa', 'Con huevo, bacon y patatas'], ['g20', 'Butifarra con ensalada', 'A la brasa, como siempre'], ['g25', 'Parrillada de verduras', 'Berenjena, pimiento y calabacín'], ['g29', 'Croquetas caseras', 'Para abrir boca'], ['g16', 'Pollo de la casa', 'Jugoso y con su salsa']];
$('#dishes').innerHTML = D.map(([s, t, d], i) => `<figure class="dish"><span class="dish__km">KM ${i + 1}</span><img src="assets/maps/${s}.jpg" alt="${t}" loading="lazy"><figcaption>${t}<small>${d}</small></figcaption></figure>`).join('');
$('#strip').innerHTML = ['maps/g04', 'fb/f01', 'maps/g17', 'maps/g26', 'maps/g12'].map(s => `<img src="assets/${s}.jpg" alt="Nou Transi 47" loading="lazy">`).join('');

$$('.head, .dish, .warn, .services article, .strip img, .reviews blockquote, .llegar > *').forEach(n => gsap.from(n, { y: 50, opacity: 0, duration: .9, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: n, start: 'top 90%', once: true } }));
