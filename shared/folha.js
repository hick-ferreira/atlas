/* Folha inferior (bottom sheet) para a ficha do músculo no celular, no modo 3D.
   O painel #panel vira uma folha fixa na base da tela, com três alturas (só o nome, metade, quase tudo),
   para o modelo continuar visível acima. No desktop e no modo ilustração o painel continua no lugar de sempre. */
(function(){
  const MQ=matchMedia("(max-width:900px)");
  const ALT={peek:84,meio:null,cheio:null};
  const css=document.createElement("style");
  css.textContent=`
  .fl-bar{display:none}
  .fl-scroll{display:contents}
  body.fl-on{padding-bottom:110px}
  body.fl-on #panel{position:fixed;left:0;right:0;bottom:0;z-index:60;margin:0;padding:0;min-height:0;border-radius:20px 20px 0 0;
    height:var(--fl-h,84px);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -12px 40px rgba(0,0,0,.45);
    transition:height .25s ease;padding-bottom:env(safe-area-inset-bottom,0px)}
  body.fl-on #panel.fl-arrasta{transition:none}
  body.fl-on .fl-bar{display:flex;flex:none;align-items:center;gap:10px;padding:6px 10px 8px 14px;touch-action:none;cursor:grab;position:relative}
  body.fl-on .fl-bar::before{content:"";position:absolute;top:5px;left:50%;width:38px;height:4px;margin-left:-19px;border-radius:99px;background:var(--line)}
  body.fl-on .fl-bar .sw{flex:none;width:12px;align-self:stretch;margin-top:14px;border-radius:5px;background:var(--c)}
  body.fl-on .fl-tit{flex:1;min-width:0;padding-top:12px}
  body.fl-on .fl-tit b{display:block;font:800 1.1rem/1.15 var(--f-display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  body.fl-on .fl-tit small{display:block;font:500 11.5px var(--f-mono);color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  body.fl-on .fl-bar button{flex:none;width:44px;height:44px;margin-top:8px;border-radius:50%;border:1.5px solid var(--line);background:var(--surface);font-size:1.05rem;display:grid;place-items:center;color:var(--ink)}
  body.fl-on .fl-scroll{display:block;flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:0 16px 24px}
  body.fl-on #panel .mname,body.fl-on #panel .latin{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  body.fl-on .back3d{display:none!important}
  body.fl-on .v3-stage.emb{height:min(44vh,440px);min-height:260px}
  body.fl-fora #panel{display:none}
  body.fl-fora{padding-bottom:0}
  @media (prefers-reduced-motion:reduce){body.fl-on #panel{transition:none}}`;
  document.head.appendChild(css);

  let painel,barra,tit,nomeEl,latEl,sw,botTog,estado="peek",ativo=false,opts={};
  const vh=()=>innerHeight;
  const alt=e=>e==="peek"?ALT.peek:e==="meio"?Math.round(vh()*.46):Math.round(vh()*.88);
  function aplica(e,sem){
    estado=e;painel.dataset.fl=e;
    painel.style.height="";painel.style.setProperty("--fl-h",alt(e)+"px");
    if(botTog){botTog.textContent=e==="cheio"?"⌄":"⌃";botTog.setAttribute("aria-expanded",e!=="peek");botTog.setAttribute("aria-label",e==="peek"?"Abrir a ficha":"Recolher a ficha")}
  }
  function garantePalco(){
    // o modelo precisa continuar visível acima da folha
    const el=opts.palco;if(!el)return;
    const r=el.getBoundingClientRect(),nav=(document.querySelector(".rnav")?.offsetHeight||52)+(document.querySelector(".snav")?.offsetHeight||0)+6,livre=vh()-alt(estado);
    if(r.top<nav||r.bottom>livre)window.scrollBy({top:r.bottom>livre&&r.top>=nav?Math.min(r.bottom-livre+8,r.top-nav):r.top-nav,behavior:(window.SUAVE||"smooth")});
  }
  const api={
    montar(o){
      opts=o;painel=o.painel;
      // barra com o nome, setas e botão de abrir/recolher; o conteúdo antigo vai para dentro de uma área rolável
      const rola=document.createElement("div");rola.className="fl-scroll";
      while(painel.firstChild)rola.appendChild(painel.firstChild);
      barra=document.createElement("div");barra.className="fl-bar";barra.setAttribute("role","toolbar");barra.setAttribute("aria-label","Ficha do músculo");
      barra.innerHTML=`<span class="sw"></span><div class="fl-tit"><b></b><small></small></div>
        <button type="button" data-f="ant" aria-label="Músculo anterior">‹</button><button type="button" data-f="prox" aria-label="Próximo músculo">›</button><button type="button" data-f="tog" aria-expanded="false" aria-label="Abrir a ficha">⌃</button>`;
      painel.appendChild(barra);painel.appendChild(rola);
      sw=barra.querySelector(".sw");tit=barra.querySelector(".fl-tit");nomeEl=tit.querySelector("b");latEl=tit.querySelector("small");botTog=barra.querySelector("[data-f=tog]");
      barra.addEventListener("click",e=>{
        const b=e.target.closest("button[data-f]");if(!b)return;
        if(b.dataset.f==="ant")o.nav(-1);else if(b.dataset.f==="prox")o.nav(1);
        else aplica(estado==="peek"?"meio":"peek");
        if(b.dataset.f==="tog"&&estado==="meio")garantePalco();
      });
      // arrastar a barra: acompanha o dedo e encaixa na altura mais próxima
      let ini=null;
      barra.addEventListener("pointerdown",e=>{
        if(e.target.closest("button"))return;
        ini={y:e.clientY,h:painel.getBoundingClientRect().height,mov:false,t:performance.now()};
        barra.setPointerCapture(e.pointerId);painel.classList.add("fl-arrasta");
      });
      barra.addEventListener("pointermove",e=>{
        if(!ini)return;const dy=ini.y-e.clientY;if(Math.abs(dy)>4)ini.mov=true;
        painel.style.setProperty("--fl-h",Math.max(ALT.peek,Math.min(alt("cheio"),ini.h+dy))+"px");
      });
      const fim=e=>{
        if(!ini)return;painel.classList.remove("fl-arrasta");
        const h=painel.getBoundingClientRect().height,dy=ini.y-e.clientY,mov=ini.mov;ini=null;
        if(!mov){aplica(estado==="peek"?"meio":"peek");return}
        // um gesto rápido para cima ou para baixo pula para a próxima altura
        const opc=["peek","meio","cheio"].map(k=>[k,Math.abs(alt(k)-h)]).sort((a,b)=>a[1]-b[1]);
        let alvo=opc[0][0];
        const idx=["peek","meio","cheio"].indexOf(estado);
        if(Math.abs(dy)>60&&alvo===estado)alvo=["peek","meio","cheio"][Math.max(0,Math.min(2,idx+(dy>0?1:-1)))];
        aplica(alvo);if(alvo==="meio")garantePalco();
      };
      barra.addEventListener("pointerup",fim);barra.addEventListener("pointercancel",fim);
      // some quando o palco sai da tela (o usuário foi para outra seção)
      if(o.palco&&"IntersectionObserver" in window)new IntersectionObserver(es=>{document.body.classList.toggle("fl-fora",!es[0].isIntersecting&&document.body.classList.contains("fl-on"))},{threshold:0}).observe(o.figura||o.palco);
      MQ.addEventListener("change",()=>api.ativar(ativo));
      addEventListener("resize",()=>{if(document.body.classList.contains("fl-on"))aplica(estado)});
    },
    /* liga a folha quando o modo 3D está aberto e a tela é de celular */
    ativar(on){
      ativo=on;const liga=!!(on&&MQ.matches);
      document.body.classList.toggle("fl-on",liga);
      if(!liga){document.body.classList.remove("fl-fora");painel.style.removeProperty("--fl-h");painel.style.height="";delete painel.dataset.fl}
      else aplica(estado);
    },
    atualiza(d){
      if(!barra)return;
      nomeEl.textContent=d.nome;latEl.textContent=d.latin||"";sw.style.background=d.cor;barra.style.setProperty("--c",d.cor);
    },
    abrir(e){
      if(!document.body.classList.contains("fl-on"))return;
      aplica(e);if(e==="meio")setTimeout(garantePalco,60);
    },
    recolher(){if(document.body.classList.contains("fl-on"))aplica("peek")},
    aberta:()=>document.body.classList.contains("fl-on")
  };
  window.Folha=api;
})();
