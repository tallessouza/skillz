---
name: rs-tailwind-estrutura-do-layout
description: "Applies dashboard layout structure patterns using Tailwind CSS grid with sidebar and content areas. Use when user asks to 'create a layout', 'add a sidebar', 'build a dashboard', 'structure a page with grid', or 'split content into columns'. Enforces min-h-screen, grid with minmax for flexible sidebars, and tailwind.config extension over arbitrary values. Make sure to use this skill whenever building page layouts with fixed sidebar and dynamic content areas. Not for form styling, component design, or responsive breakpoints."
---

# Estrutura do Layout

> Defina a estrutura de layout separando areas fixas (sidebar) de areas dinamicas (conteudo) usando CSS Grid com minmax para flexibilidade.

## Rules

1. **Sempre aplique min-h-screen no container raiz** — porque HTML/body nao ocupam 100% da altura por padrao, e sem isso nao e possivel centralizar conteudo verticalmente ou usar alturas relativas a tela
2. **Use CSS Grid para dividir sidebar e conteudo** — `grid grid-cols-app` e mais semantico que flex para layouts de duas colunas com tamanhos distintos, porque define as colunas explicitamente
3. **Use minmax() para sidebars flexiveis** — `minmax(18rem, 20rem)` permite que a sidebar reduza em telas menores sem quebrar, porque valores fixos em pixels nao se adaptam
4. **Estenda o tailwind.config ao inves de usar valores arbitrarios** — `grid-cols-app` e mais legivel que `grid-cols-[minmax(18rem,20rem)_1fr]`, porque valores arbitrarios sao dificeis de ler e manter
5. **Use rem ao inves de pixels** — unidades relativas se adaptam melhor a diferentes configuracoes de fonte do usuario
6. **Envolva o conteudo em uma div dentro do body** — nao estilize o body diretamente, porque uma div oferece mais controle

## How to write

### Container raiz do layout

```tsx
// No layout.tsx (Next.js) ou equivalente
<div className="min-h-screen grid grid-cols-app">
  <aside className="border-r border-zinc-200 px-5 py-8">
    {/* Sidebar — fixa entre paginas */}
  </aside>
  <main className="px-4 pb-12 pt-8">
    {children} {/* Conteudo dinamico */}
  </main>
</div>
```

### Configuracao do grid no tailwind.config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      gridTemplateColumns: {
        app: 'minmax(18rem, 20rem) 1fr',
      },
    },
  },
}
```

## Example

**Before (valores arbitrarios, dificil de ler):**
```tsx
<div className="min-h-screen grid grid-cols-[250px_1fr]">
  <aside>Sidebar</aside>
  <main>{children}</main>
</div>
```

**After (config estendido, flexivel):**
```tsx
<div className="min-h-screen grid grid-cols-app">
  <aside className="border-r border-zinc-200 px-5 py-8">
    Sidebar
  </aside>
  <main className="px-4 pb-12 pt-8">
    {children}
  </main>
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Sidebar fixa + conteudo dinamico | Grid com minmax na sidebar e 1fr no conteudo |
| Valor CSS muito especifico da app | Estenda o tailwind.config, nao use valores arbitrarios |
| Precisa centralizar conteudo na tela | min-h-screen no container + flex items-center |
| Valores arbitrarios com espacos | Use underline `_` como separador (Tailwind converte para espaco) |
| Nao lembra a classe Tailwind | Digite o nome da propriedade CSS e use autocomplete |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `grid-cols-[250px_1fr]` inline | `grid-cols-app` via tailwind.config |
| `style={{ minHeight: '100vh' }}` | `min-h-screen` |
| Estilizar `<body>` diretamente | Wrapper `<div>` dentro do body |
| `width: 312px` fixo na sidebar | `minmax(18rem, 20rem)` para flexibilidade |
| Valores em pixels no config | Valores em rem (18rem = 288px, 20rem = 320px) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-estrutura-do-layout/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-estrutura-do-layout/references/code-examples.md)
