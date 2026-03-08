---
name: rs-next-js-componente-avatar-2024
description: "Applies the React compound component pattern when building reusable UI components in Next.js. Use when user asks to 'create a component', 'build an avatar', 'avoid code duplication', 'compound pattern', or 'reusable component with subcomponents'. Enforces splitting components into composable pieces (Container, Image, Content, Title, Description) exported as a single namespace object. Make sure to use this skill whenever creating components that appear in multiple places with slight variations. Not for simple single-use components, API routes, or state management."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: componentes-reutilizaveis
  tags: [compound-component, avatar, composition, namespace-export, next-js, react]
---

# Compound Component Pattern — Avatar

> Componentes reutilizaveis com variacoes devem ser construidos como compound components: um objeto namespace exportando subcomponentes composiveis.

## Rules

1. **Quebre o componente em subcomponentes atomicos** — `Container`, `Image`, `Content`, `Title`, `Description`, porque cada peca pode ser recomposta de formas diferentes em cada tela
2. **Exporte como objeto namespace** — `export const Avatar = { Container, Image, Title, Description, Content }`, porque permite `Avatar.Container` que e autodocumentado e evita imports multiplos
3. **Cada subcomponente recebe children** — tipo `React.ReactNode`, porque a composicao vem de fora, nao de props complexas
4. **Reutilize tipagens existentes** — `ImageProps` do Next.js em vez de recriar `src`, `alt`, `width`, `height`, porque evita divergencia de tipos
5. **Use rest/spread para props adicionais** — desestruture o essencial e passe `...rest` no spread, porque mantem flexibilidade sem perder controle
6. **Defina defaults razoaveis** — `width={40} height={40}` no Image, porque reduz boilerplate no uso

## How to write

### Estrutura de arquivos

```
components/
  avatar/
    index.ts              # Namespace object
    avatar-container.tsx
    avatar-content.tsx
    avatar-image.tsx
    avatar-title.tsx
    avatar-description.tsx
```

### Namespace export (index.ts)

```typescript
import { AvatarContainer } from "./avatar-container"
import { AvatarImage } from "./avatar-image"
import { AvatarContent } from "./avatar-content"
import { AvatarTitle } from "./avatar-title"
import { AvatarDescription } from "./avatar-description"

export const Avatar = {
  Container: AvatarContainer,
  Image: AvatarImage,
  Content: AvatarContent,
  Title: AvatarTitle,
  Description: AvatarDescription,
}
```

### Subcomponente com children

```typescript
import { ReactNode } from "react"

type AvatarContainerProps = { children: ReactNode }

export function AvatarContainer({ children }: AvatarContainerProps) {
  return <div className="flex items-center gap-3">{children}</div>
}
```

### Subcomponente reutilizando tipagem existente

```typescript
import Image, { ImageProps } from "next/image"

export function AvatarImage({ src, alt, width = 40, height = 40, ...rest }: ImageProps) {
  return <Image src={src} alt={alt} width={width} height={height} {...rest} />
}
```

## Example

**Before (duplicacao entre PostCard e Post page):**
```typescript
// Em PostCard
<div className="flex items-center gap-3">
  <Image src={post.author.avatar} alt={post.author.name} width={40} height={40} />
  <div className="flex flex-col">
    <strong>{post.author.name}</strong>
  </div>
</div>

// Em Post page — codigo quase identico copiado
<div className="flex items-center gap-3">
  <Image src={post.author.avatar} alt={post.author.name} width={40} height={40} />
  <div className="flex flex-col">
    <strong>{post.author.name}</strong>
    <span>Publicado em {post.date}</span>
  </div>
</div>
```

**After (compound component):**
```typescript
// Em PostCard — versao simples
<Avatar.Container>
  <Avatar.Image src={post.author.avatar} alt={post.author.name} />
  <Avatar.Content>
    <Avatar.Title>{post.author.name}</Avatar.Title>
  </Avatar.Content>
</Avatar.Container>

// Em Post page — versao com descricao
<Avatar.Container>
  <Avatar.Image src={post.author.avatar} alt={post.author.name} />
  <Avatar.Content>
    <Avatar.Title>{post.author.name}</Avatar.Title>
    <Avatar.Description>
      Publicado em <time dateTime={post.date}>{publishDate}</time>
    </Avatar.Description>
  </Avatar.Content>
</Avatar.Container>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente aparece em 2+ lugares com variacoes | Compound pattern |
| Componente tem apenas 1 uso | Componente simples, sem compound |
| Subcomponente envolve tag semantica (Image, time) | Reutilize tipagem nativa/do framework |
| Props do subcomponente sao muitas | Desestruture essenciais + rest spread |
| Slug precisa ser unico | Use `===` (strict equal) em vez de `.includes()` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Copiar bloco de JSX entre paginas | Criar compound component reutilizavel |
| `type Props = { src: string; alt: string; width: number }` para Image | `ImageProps` do `next/image` |
| `.includes()` para buscar por slug unico | `===` (strict equal) |
| Um componente gigante com muitas props condicionais | Compound pattern com subcomponentes composiveis |
| `export default function Avatar()` com tudo dentro | Namespace object `export const Avatar = { Container, Image, ... }` |

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

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-componente-avatar-2024/references/deep-explanation.md) — O instrutor identifica um problema classico: o avatar aparece tanto na listagem de posts (PostCard) 
- [code-examples.md](../../../data/skills/next-js/rs-next-js-componente-avatar-2024/references/code-examples.md) — import { ReactNode } from "react"
