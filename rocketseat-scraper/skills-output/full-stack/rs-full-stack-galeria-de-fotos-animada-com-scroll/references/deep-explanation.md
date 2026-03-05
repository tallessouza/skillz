# Deep Explanation: Galeria de Fotos Animada com Scroll

## Por que transition vai no elemento base e NAO no :hover

Este e um dos erros mais comuns em CSS transitions. O instrutor explica com clareza:

Quando voce coloca `transition` dentro do `:hover`, a propriedade de transicao so existe **enquanto o mouse esta em cima**. No momento que o mouse sai, o `:hover` deixa de ser aplicado, e com ele a `transition` desaparece. O resultado: o elemento "pula" instantaneamente de volta ao estado original.

Ao colocar `transition` no seletor base (sem hover), voce esta dizendo ao navegador: "este elemento SEMPRE tem uma transicao configurada para esta propriedade". Quando o hover dispara a mudanca, a transicao suaviza a ida. Quando o hover e removido, a transicao ainda existe no elemento base, entao suaviza a volta tambem.

```
Errado:   hover liga transition → hover sai → transition some → pulo instantaneo
Correto:  transition sempre presente → hover muda valor → transition suaviza ida E volta
```

## animation-timeline: view() — Como funciona

`animation-timeline: view()` e uma propriedade CSS que substitui o tempo (duration) da animacao pelo **progresso de scroll do elemento na viewport**. Em vez de "anime em 2 segundos", e "anime conforme o elemento entra na tela".

Por isso o instrutor NAO coloca duration na animacao:
```css
/* SEM duration — o timeline e controlado pelo scroll */
animation: image-appear linear backwards;
animation-timeline: view();
```

Se voce colocar duration (ex: `2s`), ele sera ignorado quando `animation-timeline: view()` esta ativo, porque o progresso e baseado em scroll, nao em tempo.

### animation-range — Ajuste fino

`animation-range` define em que ponto do scroll a animacao comeca e termina, medido a partir da borda inferior da viewport:

```css
animation-range: 100px 350px;
```

- **100px**: a animacao comeca quando o elemento esta a 100px da borda inferior
- **350px**: a animacao termina (completa) quando o elemento esta a 350px da borda inferior

### Stagger com data attributes

Para criar o efeito de elementos aparecendo sequencialmente (primeiro uma imagem, depois outra), o instrutor usa ranges diferentes:

- Elementos normais: `100px` a `350px`
- Elementos com `data-delay`: `150px` a `400px`

A diferenca de 50px entre os ranges cria o efeito de stagger — quando o primeiro termina de animar, o segundo comeca logo em seguida.

## Compatibilidade de navegadores

O instrutor alerta explicitamente: `animation-timeline: view()` **ainda nao esta disponivel em todos os navegadores**. No momento da aula, funciona no Edge (Chromium-based) e Chrome. Firefox e Safari podem nao suportar.

Para producao, considere:
1. Progressive enhancement — a galeria funciona sem animacao, animacao e bonus
2. `@supports (animation-timeline: view())` para aplicar condicionalmente
3. Fallback com Intersection Observer + classes JS para navegadores sem suporte

## Figure e Figcaption — Semantica correta

O instrutor usa `<figure>` em vez de `<div>` porque:
- `<figure>` indica conteudo independente (imagem, diagrama, codigo)
- `<figcaption>` e o unico elemento semanticamente correto para descrever/legendar o conteudo do figure
- Leitores de tela associam automaticamente figcaption ao conteudo do figure

## Tecnica do overflow hidden no figure

O `border-radius: 2.5rem` no figure cria cantos arredondados. Sem `overflow: hidden`, a imagem (que tem `width: 100%` e `height: auto`) vazaria alem dos cantos arredondados. Com `overflow: hidden`, tudo que ultrapassa os limites do figure (incluindo os cantos arredondados) e cortado.

Isso tambem e essencial para o efeito de `scale: 1.1` no hover — a imagem cresce, mas o overflow hidden garante que ela nao vaze do container.

## Gradiente no figcaption

O background gradient cria uma sombra suave que garante legibilidade do texto branco sobre qualquer imagem:

```css
background: linear-gradient(to top, rgb(0 0 0 / 0.64), rgb(0 0 0 / 0));
```

- Direcao: de baixo para cima (`to top`)
- Base: preto com 64% de opacidade (onde o texto fica)
- Topo: totalmente transparente (transicao suave)

## animation-fill-mode: backwards

O `backwards` no shorthand `animation: image-appear linear backwards` faz com que o estado do `from` do keyframe seja aplicado **antes** da animacao comecar. Sem isso, o elemento apareceria visivel por um frame antes de sumir e comecar a animar.