/* ui — views, forms, modals, events */
/* ---------- Views ---------- */
function txRow(x){return `<button class="tx" data-a="open" data-id="${x.id}"><span class="ic" aria-hidden="true">${ICON[x.category]||'📦'}</span><span class="m"><b>${esc(x.description)}</b><small>${x.paymentMethod==='cash'?'💵 '+t('cash'):'📱 '+t('scan')} · ${fd(x.date)}</small></span><span class="amt ${x.type==='income'?'pos':'neg'}">${signed(x)}</span></button>`}
function empty(m){return `<div class="empty">${esc(m)}</div>`}
function home(){const l=mine(),inc=sum(l,'income'),exp=sum(l,'expense'),ym=ds(new Date()).slice(0,7),mo=l.filter(x=>x.date.startsWith(ym)),mi=sum(mo,'income'),me=sum(mo,'expense');
return `<div class="card hero"><div class="l">${t('balance')}</div><div class="big">${inc-exp<0?'-':''}${fmt(inc-exp)}</div><div class="l" style="margin-top:10px">${t('thisMonth')}</div><div class="row3"><div>${t('income')}<b>${fmt(mi)}</b></div><div>${t('expense')}<b>${fmt(me)}</b></div><div>${t('left')}<b>${mi-me<0?'-':''}${fmt(mi-me)}</b></div></div></div>
<div class="sec">${t('recent')}</div>${l.length?sorted(l).slice(0,6).map(txRow).join(''):empty(t('empty'))}`}
function history(){const fs=['all','income','expense','cash','scan'],q=S.q.toLowerCase();
let l=sorted(mine()).filter(x=>(S.f==='all'||x.type===S.f||x.paymentMethod===S.f)&&(!S.day||x.date===S.day)&&(!q||x.description.toLowerCase().includes(q)||cn(x.category).toLowerCase().includes(q)));
let out='',last='';l.forEach(x=>{if(x.date!==last){last=x.date;out+=`<div class="date">${fd(x.date)}</div>`}out+=txRow(x)});
return `<label for="q" class="sr" style="margin-top:0">🔍 ${t('search')}</label><input id="q" type="search" value="${esc(S.q)}" placeholder="🔍 ${t('search')}">
<div class="chips" role="group">${fs.map(f=>`<button class="chip ${S.f===f?'on':''}" data-a="flt" data-v="${f}">${f==='all'?t('all'):f==='income'?t('income'):f==='expense'?t('expense'):t(f)}</button>`).join('')}</div>
<label for="dayf">${t('date')}</label><input id="dayf" type="date" value="${S.day}"><div id="hl">${out||empty(t('noData'))}</div>`}
function settings(){const o=(v,a,txt)=>`<option value="${v}" ${a===v?'selected':''}>${txt}</option>`;
return `<div class="card"><div class="set"><label for="sl" style="margin:0">🌐 ${t('language')}</label><select id="sl" data-s="lang">${o('th',S.lang,'🇹🇭 ไทย')}${o('id',S.lang,'🇮🇩 Indonesia')}</select></div>
<div class="set"><label for="sc" style="margin:0">💱 ${t('currency')}</label><select id="sc" data-s="cur">${o('IDR',S.cur,'IDR — Rupiah')}${o('THB',S.cur,'THB — Baht')}${o('USD',S.cur,'USD — Dollar')}</select></div>
<p class="sub" style="margin:0 0 8px">${t('note')}</p>
<div class="set"><label for="sd" style="margin:0">🌙 ${t('dark')}</label><input id="sd" type="checkbox" data-s="dark" ${S.dark?'checked':''} style="width:28px;height:28px;min-height:0"></div>
<div class="set"><label for="sw" style="margin:0">📅 ${t('weekStart')}</label><select id="sw" data-s="week">${o('1',String(S.week),t('mon'))}${o('0',String(S.week),t('sun'))}</select></div></div>
<div class="card"><b>💾 ${t('export')}</b><button class="btn s" data-a="csv">${t('exportBtn')}</button><button class="btn d" data-a="wipe">🗑 ${t('delAll')}</button></div>
${installCard()}<p class="sub" style="text-align:center">My Money · v1</p>`}
const VIEWS={home,summary,history,settings};
function render(){document.documentElement.lang=S.lang;document.documentElement.dataset.theme=S.dark?'dark':'light';document.querySelector('meta[name=theme-color]').content=S.dark?'#0d1714':'#0f3d34';
const titles={home:'My Money',summary:t('summary'),history:t('history'),settings:t('settings')};
$('#app').innerHTML=`<div class="top"><div><h1>${titles[S.tab]}</h1>${S.tab==='home'?`<p class="sub">${t('sub')}</p>`:''}</div></div>`+VIEWS[S.tab]();
const nv=[['home','🏠'],['summary','📊'],['gap'],['history','🧾'],['settings','⚙️']];
$('#nav').innerHTML=nv.map(n=>n[0]==='gap'?'<span class="gap"></span>':`<button class="t ${S.tab===n[0]?'on':''}" data-a="tab" data-v="${n[0]}" ${S.tab===n[0]?'aria-current="page"':''}><span aria-hidden="true">${n[1]}</span>${t(n[0])}</button>`).join('');
$('#fab').setAttribute('aria-label',t('addT'))}
/* ---------- Modal / form ---------- */
let F={};
function sheet(h){$('#sheet').innerHTML=h;$('#modal').classList.add('open')}
function closeM(){$('#modal').classList.remove('open')}
function openForm(x){F=x?{id:x.id,type:x.type,method:x.paymentMethod,cur:x.currency,date:x.date,time:x.time,cat:x.category}:{type:'expense',method:'',cur:S.cur};drawForm(x?{a:String(x.amount),d:x.description}:{a:'',d:''});$('#fa').focus()}
function drawForm(v){const e=F.type==='expense',pm=(k,ic)=>`<button type="button" class="${F.method===k?'on':''}" data-a="pm" data-v="${k}" aria-pressed="${F.method===k}">${ic} ${t(k)}</button>`;
sheet(`<h2 style="margin:0 0 12px;font-size:1.1rem">${F.id?t('editT'):t('addT')}</h2>
<div class="seg"><button class="e ${e?'on':''}" data-a="ty" data-v="expense">${t('expense')}</button><button class="i ${e?'':'on'}" data-a="ty" data-v="income">${t('income')}</button></div>
<label for="fa">${t('amount')} (${F.cur})</label><input id="fa" class="amtin" inputmode="decimal" autocomplete="off" placeholder="${fmt(25000,F.cur)}" value="${esc(v.a)}">
<label>${e?t('payWith'):t('recvVia')}</label><div class="pm">${pm('cash','💵')}${pm('scan','📱')}</div>
<label for="fd">${e?t('buy'):t('from')}</label><input id="fd" autocomplete="off" value="${esc(v.d)}" placeholder="${e?'Nasi Ayam':'Salary'}">
${F.id?`<label for="fc">${t('category')}</label><select id="fc">${Object.keys(ICON).map(k=>`<option value="${k}" ${F.cat===k?'selected':''}>${ICON[k]} ${cn(k)}</option>`).join('')}</select>`:''}
<div class="err" id="er" role="alert"></div><button class="btn" data-a="save">${t('save')}</button><button class="btn s" data-a="close">${t('cancel')}</button>`)}
function submit(){const a=parseAmt($('#fa').value,F.cur),d=$('#fd').value.trim();let er='';
if(!(a>0))er=t('eAmt');else if(!d)er=t('eDesc');else if(!F.method)er=t('eMeth');else if(!['IDR','THB','USD'].includes(F.cur))er='Currency?';
if(er){$('#er').textContent=er;return}
const n=new Date(),old=F.id,x={id:old||uid(),amount:a,type:F.type,description:d,paymentMethod:F.method,currency:F.cur,category:old?$('#fc').value:categorize(d,F.type),date:old?F.date:ds(n),time:old?F.time:p2(n.getHours())+':'+p2(n.getMinutes())};
(old?updateTransaction(x):addTransaction(x));closeM();toast(t('saved'));render()}
function detail(id){const x=getTransactions().find(v=>v.id===id);if(!x)return;const r=(k,v)=>`<div class="dt"><span class="sub">${k}</span><b>${v}</b></div>`;
sheet(`<h2 style="margin:0 0 8px;font-size:1.1rem">${t('details')}</h2><div class="amt ${x.type==='income'?'pos':'neg'}" style="font-size:1.8rem">${signed(x)}</div>
${r(t('type'),x.type==='income'?t('income'):t('expense'))}${r('',esc(x.description))}${r(t('method'),x.paymentMethod==='cash'?'💵 '+t('cash'):'📱 '+t('scan'))}${r(t('category'),ICON[x.category]+' '+esc(cn(x.category)))}${r(t('date'),fd(x.date))}${r(t('time'),x.time)}
<button class="btn" data-a="edit" data-id="${id}">${t('edit')}</button><button class="btn d" data-a="askdel" data-id="${id}">${t('del')}</button><button class="btn s" data-a="close">${t('close')}</button>`)}
function confirmBox(msg,act,id){sheet(`<p style="font-weight:700;font-size:1.05rem">${esc(msg)}</p><button class="btn d" data-a="${act}" data-id="${id||''}">${t('del')}</button><button class="btn s" data-a="close">${t('cancel')}</button>`)}
/* ---------- Events ---------- */
const A={tab:e=>{S.tab=e.dataset.v;render();scrollTo(0,0)},add:()=>openForm(),close:closeM,open:e=>detail(e.dataset.id),
edit:e=>openForm(getTransactions().find(x=>x.id===e.dataset.id)),askdel:e=>confirmBox(t('confirmDel'),'del',e.dataset.id),del:e=>{deleteTransaction(e.dataset.id);closeM();toast(t('deleted'));render()},
wipe:()=>confirmBox(t('confirmAll'),'wipe2'),wipe2:()=>{clearTransactions();closeM();toast(t('deleted'));render()},csv:()=>{try{exportCsv()}catch(e){toast(t('eCsv'))}},save:submit,
pm:e=>{F.method=e.dataset.v;drawForm({a:$('#fa').value,d:$('#fd').value});$('#fd').focus()},ty:e=>{F.type=e.dataset.v;drawForm({a:$('#fa').value,d:$('#fd').value})},
mode:e=>{S.mode=e.dataset.v;S.off=0;render()},pg:e=>{S.off+=+e.dataset.v;render()},flt:e=>{S.f=e.dataset.v;render()}};
document.addEventListener('click',e=>{if(e.target.id==='modal')return closeM();const a=e.target.closest('[data-a]');if(a&&A[a.dataset.a])A[a.dataset.a](a)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeM();if(e.key==='Enter'&&e.target.closest('#sheet')&&e.target.tagName==='INPUT'&&$('#fa'))submit()});
document.addEventListener('change',e=>{const k=e.target.dataset.s;if(k){S[k]=k==='dark'?e.target.checked:k==='week'?+e.target.value:e.target.value;saveSet();render()}if(e.target.id==='dayf'){S.day=e.target.value;render()}});
document.addEventListener('input',e=>{if(e.target.id==='q'){S.q=e.target.value;const p=e.target.selectionStart;render();const q=$('#q');q.focus();q.setSelectionRange(p,p)}});
