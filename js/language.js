/* language — t() / cn() / locale */
const t=k=>TR[S.lang][k]??k,cn=k=>TR[S.lang].cats[k];
const loc=()=>S.lang==='th'?'th-TH-u-ca-gregory':'id-ID';
