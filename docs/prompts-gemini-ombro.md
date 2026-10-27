# Prompts Gemini · braço e ombro

Mesma ideia da coxa: primeiro as ilustrações principais, depois as folhas de movimento, depois os alongamentos.
Gere uma imagem por vez, cole o BLOCO DE ESTILO antes de cada prompt e salve com o nome indicado.

Lições da coxa, para poupar retrabalho:
- Peça sempre **o mesmo lado** (braço direito do modelo) e a mesma câmera em todos os quadros.
- Nas folhas de movimento, os ângulos têm de crescer sempre na mesma direção e o corpo não pode "andar" entre os quadros.
- Sem texto dentro da figura, só o número do ângulo no canto da célula.
- Se vier com texto, seta ou lado errado, peça "refaça sem texto e com o braço direito".

## BLOCO DE ESTILO (cole antes de cada prompt)

Ilustração médica educativa em estilo de atlas de anatomia moderno (traço limpo, sombreamento suave, cores naturais, como uma prancha de livro de anatomia). Fundo liso creme muito claro (#FBF8F3), sem cenário. Pessoa adulta, atlética, de camiseta cinza-azulada e bermuda escura quando o corpo aparece. Na região do ombro e do braço a pele fica translúcida, mostrando os músculos com fibras visíveis, tendões em branco-acinzentado e o osso apenas onde indicado. Sem nenhum texto, sem legendas, sem marca d'água, sem moldura. Anatomia correta e proporções realistas.

---

## A. Ilustrações principais (como a da coxa)

Salvar em `ombro/img/`. Proporção 4:5 vertical. Mesma câmera, mesma escala e mesmo enquadramento nas duas, para trocar entre elas sem pular.

### A1. ombro-frente.jpg · vista anterior do ombro e do braço direito
Vista anterior (de frente) do ombro direito e do braço direito até o meio do antebraço, sem a pele, em estilo de prancha de anatomia realista, braço relaxado ao lado do corpo, parte do tórax e da clavícula visíveis. Mostre e diferencie por cor: deltoide (porção anterior e lateral) em vermelho-coral; peitoral maior cortado/rebatido para mostrar o que há embaixo; subescapular em amarelo (parte visível sob o peitoral); coracobraquial em verde-água; bíceps braquial com a cabeça longa e a curta em laranja; braquial em rosa, sob o bíceps; tendão do bíceps no antebraço; clavícula, acrômio, processo coracoide e úmero em tom osso. Sem texto.

### A2. ombro-costas.jpg · vista posterior do ombro e do braço direito
Mesma câmera, escala e enquadramento da A1, vista posterior (de costas) do ombro direito e do braço direito até o meio do antebraço, sem a pele. Mostre e diferencie por cor: deltoide (porção posterior e lateral) em vermelho-coral, com a parte superior rebatida para mostrar o manguito; supraespinal em azul; infraespinal em verde; redondo menor em roxo; redondo maior em salmão; tríceps braquial com as cabeças longa, lateral e medial em azul-escuro; escápula (espinha da escápula e acrômio) e úmero em tom osso. Sem texto.

Dica: peça também uma versão sem cores (todos os músculos em vermelho natural), útil como base para o efeito de contração.

---

## B. Folhas de movimento (como a de 16 quadros do quadríceps)

Salvar em `ombro/img/movimento/`. Uma folha por movimento, grade 4×4 de células iguais, **sem título dentro da célula**, só o ângulo em graus num canto fixo (sempre o mesmo canto, longe da figura). Fundo liso creme em todas as células, bordas finas. Os 16 quadros formam uma sequência contínua, ida e volta NÃO: sempre crescendo.

### B1. folha-ombro.jpg · elevação lateral do braço (abdução)
Pessoa em pé, vista frontal, braço direito do modelo (do lado esquerdo da imagem) elevando lateralmente com a palma voltada para baixo, cotovelo estendido, de 0° (braço ao lado do corpo) até 150° em passos iguais (0°, 10°, 20°, 30°, 40°, 50°, 60°, 70°, 80°, 90°, 100°, 110°, 120°, 130°, 140°, 150°). Corpo parado, só o braço se move. Em cada quadro destaque o deltoide (lateral) em vermelho-coral e o supraespinal em azul translúcidos, com a escápula visível por transparência.

### B2. folha-cotovelo.jpg · flexão do cotovelo
Pessoa em pé, vista lateral (de perfil), braço colado ao corpo com o ombro parado, cotovelo flexionando de 0° (braço esticado ao lado do corpo, palma para a frente) até 145° em passos iguais (0°, 10°, 20°, 30°, 40°, 50°, 60°, 70°, 80°, 90°, 100°, 110°, 120°, 130°, 140°, 145°). Em cada quadro destaque o bíceps braquial em laranja e o braquial em rosa translúcidos, com o tríceps em azul-escuro relaxado. Corpo parado, só o antebraço se move.

(Se o Gemini não respeitar 16 quadros, peça 8 quadros por folha em duas linhas. Com 8 já conseguimos interpolar.)

---

## C. Alongamentos

Salvar em `ombro/img/alongamentos/<nome>.jpg`. Proporção 4:3 horizontal. Mesmo BLOCO DE ESTILO. Pessoa de corpo inteiro (ou até a cintura se a posição pedir), centralizada. Destaque o músculo-alvo em vermelho translúcido. Uma seta simples coral mostra a direção do alongamento.

### C1. delpos.jpg · Deltoide posterior · braço cruzado
Pessoa em pé, vista frontal, braço direito esticado na horizontal cruzando à frente do peito, a outra mão puxando-o suavemente na altura do cotovelo. Ombros relaxados, tronco ereto. Destaque o deltoide posterior do braço cruzado. Seta indicando o braço sendo puxado para o lado oposto.

### C2. delant.jpg · Deltoide anterior e peitoral · mãos atrás das costas
Pessoa em pé, vista lateral, mãos entrelaçadas atrás das costas, braços estendidos e elevados levemente para trás, peito aberto, queixo neutro. Destaque o deltoide anterior (e o peitoral maior, em tom mais claro). Seta indicando os braços subindo para trás.

### C3. dellat.jpg · Deltoide lateral · braço atrás do corpo
Pessoa em pé, vista posterior ou três quartos, braço direito atrás das costas, a mão esquerda segurando o pulso direito e puxando suavemente para o lado oposto, cabeça inclinada para o lado contrário. Destaque o deltoide lateral. Seta indicando o puxão do pulso.

### C4. supra.jpg · Supraespinal · mão às costas com inclinação
Pessoa em pé, vista posterior, braço direito atrás do corpo com a mão na região lombar, a outra mão segurando o cotovelo e levando-o suavemente para frente e para o lado oposto, tronco ereto. Destaque o supraespinal sobre a escápula, sob o trapézio (em tom mais claro). Seta indicando o cotovelo sendo puxado.

### C5. infra.jpg · Infraespinal · adução cruzada com rotação interna
Pessoa em pé, vista lateral, braço direito à frente do peito com o cotovelo dobrado a 90° e a palma voltada para baixo, a outra mão empurrando suavemente o antebraço em direção ao corpo (rotação interna). Destaque o infraespinal na parte de trás da escápula. Seta indicando o antebraço descendo.

### C6. redmen.jpg · Redondo menor · cruzar o braço na altura do peito
Pessoa em pé, vista frontal, braço esticado cruzando o peito na altura do ombro, a outra mão segurando acima do cotovelo e puxando para o peito, ombro mantido baixo. Destaque o redondo menor no contorno lateral da escápula. Seta indicando o puxão.

### C7. subesc.jpg · Subescapular · rotação externa na porta
Pessoa em pé, vista frontal, ao lado de um batente de porta, cotovelo dobrado a 90° colado ao corpo e antebraço apoiado no batente, girando o corpo para longe para abrir a rotação externa. Destaque o subescapular na face anterior da escápula, por transparência. Seta indicando o corpo girando.

### C8. redmai.jpg · Redondo maior · cotovelo atrás da cabeça lateralmente
Pessoa em pé, vista posterior, braço direito elevado com o cotovelo dobrado atrás da cabeça, a outra mão segurando o cotovelo e inclinando o tronco suavemente para o lado oposto. Destaque o redondo maior (e a parte lateral da escápula). Seta indicando a inclinação.

### C9. bic.jpg · Bíceps braquial · palma na parede
Pessoa em pé, vista lateral, braço direito estendido para trás com a palma apoiada em uma parede na altura do ombro e dedos apontando para trás, corpo girando suavemente para o lado oposto. Destaque o bíceps braquial com a cabeça longa e a curta. Seta indicando a rotação do tronco.

### C10. braq.jpg · Braquial · antebraço pronado apoiado
Pessoa sentada, vista lateral, braço direito apoiado em uma mesa com o antebraço pronado (palma para baixo) e o cotovelo estendido, a outra mão pressionando suavemente a mão para flexionar o punho. Destaque o braquial sob o bíceps. Seta indicando o punho descendo.

### C11. corac.jpg · Coracobraquial · porta com palma para frente
Pessoa em pé, vista frontal, braço direito elevado na horizontal para o lado com a palma voltada para frente apoiada em um batente de porta, corpo girando suavemente para o lado oposto. Destaque o coracobraquial na face interna do braço, perto do ombro. Seta indicando a rotação.

### C12. tric.jpg · Tríceps braquial · cotovelo atrás da cabeça
Pessoa em pé, vista posterior ou lateral, braço direito elevado com o cotovelo dobrado e a mão tocando as costas entre as escápulas, a outra mão puxando o cotovelo para trás da cabeça. Destaque as três cabeças do tríceps braquial. Seta indicando o cotovelo sendo puxado.

---

Dica: peça cada alongamento de uma vez, confira se o braço certo está destacado e, se necessário, peça "mesmo prompt, agora mostrando o braço direito".
