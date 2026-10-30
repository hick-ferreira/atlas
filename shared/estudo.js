/* Ferramentas de estudo compartilhadas: perguntas de múltipla escolha sobre todos os músculos e a tabela-resumo com busca.
   Cada página passa uma lista de itens: {id, nome, lat, cor, origem, insercao, nervo, acao, quiz} e uma função abrir(id). */
const CSS=`
.sr-only{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.es-quiz{padding:18px;display:grid;gap:16px}
.es-bar{height:8px;border-radius:999px;background:color-mix(in srgb,var(--ink) 10%,transparent);overflow:hidden}
.es-bar i{display:block;height:100%;width:0;background:var(--ink);transition:width .25s}
.es-meta{display:flex;justify-content:space-between;gap:10px;font:500 13px var(--f-mono);color:var(--muted)}
.es-q{font:700 clamp(1.15rem,2.6vw,1.5rem)/1.25 var(--f-display);text-wrap:balance}
.es-tipo{font:500 11.5px/1 var(--f-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.es-opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}
.es-opts button{display:flex;align-items:center;gap:10px;text-align:left;border:1.5px solid var(--line);background:var(--surface);border-radius:14px;padding:12px 14px;min-height:54px;font-weight:600;font-size:.98rem}
.es-opts button:hover:not(:disabled){border-color:var(--ink)}
.es-opts button b{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:var(--surface2);font:700 12px var(--f-mono);color:var(--muted)}
.es-opts button.ok{border-color:var(--ok,#14863f);background:color-mix(in srgb,var(--ok,#14863f) 16%,transparent)}
.es-opts button.no{border-color:var(--bad,#c42b2b);background:color-mix(in srgb,var(--bad,#c42b2b) 14%,transparent)}
.es-opts button:disabled{cursor:default}
.es-fb{border-radius:14px;padding:14px 16px;background:var(--surface2);min-height:78px;font-size:.95rem}
.es-fb.good{background:color-mix(in srgb,var(--ok,#14863f) 16%,transparent);border:1px solid var(--ok,#14863f)}
.es-fb.bad{background:color-mix(in srgb,var(--bad,#c42b2b) 14%,transparent);border:1px solid var(--bad,#c42b2b)}
.es-btn{justify-self:start;border:1.5px solid var(--ink);background:var(--ink);color:var(--bg);border-radius:999px;padding:11px 22px;font-weight:600;min-height:44px}
.es-btn:disabled{opacity:.4;cursor:default}
.es-rev{display:flex;flex-wrap:wrap;gap:8px}
.es-rev button{border:1.5px solid var(--line);background:var(--surface);border-radius:999px;padding:7px 14px;font-weight:600;font-size:.88rem;min-height:38px}
.es-rev button:hover{border-color:var(--ink)}
.es-find{display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:14px 18px 0}
.es-find input{flex:1;min-width:200px;border:1.5px solid color-mix(in srgb,var(--ink) 55%,var(--surface));background:var(--surface);color:var(--ink);border-radius:999px;padding:11px 16px;font:inherit;min-height:44px}
.es-find input:focus{outline:2px solid var(--ink);outline-offset:1px}
.es-find span{font:500 12px var(--f-mono);color:var(--muted)}
.es-tab{width:100%;border-collapse:collapse;min-width:0;font-size:.92rem}
.es-tab th{position:sticky;top:0;background:var(--surface);text-align:left;font:500 11px var(--f-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--muted);padding:12px 10px;border-bottom:1px solid var(--line)}
.es-tab td{padding:12px 10px;vertical-align:top;border-bottom:1px solid var(--line)}
.es-tab td:first-child{white-space:nowrap;font-weight:700}
.es-tab td:first-child button{border:0;background:none;padding:0;font:inherit;font-weight:700;color:var(--ink);cursor:pointer;display:flex;gap:8px;align-items:center;text-align:left}
.es-tab td:first-child button::before{content:"";width:10px;height:10px;border-radius:50%;background:var(--c);flex:none}
.es-tab td:first-child button:hover{text-decoration:underline}
.es-tab td:first-child::before{display:none!important}
.es-tab tr[hidden]{display:none}
.es-vazio{padding:22px;color:var(--muted);text-align:center}
@media (max-width:760px){
  .es-tab thead{display:none}
  .es-tab,.es-tab tbody,.es-tab tr,.es-tab td{display:block;width:100%}
  .es-tab tr{border:1.5px solid var(--line);border-left:5px solid var(--c);border-radius:14px;margin:0 0 10px;padding:10px 12px;background:var(--surface)}
  .es-tab td{border:0;padding:4px 0}
  .es-tab td[data-l]::before{content:attr(data-l);display:block;font:500 11.5px/1 var(--f-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:2px}
  .es-tab td:first-child{white-space:normal;font-size:1.05rem}
  .es-tab td:first-child button::before{display:none}
  .es-wrap{padding:12px 14px 4px}
}
`;
const norm=s=>String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const emb=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const txt=h=>String(h).replace(/<[^>]+>/g,"");
function css(){if(!document.getElementById("es-css")){const s=document.createElement("style");s.id="es-css";s.textContent=CSS;document.head.appendChild(s)}}

