---
name: rs-a11y-react-textos-alternativos
description: "Enforces correct alternative text practices for images and SVGs in React/HTML. Use when user asks to 'add alt text', 'fix accessibility', 'make images accessible', 'add aria-label', or 'handle SVG accessibility'. Applies rules: describe intent not appearance for logos, never prefix with 'image of', use empty alt for decorative images, use title element inside SVGs, avoid redundant text. Make sure to use this skill whenever creating img tags, SVGs inside links, or fixing accessibility warnings. Not for multimedia audio/video accessibility or ARIA roles/landmarks."
---

# Textos Alternativos para Imagens e SVGs

> Descreva a intencao da imagem, nao sua aparencia visual — logos descrevem a marca, nao o desenho.

## Rules

1. **Descreva a intencao, nao a aparencia** — para logos, escreva `Skillz Blog` nao `foguete roxo inclinado 45 graus com chamas`, porque o texto alternativo deve transmitir o que a imagem representa, nao o que ela mostra visualmente
2. **Nunca prefixe com "imagem de" ou "logo de"** — leitores de tela ja informam que o elemento e uma imagem, entao `alt="Skillz"` nao `alt="Logo da Skillz"`, porque seria informacao redundante
3. **Use alt vazio para imagens decorativas** — `alt=""` faz o leitor de tela ignorar a imagem, mas nunca remova o atributo alt completamente, porque ausencia de alt e um erro critico de acessibilidade
4. **SVGs dentro de links: use aria-label no link** — `<a aria-label="GitHub">` quando o link so contem um SVG sem texto, porque elementos interagiveis precisam de texto discernivel
5. **SVGs standalone: use title como primeiro filho** — `<svg><title>GitHub</title>...</svg>` torna o SVG acessivel sem aria-label externo
6. **Nunca duplique alt e texto visivel** — se a imagem tem `alt="GitHub"` e ao lado tem texto "GitHub", ha redundancia; use `alt=""` na imagem e deixe o texto visivel ser lido

## How to write

### Imagens com alt descritivo
```tsx
// Logo — descreva a marca, nao o visual
<img src="/logo.svg" alt="Skillz Blog" />

// Foto de perfil — descreva quem e
<img src="/avatar.jpg" alt="Diego Fernandes" />
```

### Imagem decorativa (ignorada pelo leitor)
```tsx
// Alt vazio = leitor de tela ignora
<img src="/decorative-divider.svg" alt="" />
```

### SVG dentro de link (aria-label no link)
```tsx
<a href="https://github.com/skillz" aria-label="GitHub">
  <svg>{/* conteudo do SVG */}</svg>
</a>
```

### SVG standalone (title como primeiro filho)
```tsx
<svg width="24" height="24" viewBox="0 0 24 24">
  <title>GitHub</title>
  <path d="..." />
</svg>
```

### Imagem + texto visivel (sem redundancia)
```tsx
// CORRETO: alt vazio quando texto visivel ja descreve
<a href="/github">
  <img src="/github-icon.png" alt="" />
  GitHub
</a>
```

## Example

**Before (erros criticos de acessibilidade):**
```tsx
<img src="/logo.svg" />
<img src="/skillz-blog.svg" />
<a href="https://github.com">
  <svg>
    <path d="M12 0C5.37..." />
  </svg>
</a>
<a href="/profile">
  <img src="/avatar.png" alt="Foto do usuario João" />
  João
</a>
```

**After (com esta skill aplicada):**
```tsx
<img src="/logo.svg" alt="Skillz Blog" />
<img src="/skillz-blog.svg" alt="Skillz Blog" />
<a href="https://github.com" aria-label="GitHub">
  <svg>
    <path d="M12 0C5.37..." />
  </svg>
</a>
<a href="/profile">
  <img src="/avatar.png" alt="" />
  João
</a>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Logo de empresa/produto | Descreva a marca: `alt="Skillz"` |
| Icone SVG dentro de link sem texto | `aria-label` no link OU `<title>` no SVG |
| Imagem puramente decorativa | `alt=""` (vazio, nunca remova o atributo) |
| Imagem + texto visivel identico | `alt=""` na imagem, deixe o texto ser lido |
| Obra de arte / ilusao de otica | `alt=""` ou descricao simplificada — interpretacao visual nao traduz bem |
| Elemento de audio | Nao use alt; coloque texto descritivo adjacente no HTML |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<img src="logo.svg" />` (sem alt) | `<img src="logo.svg" alt="Skillz" />` |
| `alt="Imagem da logo da Skillz"` | `alt="Skillz"` |
| `alt="foguete roxo com chamas"` (logo) | `alt="Skillz Blog"` |
| `<a href="..."><svg>...</svg></a>` (sem label) | `<a href="..." aria-label="GitHub"><svg>...</svg></a>` |
| `alt="GitHub"` + texto visivel "GitHub" | `alt=""` + texto visivel "GitHub" |
| Remover atributo alt completamente | `alt=""` para decorativas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
