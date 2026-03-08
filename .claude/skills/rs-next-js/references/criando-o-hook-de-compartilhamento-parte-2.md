---
name: rs-next-js-hook-compartilhamento-pt2
description: "Applies social sharing hook patterns when building share functionality in React/Next.js. Use when user asks to 'create share buttons', 'share to social media', 'build sharing hook', 'add social providers', or 'share link to twitter/linkedin/facebook'. Enforces provider-config pattern, window.open for external links, useMemo/useCallback optimization, and dynamic button generation from config objects. Make sure to use this skill whenever implementing any social sharing feature in React. Not for internal navigation, clipboard-only copy, or native Web Share API implementations."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: social-sharing-hook
  tags: [react, next-js, social-sharing, useMemo, useCallback, window-open, hook-patterns]
---

# Hook de Compartilhamento Social

> Compartilhamento social usa um objeto de configuracao de providers que gera botoes dinamicos, com memoizacao para evitar re-renders.

## Rules

1. **Defina providers como objeto de configuracao** — cada provider tem `name`, `icon`, e `shareURL` callback, porque adicionar um novo provider se resume a adicionar uma entrada no objeto
2. **Use tipagem union para providers** — `type SocialProvider = 'linkedin' | 'facebook' | 'twitter'`, porque garante type-safety e autocomplete
3. **Valide provider antes de usar** — lance erro se provider nao existe no config, porque providers invalidos devem falhar explicitamente
4. **Use window.open para links externos** — `useRouter` do Next.js serve para navegacao interna, nao para abrir URLs externas em nova aba
5. **Envolva config em useMemo** — o objeto `shareConfig` com text/title/url deve ser memoizado, porque e dependencia do useCallback
6. **Envolva share em useCallback** — a funcao de compartilhamento depende do shareConfig memoizado, evitando recriacoes desnecessarias
7. **Exporte array de botoes, nao funcoes avulsas** — `shareButtons` via `Object.entries().map()` gera array pronto para renderizar

## How to write

### Tipagem dos providers

```typescript
export type SocialProvider = 'linkedin' | 'facebook' | 'twitter' | 'threads'
```

### Objeto de configuracao

```typescript
const socialProviders = {
  linkedin: {
    name: 'LinkedIn',
    icon: LinkedinIcon,
    shareURL: (config: ShareConfig) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${config.url}`,
  },
  twitter: {
    name: 'Twitter',
    icon: TwitterIcon,
    shareURL: (config: ShareConfig) =>
      `https://twitter.com/intent/tweet?text=${config.text}&url=${config.url}`,
  },
}
```

### Hook com memoizacao

```typescript
function useShare({ url, title, text }: UseShareProps) {
  const shareConfig = useMemo(() => ({ text, title, url }), [text, title, url])

  const share = useCallback(
    (provider: SocialProvider) => {
      try {
        const providerConfig = socialProviders[provider]
        if (!providerConfig) {
          throw new Error(`Provider nao suportado: ${provider}`)
        }
        const shareURL = providerConfig.shareURL(shareConfig)
        const shareWindow = window.open(
          shareURL, '_blank', 'width=600,height=600,location=yes,status=yes'
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

### Consumo no componente

```tsx
const postURL = `https://site.com/blog/${slug}`
const { shareButtons } = useShare({ url: postURL, title: post.title, text: post.description })

{shareButtons.map((btn) => (
  <button key={btn.provider} onClick={btn.action}>
    <btn.icon /> {btn.name}
  </button>
))}
```

## Example

**Before (botoes hardcoded):**
```tsx
<button onClick={() => window.open(`https://linkedin.com/share?url=${url}`)}>LinkedIn</button>
<button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${url}`)}>Twitter</button>
<button onClick={() => window.open(`https://facebook.com/sharer?u=${url}`)}>Facebook</button>
```

**After (dinamico via hook):**
```tsx
const { shareButtons } = useShare({ url: postURL, title, text: description })

{shareButtons.map((btn) => (
  <button key={btn.provider} onClick={btn.action}>
    <btn.icon /> {btn.name}
  </button>
))}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Adicionar novo provider | Adicione entrada no objeto `socialProviders` e no type union |
| Link externo (social media) | `window.open` com `_blank`, nunca `useRouter` |
| Funcao depende de config memoizado | `useCallback` com config no array de dependencias |
| Objeto de config estavel | `useMemo` com campos primitivos no array |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useRouter().push('https://twitter.com/...')` | `window.open(url, '_blank', ...)` |
| Botoes de share hardcoded um por um | `Object.entries(providers).map()` |
| `share()` sem try/catch | try/catch com return boolean |
| useCallback sem useMemo no config | useMemo no config, useCallback na funcao |
| Type provider como `string` | Union type `'linkedin' \| 'facebook' \| ...` |

## Troubleshooting

### Estado nao atualiza na tela
**Symptom:** Chamou setState mas o componente nao re-renderiza
**Cause:** Mutacao direta do estado (push em array, modificacao de objeto) ao inves de criar nova referencia
**Fix:** Sempre criar novo objeto/array: `setItems([...items, newItem])` ao inves de `items.push(newItem)`. React compara por referencia

### Context nao disponivel em componente filho
**Symptom:** useContext retorna undefined ou valor padrao
**Cause:** Componente esta fora do Provider ou Provider esta em nivel errado da arvore
**Fix:** Verificar que o Provider envolve o componente que consome o contexto. Em App Router, Provider com "use client" deve estar no layout

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-criando-o-hook-de-compartilhamento-parte-2/references/deep-explanation.md) — O instrutor explica que define `share` como `const share = ...` (arrow function) em vez de `function
- [code-examples.md](../../../data/skills/next-js/rs-next-js-criando-o-hook-de-compartilhamento-parte-2/references/code-examples.md) — export type SocialProvider = 'linkedin' | 'facebook' | 'slack' | 'twitter' | 'threads'
