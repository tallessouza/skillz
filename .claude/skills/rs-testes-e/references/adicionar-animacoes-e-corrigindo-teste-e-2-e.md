---
name: rs-testes-e-adicionar-animacoes-e-corrigindo-teste-e-2-e
description: "Applies Motion (Framer Motion) animation patterns and fixes E2E test failures caused by state desync in Next.js projects. Use when user asks to 'add animations', 'add micro interactions', 'fix e2e test failure', 'fix Firefox test failure', 'use Motion library', or 'add transitions to components'. Enforces motion.element patterns, short durations for micro interactions, router.refresh after mutations, and centralized test mocks. Make sure to use this skill whenever implementing UI animations with Motion or debugging E2E failures related to state sync. Not for CSS-only animations (use rs-masterizando), Tailwind transitions, or unit test writing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: animacoes-e-e2e
  tags: [motion, framer-motion, animation, e2e, playwright, router-refresh, next-js]
---

# Animacoes com Motion e Correcao de Testes E2E

> Utilizar motion.element para micro interacoes suaves e garantir que mudancas de estado sincronizem com router.refresh para nao quebrar testes E2E.

## Rules

1. **Instale `motion` (nao framer-motion)** — `pnpm install motion`, importar de `motion/react`, porque a biblioteca foi renomeada
2. **Use `motion.element` em vez de tags HTML** — `motion.span`, `motion.li`, `motion.div` habilitam props de animacao sem quebrar a app existente
3. **Duracoes curtas para micro interacoes** — 0.15 a 0.3 segundos, porque duracoes longas (0.5+) dao impressao de travamento
4. **Use `router.refresh()` apos mutacoes** — sem refresh o estado fica dessincronizado e testes E2E (especialmente Firefox/WebKit) falham
5. **Centralize mocks repetidos no jest.setup.ts** — se 2+ arquivos usam o mesmo mock, mova para setup global
6. **Extraia constantes de animacao** — `INITIAL_MOTION`, `FADE_TRANSITION` em uppercase fora do componente

## How to write

### Botao com transicao de texto

```tsx
import { motion } from "motion/react"

<motion.span
  key={isCopied ? "copied" : "copy"}
  initial={{ opacity: 0, y: 2 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.15 }}
>
  {isCopied ? "Copiado" : "Copiar"}
</motion.span>
```

### Card com animacao de saida

```tsx
<motion.li
  initial={{ opacity: 1, height: "auto" }}
  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
  aria-label={prompt.title}
>
  {/* conteudo */}
</motion.li>
```

### Fix de delecao com router.refresh

```tsx
async function handleDelete() {
  await deletePrompt(id)
  router.refresh() // Essencial para Firefox/WebKit
}
```

## Example

**Before (delecao sem refresh — quebra E2E no Firefox):**
```tsx
async function handleDelete() {
  await deletePrompt(id)
  // Estado fica stale, Firefox E2E falha
}
```

**After (com router.refresh):**
```tsx
async function handleDelete() {
  await deletePrompt(id)
  router.refresh()
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Troca de texto em botao | `motion.span` com `key` dinamica |
| Item removido de lista | `motion.li` com `exit` animando height para 0 |
| Lista aparecendo | `motion.ol` com offset no initial |
| Constantes de animacao em 2+ elementos | Extrair para uppercase fora do componente |
| Teste E2E falha apenas no Firefox | Verificar falta de `router.refresh()` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `duration: 0.5` para micro interacoes | `duration: 0.15` — rapido e suave |
| Deletar sem `router.refresh()` | Sempre chamar apos mutacao server-side |
| Repetir mock de next/navigation em cada arquivo | Centralizar no jest.setup.ts |
| Constantes de animacao inline no JSX | Extrair fora do componente |

## Troubleshooting

### Teste E2E falha no Firefox mas passa no Chrome
**Symptom:** Delecao funciona visualmente mas E2E Firefox nao encontra elemento atualizado
**Cause:** Estado server-side nao foi resincronizado apos mutacao
**Fix:** Adicionar `router.refresh()` imediatamente apos a action de mutacao

### Animacao nao aparece
**Symptom:** Componente renderiza mas sem transicao
**Cause:** Usando tag HTML direta ao inves de motion.element
**Fix:** Substituir `<span>` por `<motion.span>` com props initial/animate

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
