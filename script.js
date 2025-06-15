let startDate, interval, PIN = localStorage.getItem('sugarPIN');

// PIN : vérifie à chaque chargement
window.onload = () => {
  if (PIN) {
    const p = prompt('Entre ton PIN pour démarrer');
    if (p !== PIN) return alert('PIN incorrect. Réouvre la page.');
  }
  init();
};

function init(){
  document.write(`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-jscalendar@1.4.5/source/jsCalendar.min.css">
    <script src="https://cdn.jsdelivr.net/npm/simple-jscalendar@1.4.5/source/jsCalendar.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"><\/script>
  `);
  setTimeout(() => new jsCalendar.new('#calendar'), 500);
  Notification.requestPermission();
}

// chrono
function startTracking() {
  const v = document.getElementById('start-date').value;
  if (!v) return alert('Choisis une date !');
  startDate = new Date(v);
  clearInterval(interval);
  updateChrono();
  interval = setInterval(updateChrono, 1000);
  beep('start');
  addSuccess('🕒 Chrono lancé !');
}
function updateChrono(){
  const diff = new Date() - startDate;
  const d = Math.floor(diff / 86400000),
    h = new Date(diff).getUTCHours(),
    m = new Date(diff).getUTCMinutes(),
    s = new Date(diff).getUTCSeconds();
  document.getElementById('chrono').textContent = `${d}j ${h}h ${m}m ${s}s`;
}

// tâches & progression
function onTask(cb) {
  updateProgress();
  if(cb.checked){ beep('task'); addSuccess('✅ Tâche cochée !'); }
}
function updateProgress(){
  const tasks = document.querySelectorAll('#task-list input');
  const done = [...tasks].filter(i=>i.checked).length;
  const pct = Math.round(done/tasks.length*100);
  document.getElementById('done-count').textContent = done;
  document.getElementById('total-count').textContent = tasks.length;
  document.getElementById('progress-bar').value = pct;
  if(pct===100){ addBadge('🎖️ 100 % réussi !'); sendNote('Bravo pour tes 100 % !'); }
}

// badges
function addSuccess(txt){document.getElementById('success-list').innerHTML += `<li>${txt}</li>`;}
function addBadge(txt){ addSuccess(txt); beep('badge'); }

// mode sombre
function toggleDark(){document.body.classList.toggle('dark'); beep('toggle');}

// sons
const sounds = {
  start: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'),
  task: new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg'),
  badge: new Audio('https://actions.google.com/sounds/v1/cartoon/rooster_crow.ogg'),
  toggle: new Audio('https://actions.google.com/sounds/v1/cartoon/slide_whistle_to_drum_hit.ogg')
};
function beep(type){ sounds[type]?.play(); }

// notifications
function sendNote(msg){
  if(Notification.permission==='granted')
    new Notification('Sans Sucre Challenge', { body: msg });
}

// export PDF
function exportToPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(document.getElementById('chrono').textContent,20,20);
  doc.text('Progression: '+document.getElementById('progress-bar').value+'%',20,30);
  doc.save('SansSucreChallenge.pdf');
}

// PIN
function savePIN(){
  const v = document.getElementById('pin-input').value;
  if(!v) return alert('Entre un PIN valide');
  localStorage.setItem('sugarPIN', v);
  alert('PIN enregistré ✅');
}

// sauvegarde JSON
function exportData(){
  const data = {
    startDate: startDate?.toISOString(),
    tasks: [...document.querySelectorAll('#task-list input')].map(i=>i.checked),
    progress: document.getElementById('progress-bar').value
  };
  const a = document.createElement('a');
  a.href = 'data:application/json,' + encodeURIComponent(JSON.stringify(data));
  a.download = 'sans-sucre-data.json';
  a.click();
}
function importData(){
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = '.json';
  inp.onchange = e => {
    const f = e.target.files[0];
    if(!f) return;
    const r = new FileReader();
    r.onload = () => {
      const d = JSON.parse(r.result);
      startDate = new Date(d.startDate);
      document.getElementById('start-date').value = startDate.toISOString().slice(0,16);
      d.tasks.forEach((v,i)=>{
        document.querySelectorAll('#task-list input')[i].checked = v;
      });
      document.getElementById('progress-bar').value = d.progress;
      updateProgress();
    };
    r.readAsText(f);
  };
  inp.click();
}
