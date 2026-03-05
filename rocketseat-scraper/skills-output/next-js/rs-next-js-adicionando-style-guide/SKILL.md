---
name: rs-next-js-adicionando-style-guide
description: "Applies custom Style Guide configuration in Tailwind CSS for Next.js projects. Use when user asks to 'configure tailwind', 'add style guide', 'setup design tokens', 'customize theme', or 'replace default styles with custom design'. Covers color tokens, typography, font sizes, container config, and component refactoring to match a Figma design. Make sure to use this skill whenever setting up or migrating a Tailwind theme from a design system. Not for creating components from scratch, building layouts, or CSS-in-JS solutions."
---

# Adicionando Style Guide no Next.js com Tailwind

> Extraia tokens do Figma para o `tailwind.config.ts` e refatore componentes existentes para o novo design system.

## Rules

1. **Remova estilos de libs UI antes de customizar** — remova variáveis CSS de libs como shadcn/ui do `globals.css` antes de adicionar tokens próprios, porque conflitos de tokens causam comportamentos imprevisíveis
2. **Defina container no theme root, não no extend** — `container` com `center: true`, `padding` e `screens` vai direto em `theme`, porque é uma substituição completa do default
3. **Cores, fontes e fontSize vão em extend** — use `theme.extend` para sobrescrever apenas os tokens necessários sem perder os defaults do Tailwind
4. **Separe tipografia por função** — headings (`heading-hg` a `heading-xs`), body (`body-md` a `body-xs`) e action (`action-md`, `action-sm`), porque cada função tem font-family, weight e line-height diferentes
5. **Configure fontes do Next.js no layout** — importe fontes via `next/font` e aplique `.className` na div raiz do layout, porque o Next otimiza carregamento de fontes automaticamente
6. **Adicione transition em interações** — use `transition-colors duration-200` em botões e links, porque transições suaves são padrão em design systems modernos

## Steps

### Step 1: Limpar estilos anteriores

Remova variáveis CSS de libs UI do `globals.css` (ex: variáveis do shadcn/ui). Mantenha apenas resets e utilitários próprios.

### Step 2: Configurar `tailwind.config.ts`

```typescript
// theme.container — substituição completa
container: {
  center: true,
  padding: '2rem',
  screens: { '2xl': '1200px' },
},

// theme.extend — sobrescrever tokens específicos
extend: {
  colors: {
    // Mapear 1:1 com Figma: blue.100-400, cyan.100-300, gray.100-800
  },
  fontFamily: {
    sans: ['PT Sans Caption', 'sans-serif'],  // headings
    inter: ['Inter', 'sans-serif'],            // body/action
  },
  fontSize: {
    // heading-hg..xs: font PT Sans, weight 700, line-height 120%
    // body-md..xs: font Inter, weight 400, line-height 150%
    // action-md..sm: font Inter, weight 500, line-height normal
  },
}
```

### Step 3: Aplicar fonte no layout

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Layout({ children }) {
  return (
    <div className={`${inter.className}`}>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
```

### Step 4: Refatorar componentes existentes

Substitua classes genéricas/de lib pelos novos tokens:

| Componente | Antes | Depois |
|-----------|-------|--------|
| Footer bg | `border-t` | `bg-gray-500` |
| Links texto | `text-primary` | `text-body-sm text-blue-100` |
| Links hover | `hover:text-primary` | `hover:text-blue-200` |
| ActiveLink | classe genérica | `text-action-sm`, ativo=`text-blue-200`, inativo=`text-white` |
| Button primary | `bg-primary text-primary-foreground` | `bg-blue-200 text-white hover:bg-blue-300` |
| Button secondary | `bg-secondary` | `bg-white text-gray-800 hover:bg-blue-100 rounded-full` |
| Button outline | border genérico | `border-gray-500 hover:text-blue-200 hover:border-blue-200 transition-colors duration-200` |

## Heuristics

| Situação | Faça |
|----------|------|
| Design entregou novo Style Guide com projeto em andamento | Limpe tokens antigos, configure novos, refatore componentes existentes |
| Cor/fonte aparece em 3+ lugares | Defina como token no `tailwind.config.ts` |
| Botão tem estados hover/active | Adicione `transition-colors duration-200` |
| Fonte vem do Google Fonts + Next.js | Use `next/font/google`, nunca `<link>` no head |
| Container com largura máxima recorrente | Defina em `theme.container` |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| Manter variáveis CSS de lib junto com tokens próprios | Remover variáveis da lib, usar apenas tokens do design |
| `text-[#2C85FC]` hardcoded no JSX | `text-blue-200` via token no config |
| `className="font-bold text-[40px]"` | `className="text-heading-hg"` com peso e line-height no token |
| Importar fonte via `<link>` no `_document` | Usar `next/font/google` no layout |
| Definir `container` dentro de `extend` | Definir `container` direto em `theme` (substituição completa) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
