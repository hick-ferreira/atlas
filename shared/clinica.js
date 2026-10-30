/* Seção "Avaliação clínica" compartilhada: amplitudes de referência, testes especiais, sinais de alerta e fontes.
   Cada página passa os dados (o.rom, o.testes, o.alertas, o.refs) e uma função para abrir a ficha de um músculo. */
const CSS=`
.cl{padding:0;overflow:clip}
.cl-top{padding:18px 18px 0;display:grid;gap:12px}
.cl-note{font-size:.88rem;color:var(--muted);border-left:4px solid var(--line);padding:2px 0 2px 12px}
.cl-bar2{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.cl-link{border:1.5px solid var(--line);background:var(--surface);border-radius:999px;padding:8px 14px;font-size:.84rem;font-weight:600;color:var(--ink)}
.cl-link:hover{border-color:var(--ink)}
.cl-tabs{display:flex;gap:4px;background:var(--surface2);padding:4px;border-radius:12px;overflow-x:auto;scrollbar-width:none;width:fit-content;max-width:100%}
.cl-tabs::-webkit-scrollbar{display:none}
.cl-tabs button{flex:none;border:0;background:transparent;border-radius:9px;padding:9px 16px;font-weight:600;font-size:.92rem;color:var(--muted);white-space:nowrap}
.cl-tabs button[aria-selected=true]{background:var(--surface);color:var(--ink);box-shadow:0 1px 3px rgba(0,0,0,.14)}
.cl-pane{padding:18px}
.cl-pane[hidden]{display:none}
.cl-rom{display:grid;gap:10px;margin:0;padding:0;list-style:none}
.cl-rom li{display:grid;grid-template-columns:minmax(120px,190px) 1fr;gap:6px 16px;align-items:center;padding:20px 12px 10px;border-radius:12px;background:var(--surface2)}
.cl-rom b{font-weight:600}
.cl-bar{position:relative;height:12px;border-radius:999px;background:color-mix(in srgb,var(--ink) 10%,transparent)}
.cl-bar i{position:absolute;left:0;top:0;bottom:0;border-radius:999px;background:var(--cl-c,#4a6cf0)}
.cl-bar span{position:absolute;right:0;top:-20px;font:500 12px var(--f-mono);color:var(--muted)}
.cl-rom small{grid-column:1/-1;color:var(--muted);font-size:.84rem}
.cl-callout{margin-top:14px;border-radius:14px;padding:12px 14px;background:color-mix(in srgb,var(--cl-c,#4a6cf0) 12%,var(--surface2));font-size:.92rem}
.cl-filter{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin-bottom:12px;padding-bottom:2px}
.cl-filter::-webkit-scrollbar{display:none}
.cl-filter button{flex:none;border:1.5px solid var(--line);background:var(--surface);border-radius:999px;padding:7px 14px;font-size:.86rem;font-weight:600;color:var(--muted)}
.cl-filter button[aria-pressed=true]{background:var(--ink);border-color:var(--ink);color:var(--bg)}
.cl-list{display:grid;gap:8px}
.cl-test{border:1.5px solid var(--line);border-radius:14px;background:var(--surface);scroll-margin-top:calc(var(--rnav-h,52px) + 70px)}
.cl-test[open]{border-color:var(--ink)}
.cl-test summary{list-style:none;cursor:pointer;display:grid;gap:4px;padding:12px 14px;min-height:48px}
.cl-test summary::-webkit-details-marker{display:none}
.cl-test summary b{font:700 1.02rem var(--f-display)}
.cl-test summary small{color:var(--muted);font-size:.84rem}
.cl-tag{justify-self:start;font:500 11px/1 var(--f-mono);letter-spacing:.08em;text-transform:uppercase;padding:5px 9px;border-radius:999px;background:var(--surface2);color:var(--muted)}
.cl-body{padding:0 14px 14px;display:grid;gap:10px;font-size:.94rem}
.cl-body h4{margin:0 0 2px;font:500 11.5px/1 var(--f-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.cl-body p{margin:0}
.cl-chips{display:flex;flex-wrap:wrap;gap:6px}
.cl-chips button{border:1.5px solid var(--line);background:var(--surface2);border-radius:999px;padding:6px 12px;font-size:.84rem;font-weight:600;min-height:36px}
.cl-chips button:hover{border-color:var(--ink)}
.cl-alert{display:grid;gap:10px;margin:0;padding:0;list-style:none}
.cl-alert li{border-radius:14px;padding:12px 14px;background:color-mix(in srgb,var(--bad,#c42b2b) 10%,var(--surface2));border-left:5px solid var(--bad,#c42b2b)}
.cl-alert b{display:block;margin-bottom:2px}
.cl-refs{margin:0;padding-left:1.2em;display:grid;gap:8px;font-size:.9rem;color:var(--muted)}
.cl-refs i{color:var(--ink)}
@media (max-width:640px){.cl-top,.cl-pane{padding-left:14px;padding-right:14px}.cl-rom li{grid-template-columns:1fr}.cl-bar{margin-top:6px}}
`;
const esc=s=>String(s??"").replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));

