/* currency — amount number -> display string (never stored as text) */
function fmt(n,c=S.cur){const a=Math.abs(n);if(c==='IDR')return 'Rp '+Math.round(a).toLocaleString('id-ID');if(c==='THB')return '฿'+a.toLocaleString('en-US',{maximumFractionDigits:2});return '$'+a.toLocaleString('en-US',{maximumFractionDigits:2})}
const signed=x=>(x.type==='income'?'+':'-')+fmt(x.amount,x.currency);
function parseAmt(s,c){s=String(s).trim();if(c==='IDR')return Number(s.replace(/\D/g,''))||0;const n=parseFloat(s.replace(',','.'));return isFinite(n)?n:0}
