---
name: rs-tailwind-theme-switcher
description: "Applies Tailwind CSS dark mode theme switching configuration when user asks to 'add dark mode', 'implement theme switcher', 'configure dark/light theme', 'toggle dark mode', or 'setup theme switching'. Covers darkMode class strategy, HTML class toggling, and Next.js NextThemes integration. Make sure to use this skill whenever configuring dark mode beyond system preferences in Tailwind projects. Not for general Tailwind styling, color customization, or non-theme CSS configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: dark-mode
  tags: [tailwind, react, nextjs]
---

# Theme Switcher — Dark/Light Mode no Tailwind

> Configure o dark mode do Tailwind via classe CSS para permitir troca manual de tema, independente das preferencias do sistema operacional.

## Rules

1. **Use `darkMode: 'class'` no tailwind.config** — nao `'media'`, porque `media` herda do SO e impede controle manual pelo usuario
2. **Adicione a classe `dark` na tag `<html>`** — nao no `<body>`, porque o Tailwind busca a classe dark no elemento raiz do documento
3. **O theme switcher e um toggle da classe `dark`** — adicionar/remover essa classe no `<html>` e tudo que precisa para trocar entre temas
4. **Em Next.js, use NextThemes** — porque integra automaticamente com o Tailwind darkMode class, gerencia a classe no `<html>`, e lida com SSR/hydration

## How to configure

### tailwind.config

```typescript
// Mudar de 'media' (padrao) para 'class'
export default {
  darkMode: 'class',
  // ... resto da config
}
```

### HTML — Ativar dark mode

```html
<!-- Dark mode ATIVO -->
<html class="dark">

<!-- Dark mode INATIVO (light) -->
<html class="">
```

### Next.js — Integracao com NextThemes

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Botao de troca simples (vanilla)

```typescript
function toggleTheme() {
  document.documentElement.classList.toggle('dark')
}
```

## Example

**Before (depende do SO, sem controle do usuario):**
```typescript
// tailwind.config.ts
export default {
  darkMode: 'media', // ou omitido (media e padrao)
}
```

**After (controle manual via classe):**
```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
}

// Componente de toggle
function ThemeToggle() {
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
  }
  return <button onClick={toggleTheme}>Toggle Theme</button>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App deve seguir preferencia do SO | Use `darkMode: 'media'` (padrao) |
| Usuario precisa trocar tema manualmente | Use `darkMode: 'class'` + toggle na tag `<html>` |
| Projeto Next.js com App Router | Use NextThemes com `attribute="class"` |
| Projeto React puro (Vite, CRA) | Toggle manual da classe `dark` no `document.documentElement` |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Adicionar classe `dark` no `<body>` | Adicionar no `<html>` (`document.documentElement`) |
| Usar `darkMode: 'media'` quando precisa de toggle | Usar `darkMode: 'class'` |
| Implementar gerenciamento de tema manual no Next.js | Usar NextThemes que resolve SSR/hydration |
| Omitir `suppressHydrationWarning` no `<html>` com NextThemes | Adicionar `suppressHydrationWarning` para evitar warnings de hydration |
## Troubleshooting

### Dark mode nao ativa
**Symptom:** Classes `dark:` nao tem efeito mesmo com tema escuro no SO.
**Cause:** Se `darkMode: 'class'` esta configurado, o Tailwind ignora `prefers-color-scheme` e espera a classe `dark` no `<html>`.
**Fix:** Se quer resposta automatica ao SO, use `darkMode: 'media'` (padrao). Se quer toggle manual, adicione classe `dark` no `<html>`.

### Contraste insuficiente no dark mode
**Symptom:** Texto dificil de ler em fundo escuro.
**Cause:** Texto claro demais (`dark:text-zinc-600`) ou fundo muito proximo do texto.
**Fix:** Use `dark:text-zinc-100` para texto primario e `dark:text-zinc-400` para secundario em fundo `dark:bg-zinc-900`.

## Deep reference library

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-theme-switcher/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-theme-switcher/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
