---
name: rs-full-stack-personalizando-espacos
description: "Applies CSS spacing patterns when styling page layouts with margins, padding, and line-height. Use when user asks to 'style a page', 'fix spacing', 'adjust margins', 'reset CSS', 'add padding between sections', or any layout spacing task. Enforces universal reset, sibling-based margin strategy, and systematic spacing workflow. Make sure to use this skill whenever writing CSS that involves element spacing or layout adjustments. Not for Flexbox/Grid alignment, animations, or color theming."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-fundamentals
  tags:
    - css
    - spacing
    - margin
    - padding
    - layout
---

# Personalizando Espacos CSS

> Zere tudo primeiro, depois construa espacos de forma sistematica usando margens entre irmaos e padding em containers.

## Rules

1. **Sempre comece com reset universal** — `* { margin: 0; padding: 0; }` antes de qualquer estilo, porque os navegadores aplicam margens e paddings default inconsistentes entre si
2. **Use padding no container, margin nos filhos** — o container (main, section) recebe padding para afastar do limite; elementos internos usam margin para espacar entre si, porque separa responsabilidades de espacamento
3. **Prefira margin entre irmaos adjacentes** — use seletores como `p + p` ou `section + section` para aplicar margin-top apenas quando um elemento segue outro igual, porque evita margin desnecessaria no primeiro elemento
4. **Teste e ajuste iterativamente** — coloque um valor, observe, ajuste; nao tente acertar de primeira, porque spacing e visual e depende de contexto
5. **Defina line-height explicitamente nos elementos** — variaveis CSS no `:root` ou `body` nem sempre cascateiam para h1/h2 porque o navegador tem estilos mais especificos; aplique diretamente quando necessario
6. **Faca commits incrementais** — adicione ao Stage Area antes de commitar; nunca use "always" no auto-stage para manter controle granular

## How to write

### Reset universal (primeiro no arquivo CSS)

```css
* {
  margin: 0;
  padding: 0;
}
```

### Padding no container

```css
main {
  padding: 24px;
}
```

### Margin entre irmaos adjacentes

```css
/* Paragrafo que segue outro paragrafo */
p + p {
  margin-top: 12px;
}

/* Secao que segue outra secao */
section + section {
  margin-top: 24px;
}
```

### Titulos com margem inferior

```css
h1, h2 {
  margin-bottom: 4px;
}
```

### Line-height aplicado diretamente

```css
h1, h2 {
  line-height: 150%;
}
```

## Example

**Before (espacamento default do navegador, inconsistente):**

```css
main {
  /* nenhum estilo de spacing */
}
h1 {
  /* margens default do navegador */
}
```

**After (espacamento sistematico):**

```css
* {
  margin: 0;
  padding: 0;
}

main {
  padding: 24px;
}

h1, h2 {
  margin-bottom: 4px;
  line-height: 150%;
}

p + p {
  margin-top: 12px;
}

section + section {
  margin-top: 24px;
}

ul {
  padding-left: 24px;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Espaco entre container e conteudo | `padding` no container |
| Espaco entre elementos irmaos | `margin-top` com seletor adjacente (`+`) |
| Recuo de lista | `padding-left` na `ul`/`ol` |
| line-height nao funciona via root/body | Aplique diretamente no elemento (h1, h2, p) |
| Nao sabe o valor exato do espaco | Comece com um valor, observe, dobre ou reduza pela metade |
| Muitos arquivos modificados no Git | Adicione ao Stage Area manualmente, nunca use "always" |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Deixar margins/paddings default do navegador | Reset universal `* { margin: 0; padding: 0; }` |
| `section { margin-top: 24px; }` (afeta o primeiro) | `section + section { margin-top: 24px; }` |
| Definir line-height apenas no `:root` esperando cascata total | Aplicar line-height diretamente nos elementos que precisam |
| Tentar acertar spacing perfeito de primeira | Iterar: colocar valor, observar, ajustar |
| Usar "Always" no auto-stage do VS Code | Usar "Yes" pontualmente para manter controle |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cascata de line-height, estrategia de spacing iterativo e workflow Git
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes e contexto HTML

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Margem entre elementos nao aparece | Reset universal removeu margens mas nao aplicou novas | Adicione `margin-top` com seletor adjacente (`+`) entre irmaos |
| Line-height definido no body nao afeta h1/h2 | Navegador tem estilos mais especificos para headings | Aplique `line-height` diretamente nos elementos h1, h2 |
| Espacamento inconsistente entre navegadores | Margens e paddings default variam por browser | Verifique se o reset universal `* { margin: 0; padding: 0; }` esta no topo do CSS |

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-personalizando-espacos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-personalizando-espacos/references/code-examples.md)