/* ---------- perguntas de múltipla escolha ---------- */
export function mountDesafio(o){
  css();
  const root=o.root,N=Math.min(o.n||10,o.itens.length);
  const KEY="atlas:"+(o.reg||"x")+":mcq",EKEY="atlas:"+(o.reg||"x")+":erros";
  const ler=(k,pad)=>{try{return JSON.parse(localStorage.getItem(k))??pad}catch(e){return pad}};
  const gravar=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  let rodada=[],i=0,acertos=0,erros=[],respondida=false;
  const comClue=o.itens.filter(x=>x.quiz);
  const nervos=[...new Set(o.itens.map(x=>x.nervo).filter(Boolean))];

  function monta(){
    // músculos que a pessoa mais errou voltam com mais chance
    const err=ler(EKEY,{});
    const pesos=o.itens.map(x=>({x,p:1+Math.min(4,(err[x.id]||0)*2)}));
    const pool=[];
    while(pool.length<N&&pesos.length){
      const tot=pesos.reduce((a,b)=>a+b.p,0);let r=Math.random()*tot,k=0;
      for(;k<pesos.length;k++){r-=pesos[k].p;if(r<=0)break}
      pool.push(pesos.splice(Math.min(k,pesos.length-1),1)[0].x);
    }
    return pool.map(x=>{
      const nervoOk=x.nervo&&nervos.length>=4&&Math.random()<.3;
      if(nervoOk){
        const outros=emb(nervos.filter(n=>n!==x.nervo)).slice(0,3);
        return{x,tipo:"Inervação",texto:`Qual nervo inerva o ${x.nome.toLowerCase()}?`,opcoes:emb([x.nervo,...outros]),certa:x.nervo,exp:`<b>${x.nome}:</b> ${x.nervo}.`};
      }
      const clue=x.quiz||`Origem: ${txt(x.origem)}`;
      const outros=emb(o.itens.filter(y=>y.id!==x.id&&y.nome!==x.nome)).slice(0,3);
      return{x,tipo:"Qual músculo é?",texto:clue,opcoes:emb([x.nome,...outros.map(y=>y.nome)]),certa:x.nome,exp:`${x.acao?`Ação: ${txt(x.acao)}.`:""} ${x.insercao?`Inserção: ${txt(x.insercao)}.`:""}`};
    });
  }

  function mostra(){
    const q=rodada[i];respondida=false;
    root.innerHTML=`<div class="es-bar"><i style="width:${Math.round(i/rodada.length*100)}%"></i></div>
      <div class="es-meta"><span>Pergunta ${i+1} de ${rodada.length}</span><span>Acertos: ${acertos}${ler(KEY,0)?` · recorde ${ler(KEY,0)}`:""}</span></div>
      <div class="es-tipo">${q.tipo}</div>
      <div class="es-q">${q.texto}</div>
      <div class="es-opts" role="group" aria-label="Alternativas">${q.opcoes.map((t,k)=>`<button data-k="${k}"><b>${"ABCD"[k]}</b><span>${t}</span></button>`).join("")}</div>
      <div class="es-fb" role="status">Escolha uma alternativa.</div>
      <button class="es-btn" disabled>${i===rodada.length-1?"Ver resultado":"Próxima"}</button>`;
  }
  function responde(k){
    if(respondida)return;respondida=true;
    const q=rodada[i],bts=[...root.querySelectorAll(".es-opts button")],ok=q.opcoes[k]===q.certa;
    bts.forEach((b,j)=>{b.disabled=true;if(q.opcoes[j]===q.certa)b.classList.add("ok");else if(j===k)b.classList.add("no")});
    const fb=root.querySelector(".es-fb");fb.className="es-fb "+(ok?"good":"bad");
    fb.innerHTML=(ok?"Certo, é o <b>"+q.x.nome+"</b>. ":"Quase. A resposta é <b>"+q.certa+"</b>. ")+(q.tipo==="Inervação"?(ok?"":q.x.nome+" é inervado por esse nervo."):q.exp);
    if(ok)acertos++;else erros.push(q.x);
    const err=ler(EKEY,{});
    if(ok){if(err[q.x.id]>0)err[q.x.id]--}else err[q.x.id]=(err[q.x.id]||0)+1;
    gravar(EKEY,err);
    root.querySelector(".es-btn").disabled=false;
    root.querySelector(".es-btn").focus({preventScroll:true});
  }
  function fim(){
    const melhor=ler(KEY,0),novo=acertos>melhor;if(novo)gravar(KEY,acertos);
    const pct=acertos/rodada.length;
    root.innerHTML=`<div class="es-bar"><i style="width:100%"></i></div>
      <div class="es-q">Você acertou ${acertos} de ${rodada.length}.${melhor?(novo?` Novo recorde (antes: ${melhor}).`:` Seu recorde: ${melhor}.`):""}</div>
      <div class="es-fb">${pct>=.8?"Você já domina bem esses músculos. Tente achá-los com as mãos e revisar os testes relacionados.":pct>=.5?"Bom caminho. Revise os músculos que escaparam.":"Releia as fichas e volte: os músculos que você errou aparecem com mais frequência nas próximas rodadas."}</div>
      ${erros.length?`<div><div class="es-tipo" style="margin-bottom:8px">Rever</div><div class="es-rev">${erros.map(x=>`<button data-r="${x.id}">${x.nome}</button>`).join("")}</div></div>`:""}
      <button class="es-btn" data-novo>Jogar de novo</button>`;
  }
  function inicia(){rodada=monta();i=0;acertos=0;erros=[];mostra()}
  root.classList.add("es-quiz");
  root.addEventListener("click",e=>{
    const b=e.target.closest(".es-opts button");if(b){responde(+b.dataset.k);return}
    const r=e.target.closest("[data-r]");if(r){o.abrir(r.dataset.r);return}
    if(e.target.closest("[data-novo]")){inicia();return}
    if(e.target.closest(".es-btn")&&respondida){if(i>=rodada.length-1)fim();else{i++;mostra()}}
  });
  root.addEventListener("keydown",e=>{
    if(respondida||!/^[1-4a-dA-D]$/.test(e.key))return;
    const k=isNaN(e.key)?"abcd".indexOf(e.key.toLowerCase()):+e.key-1;
    if(root.querySelectorAll(".es-opts button")[k])responde(k);
  });
  inicia();
  return{reiniciar:inicia};
}

