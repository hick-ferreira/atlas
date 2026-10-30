/* Barra de regiões compartilhada: adicione uma linha em REGIOES para cada nova região do atlas. */
(function(){
  const REGIOES=[
    {id:"coxa",nome:"Coxa",sub:"Quadríceps e grupos da coxa"},
    {id:"ombro",nome:"Braço e ombro",sub:"Deltoide, manguito, bíceps e tríceps"}
  ];
  const s=document.currentScript,base=new URL("../",s.src).href;
  const atual=(location.pathname.match(/\/(coxa|ombro)(\/|$)/)||[])[1]||"";
  const noFolheto=/\/folheto(\/|$)/.test(location.pathname);
  const css=document.createElement("style");
  css.textContent=`
  .rnav{position:sticky;top:0;z-index:50;margin:0 -16px;padding:8px 16px;background:color-mix(in srgb,var(--bg,#edf1f5) 88%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--line,#d2dce6)}
  .rnav-in{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:6px;overflow-x:auto;scrollbar-width:none}
  .rnav-in::-webkit-scrollbar{display:none}
  .rnav a{flex:none;text-decoration:none;color:var(--muted,#53657a);font:600 14px/1 var(--f-body,system-ui);padding:9px 14px;border-radius:999px;border:1.5px solid transparent;white-space:nowrap}
  .rnav a:hover{color:var(--ink,#0f1d2b)}
  .rnav a[aria-current=page]{background:var(--ink,#0f1d2b);color:var(--bg,#fff)}
  .rnav .home{font:800 15px/1 var(--f-display,system-ui);letter-spacing:-.01em;color:var(--ink,#0f1d2b);padding-right:12px;margin-right:6px;border-right:1px solid var(--line,#d2dce6);border-radius:0}
  .rnav .home[aria-current=page]{background:none;color:var(--ink,#0f1d2b)}
  .rnav .fim{margin-left:auto;flex:none;display:flex;gap:6px;align-items:center;padding-left:10px}
  .rnav .fl{display:flex;align-items:center;gap:7px}
  .rnav .bd{display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 6px;margin-left:6px;border-radius:99px;background:var(--ink,#0f1d2b);color:var(--bg,#fff);font:700 11px var(--f-mono,monospace)}
  .rnav a[aria-current=page] .bd{background:var(--bg,#fff);color:var(--ink,#0f1d2b)}
  .rnav-busca{flex:none;display:flex;align-items:center;gap:8px;border:1.5px solid color-mix(in srgb,var(--ink,#0f1d2b) 35%,var(--bg,#fff));background:var(--surface,#fff);color:var(--ink,#0f1d2b);border-radius:999px;padding:8px 14px;font:600 14px/1 var(--f-body,system-ui);cursor:pointer;min-height:38px}
  .rnav-busca:hover{border-color:var(--ink,#0f1d2b)}
  .rnav-busca kbd{font:600 11px var(--f-mono,monospace);border:1px solid var(--line,#d2dce6);border-radius:5px;padding:2px 6px;color:var(--muted,#53657a)}
  @media (max-width:640px){.rnav-busca span,.rnav-busca kbd,.rnav .t{display:none}.rnav-busca{padding:9px 12px}.rnav a{padding:9px 11px}.rnav .home{padding-right:10px;margin-right:2px}.rnav .fim{position:sticky;right:0;background:var(--bg,#edf1f5);padding-left:6px;margin-left:auto}.rnav .bd{margin-left:0}}`;
  css.textContent+=`
  .skip{position:absolute;left:8px;top:-64px;z-index:200;background:var(--ink,#0f1d2b);color:var(--bg,#fff);padding:10px 16px;border-radius:10px;font:600 14px var(--f-body,system-ui);text-decoration:none}
  .skip:focus{top:8px}`;
  document.head.appendChild(css);
  const nav=document.createElement("nav");nav.className="rnav";nav.setAttribute("aria-label","Regiões do atlas");
  nav.innerHTML='<div class="rnav-in"><a class="home" href="'+base+'"'+(atual?"":' aria-current="page"')+'>Atlas</a>'+
    REGIOES.map(r=>'<a href="'+base+r.id+'/" title="'+r.sub+'"'+(r.id===atual?' aria-current="page"':"")+'>'+r.nome+'</a>').join("")+
    '<span class="fim"><a class="fl" href="'+base+'folheto/"'+(noFolheto?' aria-current="page"':"")+' title="Folheto de exercícios para imprimir" aria-label="Folheto de exercícios"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4M10 12h6M10 16h6"/></svg><span class="t">Folheto</span><span class="bd" id="rnav-bd" hidden></span></a>'+
    '<button type="button" class="rnav-busca" aria-label="Buscar no atlas" aria-keyshortcuts="/"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><span>Buscar</span><kbd>/</kbd></button></span></div>';
  document.body.insertBefore(nav,document.body.firstChild);
  const sk=document.createElement("a");sk.className="skip";sk.href="#conteudo";sk.textContent="Pular para o conteúdo";
  sk.addEventListener("click",()=>{const m=document.getElementById("conteudo");if(m){m.focus();}});
  nav.insertBefore(sk,nav.firstChild);

  const medeNav=()=>document.documentElement.style.setProperty("--rnav-h",nav.offsetHeight+"px");
  medeNav();addEventListener("resize",medeNav);addEventListener("load",medeNav);

  /* busca global: o módulo só é baixado na primeira vez que alguém abre a busca */
  function carregaBusca(cb){
    if(window.Busca)return cb();
    const t=document.createElement("script");t.src=base+"shared/busca.js";t.onload=cb;document.head.appendChild(t);
  }
  const abrir=()=>carregaBusca(()=>window.Busca.abrir());
  nav.querySelector(".rnav-busca").addEventListener("click",abrir);
  window.abrirBusca=abrir;
  addEventListener("keydown",e=>{
    const el=document.activeElement,digitando=el&&(/^(input|textarea|select)$/i.test(el.tagName)||el.isContentEditable);
    if((e.key==="/"&&!digitando&&!e.ctrlKey&&!e.metaKey&&!e.altKey)||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k")){e.preventDefault();abrir()}
  });
  /* contador de exercícios no folheto */
  const bd=nav.querySelector("#rnav-bd");
  function conta(){let n=0;try{n=(JSON.parse(localStorage.getItem("atlas:folheto")||"[]")||[]).length}catch(e){}bd.hidden=!n;bd.textContent=n}
  conta();addEventListener("folheto-mudou",conta);addEventListener("storage",conta);
})();
