// Simple Pomodoro Timer
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const workInput = document.getElementById('work');
const shortInput = document.getElementById('short');
const longInput = document.getElementById('long');
const sessionEl = document.getElementById('session');

let state = {
  mode: 'work', // work | short | long
  running: false,
  intervalId: null,
  remaining: 25 * 60,
  cycles: 0
};

function formatTime(s){ const m = Math.floor(s/60); const sec = s%60; return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; }

function setMode(mode){
  state.mode = mode;
  if(mode==='work') state.remaining = Number(workInput.value || 25) * 60;
  if(mode==='short') state.remaining = Number(shortInput.value || 5) * 60;
  if(mode==='long') state.remaining = Number(longInput.value || 15) * 60;
  sessionEl.textContent = 'Session: ' + (mode==='work' ? 'Work' : mode==='short' ? 'Short Break' : 'Long Break');
  render();
}

function render(){ timerEl.textContent = formatTime(state.remaining); startBtn.disabled = state.running; pauseBtn.disabled = !state.running; }

function tick(){
  if(state.remaining<=0){
    // beep and switch
    try { new Notification('Pomodoro', { body: 'Session complete!' }); } catch(e) {}
    const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA='); // tiny silent wav to avoid auto-play issues
    audio.play().catch(()=>{});
    if(state.mode==='work'){ state.cycles++; if(state.cycles % 4 === 0) setMode('long'); else setMode('short'); }
    else setMode('work');
    return;
  }
  state.remaining--; render();
}

startBtn.addEventListener('click', ()=>{
  if(state.running) return;
  state.running = true;
  state.intervalId = setInterval(tick, 1000);
  render();
});

pauseBtn.addEventListener('click', ()=>{
  if(!state.running) return;
  state.running = false;
  clearInterval(state.intervalId);
  state.intervalId = null;
  render();
});

resetBtn.addEventListener('click', ()=>{
  state.running = false;
  clearInterval(state.intervalId);
  state.intervalId = null;
  state.cycles = 0;
  setMode('work');
});

// change durations live
[workInput, shortInput, longInput].forEach(inp=>inp.addEventListener('change', ()=>{
  // if currently in that mode, update remaining
  if(state.mode==='work' && inp===workInput) state.remaining = Number(inp.value||25)*60;
  if(state.mode==='short' && inp===shortInput) state.remaining = Number(inp.value||5)*60;
  if(state.mode==='long' && inp===longInput) state.remaining = Number(inp.value||15)*60;
  render();
}));

// initialize and request notification permission
setMode('work');
if('Notification' in window){ if(Notification.permission === 'default') Notification.requestPermission().catch(()=>{}); }
