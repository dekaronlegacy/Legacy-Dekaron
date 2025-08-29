const MAX_ONLINE = 200;
const SERVER_OFFSET_HOURS = 5;            // ajuste aqui
const CLIENT_SIZE_TEXT = '2,7 GB';
const EVENTS = [
  { title: 'Frente Morta', time: '01:00''05:00''09:00''013:00''15:00''21:00' },
 
];

const $ = (s) => document.querySelector(s);
const pad = (n) => String(n).padStart(2,'0');
const fmtTime = (d) => pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds());
const nowServer = () => { const d = new Date(); d.setHours(d.getHours()+SERVER_OFFSET_HOURS); return d; };

function tickClocks(){
  const local = new Date();
  const server = nowServer();
  $('#localTime').textContent = fmtTime(local);
  $('#serverTime').textContent = fmtTime(server);
  $('#lastUpdated').textContent = fmtTime(local);
}
function updateOnline(){
  const base = 18;
  const variance = Math.floor(Math.random()*10)-5;
  let online = Math.max(0, base+variance);
  if(online>MAX_ONLINE) online = MAX_ONLINE;
  $('#onlineNow').textContent = online;
  $('#onlineMax').textContent = MAX_ONLINE;
  $('#onlineBar').style.width = Math.round((online/MAX_ONLINE)*100)+'%';
}
function buildEvents(){
  const el = $('#eventsList'); el.innerHTML='';
  EVENTS.forEach(evt => {
    const row = document.createElement('div');
    row.className='event';
    row.innerHTML = `<div><div class="event__title">${evt.title}</div><div class="event__time">🕒 ${evt.time}</div></div><div class="event__eta" data-time="${evt.time}">--:--:--</div>`;
    el.appendChild(row);
  });
}
function tickEvents(){
  const now = nowServer();
  document.querySelectorAll('.event__eta').forEach(el => {
    const [hh, mm] = el.dataset.time.split(':').map(Number);
    const target = new Date(now); target.setHours(hh, mm, 0, 0);
    if(target<=now) target.setDate(target.getDate()+1);
    const diff = (target-now)/1000;
    const h = Math.floor(diff/3600), m = Math.floor((diff%3600)/60), s = Math.floor(diff%60);
    el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  });
}
function init(){
  $('#year').textContent = new Date().getFullYear();
  $('#clientSize').textContent = CLIENT_SIZE_TEXT;
  buildEvents(); tickClocks(); updateOnline(); tickEvents();
  setInterval(()=>{ tickClocks(); tickEvents(); },1000);
  setInterval(updateOnline,8000);
  $('#copyCal')?.addEventListener('click',()=>{
    const txt = EVENTS.map(e=>`${e.title} — ${e.time}`).join('\n');
    navigator.clipboard.writeText(txt);
    $('#copyCal').textContent='✅'; setTimeout(()=>$('#copyCal').textContent='📋',1200);
  });
}
document.addEventListener('DOMContentLoaded', init);