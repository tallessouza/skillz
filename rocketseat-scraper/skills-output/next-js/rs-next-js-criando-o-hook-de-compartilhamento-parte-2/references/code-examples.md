# Code Examples: Hook de Compartilhamento Social

## Definicao completa do type

```typescript
export type SocialProvider = 'linkedin' | 'facebook' | 'slack' | 'twitter' | 'threads'
```

## Objeto socialProviders completo

```typescript
const socialProviders = {
  linkedin: {
    name: 'LinkedIn',
    icon: LinkedinIcon,
    shareURL: (config: ShareConfig) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${config.url}`,
  },
  facebook: {
    name: 'Facebook',
    icon: FacebookIcon,
    shareURL: (config: ShareConfig) =>
      `https://www.facebook.com/sharer/sharer.php?u=${config.url}`,
  },
  twitter: {
    name: 'Twitter',
    icon: TwitterIcon,
    shareURL: (config: ShareConfig) =>
      `https://twitter.com/intent/tweet?text=${config.text}&url=${config.url}`,
  },
  threads: {
    name: 'Threads',
    icon: AtSignIcon,
    shareURL: (config: ShareConfig) =>
      `https://threads.net/intent/post?text=${config.text} ${config.url}`,
  },
}
```

## Hook useShare completo

```typescript
interface ShareConfig {
  text: string
  title: string
  url: string
}

interface UseShareProps {
  url: string
  title: string
  text: string
}

function useShare({ url, title, text }: UseShareProps) {
  const shareConfig = useMemo<ShareConfig>(
    () => ({ text, title, url }),
    [text, title, url],
  )

  const share = useCallback(
    (provider: SocialProvider) => {
      try {
        const providerConfig = socialProviders[provider]

        if (!providerConfig) {
          throw new Error(`Provider nao suportado: ${provider}`)
        }

        const shareURL = providerConfig.shareURL(shareConfig)

        const shareWindow = window.open(
          shareURL,
          '_blank',
          'width=600,height=600,location=yes,status=yes',
        )

        return !!shareWindow
      } catch (error) {
        console.error(error)
        return false
      }
    },
    [shareConfig],
  )

  const shareButtons = useMemo(
    () =>
      Object.entries(socialProviders).map(([key, provider]) => ({
        provider: key as SocialProvider,
        name: provider.name,
        icon: provider.icon,
        action: () => share(key as SocialProvider),
      })),
    [share],
  )

  return { shareButtons }
}
```

## Consumo no componente (pagina de slug)

```tsx
export default function PostPage({ post, slug }: PostPageProps) {
  const postURL = `https://site.com/blog/${slug}`

  const { shareButtons } = useShare({
    url: postURL,
    title: post.title,
    text: post.description,
  })

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>

      <div className="share-buttons">
        {shareButtons.map((btn) => (
          <button
            key={btn.provider}
            onClick={btn.action}
            className="share-button"
          >
            <btn.icon />
            {btn.name}
          </button>
        ))}
      </div>
    </div>
  )
}
```

## Adicionando novo provider (demonstracao de escalabilidade)

Para adicionar Threads, o instrutor fez apenas:

1. Atualizou o type:
```typescript
export type SocialProvider = 'linkedin' | 'facebook' | 'twitter' | 'threads'
```

2. Adicionou entrada no objeto:
```typescript
threads: {
  name: 'Threads',
  icon: AtSignIcon,
  shareURL: (config: ShareConfig) =>
    `https://threads.net/intent/post?text=${config.text} ${config.url}`,
},
```

Zero mudancas no componente. Os botoes aparecem automaticamente.