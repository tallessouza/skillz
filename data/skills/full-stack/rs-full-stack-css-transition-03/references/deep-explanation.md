# Deep Explanation: CSS Transition — Shorthand, Placement & Accessibility

## Por que a transicao pertence ao elemento, nao ao trigger?

O instrutor demonstra um erro muito comum: colocar `transition` dentro do `:hover`. Quando voce faz isso, a transicao so existe enquanto o estado hover esta ativo. No momento em que o mouse sai, o `:hover` deixa de aplicar, e com ele a propriedade `transition` desaparece — fazendo a saida ser instantanea.

A analogia e simples: a transicao e uma **caracteristica do elemento**, nao do evento. E como dizer "este elemento sabe fazer transicoes suaves". Se voce so diz isso durante o hover, ele "esquece" quando o hover acaba.

### Uso intencional de transicoes diferentes

Existe um caso legitimo para colocar transition no trigger: quando voce **quer** tempos diferentes para entrada e saida. O CSS funciona por especificidade — a regra no `:hover` sobrescreve a regra base durante o hover. Entao:

- **Elemento base**: define a transicao de saida (quando hover termina)
- **`:hover`**: define a transicao de entrada (quando hover comeca)

Isso permite efeitos como entrada rapida (100ms) e saida lenta (500ms), criando interacoes mais naturais.

## Como o browser parseia o shorthand

O shorthand `transition` aceita ate 4 valores por propriedade:

```
transition: [property] [duration] [delay] [timing-function]
```

O browser identifica:
- **Primeiro valor temporal** → duracao
- **Segundo valor temporal** → delay
- **Keyword de timing** (ease, linear, ease-in, ease-out, ease-in-out) → timing-function
- **Nome de propriedade CSS** → property

Se voce escreve `transition: all 400ms 2s ease`:
- `all` = propriedade
- `400ms` = duracao (primeiro numero)
- `2s` = delay (segundo numero)
- `ease` = timing-function

## Prefers Reduced Motion — por que e obrigatorio

Muitos usuarios tem condicoes vestibulares, epilepsia, ou simplesmente preferem interfaces sem movimento. Todos os sistemas operacionais modernos oferecem a opcao "Reduce Motion".

O CSS expoe isso via `@media (prefers-reduced-motion: reduce)`.

### Como testar

1. **No SO**: System Settings → Accessibility → Reduce Motion
2. **No DevTools**: Cmd+P (ou Ctrl+P) → `>` → digitar "Reduce" → "Emulate CSS prefers-reduced-motion"

### Estrategias de reducao

- **Remocao total**: `transition: none` — mais seguro
- **Reducao parcial**: manter apenas `opacity` (sem movimentos bruscos) — usado em muitos sites como alternativa mais suave

## Propriedades que nao aceitam transition

Nem toda propriedade CSS e animavel. O CSS evolui, entao propriedades que hoje nao aceitam podem passar a aceitar no futuro. Exemplos de propriedades **nao animaveis**:
- `display`
- `grid-template-columns` (parcialmente suportado em browsers modernos)
- `content`

Quando uma transicao nao funciona, o primeiro passo e verificar na documentacao MDN se aquela propriedade e "animatable".

## Minimo necessario

Para uma transicao funcionar, voce precisa de apenas **duas informacoes**:
1. Qual propriedade transicionar (ou `all`)
2. Quanto tempo dura

```css
transition: opacity 300ms;
/* Isso ja funciona — timing-function padrao e 'ease', delay padrao e 0 */
```