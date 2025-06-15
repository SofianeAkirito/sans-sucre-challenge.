let startDate = new Date();
const now = new Date();
const target = new Date(now.getTime());
target.setDate(target.getDate() - ((now.getDay()+3)%7));
target.setHours(17,0,0,0);
startDate = target;
let interval = setInterval(updateChrono,1000);

function updateChrono(){
  const diff = Date.now() - startDate.getTime();
  const d = Math.floor(diff/86400000), h = new Date(diff).getUTCHours();
  const m = new Date(diff).getUTCMinutes(), s = new Date(diff).getUTCSeconds();
  document.getElementById('chrono').textContent = `${d}j ${h}h ${m}m ${s}s`;
}

const tasks = [
  document.getElementById('task-sophie'),
  document.getElementById('task-axelle'),
  document.getElementById('cheat')
];
tasks.forEach(cb => cb.addEventListener('change', onTask));
function onTask(){
  beep('task');
  const t = tasks.filter(i=>i.checked).length;
  const pct = Math.round(t/tasks.length*100);
  document.getElementById('progress-bar').value = pct;
  const who = this.id==='task-sophie'?'Sofiane': this.id==='task-axelle'?'Axelle':'Cheat';
  addSuccess(`${who} : ${this.checked?'OK':'KO'}`);
  if(pct===100) addSuccess('🎖 100 % complété aujourd\'hui');
}
function addSuccess(txt){
  document.getElementById('success-list').innerHTML += `<li>${txt}</li>`;
}

function toggleDark(){document.body.classList.toggle('dark');beep('toggle');}
exportToPDF = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(document.getElementById('chrono').textContent,20,20);
  doc.text('Progression : '+document.getElementById('progress-bar').value+'%',20,30);
  doc.save('SansSucre.pdf');
};

const sounds = {
  task: new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg'),
  toggle: new Audio('https://actions.google.com/sounds/v1/cartoon/slide_whistle_to_drum_hit.ogg')
};
function beep(t){ sounds[t]?.play(); }

// Initialisation
updateChrono();
document.write(`
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-jscalendar@1.4.5/source/jsCalendar.min.css">
<script src="https://cdn.jsdelivr.net/npm/simple-jscalendar@1.4.5/source/jsCalendar.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"><\/script>
`);
window.addEventListener('load',()=>{ new jsCalendar.new('#calendar'); beep(''); });
