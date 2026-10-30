/* Estado da página: links diretos (hash da URL) e memória do que o usuário fez (localStorage).
   Chaves do hash: m = músculo, v = vista 3D, x = ficha de grupo, c = aba clínica, t = teste, s = seção.
   Só m, x e v são lembrados entre visitas; o resto vale apenas para o link. */
(function(){
  const reg=(location.pathname.match(/\/(coxa|ombro)(\/|$)/)||[])[1]||"home";
  const KEY="atlas:"+reg,LEMBRAR=["m","x","v"];
  const lerUrl=()=>{const o={};new URLSearchParams(location.hash.slice(1)).forEach((v,k)=>{o[k]=v});return o};
  const lerSalvo=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch(e){return{}}};
  const salvo=lerSalvo();
  let atual=lerUrl();
  function gravar(patch){
    Object.assign(atual,patch);
    Object.keys(atual).forEach(k=>{if(atual[k]==null||atual[k]==="")delete atual[k]});
    const h=new URLSearchParams(atual).toString();
    try{history.replaceState(null,"",location.pathname+location.search+(h?"#"+h:""))}catch(e){}
    try{
      const mem=Object.assign({},salvo);
      LEMBRAR.forEach(k=>{if(k in patch){if(patch[k])mem[k]=patch[k];else delete mem[k]}});
      Object.assign(salvo,mem);
      localStorage.setItem(KEY,JSON.stringify(mem));
    }catch(e){}
  }
  function aviso(txt){
    let t=document.getElementById("est-toast");
    if(!t){
      const st=document.createElement("style");
      st.textContent="#est-toast{position:fixed;left:50%;bottom:max(20px,env(safe-area-inset-bottom));transform:translate(-50%,20px);background:var(--ink,#0f1d2b);color:var(--bg,#fff);padding:10px 16px;border-radius:999px;font:600 .9rem var(--f-body,system-ui);box-shadow:0 6px 24px rgba(0,0,0,.35);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;z-index:200}#est-toast.on{opacity:1;transform:translate(-50%,0)}";
      document.head.appendChild(st);
      t=document.createElement("div");t.id="est-toast";t.setAttribute("role","status");document.body.appendChild(t);
    }
    t.textContent=txt;t.classList.add("on");clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove("on"),2200);
  }
  function copiar(){
    const url=location.href;
    const ok=()=>aviso("Link copiado");
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(ok,()=>window.prompt("Copie o link:",url));
    else window.prompt("Copie o link:",url);
  }
  window.SUAVE=matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth";
  function anuncia(txt){
    let r=document.getElementById("sr-status");
    if(!r){
      const st=document.createElement("style");
      st.textContent=".sr-only{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}";
      document.head.appendChild(st);
      r=document.createElement("div");r.id="sr-status";r.className="sr-only";r.setAttribute("role","status");r.setAttribute("aria-live","polite");document.body.appendChild(r);
    }
    r.textContent="";setTimeout(()=>{r.textContent=txt},30);
  }
  // setas, Home e End movem o foco entre as abas de um tablist
  function setas(c){
    if(!c)return;
    c.addEventListener("keydown",e=>{
      if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;
      const ts=[...c.querySelectorAll("[role=tab]")],i=ts.indexOf(document.activeElement);if(i<0)return;
      e.preventDefault();
      const j=e.key==="Home"?0:e.key==="End"?ts.length-1:(i+(e.key==="ArrowRight"?1:-1)+ts.length)%ts.length;
      ts[j].focus();ts[j].click();
    });
  }
  // devolve "#fff" ou o azul-escuro do atlas, o que der mais contraste sobre a cor de fundo (aceita var(--x))
  let sonda;
  function on(cor){
    if(!sonda){sonda=document.createElement("span");sonda.style.cssText="position:absolute;visibility:hidden;pointer-events:none";document.documentElement.appendChild(sonda)}
    sonda.style.color="#000";sonda.style.color=cor;
    const m=getComputedStyle(sonda).color.match(/[\d.]+/g);if(!m)return "#fff";
    const L=c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)};
    const lum=.2126*L(+m[0])+.7152*L(+m[1])+.0722*L(+m[2]);
    return (1.05)/(lum+.05)>=(lum+.05)/(0.0185+.05)?"#fff":"#14202d";
  }
  // relato de erro de conteúdo: abre um novo problema no GitHub com a página e o item já preenchidos
  const REPO="hick-ferreira/atlas";
  function reportar(ctx){
    const corpo="**Onde:** "+location.href+"\n**Item:** "+ctx+"\n\n**O que está errado ou impreciso?**\n\n\n**Fonte ou referência (opcional)**\n\n";
    const url="https://github.com/"+REPO+"/issues/new?title="+encodeURIComponent("Conteúdo: "+ctx)+"&body="+encodeURIComponent(corpo)+"&labels=conteudo";
    window.open(url,"_blank","noopener");
  }
  // folheto: lista de exercícios escolhidos ("regiao:id"), guardada no navegador
  const FK="atlas:folheto";
  const folhetoLer=()=>{try{const v=JSON.parse(localStorage.getItem(FK)||"[]");return Array.isArray(v)?v:[]}catch(e){return[]}};
  function folhetoSalvar(l){try{localStorage.setItem(FK,JSON.stringify(l))}catch(e){}window.dispatchEvent(new Event("folheto-mudou"))}
  function folhetoAlternar(id){
    const l=folhetoLer(),i=l.indexOf(id);
    if(i>=0)l.splice(i,1);else l.push(id);
    folhetoSalvar(l);return i<0;
  }
  addEventListener("hashchange",()=>{atual=lerUrl()});
  window.Estado={on,reportar,folhetoLer,folhetoSalvar,folhetoAlternar,url:lerUrl,url:lerUrl,salvo:()=>salvo,gravar,copiar,aviso,anuncia,setas,reg};
})();
