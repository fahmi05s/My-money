/* summary — weekly / monthly summary views */
function catBlock(l){const e=l.filter(x=>x.type==='expense'),tot=sum(e,'expense');if(!tot)return empty(t('noData'));const m={};e.forEach(x=>m[x.category]=(m[x.category]||0)+x.amount);
return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([k,v])=>{const p=Math.round(v/tot*100);return `<div class="cat"><div class="h"><span>${ICON[k]||'📦'} ${esc(cn(k))}</span><span>${p}% · ${fmt(v)}</span></div><div class="bar"><i style="width:${p}%"></i></div></div>`}).join('')}
function summary(){const w=S.mode==='week',now=new Date();let label,l,chart;
if(w){const dow=(now.getDay()-S.week+7)%7,st=new Date(now.getFullYear(),now.getMonth(),now.getDate()-dow+S.off*7),days=[...Array(7)].map((_,i)=>ds(new Date(st.getFullYear(),st.getMonth(),st.getDate()+i)));
const f=new Intl.DateTimeFormat(loc(),{day:'numeric',month:'short'});label=f.format(st)+' – '+f.format(parse(days[6]));l=mine().filter(x=>x.date>=days[0]&&x.date<=days[6]);
const v=days.map(d=>sum(l.filter(x=>x.date===d),'expense')),mx=Math.max(...v,1),wf=new Intl.DateTimeFormat(loc(),{weekday:'short'});
chart=`<div class="sec" style="margin-top:4px">${t('byDay')}</div><div class="bars">${v.map((n,i)=>`<div title="${fmt(n)}"><i style="height:${n/mx*100*.8}%"></i>${wf.format(parse(days[i]))}</div>`).join('')}</div>`}
else{const m=new Date(now.getFullYear(),now.getMonth()+S.off,1),k=m.getFullYear()+'-'+p2(m.getMonth()+1);label=new Intl.DateTimeFormat(loc(),{month:'long',year:'numeric'}).format(m);l=mine().filter(x=>x.date.startsWith(k));
const a=sum(l,'income'),b=sum(l,'expense'),mx=Math.max(a,b,1);chart=`<div class="bars" style="height:110px"><div><i class="in" style="height:${a/mx*80}%"></i>${t('income')}</div><div><i style="height:${b/mx*80}%"></i>${t('expense')}</div></div>`}
const inc=sum(l,'income'),exp=sum(l,'expense');
return `<div class="seg" role="tablist"><button class="${w?'on':''}" data-a="mode" data-v="week">${t('weekly')}</button><button class="${w?'':'on'}" data-a="mode" data-v="month">${t('monthly')}</button></div>
<div class="pager"><button data-a="pg" data-v="-1" aria-label="prev">‹</button><span>${esc(label)}</span><button data-a="pg" data-v="1" aria-label="next">›</button></div>
<div class="card"><div class="row3" style="margin:0;color:var(--ink)"><div style="background:var(--bg)">${t('income')}<b class="pos">${fmt(inc)}</b></div><div style="background:var(--bg)">${t('expense')}<b class="neg">${fmt(exp)}</b></div><div style="background:var(--bg)">${t('left')}<b>${inc-exp<0?'-':''}${fmt(inc-exp)}</b></div></div>${chart}</div>
<div class="card"><b>${t('byCat')}</b>${catBlock(l)}</div>`}
