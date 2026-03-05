# Code Examples: Hook de Compartilhamento Social

## Estrutura de pastas criada na aula

```
src/
└── hooks/
    ├── index.ts
    ├── use-share.ts
    └── social-providers.tsx
```

## Barrel export (index.ts)

```typescript
export * from "./use-share"
```

## Interface ShareConfig

```typescript
export interface ShareConfig {
  url: string
  title?: string
  text?: string
}
```

## Interface UseShareProps

```typescript
export interface UseShareProps extends ShareConfig {
  clipboardTimeout?: number
}
```

## Social Providers completo (da aula)

```tsx
import { Linkedin, Facebook, Slack, Twitter } from "lucide-react"
import type { ShareConfig } from "./use-share"

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
  slack: {
    name: "Slack",
    icon: <Slack className="h-4 w-4" />,
    shareUrl: (config: ShareConfig) =>
      `https://slack.com/share?url=${encodeURIComponent(config.url)}${
        config.title ? `&title=${encodeURIComponent(config.title)}` : ""
      }`,
  },
  twitter: {
    name: "Twitter",
    icon: <Twitter className="h-4 w-4" />,
    shareUrl: (config: ShareConfig) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(config.url)}${
        config.title ? `&text=${encodeURIComponent(config.title)}` : ""
      }`,
  },
}
```

## Hook useShare (estado da parte 1)

```typescript
import { socialProviders, type ShareConfig } from "./social-providers"

export interface UseShareProps extends ShareConfig {
  clipboardTimeout?: number
}

export function useShare({
  url,
  title,
  text,
  clipboardTimeout = 2000,
}: UseShareProps) {
  const shareConfig: ShareConfig = {
    url,
    ...(title && { title }),
    ...(text && { text }),
  }

  return {
    shareConfig,
    socialProviders,
  }
}
```

## Componente consumidor (layout da aula)

```tsx
import { useShare } from "@/hooks"

function ShareAside({ url, title }: { url: string; title?: string }) {
  const { socialProviders, shareConfig } = useShare({ url, title })

  return (
    <aside>
      <div className="flex items-start gap-2">
        {Object.values(socialProviders).map((provider) => (
          <a
            key={provider.name}
            href={provider.shareUrl(shareConfig)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {provider.icon}
          </a>
        ))}
      </div>
    </aside>
  )
}
```

## Padrao de spreading condicional — variações

```typescript
// Basico: so adiciona se existir
const obj = {
  required: "always here",
  ...(optional && { optional }),
}

// Com transformacao
const obj = {
  url,
  ...(title && { title: title.trim() }),
}

// Multiplos opcionais
const obj = {
  url,
  ...(title && { title }),
  ...(text && { text }),
  ...(hashtags?.length && { hashtags: hashtags.join(",") }),
}
```

## URLs de compartilhamento por provider

| Provider | URL pattern |
|----------|------------|
| LinkedIn | `https://www.linkedin.com/sharing/share-offsite/?url={url}` |
| Facebook | `https://www.facebook.com/sharer/sharer.php?u={url}` |
| Twitter/X | `https://twitter.com/intent/tweet?url={url}&text={title}` |
| Slack | `https://slack.com/share?url={url}&title={title}` |

Todos os valores de `{url}` e `{title}` devem ser passados por `encodeURIComponent()`.