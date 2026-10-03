/* transactions — categorize, queries, CSV export */
function categorize(d,type){if(type==='income')return 'income';const s=d.toLowerCase();for(const k in KW)if(k!=='income'&&KW[k].some(w=>s.includes(w)))return k;return 'other'}
const mine=()=>getTransactions().filter(x=>x.currency===S.cur);
const sum=(l,ty)=>l.filter(x=>x.type===ty).reduce((a,x)=>a+x.amount,0);
const sorted=l=>l.slice().sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
const uid=()=>(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2));
function exportCsv(){const q=v=>'"'+String(v).replace(/"/g,'""')+'"',h=['ID','Date','Time','Type','Description','Amount','Currency','Payment Method','Category'],
rows=sorted(getTransactions()).map(x=>[x.id,x.date,x.time,x.type,x.description,x.amount,x.currency,x.paymentMethod,x.category].map(q).join(','));
const b=new Blob(['\ufeff'+[h.join(','),...rows].join('\r\n')],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='my-money-'+ds(new Date())+'.csv';document.body.appendChild(a);a.click();a.remove()}
