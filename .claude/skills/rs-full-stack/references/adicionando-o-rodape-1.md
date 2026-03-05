---
name: rs-full-stack-adicionando-o-rodape-1
description: "Applies footer layout patterns with CSS pseudo-element animations when building navigation footers, social link sections, or hover effects. Use when user asks to 'create a footer', 'add social links', 'hover underline animation', 'scale on hover', or 'pseudo-element transitions'. Covers flexbox footer layout, ::after underline grow effect, ::before circle reveal, and logo rotate on hover. Make sure to use this skill whenever building footer sections or hover micro-interactions with CSS. Not for JavaScript animations, header navigation, or complex keyframe sequences."
---

# Footer com Animações CSS

> Construa footers responsivos com micro-interações usando pseudo-elementos, transições e transforms CSS.

## Rules

1. **Use flexbox para layout do footer** — `display: flex; align-items: center; justify-content: space-between`, porque garante alinhamento consistente entre logo, nav e social links
2. **Pseudo-elementos precisam de position absolute + parent relative** — sem isso o posicionamento falha silenciosamente
3. **Anime com scale ao invés de width** — `transform: scaleX()` performa melhor que animar `width`, porque scale usa GPU e não causa reflow
4. **Comece escondido, revele no hover** — `scaleX(0)` ou `scale(0)` no estado base, `scaleX(1)` ou `scale(1)` no hover, porque cria o efeito de crescimento
5. **Use z-index negativo para pseudo-elementos de fundo** — `z-index: -1` no `::before` coloca o elemento atrás do conteúdo sem escondê-lo
6. **Adicione title em links com apenas ícone** — leitores de tela precisam saber o destino do link quando só há imagem

## How to write

### Footer layout base

```css
footer {
  max-width: 80rem;
  width: 100%;
  padding: 4rem 2rem 2rem;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### Underline grow from center (::after)

```css
nav a {
  position: relative;
}

nav a::after {
  content: "";
  width: 100%;
  height: 2px;
  background-color: var(--color-accent);
  position: absolute;
  bottom: 0;
  left: 0;
  transform: scaleX(0);
  transition: transform 200ms linear;
}

nav a:hover::after {
  transform: scaleX(1);
}
```

### Circle reveal on hover (::before)

```css
.social-links a {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5rem;
  position: relative;
}

.social-links a::before {
  content: "";
  width: inherit;
  height: inherit;
  border-radius: inherit;
  background-color: var(--color-highlight);
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  transform: scale(0);
  transition: scale 200ms;
}

.social-links a:hover::before {
  transform: scale(1);
}
```

### Logo rotate on hover

```css
.logo img {
  width: 2rem;
  transition: rotate 350ms;
}

.logo img:hover {
  rotate: 90deg;
}
```

## Example

**Before (sem animações):**
```css
nav a { color: white; }
.social-links a { padding: 8px; }
```

**After (com micro-interações):**
```css
nav a {
  position: relative;
}
nav a::after {
  content: "";
  width: 100%;
  height: 2px;
  background-color: var(--sniptap-sky-mid);
  position: absolute;
  bottom: 0;
  left: 0;
  transform: scaleX(0);
  transition: transform 200ms linear;
  opacity: 0;
}
nav a:hover::after {
  transform: scaleX(1);
  opacity: 1;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Link com só ícone | Adicione `title` no `<a>` para acessibilidade |
| Efeito de fundo aparecendo | `::before` com `z-index: -1` e `scale(0)` → `scale(1)` |
| Linha crescendo embaixo do texto | `::after` com `scaleX(0)` → `scaleX(1)` |
| Rotação de ícone | Use propriedade `rotate` direto, com fallback `transform: rotate()` |
| Padding assimétrico no footer | Mais espaço em cima que embaixo (ex: `4rem 2rem 2rem`) |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `width: 0` → `width: 100%` para underline | `transform: scaleX(0)` → `scaleX(1)` |
| Pseudo-elemento sem `content: ""` | Sempre declare `content: ""` mesmo vazio |
| `position: absolute` sem parent relative | Adicione `position: relative` no parent |
| Link de ícone sem texto acessível | `<a href="#" title="Instagram">` |
| `z-index: 999` no fundo | `z-index: -1` para jogar atrás |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre pseudo-elementos, z-index e transições
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-adicionando-o-rodape-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-adicionando-o-rodape-1/references/code-examples.md)
