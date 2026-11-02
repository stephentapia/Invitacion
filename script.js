const DESTINATARIO = 'stephentapia10@gmail.com';
const ENDPOINT = `https://formsubmit.co/ajax/${DESTINATARIO}`;

let selectedFood = '';
const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];

function show(id) {
  steps.forEach(s => document.getElementById(s).classList.toggle('hidden', s !== id));
}

function accept() {
  show('step2');
  const bar = document.getElementById('bar'), pct = document.getElementById('percent');
  let n = 0;
  const timer = setInterval(() => {
    n += 5;
    bar.style.width = n + '%';
    pct.textContent = n + '%';
    if (n >= 100) { clearInterval(timer); setTimeout(() => show('step3'), 350); }
  }, 90);
}

function nope() {
  const b = document.getElementById('noBtn');
  b.textContent = '¿Segura? 🥺';
  b.style.transform = `translate(${Math.random() * 100 - 50}px,${Math.random() * 50 - 25}px)`;
}

function nextDate() {
  const value = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  if (!value) { alert('Elige una fecha primero 💗'); return; }
  if (!time) { alert('Elige una hora para la cita 🕒'); return; }
  const chosen = new Date(value + 'T12:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (chosen < today) { alert('Elige una fecha de hoy en adelante 😊'); return; }
  show('step4');
}

function chooseFood(el, food) {
  document.querySelectorAll('.food').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');
  selectedFood = food;
}

function confirmFood() {
  if (!selectedFood) { alert('Elige algo rico para comer 🍕'); return; }
  const value = document.getElementById('date').value;
  document.getElementById('finalDate').textContent =
    new Date(value + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  document.getElementById('finalTime').textContent = document.getElementById('time').value;
  document.getElementById('finalFood').textContent = selectedFood;
  show('step5');
  enviarCorreo(); // se envía automáticamente al confirmar
}

async function enviarCorreo() {
  const status = document.getElementById('sendStatus');
  const btn = document.getElementById('sendBtn');
  const date = document.getElementById('finalDate').textContent;
  const time = document.getElementById('finalTime').textContent;

  btn.classList.add('hidden');
  status.className = 'status';
  status.textContent = 'Enviando invitación... ⏳';

  const payload = {
    _subject: '¡Nuestra cita está agendada! 💗',
    _template: 'table',
    _captcha: 'false',
    Fecha: date,
    Hora: time,
    Comida: selectedFood,
    Mensaje: '¡Tenemos una cita! Nos vemos 🥰'
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || 'Error al enviar');
    status.className = 'status ok';
    status.textContent = '¡Invitación enviada! ✅';
  } catch (err) {
    console.error(err);
    status.className = 'status error';
    status.textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.';
    btn.classList.remove('hidden');
  }
}

// Permitir agendar únicamente desde hoy hasta el último día del mes actual.
const dateInput = document.getElementById('date');
const now = new Date();
const localISODate = d => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
dateInput.min = localISODate(now);
dateInput.max = localISODate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
