---
name: rs-testes-arquitetura-animacoes-e2e
description: "Applies Motion (Framer Motion) animation patterns and fixes E2E test failures in Next.js projects. Use when user asks to 'add animations', 'add micro interactions', 'fix e2e test', 'fix Firefox test failure', 'add transitions to components', or 'use Motion library'. Covers motion.element patterns, initial/animate/exit props, router.refresh for deletion sync, and centralizing test mocks in Jest setup. Make sure to use this skill whenever implementing UI animations with Motion in React/Next.js or debugging E2E test failures related to state sync. Not for CSS-only animations, Tailwind transitions, or unit test writing from scratch."
---

# Animacoes com Motion e Correcao de Testes E2E

> Utilizar motion.element para micro interacoes suaves e garantir que mudancas de estado (como delecao) sincronizem corretamente com router.refresh para nao quebrar testes E2E.

## Rules

1. **Instale apenas `motion`** — `pnpm install motion`, importar de `motion/react`, porque a biblioteca foi renomeada de Framer Motion para apenas Motion
2. **Use `motion.element` em vez de tags HTML diretas** — `motion.span`, `motion.li`, `motion.div`, porque isso habilita props de animacao sem quebrar a aplicacao existente
3. **Duracoes curtas para micro interacoes** — 0.15 a 0.3 segundos, porque duracoes longas (0.5+) dao impressao de travamento
4. **Use `router.refresh()` apos acoes de mutacao** — porque sem refresh o estado fica dessincronizado e testes E2E (especialmente Firefox/WebKit) falham
5. **Centralize mocks repetidos no Jest setup** — se 2+ arquivos de teste usam o mesmo mock (ex: `next/navigation`), mova para `jest.setup.ts`, porque evita duplicacao e inconsistencia
6. **Extraia constantes de animacao para fora do componente** — `INITIAL_MOTION`, `FADE_TRANSITION` em uppercase, porque sao valores estaticos que nao dependem de estado

## How to write

### Botao com transicao de texto (copy button pattern)

```tsx
import { motion } from "motion/react"

// Use key para forcar re-render na troca de estado
<motion.span
  key={isCopied ? "copied" : "copy"}
  initial={{ opacity: 0, y: 2 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -2 }}
  transition={{ duration: 0.15 }}
>
  {isCopied ? "Copiado" : "Copiar"}
</motion.span>
```

### Card com animacao de saida (delecao)

```tsx
<motion.li
  initial={{ opacity: 1, height: "auto" }}
  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
  aria-label={prompt.title}
>
  {/* conteudo do card */}
</motion.li>
```

### Lista com entrada lateral

```tsx
<motion.ol
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
  layout
>
  {/* items */}
</motion.ol>
```

### Sidebar com fade escalonado

```tsx
const INITIAL_MOTION = { opacity: 0 }
const FADE_TRANSITION = { duration: 0.2, delay: 0.1 }

<motion.aside
  initial={false}
  transition={{ duration: 0.3 }}
>
  <motion.div
    initial={INITIAL_MOTION}
    animate={{ opacity: 1 }}
    transition={FADE_TRANSITION}
  >
    {/* header */}
  </motion.div>
  <motion.nav
    initial={INITIAL_MOTION}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={FADE_TRANSITION}
  >
    {/* navigation */}
  </motion.nav>
</motion.aside>
```

### Fix de delecao com router.refresh

```tsx
import { useRouter } from "next/navigation"

const router = useRouter()

async function handleDelete() {
  await deletePrompt(id)
  router.refresh() // Essencial para sincronizar estado no Firefox/WebKit
  return
}
```

## Example

**Before (delecao sem refresh — quebra E2E no Firefox):**
```tsx
async function handleDelete() {
  await deletePrompt(id)
  // Sem refresh: item some visualmente mas estado fica stale
  // Firefox E2E test falha ao tentar deletar novamente
}
```

**After (com router.refresh — testes passam em todos os browsers):**
```tsx
async function handleDelete() {
  await deletePrompt(id)
  router.refresh()
  return
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Troca de texto em botao (copy/copied) | `motion.span` com `key` dinamica para forcar re-render |
| Item sendo removido de lista | `motion.li` com `exit` animando height para 0 |
| Lista aparecendo na tela | `motion.ol` com `x` ou `y` offset no initial |
| Sidebar/paineis laterais | `motion.aside` com `initial={false}` para evitar animacao no mount |
| Constantes de animacao usadas em 2+ elementos | Extrair para constantes uppercase fora do componente |
| Mock de `next/navigation` usado em 3+ testes | Centralizar no `jest.setup.ts` |
| Teste E2E falha apenas no Firefox | Verificar se falta `router.refresh()` apos mutacoes |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `transition={{ duration: 0.5 }}` para micro interacoes | `transition={{ duration: 0.15 }}` — rapido e suave |
| Deletar item sem `router.refresh()` | Sempre chamar `router.refresh()` apos mutacao server-side |
| Repetir `jest.mock("next/navigation")` em cada arquivo | Centralizar no `jest.setup.ts`, sobrescrever so quando necessario |
| Deixar constantes de animacao inline no JSX | Extrair `INITIAL_MOTION`, `FADE_TRANSITION` fora do componente |
| `<li>` sem `aria-label` em cards interativos | `<motion.li aria-label={prompt.title}>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
