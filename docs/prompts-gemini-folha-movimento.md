# Prompts Gemini · nova folha de movimento (8 quadros por movimento)

Faça UMA folha por movimento (joelho e quadril). Salve como `img/movimento/folha-joelho.png` e `img/movimento/folha-quadril.png`.
Se o Gemini errar a folha inteira, use a OPÇÃO B (um quadro por vez, editando a imagem anterior).

## BLOCO DE ESTILO (cole antes dos dois)

Ilustração médica educativa, no mesmo estilo da folha anterior: traço limpo, sombreamento suave, cores naturais, fundo liso creme (#FBF8F3). Mesma pessoa em todos os quadros (rosto, cabelo curto castanho, camiseta cinza-azulada, bermuda escura, descalça), sentada de perfil na beira de um banco alto de metal escuro, voltada para a direita da imagem, costas eretas, mãos apoiadas na beira do banco. Na coxa a pele fica translúcida e mostra o quadríceps com estas cores fixas: reto femoral coral, vasto lateral azul, vasto medial amarelo, vasto intermédio roxo, tendões e ligamento patelar em branco-acinzentado. O músculo fica mais curto e grosso quando contrai e mais longo e fino quando alonga.

## REGRAS DA FOLHA (valem para as duas)

- Grade de 4 colunas por 2 linhas, 8 quadros do mesmo tamanho, folha em proporção 16:9.
- Cada quadro fica dentro de uma célula própria com muita folga: NADA pode atravessar a borda da célula nem encostar no quadro vizinho. Deixe uma faixa vazia de pelo menos 15% da largura da célula entre os quadros.
- A pessoa e o banco ficam EXATAMENTE na mesma posição, no mesmo tamanho e na mesma escala em todas as células. Só a perna muda.
- O corpo inteiro aparece em todos os quadros, inclusive cabeça, banco e pé completo (dedos incluídos). Nenhum pé cortado.
- Sem texto dentro das células. Embaixo de cada célula, em letra pequena e centralizada, só o ângulo indicado.
- Sem legenda de cores, sem título, sem moldura, sem marca d'água.
- Os ângulos precisam ser REAIS e crescer de forma uniforme, quadro a quadro, da esquerda para a direita e de cima para baixo.

## 1. folha-joelho.png · Extensão do joelho

Oito quadros do mesmo movimento. O joelho vai de 90° dobrado até totalmente esticado, e a coxa fica sempre na horizontal, apoiada no banco, com o tronco parado. Ângulos de flexão do joelho, na ordem: 90°, 77°, 64°, 51°, 38°, 26°, 13°, 0°. A canela forma exatamente esse ângulo com a coxa estendida (a 90° ela pende na vertical; a 0° a perna está reta na horizontal). Mostre o pé relaxado em todos os quadros. O quadríceps vai se contraindo aos poucos, e nos últimos graus o vasto medial (amarelo) fica mais evidente.

## 2. folha-quadril.png · Elevação da coxa (flexão do quadril)

Oito quadros do mesmo movimento. O joelho fica dobrado a 90° o tempo todo e o tronco não se inclina. Só a coxa sobe, girando a partir do quadril, junto com a canela. Ângulos de elevação da coxa acima da horizontal, na ordem: 0°, 7°, 14°, 21°, 29°, 36°, 43°, 50°. No primeiro quadro a coxa está horizontal no banco; no último, subiu 50°. O reto femoral (coral) se encurta e engrossa conforme a coxa sobe, e os vastos ficam mais discretos.

---

## OPÇÃO B · um quadro por vez (mais confiável para manter tudo alinhado)

1. Gere o primeiro quadro (joelho a 90° ou coxa a 0°) com o BLOCO DE ESTILO, em 4:3, com a pessoa inteira e margem em volta.
2. Para cada quadro seguinte, anexe o quadro anterior e peça:
   "Edite esta imagem. Mantenha exatamente o mesmo rosto, camiseta, bermuda, banco, mãos, tronco, enquadramento, tamanho e posição na tela, o mesmo fundo creme e as mesmas cores dos músculos. Mude SOMENTE a perna: [joelho em X° de flexão] ou [coxa elevada X° acima da horizontal, joelho a 90°]. Pé inteiro visível. Sem texto."
3. Joelho: 77°, 64°, 51°, 38°, 26°, 13°, 0°. Quadril: 7°, 14°, 21°, 29°, 36°, 43°, 50°.
4. Salve como `img/movimento/joelho-1.png` até `joelho-8.png` e `quadril-1.png` até `quadril-8.png`.

---

Como conferir antes de me enviar:
- Pé inteiro em todos os quadros, e nada encostando na célula vizinha.
- Banco, tronco e cabeça no mesmo lugar em todos (sobreponha duas imagens para testar).
- Os ângulos crescem de forma uniforme (nada de dois quadros quase iguais seguidos).
Se vier errado, peça: "refaça mantendo tudo, mas com o quadro N em X° e o pé inteiro, sem cortar".
