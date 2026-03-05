# Deep Explanation: Display Inline

## Modelo mental: inline e como texto

Elementos inline se comportam como palavras numa frase. Assim como palavras ficam uma ao lado da outra e ocupam apenas seu proprio espaco, elementos inline fazem o mesmo. Voce nao consegue definir a "largura" de uma palavra — ela ocupa o que precisa.

## Por que width e height nao funcionam?

O browser trata elementos inline como fragmentos de texto. O tamanho e determinado inteiramente pelo conteudo (texto, fonte, etc). Propriedades de dimensao (`width`, `height`) simplesmente nao se aplicam a esse modelo — sao ignoradas silenciosamente pelo browser.

Isso e uma fonte classica de confusao: o desenvolvedor aplica `width: 200px` num `span`, nada muda, e fica procurando o bug. A resposta e sempre: **verifique se o elemento e inline**.

## O comportamento "estranho" do padding e border vertical

O instrutor destaca um ponto sutil e importante:

- **Padding vertical renderiza visualmente** — voce ve o espaco preenchido
- **Mas nao empurra elementos acima/abaixo** — causa sobreposicao

Isso acontece porque o modelo de layout inline so calcula espaco horizontal para o fluxo. O padding vertical e pintado na tela, mas o algoritmo de posicionamento ignora ele ao calcular onde o proximo elemento vai.

### Demonstracao do instrutor

O instrutor colocou dois `span` um acima do outro com `padding: 20px`. O resultado:
- Lateralmente: padding empurra os elementos vizinhos
- Verticalmente: padding dos dois spans se sobrepoem — "esse pedacinho de baixo e do cara de cima, e esse pedacinho de cima e do cara de baixo"

Mesma logica para `border`: bordas laterais empurram, bordas verticais sobrepoe.

## Interacao inline + block

Quando uma `div` (block) aparece entre dois `span` (inline), a div quebra o fluxo porque block reclama a linha inteira. Isso acontece independente de a div ter conteudo ou nao — o comportamento block prevalece.

```html
<span>Inline 1</span>
<div>Block (quebra a linha)</div>
<span>Inline 2</span>
```

Resultado: Inline 1 e Inline 2 ficam em linhas separadas por causa da div.

## Regra pratica resumida

**Horizontais: SIM** — margin, padding, border empurram e funcionam normalmente.
**Verticais: depende** — margin nao funciona, padding/border renderizam mas nao empurram.

## Elementos inline por padrao

- `<a>` — links
- `<span>` — container generico inline
- `<strong>` — texto em negrito semantico
- `<em>` — texto em italico semantico

Existem outros (como `<abbr>`, `<cite>`, `<code>`), mas esses sao os principais para o dia a dia.

## Quando mudar de inline

Se voce precisa de qualquer uma dessas propriedades funcionando completamente:
- `width` / `height`
- `margin-top` / `margin-bottom`
- Padding/border vertical sem sobreposicao

Use `display: inline-block` (mantem em linha mas aceita dimensoes) ou `display: block` (ocupa linha inteira).