/* Gera shared/indice.json (busca global e folheto) a partir dos dados que ficam dentro das páginas.
   Uso: com o site rodando em http://localhost:8000 (python3 -m http.server 8000), rode
     node tools/gerar-indice.mjs
   Precisa do Node 22+ e do Google Chrome (defina CHROME=/caminho/do/chrome se não for o do macOS). */
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const raiz=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const BASE=process.env.BASE||'http://localhost:8000';
const CHROME=process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const REGIOES={coxa:'Coxa',ombro:'Braço e ombro'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

const chrome=spawn(CHROME,['--headless=new','--remote-debugging-port=9444','--user-data-dir='+fs.mkdtempSync(path.join(os.tmpdir(),'idx-')),'about:blank'],{stdio:'ignore'});
let tabs;for(let i=0;i<60;i++){try{tabs=await (await fetch('http://localhost:9444/json')).json();if(tabs.length)break}catch{}await sleep(200)}
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let id=0;const pend={};ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pend[d.id])pend[d.id](d)};
const send=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}))});
const avalia=async e=>{const r=await send('Runtime.evaluate',{expression:e,awaitPromise:true,returnByValue:true});if(r.result?.exceptionDetails)throw new Error(JSON.stringify(r.result.exceptionDetails));return r.result.result.value};
await send('Runtime.enable');await send('Page.enable');

const EXTRAIR=`(()=>{
  const sem=h=>String(h??"").replace(/<[^>]+>/g,"");
  const mus=TODOS.map(x=>({id:x.id,nome:x.nome,lat:x.lat,origem:sem(x.origem),insercao:sem(x.insercao),nervo:sem(x.nervo),acao:sem(x.acao),quiz:x.quiz||"",
    resumo:sem((M[x.id]||X[x.id]||{}).resumo),
    modo:ORDER.includes(x.id)?"ilu":(typeof EXTRA!=="undefined"&&EXTRA.includes(x.id))?"3d":"grupo"}));
  const alo=Object.entries(X).filter(([k,x])=>x.at).map(([k,x])=>({id:k,musculo:x.nome,at:x.at,passos:x.passos,sente:x.sente,cuidado:x.cuidado,porque:x.porque||"",forte:x.forte||"",
    media:(typeof MEDIA!=="undefined"&&MEDIA[k])||k}));
  return {mus,alo,tempo:TEMPO,testes:CLIN.testes,rom:CLIN.rom,romMax:CLIN.romMax,alertas:CLIN.alertas};
})()`;

const itens=[],alongamentos=[];
for(const [reg,nome] of Object.entries(REGIOES)){
  await send('Page.navigate',{url:`${BASE}/${reg}/`});await sleep(3500);
  const d=await avalia(EXTRAIR);
  const url=h=>`${reg}/#${h}`;
  d.mus.forEach(m=>itens.push({t:'musculo',regiao:reg,titulo:m.nome,sub:`${nome} · ${m.lat}`,
    url:url(m.modo==='ilu'?`m=${m.id}`:m.modo==='3d'?`d=3d&m=${m.id}`:`x=${m.id}&s=secGroups`),
    texto:[m.lat,m.resumo,m.origem,m.insercao,m.nervo,m.acao,m.quiz].join(' ')}));
  d.alo.forEach(a=>{
    const ok=f=>fs.existsSync(path.join(raiz,reg,'img','alongamentos',f));
    const img=ok(a.media+'.jpg')?`${reg}/img/alongamentos/${a.media}.jpg`:null;
    itens.push({t:'alongamento',regiao:reg,titulo:a.at,sub:`${nome} · ${a.musculo}`,url:url(`x=${a.id}&s=secGroups`),texto:[a.musculo,a.passos.join(' '),a.sente,a.cuidado,a.porque].join(' ')});
    alongamentos.push({id:a.id,regiao:reg,regiaoNome:nome,musculo:a.musculo,at:a.at,passos:a.passos,sente:a.sente,cuidado:a.cuidado,porque:a.porque,forte:a.forte,img,tempo:d.tempo});
  });
  d.testes.forEach(t=>itens.push({t:'teste',regiao:reg,titulo:t.nome,sub:`${nome} · ${t.area} · sugere: ${t.sugere}`,url:url(`c=testes&t=${t.id}&s=secClinica`),texto:[t.sugere,t.como,t.positivo,t.nota||''].join(' ')}));
  d.rom.forEach(r=>itens.push({t:'movimento',regiao:reg,titulo:r.nome,sub:`${nome} · amplitude de referência ${r.ref[0]}–${r.ref[1]}°`,url:url('c=rom&s=secClinica'),texto:r.motor||''}));
  d.alertas.forEach(a=>itens.push({t:'alerta',regiao:reg,titulo:a.t,sub:`${nome} · sinal de alerta`,url:url('c=alerta&s=secClinica'),texto:a.d}));
}
chrome.kill();
const saida={versao:new Date().toISOString().slice(0,10),regioes:REGIOES,itens,alongamentos};
fs.writeFileSync(path.join(raiz,'shared','indice.json'),JSON.stringify(saida));
console.log(`shared/indice.json: ${itens.length} itens de busca, ${alongamentos.length} alongamentos (${(fs.statSync(path.join(raiz,'shared','indice.json')).size/1024).toFixed(0)} KB)`);
process.exit(0);
