# Code Examples: Animando Abertura dos Selects

## Exemplo completo do tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      // ... outras extensoes (gridTemplateColumns, borderWidth, colors, maxWidth)

      keyframes: {
        slideDownAndFade: {
          from: {
            opacity: '0',
            transform: 'translateY(-2px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        // Comentado porque Select do Radix nao suporta forceMount
        // slideUpAndFade: {
        //   from: {
        //     opacity: '1',
        //     transform: 'translateY(0)',
        //   },
        //   to: {
        //     opacity: '0',
        //     transform: 'translateY(-2px)',
        //   },
        // },
      },

      animation: {
        slideDownAndFade:
          'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        // slideUpAndFade:
        //   'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config
```

## Aplicacao no componente Select (Radix UI)

```tsx
import * as SelectPrimitive from '@radix-ui/react-select'

// A classe animate-slideDownAndFade vai no SelectPrimitive.Content
<SelectPrimitive.Content
  className="animate-slideDownAndFade rounded-lg border border-zinc-200 bg-white shadow-sm"
>
  <SelectPrimitive.Viewport>
    {children}
  </SelectPrimitive.Viewport>
</SelectPrimitive.Content>
```

## Versao com duracao lenta para debug

Util durante desenvolvimento para ver a animacao em camera lenta:

```typescript
animation: {
  slideDownAndFade:
    'slideDownAndFade 1s linear', // APENAS PARA TESTE
},
```

Depois trocar para a versao de producao:

```typescript
animation: {
  slideDownAndFade:
    'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
},
```

## Padrao para outros componentes (se forceMount estiver disponivel)

Para componentes Radix que suportam `forceMount` (Dialog, Tooltip, Popover):

```typescript
// tailwind.config.ts
keyframes: {
  slideDownAndFade: {
    from: { opacity: '0', transform: 'translateY(-2px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  slideUpAndFade: {
    from: { opacity: '1', transform: 'translateY(0)' },
    to: { opacity: '0', transform: 'translateY(-2px)' },
  },
},
animation: {
  slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
  slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
},
```

```tsx
// Componente com data-state para controlar entrada/saida
<DialogContent
  forceMount
  className={clsx(
    'data-[state=open]:animate-slideDownAndFade',
    'data-[state=closed]:animate-slideUpAndFade',
  )}
>
  {children}
</DialogContent>
```

## Variacoes de direcao

Slide da esquerda (util para sidebars):

```typescript
keyframes: {
  slideRightAndFade: {
    from: { opacity: '0', transform: 'translateX(-2px)' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
},
```

Slide de baixo para cima (util para bottom sheets):

```typescript
keyframes: {
  slideUpFromBottom: {
    from: { opacity: '0', transform: 'translateY(2px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
},
```