export function mountClinica(o){
  if(!document.getElementById("cl-css")){const s=document.createElement("style");s.id="cl-css";s.textContent=CSS;document.head.appendChild(s)}
  const root=o.root;root.classList.add("cl");
  if(o.cor)root.style.setProperty("--cl-c",o.cor);
  const abas=[["rom","Amplitude"],["testes","Testes"],["alerta","Alertas"],["fontes","Fontes"]];
  const areas=["Todos",...new Set(o.testes.map(t=>t.area))];
  const nomeX=id=>(o.nomeX&&o.nomeX(id))||id;
  root.innerHTML=`
  <div class="cl-top">
    <div class="cl-note">${o.aviso||"Conteúdo educativo, não é diagnóstico. Nenhum teste isolado confirma uma condição: compare com o lado sem dor e combine os achados."}</div>
    <div class="cl-bar2"><div class="cl-tabs" role="tablist" aria-label="Avaliação clínica">${abas.map(([k,n],i)=>`<button role="tab" data-p="${k}" aria-selected="${i===0}">${n}</button>`).join("")}</div><button class="cl-link" data-a="link" title="Copiar o link desta tela">Copiar link</button></div>
  </div>
  <div class="cl-pane" data-pane="rom">
    <ul class="cl-rom">${o.rom.map(r=>`<li><b>${esc(r.nome)}</b><div class="cl-bar" role="img" aria-label="${esc(r.nome)}: ${r.ref[0]} a ${r.ref[1]} graus"><i style="width:${Math.round(r.ref[1]/o.romMax*100)}%"></i><span>${r.ref[0]}–${r.ref[1]}°</span></div>${r.motor?`<small>Principais: ${esc(r.motor)}</small>`:""}</li>`).join("")}</ul>
    ${o.romNota?`<div class="cl-callout">${o.romNota}</div>`:""}
    <p class="cl-note" style="margin-top:14px">${o.romFonte||"Valores de referência (AAOS) medidos com goniômetro. Variam com idade, sexo e método; compare sempre com o outro lado."}</p>
  </div>
  <div class="cl-pane" data-pane="testes" hidden>
    <div class="cl-filter" role="group" aria-label="Filtrar por estrutura">${areas.map((a,i)=>`<button data-a="${esc(a)}" aria-pressed="${i===0}">${esc(a)}</button>`).join("")}</div>
    <div class="cl-list">${o.testes.map(t=>`<details class="cl-test" id="t-${t.id}" data-a="${esc(t.area)}"><summary><span class="cl-tag">${esc(t.area)}</span><b>${esc(t.nome)}</b><small>Sugere: ${esc(t.sugere)}</small></summary>
      <div class="cl-body"><div><h4>Como fazer</h4><p>${t.como}</p></div><div><h4>Positivo se</h4><p>${t.positivo}</p></div>
      ${t.nota?`<div><h4>Atenção</h4><p>${t.nota}</p></div>`:""}
      ${t.alvo&&t.alvo.length?`<div><h4>Músculos relacionados</h4><div class="cl-chips">${t.alvo.map(x=>`<button data-x="${x}">${esc(nomeX(x))}</button>`).join("")}</div></div>`:""}
      <div><button class="cl-link" data-rep="Teste: ${esc(t.nome)}">Reportar erro neste teste</button></div></div></details>`).join("")}</div>
  </div>
  <div class="cl-pane" data-pane="alerta" hidden>
    <p class="cl-note" style="margin-bottom:12px">Estes sinais pedem avaliação médica antes de qualquer alongamento ou exercício. Em caso de dor no peito, falta de ar ou déficit neurológico súbito, procure atendimento de urgência.</p>
    <ul class="cl-alert">${o.alertas.map(a=>`<li><b>${esc(a.t)}</b>${a.d}</li>`).join("")}</ul>
  </div>
  <div class="cl-pane" data-pane="fontes" hidden>
    <ol class="cl-refs">${o.refs.map(r=>`<li>${r}</li>`).join("")}</ol>
    <p class="cl-note" style="margin-top:14px">Material de estudo. Confira as edições atuais e valide o conteúdo clínico com um profissional antes de usá-lo em atendimento.</p>
  </div>`;

  if(window.Estado)Estado.setas(root.querySelector(".cl-tabs"));
  const $$=s=>[...root.querySelectorAll(s)];
  function aba(k,quieto){
    $$(".cl-tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.p===k));
    $$(".cl-pane").forEach(p=>p.hidden=p.dataset.pane!==k);
    if(!quieto&&o.onState)o.onState({c:k==="rom"?null:k,t:null});
  }
  function filtro(a){
    $$(".cl-filter button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.a===a));
    $$(".cl-test").forEach(d=>d.hidden=!(a==="Todos"||d.dataset.a===a));
  }
  root.addEventListener("click",e=>{
    const rp=e.target.closest("[data-rep]");if(rp&&window.Estado){Estado.reportar(rp.dataset.rep);return}
    if(e.target.closest("[data-a=link]")){if(window.Estado)Estado.copiar();return}
    const t=e.target.closest(".cl-tabs button");if(t){aba(t.dataset.p);return}
    const f=e.target.closest(".cl-filter button");if(f){filtro(f.dataset.a);return}
    const x=e.target.closest(".cl-chips button");if(x&&o.onMuscle)o.onMuscle(x.dataset.x);
  });
  // guarda no link qual teste está aberto
  root.addEventListener("toggle",e=>{const d=e.target;if(!d.classList||!d.classList.contains("cl-test")||!o.onState)return;o.onState(d.open?{c:"testes",t:d.id.slice(2)}:{t:null})},true);
  return{
    restaurar(c,t){
      if(c&&abas.some(a=>a[0]===c))aba(c,true);
      if(t){const d=root.querySelector("#t-"+t);if(d){aba("testes",true);filtro("Todos");d.open=true;return d}}
    },
    openTest(id){
      aba("testes",true);filtro("Todos");
      const d=root.querySelector("#t-"+id);if(!d)return;
      d.open=true;
      requestAnimationFrame(()=>d.scrollIntoView({behavior:(window.SUAVE||"smooth"),block:"center"}));
    }
  };
}
