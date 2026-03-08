---
name: rs-next-js-componente-active-link-1
description: "Applies the ActiveLink component pattern when building navigation in Next.js Pages Router. Use when user asks to 'create a nav', 'build a header', 'highlight active link', 'mark current page in menu', or 'refactor navigation'. Enforces useRouter-based active detection, component composition with Link props extension, and separation of concerns. Make sure to use this skill whenever building navigation components in Next.js Pages Router. Not for App Router, not for styling systems, not for layout structure."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: componentes-navegacao
  tags: [active-link, useRouter, navigation, pages-router, next-js, LinkProps]
---

# Componente ActiveLink — Next.js Pages Router

> Extraia logica de navegacao ativa para um componente reutilizavel que estende Link do Next.js, mantendo o header limpo.

## Rules

1. **Nunca duplique logica de link ativo no header** — se dois ou mais links compartilham logica de deteccao de rota ativa, extraia para um componente ActiveLink, porque duplicacao dificulta manutencao e gera inconsistencias
2. **Estenda LinkProps do Next.js** — o ActiveLink deve aceitar todas as props que o Link nativo aceita via `extends LinkProps`, porque isso garante compatibilidade total sem reescrever a API
3. **Use useRouter para detectar rota ativa** — compare `router.asPath` com o `href` recebido, usando igualdade exata OU `startsWith`, porque cobre tanto rotas exatas quanto rotas aninhadas
4. **Separe responsabilidades** — o header nao deve conter logica de deteccao de rota ativa, delegue isso ao ActiveLink, porque cada componente deve ter uma unica responsabilidade
5. **Exporte via barrel file** — crie `index.ts` no diretorio do componente para exportar, porque padroniza imports no projeto

## How to write

### Interface com extensao de LinkProps

```typescript
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

interface ActiveLinkProps extends LinkProps {
  children: ReactNode
}
```

### Componente ActiveLink completo

```typescript
export function ActiveLink({ children, href, ...rest }: ActiveLinkProps) {
  const router = useRouter()

  const isCurrentPath =
    router.asPath === String(href) ||
    router.asPath.startsWith(String(href))

  return (
    <Link href={href} {...rest} className={isCurrentPath ? 'active' : ''}>
      {children}
    </Link>
  )
}
```

### Uso no Header (limpo)

```tsx
<nav>
  <ActiveLink href="/">Início</ActiveLink>
  <ActiveLink href="/blog">Blog</ActiveLink>
</nav>
```

## Example

**Before (logica duplicada no header):**
```tsx
export function Header() {
  const router = useRouter()
  const isHome = router.asPath === '/'
  const isBlog = router.asPath === '/blog' || router.asPath.startsWith('/blog')

  return (
    <nav>
      <Link href="/" className={cn(isHome && 'active')}>Início</Link>
      <Link href="/blog" className={cn(isBlog && 'active')}>Blog</Link>
    </nav>
  )
}
```

**After (delegado ao ActiveLink):**
```tsx
export function Header() {
  return (
    <nav>
      <ActiveLink href="/">Início</ActiveLink>
      <ActiveLink href="/blog">Blog</ActiveLink>
    </nav>
  )
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Dois links com mesma logica de ativo | Extraia para ActiveLink |
| Botao que deveria ser link | Use `asChild` ou substitua por Link com estilo de botao |
| Rota com subrotas (ex: /blog/post-1) | Use `startsWith` na comparacao |
| href pode ser string ou UrlObject | Converta com `String(href)` antes de comparar |
| Link nao precisa de deteccao ativa | Use Link nativo do Next.js |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Duplicar logica de rota ativa em cada link | Criar componente ActiveLink reutilizavel |
| Verificar rota ativa no header/layout | Delegar para o componente de link |
| Criar ActiveLink sem estender LinkProps | `interface ActiveLinkProps extends LinkProps` |
| Comparar apenas com `===` (ignora subrotas) | Usar `=== OR startsWith` |
| Deixar botao sem href quando deveria navegar | Converter para Link ou usar `asChild` |

## Troubleshooting

### Componente nao renderiza ou renderiza vazio
**Symptom:** Componente importado corretamente mas nao aparece na tela
**Cause:** Falta de export default/named, ou props obrigatorias nao passadas
**Fix:** Verificar que o componente tem export correto (default ou named). Checar TypeScript props para garantir que todas as props obrigatorias estao sendo passadas

### Props nao atualizam o componente
**Symptom:** Componente mostra dados antigos mesmo quando props mudam
**Cause:** Componente nao re-renderiza por falta de key unica em listas, ou estado interno sobrescreve props
**Fix:** Adicionar `key` unica em elementos de lista. Se usando estado interno, sincronizar com props via useEffect ou derivar estado das props

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-componente-active-link-1/references/deep-explanation.md) — O instrutor identifica um "forte indicativo" de que um componente deve ser criado: **codigo duplicad
- [code-examples.md](../../../data/skills/next-js/rs-next-js-componente-active-link-1/references/code-examples.md) — src/
