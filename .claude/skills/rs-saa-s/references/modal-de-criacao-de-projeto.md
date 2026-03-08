---
name: rs-saas-nextjs-rbac-modal-criacao-projeto
description: "Applies Next.js route interception and parallel routes patterns when building modal-based creation flows in App Router. Use when user asks to 'create a modal route', 'intercept a route', 'open form in sheet/dialog without navigation', 'parallel routes', or 'invalidate query after mutation'. Ensures correct folder naming with dot prefix for interception vs bare name for parallel slots. Make sure to use this skill whenever implementing modal overlays that coexist with existing page content in Next.js App Router. Not for API routes, server actions logic, or non-Next.js modal implementations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: frontend
  tags: [saas, nextjs, project, server-actions]
---

# Modal com Interceptacao de Rotas no Next.js App Router

> Use rotas interceptadas (dot prefix) para abrir modais sobre o conteudo existente sem navegar para uma nova pagina.

## Rules

1. **Use `@` prefix para slots paralelos** — `@sheet` define um slot no layout, porque slots sao posicoes nomeadas onde o Next.js renderiza conteudo paralelo
2. **Use `.` (dot) prefix para interceptar rotas** — `(.)create-project` intercepta a navegacao, porque sem o dot o Next trata como rota paralela e mostra ambos os conteudos simultaneamente
3. **Replique a estrutura de pastas dentro do slot** — se a rota real e `/org/[slug]/create-project`, crie `@sheet/(.)org/[slug]/create-project/page.tsx`, porque o Next precisa da mesma hierarquia para interceptar corretamente
4. **Invalide queries apos mutacoes** — use `queryClient.invalidateQueries({ queryKey })` no callback `onSuccess`, porque isso refaz o fetch e atualiza a UI sem reload manual
5. **Limpe `.next` ao criar rotas interceptadas** — delete a pasta `.next` e reinicie o dev server quando a interceptacao nao funcionar, porque o Next cacheia estruturas de rota agressivamente

## How to write

### Estrutura de pastas para interceptacao

```
app/
├── layout.tsx                          # Renderiza {children} e {sheet}
├── @sheet/
│   ├── (.)create-organization/
│   │   └── page.tsx                    # Modal de criar org
│   └── (.)org/
│       └── [slug]/
│           └── create-project/
│               └── page.tsx            # Modal de criar projeto
└── org/
    └── [slug]/
        └── create-project/
            └── page.tsx                # Pagina real (fallback)
```

### Pagina do slot interceptado

```typescript
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { ProjectForm } from './project-form'

export default function CreateProject() {
  return (
    <InterceptedSheetContent>
      <ProjectForm />
    </InterceptedSheetContent>
  )
}
```

### Invalidacao de query apos criacao

```typescript
'use client'

import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

export function ProjectForm() {
  const { slug: org } = useParams<{ slug: string }>()
  const queryClient = useQueryClient()

  // No onSuccess do form/mutation:
  function handleSuccess() {
    queryClient.invalidateQueries({
      queryKey: [org, 'projects'],
    })
  }
}
```

## Example

**Before (sem interceptacao — navega para pagina nova):**
```
@sheet/
  └── create-project/     # Sem dot prefix = rota paralela
      └── page.tsx         # Mostra AMBOS: pagina + sheet
```

**After (com interceptacao — abre modal sobre pagina atual):**
```
@sheet/
  └── (.)org/
      └── [slug]/
          └── create-project/   # Com dot prefix = intercepta
              └── page.tsx      # Mantem children, mostra so o sheet
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Formulario simples que nao precisa de pagina propria | Intercepte a rota com `(.)` no slot |
| Rota interceptada nao funciona apos criar pastas | Delete `.next/`, reinicie dev server |
| Dados precisam atualizar apos criar recurso | `invalidateQueries` com a queryKey correspondente |
| Estrutura de rota tem segmentos dinamicos | Replique `[slug]` identicamente no slot |
| Rota paralela mostra dois conteudos | Faltou o dot prefix `(.)` — adicione |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Slot sem dot prefix para modal | `(.)` prefix para interceptar navegacao |
| Reload manual (`window.location.reload()`) | `queryClient.invalidateQueries()` |
| Estrutura diferente no slot vs rota real | Mesma hierarquia de pastas exata |
| Ignorar cache do Next quando rota nao funciona | Delete `.next/` e reinicie |

## Troubleshooting

### Server action nao executa
**Symptom:** Formulario submete mas nada acontece
**Cause:** A funcao nao tem a diretiva 'use server' ou o componente nao esta usando 'use client'
**Fix:** Adicione 'use server' no topo do arquivo da action e 'use client' no componente do formulario

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
