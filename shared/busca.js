/* Busca global do atlas: músculos, testes, alongamentos, amplitudes e sinais de alerta de todas as regiões.
   Os dados vêm de shared/indice.json (gerado por tools/gerar-indice.mjs). Abre com "/" ou Ctrl/Cmd+K. */
(function(){
  const RAIZ=new URL("../",document.currentScript.src).href;
  const TIPOS=[["musculo","Músculos"],["alongamento","Alongamentos"],["teste","Testes especiais"],["movimento","Amplitude de movimento"],["alerta","Sinais de alerta"]];
  const SINONIMOS={ciatico:"isquiatico",ciatica:"isquiatico",psoas:"iliopsoas",shoulder:"ombro",thigh:"coxa",hamstring:"isquiotibiais",hamstrings:"isquiotibiais",
    quad:"quadriceps",quads:"quadriceps",rotator:"manguito",abducao:"abdutor",gluteos:"gluteo",panturrilha:"perna",arm:"braco",biceps:"biceps",triceps:"triceps",
    cuff:"manguito",scapula:"escapula",impacto:"impingement"};
  const norm=s=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  let dados=null,carregando=null,dlg,inp,ul,res=[],ativo=0,abriu=null;

  const css=document.createElement("style");
  css.textContent=`
  .bs{position:fixed;inset:0;z-index:300;display:grid;align-items:start;justify-items:center;padding:max(12px,env(safe-area-inset-top,0px)) 12px 12px;background:rgba(8,14,22,.55);backdrop-filter:blur(4px)}
  .bs[hidden]{display:none}
  .bs-box{width:min(680px,100%);margin-top:6vh;max-height:min(80vh,720px);display:flex;flex-direction:column;background:var(--surface,#fff);color:var(--ink,#0f1d2b);border-radius:20px;box-shadow:0 24px 70px rgba(0,0,0,.45);overflow:hidden;border:1px solid var(--line,#d2dce6)}
  .bs-top{display:flex;gap:10px;align-items:center;padding:12px 14px;border-bottom:1px solid var(--line,#d2dce6)}
  .bs-top svg{flex:none;color:var(--muted,#53657a)}
  .bs-top input{flex:1;min-width:0;border:0;background:transparent;color:inherit;font:500 1.1rem var(--f-body,system-ui);padding:8px 2px;outline:none;min-height:44px}
  .bs-top button{flex:none;border:1.5px solid var(--line,#d2dce6);background:var(--surface2,#f4f7fa);color:var(--ink,#0f1d2b);border-radius:10px;padding:8px 12px;font:600 12px var(--f-mono,monospace);min-height:40px}
  .bs-lista{list-style:none;margin:0;padding:6px 8px 10px;overflow-y:auto;overscroll-behavior:contain;flex:1}
  .bs-grp{font:500 11.5px/1 var(--f-mono,monospace);letter-spacing:.12em;text-transform:uppercase;color:var(--muted,#53657a);padding:14px 10px 6px}
  .bs-lista a{display:grid;gap:2px;text-decoration:none;color:inherit;padding:10px 12px;border-radius:12px;min-height:48px}
  .bs-lista a[aria-selected=true],.bs-lista a:hover{background:var(--surface2,#f4f7fa);box-shadow:inset 0 0 0 1.5px var(--ink,#0f1d2b)}
  .bs-lista b{font:700 1rem var(--f-body,system-ui)}
  .bs-lista small{color:var(--muted,#53657a);font-size:.84rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .bs-vazio{padding:22px 18px;color:var(--muted,#53657a);font-size:.95rem}
  .bs-vazio b{color:var(--ink,#0f1d2b)}
  .bs-foot{padding:8px 14px;border-top:1px solid var(--line,#d2dce6);font:500 11.5px var(--f-mono,monospace);color:var(--muted,#53657a);display:flex;gap:14px;flex-wrap:wrap}
  @media (max-width:640px){.bs{padding:8px}.bs-box{margin-top:0;max-height:92vh}.bs-foot{display:none}}`;
  document.head.appendChild(css);

  function monta(){
    dlg=document.createElement("div");dlg.className="bs";dlg.hidden=true;
    dlg.innerHTML=`<div class="bs-box" role="dialog" aria-modal="true" aria-label="Buscar no atlas">
      <div class="bs-top"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
        <input type="search" role="combobox" aria-expanded="true" aria-controls="bs-lista" aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="Buscar músculo, teste, alongamento ou movimento" aria-label="Buscar no atlas">
        <button type="button" aria-label="Fechar a busca">Esc</button></div>
      <ul class="bs-lista" id="bs-lista" role="listbox" aria-label="Resultados"></ul>
      <div class="bs-foot"><span>↑ ↓ navegar</span><span>Enter abrir</span><span>Esc fechar</span></div></div>`;
    document.body.appendChild(dlg);
    inp=dlg.querySelector("input");ul=dlg.querySelector("ul");
    inp.addEventListener("input",()=>{ativo=0;mostra()});
    inp.addEventListener("keydown",e=>{
      if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();if(res.length){ativo=(ativo+(e.key==="ArrowDown"?1:-1)+res.length)%res.length;pinta()}}
      else if(e.key==="Enter"){e.preventDefault();if(res[ativo])ir(res[ativo])}
      else if(e.key==="Home"&&!inp.value){ativo=0;pinta()}
    });
    dlg.addEventListener("keydown",e=>{
      if(e.key==="Escape"){e.preventDefault();fechar()}
      if(e.key==="Tab"){ // mantém o foco dentro da caixa
        const f=[...dlg.querySelectorAll("input,button")].filter(x=>!x.disabled),i=f.indexOf(document.activeElement);
        if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}
      }
    });
    dlg.addEventListener("mousedown",e=>{if(e.target===dlg)fechar()});
    dlg.querySelector(".bs-top button").addEventListener("click",()=>fechar());
    ul.addEventListener("click",e=>{const a=e.target.closest("a[data-i]");if(a){e.preventDefault();ir(res[+a.dataset.i])}});
    ul.addEventListener("mousemove",e=>{const a=e.target.closest("a[data-i]");if(a&&+a.dataset.i!==ativo){ativo=+a.dataset.i;pinta(true)}});
  }

  function carrega(){
    if(dados)return Promise.resolve(dados);
    if(!carregando)carregando=fetch(RAIZ+"shared/indice.json").then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(d=>{
      d.itens.forEach(i=>{i._t=norm(i.titulo);i._s=norm(i.sub);i._x=norm(i.texto)});dados=d;return d});
    return carregando;
  }

  function busca(q){
    const toks=norm(q).split(/\s+/).filter(Boolean);if(!toks.length)return[];
    const out=[];
    for(const it of dados.itens){
      let total=0,ok=true;
      for(const t of toks){
        const vs=[t];if(SINONIMOS[t])vs.push(SINONIMOS[t]);
        let melhor=0;
        for(const v of vs){
          let p=0;
          if(it._t.startsWith(v)||it._t.includes(" "+v))p=100;else if(it._t.includes(v))p=60;else if(it._s.includes(v))p=30;else if(it._x.includes(v))p=10;
          if(p>melhor)melhor=p;
        }
        if(!melhor){ok=false;break}
        total+=melhor;
      }
      if(ok)out.push({it,total});
    }
    const ordem=Object.fromEntries(TIPOS.map((t,i)=>[t[0],i]));
    out.sort((a,b)=>b.total-a.total||ordem[a.it.t]-ordem[b.it.t]||a.it.titulo.localeCompare(b.it.titulo,"pt"));
    return out.map(x=>x.it);
  }

  function mostra(){
    if(!dados){ul.innerHTML='<li class="bs-vazio">Carregando…</li>';return}
    const q=inp.value.trim();
    if(!q){
      res=[];
      ul.innerHTML='<li class="bs-vazio"><b>Experimente:</b> deltoide · Thomas · quadríceps em pé · abdução · escápula alada · trombose</li>';
      inp.removeAttribute("aria-activedescendant");return;
    }
    const todos=busca(q);
    // no máximo 6 por grupo, mantendo a ordem de relevância dentro do grupo
    const porTipo=new Map();todos.forEach(i=>{const a=porTipo.get(i.t)||[];if(a.length<6)a.push(i);porTipo.set(i.t,a)});
    res=[];let html="";
    TIPOS.forEach(([t,nome])=>{
      const a=porTipo.get(t);if(!a)return;
      html+=`<li role="presentation" class="bs-grp">${nome}</li>`;
      a.forEach(i=>{html+=`<li role="presentation"><a href="${RAIZ}${i.url}" role="option" id="bs-r${res.length}" data-i="${res.length}" aria-selected="false"><b>${esc(i.titulo)}</b><small>${esc(i.sub)}</small></a></li>`;res.push(i)});
    });
    ul.innerHTML=res.length?html:`<li class="bs-vazio">Nada encontrado para <b>${esc(q)}</b>. Tente o nome do músculo, de um teste ou de um movimento.</li>`;
    ativo=Math.min(ativo,Math.max(0,res.length-1));pinta(true);
  }
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  function pinta(sem){
    ul.querySelectorAll("a[data-i]").forEach(a=>a.setAttribute("aria-selected",+a.dataset.i===ativo));
    const a=ul.querySelector(`#bs-r${ativo}`);
    if(a){inp.setAttribute("aria-activedescendant","bs-r"+ativo);if(!sem)a.scrollIntoView({block:"nearest"})}
    else inp.removeAttribute("aria-activedescendant");
  }

  function ir(it){
    if(!it)return;
    const alvo=new URL(RAIZ+it.url);
    fechar(true);
    if(alvo.pathname===location.pathname){
      const igual=location.hash===alvo.hash;location.hash=alvo.hash;
      if(igual&&window.aplicarUrl)window.aplicarUrl(true);
    }else location.href=alvo.href;
  }

  function abrir(q){
    if(!dlg)monta();
    abriu=document.activeElement;
    dlg.hidden=false;document.documentElement.style.overflow="hidden";
    inp.value=q||"";ativo=0;mostra();inp.focus();inp.select();
    carrega().then(()=>mostra()).catch(()=>{ul.innerHTML='<li class="bs-vazio">Não consegui carregar o índice de busca. Rode o site por um servidor HTTP e tente de novo.</li>'});
  }
  function fechar(naoFoco){
    if(!dlg||dlg.hidden)return;
    dlg.hidden=true;document.documentElement.style.overflow="";
    if(!naoFoco&&abriu&&abriu.focus)abriu.focus();
  }
  window.Busca={abrir,fechar};
})();
