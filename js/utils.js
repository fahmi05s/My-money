/* utils — DOM, escaping, dates, toast */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* ---------- Utils ---------- */
const p2=n=>String(n).padStart(2,'0');
const ds=d=>d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
const parse=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const fd=s=>new Intl.DateTimeFormat(loc(),{day:'2-digit',month:'short',year:'numeric'}).format(parse(s));
function toast(m){const e=$('#toast');e.innerHTML='<div class="toast">'+esc(m)+'</div>';setTimeout(()=>e.innerHTML='',1800)}
