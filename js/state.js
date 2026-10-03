/* state — settings + UI state */
/* ---------- State ---------- */
const S=Object.assign({lang:(navigator.language||'').startsWith('th')?'th':'id',cur:'IDR',dark:matchMedia('(prefers-color-scheme:dark)').matches,week:1},getSettings());
Object.assign(S,{tab:'home',mode:'week',off:0,q:'',f:'all',day:''});
function saveSet(){saveSettings({lang:S.lang,cur:S.cur,dark:S.dark,week:S.week})}
