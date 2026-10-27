/* Barra de regiões compartilhada: adicione uma linha em REGIOES para cada nova região do atlas. */
(function(){
  const REGIOES=[
    {id:"coxa",nome:"Coxa",sub:"Quadríceps e grupos da coxa"},
    {id:"ombro",nome:"Braço e ombro",sub:"Deltoide, manguito, bíceps e tríceps"}
  ];
  const s=document.currentScript,base=new URL("../",s.src).href;
  const atual=(location.pathname.match(/\/(coxa|ombro)(\/|$)/)||[])[1]||"";
  const css=document.createElement("style");
  css.textContent=`
  .rnav{position:sticky;top:0;z-index:50;margin:0 -16px;padding:8px 16px;background:color-mix(in srgb,var(--bg,#edf1f5) 88%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--line,#d2dce6)}
  .rnav-in{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:6px;overflow-x:auto;scrollbar-width:none}
  .rnav-in::-webkit-scrollbar{display:none}
  .rnav a{flex:none;text-decoration:none;color:var(--muted,#53657a);font:600 14px/1 var(--f-body,system-ui);padding:9px 14px;border-radius:999px;border:1.5px solid transparent;white-space:nowrap}
  .rnav a:hover{color:var(--ink,#0f1d2b)}
  .rnav a[aria-current=page]{background:var(--ink,#0f1d2b);color:var(--bg,#fff)}
  .rnav .home{font:800 15px/1 var(--f-display,system-ui);letter-spacing:-.01em;color:var(--ink,#0f1d2b);padding-right:12px;margin-right:6px;border-right:1px solid var(--line,#d2dce6);border-radius:0}
  .rnav .home[aria-current=page]{background:none;color:var(--ink,#0f1d2b)}`;
  document.head.appendChild(css);
  const nav=document.createElement("nav");nav.className="rnav";nav.setAttribute("aria-label","Regiões do atlas");
  nav.innerHTML='<div class="rnav-in"><a class="home" href="'+base+'"'+(atual?"":' aria-current="page"')+'>Atlas</a>'+
    REGIOES.map(r=>'<a href="'+base+r.id+'/" title="'+r.sub+'"'+(r.id===atual?' aria-current="page"':"")+'>'+r.nome+'</a>').join("")+'</div>';
  document.body.insertBefore(nav,document.body.firstChild);
})();
