---
name: rs-next-js-hook-compartilhamento-pt1
description: "Enforces patterns for creating social sharing hooks in React/Next.js applications. Use when user asks to 'create a share hook', 'add social sharing', 'share on social media', 'copy link button', or 'social providers component'. Applies rules: separate TSX providers from TS hook logic, use encodeURIComponent for URLs, conditional object spreading for optional params, clipboard timeout feedback pattern. Make sure to use this skill whenever building share/social features in React. Not for backend APIs, SEO meta tags, or Open Graph configuration."
---

# Hook de Compartilhamento Social

> Separar providers visuais (TSX) da logica do hook (TS), usar spreading condicional para parametros opcionais, e encodeURIComponent em todas as URLs.

## Rules

1. **Separe providers visuais do hook** — crie `social-providers.tsx` para icones/JSX e `use-share.ts` para logica, porque manter o hook em `.ts` evita dependencia desnecessaria de JSX
2. **Sempre use `encodeURIComponent` nas URLs** — `encodeURIComponent(config.url)` nunca `config.url` direto, porque URLs com caracteres especiais quebram o compartilhamento silenciosamente
3. **Use spreading condicional para params opcionais** — `...(title && { title })` em vez de `title: title || undefined`, porque evita chaves com valor undefined no objeto
4. **Defina providers como objeto nomeado, nao array** — `{ linkedin: {...}, facebook: {...} }` porque permite acesso direto por chave e extensao sem reordenamento
5. **Clipboard timeout como parametro com default** — aceite `clipboardTimeout` opcional com default (ex: 2000ms), porque diferentes UIs precisam de feedback com duracao diferente
6. **Exporte tipagem junto com o hook** — `ShareConfig` e `UseShareProps` devem ser exportados do mesmo modulo, porque consumidores precisam tipar seus proprios wrappers

## How to write

### Estrutura de arquivos

```
src/hooks/
├── index.ts              # re-export barrel
├── use-share.ts          # logica pura (sem JSX)
└── social-providers.tsx  # providers com icones (JSX necessario)
```

### Social Providers (TSX separado)

```typescript
// social-providers.tsx
import { Linkedin, Facebook, Slack, Twitter } from "lucide-react"

export interface ShareConfig {
  url: string
  title?: string
  text?: string
}

export const socialProviders = {
  linkedin: {
    name: "LinkedIn",
    icon: <Linkedin className="h-4 w-4" />,
    shareUrl: (config: ShareConfig) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(config.url)}`,
  },
  facebook: {
    name: "Facebook",
    icon: <Facebook className="h-4 w-4" />,
    shareUrl: (config: ShareConfig) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(config.url)}`,
  },
  twitter: {
    name: "Twitter",
    icon: <Twitter className="h-4 w-4" />,
    shareUrl: (config: ShareConfig) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(config.url)}${config.title ? `&text=${encodeURIComponent(config.title)}` : ""}`,
  },
  slack: {
    name: "Slack",
    icon: <Slack className="h-4 w-4" />,
    shareUrl: (config: ShareConfig) =>
      `https://slack.com/share?url=${encodeURIComponent(config.url)}${config.title ? `&title=${encodeURIComponent(config.title)}` : ""}`,
  },
}
```

### Hook (TS puro)

```typescript
// use-share.ts
import { socialProviders, type ShareConfig } from "./social-providers"

interface UseShareProps extends ShareConfig {
  clipboardTimeout?: number
}

export function useShare({ url, title, text, clipboardTimeout = 2000 }: UseShareProps) {
  const shareConfig: ShareConfig = {
    url,
    ...(title && { title }),
    ...(text && { text }),
  }

  // providers e logica de clipboard continuam na parte 2
  return { shareConfig, socialProviders }
}
```

### Spreading condicional

```typescript
// Correto: so adiciona a chave se o valor existir
const shareConfig: ShareConfig = {
  url,
  ...(title && { title }),
  ...(text && { text }),
}

// Errado: chaves com undefined poluem o objeto
const shareConfig = { url, title, text }
```

## Example

**Before (tudo misturado em um componente):**
```typescript
// ShareButtons.tsx — hook, providers e UI juntos
export function ShareButtons({ url }: { url: string }) {
  const linkedinUrl = `https://linkedin.com/sharing/share-offsite/?url=${url}`
  return <a href={linkedinUrl}><LinkedinIcon /></a>
}
```

**After (com este skill aplicado):**
```typescript
// use-share.ts — logica isolada
export function useShare({ url, title, clipboardTimeout = 2000 }: UseShareProps) {
  const shareConfig: ShareConfig = {
    url,
    ...(title && { title }),
  }
  return { shareConfig, socialProviders }
}

// ShareButtons.tsx — apenas UI
import { useShare } from "@/hooks"
export function ShareButtons({ url, title }: ShareConfig) {
  const { socialProviders, shareConfig } = useShare({ url, title })
  return (
    <div className="flex items-start gap-2">
      {Object.values(socialProviders).map(provider => (
        <a key={provider.name} href={provider.shareUrl(shareConfig)}>
          {provider.icon}
        </a>
      ))}
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Arquivo precisa de JSX (icones) | Use extensao `.tsx`, isole em arquivo proprio |
| Parametro pode nao existir | Spreading condicional `...(val && { val })` |
| URL vai em query string | Sempre `encodeURIComponent()` |
| Feedback visual temporario (copy) | Aceite `timeout` como prop com default |
| Novo provider social | Adicione entrada no objeto `socialProviders` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `url=${config.url}` direto na string | `url=${encodeURIComponent(config.url)}` |
| `{ url, title: title \|\| undefined }` | `{ url, ...(title && { title }) }` |
| Hook inteiro em `.tsx` sem JSX | `.ts` para logica, `.tsx` so se tiver JSX |
| Array de providers `[{}, {}]` | Objeto nomeado `{ linkedin: {}, facebook: {} }` |
| Icones inline no hook | Providers separados com icones em arquivo TSX |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
