---
name: rs-angular-fontes-proprio
description: "Applies custom font integration patterns when working with Angular projects. Use when user asks to 'add a font', 'import font', 'use custom typography', 'configure @font-face', or 'setup fonts in Angular'. Enforces correct asset placement in public/, @font-face declaration in global styles.css, variable font handling, and italic vs simulated italic awareness. Make sure to use this skill whenever adding or configuring fonts in Angular projects. Not for Google Fonts CDN/link imports, icon fonts, or CSS framework typography utilities."
---

# Fontes Próprias no Angular

> Ao importar fontes customizadas, declare @font-face no styles.css global, armazene arquivos em public/fontes/, e sempre importe a variante itálica real em vez de depender da simulação do navegador.

## Rules

1. **Armazene fontes em `public/fontes/`** — porque fontes são assets estáticos copiados para a distribuição final, e o diretório `public/` não precisa ser referenciado no path do CSS
2. **Declare `@font-face` no `styles.css` global** — porque a fonte precisa carregar antes dos componentes e estar disponível em toda a aplicação
3. **Use variable fonts quando disponível** — um único arquivo `.ttf` cobre todos os weights (100-900), em vez de importar arquivos separados por weight
4. **Sempre importe a variante itálica real** — porque o navegador simula itálico quando não encontra a variante, gerando resultado visual inferior ao itálico desenhado pelo tipógrafo
5. **Mantenha o font-family igual ao nome original da fonte** — porque facilita identificação e é boa prática de nomenclatura
6. **Adicione fallback no font-family** — `'Cascadia Code', sans-serif` para cobrir falhas de carregamento

## How to write

### Estrutura de arquivos

```
public/
└── fontes/
    ├── CascadiaCode-Regular.ttf      # variable font normal
    └── CascadiaCode-Italic.ttf       # variable font italic
```

### @font-face no styles.css

```css
/* styles.css — fonte normal (variable font) */
@font-face {
  font-family: 'Cascadia Code';
  src: url('/fontes/CascadiaCode-Regular.ttf');
  font-weight: 100 900;
  font-style: normal;
}

/* styles.css — fonte itálica (variable font) */
@font-face {
  font-family: 'Cascadia Code';
  src: url('/fontes/CascadiaCode-Italic.ttf');
  font-weight: 100 900;
  font-style: italic;
}
```

### Aplicação no componente

```css
p {
  font-family: 'Cascadia Code', sans-serif;
  font-weight: 600;
  font-style: italic;
}
```

## Example

**Before (itálico simulado pelo navegador):**
```css
/* Só importou a fonte normal, sem a variante itálica */
@font-face {
  font-family: 'Cascadia Code';
  src: url('/fontes/CascadiaCode-Regular.ttf');
  font-weight: 100 900;
  font-style: normal;
}

p {
  font-family: 'Cascadia Code', sans-serif;
  font-style: italic; /* navegador vai SIMULAR o itálico — resultado inferior */
}
```

**After (itálico real do tipógrafo):**
```css
@font-face {
  font-family: 'Cascadia Code';
  src: url('/fontes/CascadiaCode-Regular.ttf');
  font-weight: 100 900;
  font-style: normal;
}

@font-face {
  font-family: 'Cascadia Code';
  src: url('/fontes/CascadiaCode-Italic.ttf');
  font-weight: 100 900;
  font-style: italic;
}

p {
  font-family: 'Cascadia Code', sans-serif;
  font-style: italic; /* usa o arquivo itálico REAL */
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Fonte tem pasta `static/` com arquivos separados por weight | Use o variable font (arquivo único) se navegadores modernos bastam |
| Precisa suportar navegadores muito antigos | Importe arquivos static separados com font-weight específico (ex: `700`) |
| Fonte não tem variante itálica | Aceite a simulação do navegador, mas documente a limitação |
| Múltiplas fontes no projeto | Crie subpastas em `public/fontes/` por família |
| Path do CSS não funciona | Não inclua `public/` no path — use `/fontes/arquivo.ttf` diretamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `src: url('/public/fontes/...')` | `src: url('/fontes/...')` |
| `@font-face` dentro do CSS do componente | `@font-face` no `styles.css` global |
| `font-weight: bold` no @font-face de variable font | `font-weight: 100 900` |
| Mesmo `font-style: normal` para ambas variantes | `font-style: normal` para regular, `font-style: italic` para itálica |
| `font-family: 'Minha Fonte Custom'` para Cascadia Code | `font-family: 'Cascadia Code'` (nome original) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