/* ---------- tabela-resumo com busca ---------- */
export function mountResumo(o){
  css();
  const root=o.root;
  root.innerHTML=`<div class="es-find"><input type="search" placeholder="Buscar por músculo, origem, nervo ou ação" aria-label="Buscar na tabela"><span></span></div>
    <div class="es-wrap" style="padding:8px 10px 10px;overflow-x:auto"><table class="es-tab"><caption class="sr-only">Resumo de todos os músculos: origem, inserção, inervação e ação</caption><thead><tr><th>Músculo</th><th>Origem</th><th>Inserção</th><th>Inervação</th><th>Ação</th></tr></thead><tbody>${
    o.itens.map(x=>`<tr data-id="${x.id}" style="--c:${x.cor}"><td><button data-id="${x.id}" title="Abrir a ficha">${x.nome}</button></td><td data-l="Origem">${x.origem||""}</td><td data-l="Inserção">${x.insercao||""}</td><td data-l="Inervação">${x.nervo||""}</td><td data-l="Ação">${x.acao||""}</td></tr>`).join("")}</tbody></table>
    <div class="es-vazio" hidden>Nenhum músculo encontrado.</div></div>`;
  const inp=root.querySelector("input"),cont=root.querySelector(".es-find span"),vazio=root.querySelector(".es-vazio");
  const linhas=[...root.querySelectorAll("tbody tr")].map(tr=>({tr,t:norm(tr.textContent)}));
  function filtra(){
    const q=norm(inp.value.trim());let n=0;
    linhas.forEach(l=>{const ok=!q||l.t.includes(q);l.tr.hidden=!ok;if(ok)n++});
    cont.textContent=n+" de "+linhas.length;vazio.hidden=n>0;
  }
  inp.addEventListener("input",filtra);filtra();
  root.addEventListener("click",e=>{const b=e.target.closest("button[data-id]");if(b)o.abrir(b.dataset.id)});
}
