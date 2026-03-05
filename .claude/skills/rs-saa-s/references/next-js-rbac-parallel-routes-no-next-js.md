---
name: rs-saas-nextjs-rbac-parallel-routes
description: "Applies Next.js Parallel Routes pattern when structuring layouts with multiple simultaneous page slots. Use when user asks to 'create a layout with multiple content areas', 'show two pages at once', 'add a parallel route', 'use @folder convention', or 'combine parallel and interception routes'. Ensures correct folder naming with @ prefix, default.tsx files, and layout slot props. Make sure to use this skill whenever building Next.js App Router layouts that need multiple content slots beyond children. Not for API routes, middleware, or server actions."
---

# Parallel Routes no Next.js

> Usar Parallel Routes para renderizar multiplos conteudos de pagina simultaneamente no mesmo layout, cada um controlado por sua propria arvore de rotas.

## Rules

1. **Crie pastas com prefixo @** — `@nomeDaSlot` dentro de `app/`, porque o Next reconhece o `@` como slot de Parallel Route e injeta automaticamente no layout
2. **Sempre crie um `default.tsx`** — cada pasta `@slot` precisa de um `default.tsx`, porque o Next usa esse arquivo como fallback quando nenhuma rota especifica bate
3. **Receba slots como props no layout** — alem de `children`, cada `@slot` vira uma prop no layout com o mesmo nome (sem o `@`), porque o Next injeta automaticamente
4. **Layouts nao recarregam ao mudar de rota** — coloque conteudo dinamico (como headers que dependem da URL) dentro de `page.tsx`, nao no `layout.tsx`, porque o layout persiste entre navegacoes
5. **Combine com Interception Routes para modais** — Parallel Routes brilham quando combinadas com Interception Routes `(.)`, `(..)`, porque permitem exibir modais que tambem funcionam como paginas independentes

## How to write

### Estrutura de pastas

```
app/
├── layout.tsx          # Recebe children + slots
├── page.tsx            # children (pagina principal)
├── @nomeDaSlot/
│   ├── default.tsx     # Fallback obrigatorio
│   └── page.tsx        # Conteudo do slot na rota raiz
│       └── alguma-rota/
│           └── page.tsx # Conteudo do slot nessa rota
```

### Layout recebendo slots

```typescript
export default function Layout({
  children,
  nomeDaSlot,
}: {
  children: React.ReactNode
  nomeDaSlot: React.ReactNode
}) {
  return (
    <div>
      {children}
      {nomeDaSlot}
    </div>
  )
}
```

### Default file (fallback)

```typescript
// app/@nomeDaSlot/default.tsx
export default function Default() {
  return null // ou conteudo fallback
}
```

## Example

**Before (header no layout que nao recarrega):**
```typescript
// app/org/[slug]/layout.tsx
export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header /> {/* NAO recarrega ao trocar de rota */}
      {children}
    </div>
  )
}
```

**After (header na page, slot via Parallel Route):**
```typescript
// app/org/[slug]/layout.tsx
export default function OrgLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <div>
      {children}
      {modal}
    </div>
  )
}

// app/org/[slug]/page.tsx
export default function OrgPage() {
  return (
    <div>
      <Header /> {/* Recarrega a cada navegacao */}
      <p>Projects</p>
    </div>
  )
}

// app/org/[slug]/@modal/default.tsx
export default function ModalDefault() {
  return null
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de modal que tambem funciona como pagina | Parallel Route + Interception Route |
| Header depende de dados da URL (org, user) | Coloque no `page.tsx`, nao no `layout.tsx` |
| Slot nao tem conteudo em certas rotas | Crie `default.tsx` retornando `null` |
| Dois paineis independentes na mesma URL | Cada painel e um `@slot` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Colocar dados dinamicos de URL no `layout.tsx` | Colocar no `page.tsx` (layout nao recarrega) |
| Criar `@slot` sem `default.tsx` | Sempre criar `default.tsx` como fallback |
| Nomear pasta slot sem `@` | Usar `@nomeDoSlot` (o `@` e obrigatorio) |
| Usar Parallel Routes para conteudo estatico simples | Usar componentes normais importados no layout |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-parallel-routes-no-next-js/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-parallel-routes-no-next-js/references/code-examples.md)
