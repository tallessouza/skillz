---
name: rs-a11y-react-conhecendo-leitores-tela
description: "Enforces screen reader compatibility when writing React/HTML components. Use when user asks to 'create a component', 'add an image', 'build navigation', 'write accessible markup', or any UI code generation. Applies rules: meaningful alt text on images, aria-label on interactive elements, aria-hidden on decorative content, no redundant screen reader output. Make sure to use this skill whenever generating HTML or JSX with images, icons, or decorative text. Not for backend code, API design, or CSS-only styling tasks."
---

# Leitores de Tela — Escrevendo Markup Compatível

> Todo elemento visível deve ter uma leitura coerente por leitor de tela: informativo lê conteúdo útil, decorativo é ocultado.

## Rules

1. **Toda imagem informativa tem `alt` descritivo** — `alt="Blog da Rocketseat"` não `alt="logo"`, porque o leitor de tela anuncia exatamente o texto do alt como substituto visual
2. **Links e botões têm `aria-label` quando o conteúdo visual não é texto** — ícone de GitHub sem texto precisa de `aria-label="GitHub"`, porque o leitor anuncia "link" mas sem label não sabe o destino
3. **Elementos decorativos recebem `aria-hidden="true"`** — texto simbólico, ícones ilustrativos, separadores visuais, porque o leitor lê caractere por caractere gerando ruído (ex: "e-explorer", "r-rocketseat")
4. **`aria-label` sobrescreve conteúdo interno** — quando o conteúdo textual interno é confuso para leitura, use `aria-label` no container para o leitor ignorar filhos e ler apenas o label
5. **Nunca duplique informação** — se a imagem tem `alt="GitHub"` e o link tem `aria-label="GitHub"`, o leitor anuncia "GitHub" duas vezes; escolha um ponto de anúncio
6. **Teste com leitor de tela real** — ChromeVox (extensão Chrome gratuita com suporte pt-BR), NVDA (Windows), VoiceOver (macOS/iOS), porque problemas de redundância e leitura indesejada só aparecem ao ouvir

## How to write

### Imagem informativa com alt

```tsx
// Leitor anuncia: "Blog da Rocketseat, imagem"
<img src="/logo.svg" alt="Blog da Rocketseat" />
```

### Link com ícone (sem texto visível)

```tsx
// Leitor anuncia: "GitHub, link, navegação"
<nav>
  <a href="https://github.com/rocketseat" aria-label="GitHub">
    <GithubIcon />
  </a>
</nav>
```

### Texto decorativo/simbólico oculto

```tsx
// SEM aria-hidden: leitor lê "e-explorer" (caractere por caractere)
// COM aria-hidden: leitor ignora completamente
<div aria-hidden="true">
  <span className="symbol">e-</span>explorer
</div>
```

### Sobrescrevendo leitura com aria-label

```tsx
// Leitor lê apenas "Explorer" em vez do conteúdo interno confuso
<div aria-label="Explorer">
  <span className="decorative">e-</span>
  <span>explorer</span>
</div>
```

## Example

**Before (leitor de tela lê ruído):**
```tsx
<header>
  <img src="/logo.svg" />
  <nav>
    <a href="https://github.com/rocketseat">
      <GithubIcon />
    </a>
  </nav>
</header>
<section>
  <div>e-explorer</div>
  <div>r-rocketseat</div>
  <div>d-discover</div>
</section>
```
Leitor anuncia: *"imagem... link... e-explorer... r-rocketseat... d-discover"*

**After (leitura limpa e coerente):**
```tsx
<header>
  <img src="/logo.svg" alt="Blog da Rocketseat" />
  <nav>
    <a href="https://github.com/rocketseat" aria-label="GitHub">
      <GithubIcon aria-hidden="true" />
    </a>
  </nav>
</header>
<section>
  <div aria-label="Explorer">
    <span aria-hidden="true">e-</span>explorer
  </div>
  <div aria-label="Rocketseat">
    <span aria-hidden="true">r-</span>rocketseat
  </div>
  <div aria-label="Discover">
    <span aria-hidden="true">d-</span>discover
  </div>
</section>
```
Leitor anuncia: *"Blog da Rocketseat, imagem... GitHub, link, navegação... Explorer... Rocketseat... Discover"*

## Heuristics

| Situation | Do |
|-----------|-----|
| Imagem com significado (logo, foto de produto) | `alt` descritivo do conteúdo |
| Imagem puramente decorativa (separador, background) | `alt=""` (string vazia, não omitir) |
| Ícone dentro de link/botão sem texto | `aria-label` no link/botão + `aria-hidden` no ícone |
| Texto simbólico/ilustrativo (prefixos decorativos) | `aria-hidden="true"` no container decorativo |
| Conteúdo interno confuso mas elemento interativo | `aria-label` sobrescreve a leitura |
| Dúvida se algo é decorativo ou informativo | Teste com leitor de tela — se a leitura não agrega, oculte |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<img src="logo.svg" />` (sem alt) | `<img src="logo.svg" alt="Blog da Rocketseat" />` |
| `<a href="..."><Icon /></a>` (sem label) | `<a href="..." aria-label="GitHub"><Icon aria-hidden="true" /></a>` |
| `<div>e-explorer</div>` (texto simbólico exposto) | `<div aria-hidden="true">e-</div>` ou `<div aria-label="Explorer">...` |
| `alt="imagem"` / `alt="logo"` (genérico) | `alt="Blog da Rocketseat"` (descreve o conteúdo) |
| `alt` + `aria-label` com mesmo texto no mesmo elemento | Escolha um: `alt` para imagem OU `aria-label` para container |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
