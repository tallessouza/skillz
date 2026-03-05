---
name: rs-full-stack-dicas-e-aprendizados
description: "Applies responsive CSS best practices when writing stylesheets or media queries. Use when user asks to 'make responsive', 'add media queries', 'mobile first', 'desktop first', 'use rem', 'organize CSS files', or any responsive layout task. Enforces simultaneous mobile+desktop strategy, 62.5% font-size trick, media query placement near related rules, and bundler awareness. Make sure to use this skill whenever generating responsive CSS. Not for JavaScript logic, backend code, or non-CSS layout tasks."
---

# Dicas de Responsividade CSS

> Escreva CSS responsivo considerando mobile e desktop simultaneamente, use unidades relativas com consciencia, e mantenha media queries proximas ao codigo que modificam.

## Rules

1. **Desenvolva mobile e desktop ao mesmo tempo** — para layouts complexos, construa a estrutura atendendo ambos desde o inicio, porque ajustar depois em layouts complexos muda muita coisa
2. **Use a estrategia que o layout pede** — Mobile First funciona bem para layouts simples (pouca mudanca ao escalar), mas layouts complexos exigem construcao simultanea
3. **Media queries usam sempre 16px como base** — `em`/`rem` dentro de `@media` sempre referencia o valor initial do navegador (16px), independente de `font-size` no `:root`, porque media queries nao herdam do root
4. **Mantenha media queries proximas ao codigo relacionado** — coloque o `@media` do `:root` perto do `:root`, nao em arquivo separado, porque ir e voltar entre arquivos causa confusao
5. **Arquivos CSS separados afetam performance** — cada arquivo e uma requisicao HTTP adicional; em producao, use um bundler para empacotar tudo em um arquivo so
6. **Use 62.5% trick com consciencia** — `html { font-size: 62.5% }` faz 1rem = 10px (facilitando conversao), mas nao pode ser removido depois sem quebrar todos os valores rem do projeto

## How to write

### Estrategia simultanea (mobile + desktop)

```css
/* Estrutura que atende ambos desde o inicio */
.container {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  grid-template-columns: 1fr; /* mobile por padrao */
}

@media (min-width: 48em) {
  .container {
    grid-template-columns: 1fr 1fr; /* desktop */
  }
}
```

### 62.5% font-size trick

```css
:root {
  font-size: 62.5%; /* 62.5% de 16px = 10px → 1rem = 10px */
}

h1 {
  font-size: 4rem; /* 40px */
}

p {
  font-size: 1.6rem; /* 16px */
}

/* Conversao: valor_em_px / 10 = valor_em_rem */
```

### Media queries proximas ao codigo

```css
/* BOM: media query perto do que modifica */
:root {
  --spacing: 1rem;
  --font-base: 1.6rem;
}

@media (min-width: 48em) {
  :root {
    --spacing: 2rem;
    --font-base: 1.8rem;
  }
}

.header { /* ... */ }

@media (min-width: 48em) {
  .header { /* ... */ }
}
```

## Example

**Before (problemas comuns):**
```css
/* Tudo em px, media queries em arquivo separado */
h1 { font-size: 48px; }
.container { max-width: 1200px; padding: 20px; }

/* Em outro arquivo: responsive.css */
@media (max-width: 768px) {
  h1 { font-size: 32px; }
  .container { padding: 10px; }
}
```

**After (com esta skill aplicada):**
```css
:root {
  font-size: 62.5%;
}

h1 { font-size: 4.8rem; }

@media (min-width: 48em) {
  h1 { font-size: 3.2rem; }
}

.container {
  max-width: 120rem;
  padding: 2rem;
}

@media (max-width: 48em) {
  .container { padding: 1rem; }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Layout simples, poucas diferencas mobile/desktop | Mobile First (min-width) |
| Layout complexo, estrutura muda muito | Desenvolva ambos simultaneamente |
| Valores em media queries | Sempre calcule com base em 16px (1em = 16px) |
| Muitos arquivos CSS em producao | Use bundler (Vite, Webpack, etc.) |
| Estudando/prototipando | Arquivos separados OK |
| Media query de uma secao | Coloque logo abaixo da secao no mesmo arquivo |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Media queries todas em arquivo separado | Media queries proximas ao codigo que modificam |
| `@media (max-width: 768px)` com px | `@media (max-width: 48em)` com em |
| Aplicar 62.5% trick e depois remover | Se usar, mantenha durante todo o projeto |
| 10+ arquivos CSS sem bundler em producao | Use bundler para empacotar em um so |
| Assumir que rem em media query herda do root | rem/em em media query sempre usa 16px base |
| Fazer todo mobile, depois todo desktop | Para layouts complexos, faca simultaneamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre Mobile First vs Desktop First, regra de tres do 62.5%, e como media queries calculam unidades
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes e cenarios reais

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-dicas-e-aprendizados/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-dicas-e-aprendizados/references/code-examples.md)
