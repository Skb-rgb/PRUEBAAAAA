const config = window.PORTFOLIO_CONFIG;
const stage = document.querySelector('.stage');
const viewer = document.querySelector('#character');
const sketch = document.querySelector('#sketch');
const sections = [...document.querySelectorAll('.screen')];
const dots = [...document.querySelectorAll('.steps a')];
const images = ['./assets/01-inicio.png', './assets/02-detalle.png', './assets/03-proyectos.png'];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const editing = new URLSearchParams(location.search).has('editar');
let active = -1;
let ticking = false;

function camera(view) {
  viewer.cameraOrbit = `${view.yaw}deg ${view.pitch}deg ${view.distance}m`;
  viewer.cameraTarget = `${view.x}m ${view.y}m ${view.z}m`;
}
function mix(a, b, t) { return a + (b - a) * t; }
function update() {
  const middle = innerHeight / 2;
  let index = 0, shortest = Infinity;
  sections.forEach((section, i) => {
    const rect = section.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height / 2 - middle);
    if (distance < shortest) { shortest = distance; index = i; }
  });
  if (index !== active) {
    active = index;
    sketch.src = images[index];
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    if (editing) syncEditor(index);
  }
  if (!stage.classList.contains('has-model')) return;
  const a = config.views[index];
  if (editing || reduced) { camera(a); return; }
  const rect = sections[index].getBoundingClientRect();
  const t = Math.max(0, Math.min(1, -rect.top / rect.height));
  const b = config.views[Math.min(index + 1, config.views.length - 1)];
  camera(Object.fromEntries(['yaw', 'pitch', 'distance', 'x', 'y', 'z']
    .map(key => [key, mix(a[key], b[key], t)])));
}
addEventListener('scroll', () => {
  if (!ticking) requestAnimationFrame(() => { update(); ticking = false; });
  ticking = true;
}, { passive: true });
addEventListener('resize', update);
document.querySelector('#year').textContent = new Date().getFullYear();

viewer.addEventListener('load', () => { stage.classList.add('has-model'); update(); }, { once: true });
viewer.addEventListener('error', () => { stage.classList.remove('has-model'); });
viewer.src = config.model;

const fields = [
  ['yaw', 'Giro horizontal', -180, 180, 1, '°'],
  ['pitch', 'Altura de cámara', 10, 170, 1, '°'],
  ['distance', 'Distancia / tamaño', 0.5, 5, 0.01, 'm'],
  ['x', 'Posición horizontal', -2, 2, 0.01, 'm'],
  ['y', 'Altura del encuadre', -1, 2.5, 0.01, 'm'],
  ['z', 'Profundidad', -2, 2, 0.01, 'm']
];
const panel = document.querySelector('#editor');
const select = document.querySelector('#view-select');
const sliders = document.querySelector('#editor-sliders');
function syncEditor(index) {
  select.value = String(index);
  fields.forEach(([key]) => {
    const input = sliders.querySelector(`[data-key="${key}"]`);
    input.value = config.views[index][key];
    input.nextElementSibling.textContent = input.value + input.dataset.unit;
  });
}
if (editing) {
  panel.hidden = false;
  sliders.innerHTML = fields.map(([key, label, min, max, step, unit]) =>
    `<label class="editor-field"><span>${label}</span><span class="editor-control"><input type="range" data-key="${key}" data-unit="${unit}" min="${min}" max="${max}" step="${step}"><output></output></span></label>`
  ).join('');
  select.addEventListener('change', () => {
    const index = Number(select.value);
    sections[index].scrollIntoView({ behavior: 'auto' });
    syncEditor(index);
    update();
  });
  sliders.addEventListener('input', event => {
    const input = event.target.closest('input[data-key]');
    if (!input) return;
    config.views[Number(select.value)][input.dataset.key] = Number(input.value);
    input.nextElementSibling.textContent = input.value + input.dataset.unit;
    camera(config.views[Number(select.value)]);
  });
  document.querySelector('#save-config').addEventListener('click', () => {
    const source = `// Configuración de encuadres del portafolio 3D.\nwindow.PORTFOLIO_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
    const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'config.js';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  syncEditor(0);
}
update();
