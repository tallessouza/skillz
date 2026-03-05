# Deep Explanation: Criando Select com Radix UI + Tailwind

## Por que Radix para Selects?

O Select nativo do HTML e extremamente limitado para customizacao. O Radix oferece um componente Select totalmente customizavel que segue o **pattern de composicao** — varios pequenos componentes que se encaixam, cada um com responsabilidade unica.

## Hierarquia de componentes do Radix Select

```
SelectPrimitive.Root          — Estado e contexto
├── SelectPrimitive.Trigger   — Botao que abre o select
│   ├── SelectPrimitive.Value — Valor selecionado ou placeholder
│   └── SelectPrimitive.Icon  — Icone (chevron)
└── SelectPrimitive.Portal    — Renderiza no body
    └── SelectPrimitive.Content — Container dos itens
        └── SelectPrimitive.Viewport — Area scrollavel
            └── SelectPrimitive.Item — Cada opcao
                ├── SelectPrimitive.ItemText      — Texto da opcao
                └── SelectPrimitive.ItemIndicator  — Check do selecionado
```

## Portal: por que renderizar fora do componente?

O Portal e uma API do React que permite posicionar um elemento em outro local da DOM. Para selects, modals e dialogs, o HTML precisa ficar no body porque:
- Eles ficam "por cima" da tela (z-index)
- Evita problemas de overflow hidden de containers pais
- Garante posicionamento correto independente da hierarquia CSS

## Data Attributes do Radix

O Radix injeta automaticamente data attributes nos componentes para indicar estados:

| Atributo | Onde aparece | Quando |
|----------|-------------|--------|
| `data-placeholder` | Trigger | Quando nenhum valor esta selecionado |
| `data-highlighted` | Item | Quando o usuario passa o mouse ou navega com teclado |
| `data-state="checked"` | Item | Quando o item esta selecionado |

O Tailwind permite estilizar esses atributos com a sintaxe `data-[atributo]:classe`. Nao e necessario especificar valor quando o atributo e booleano (sem `=`).

## CSS Variables automaticas do Radix

O Radix cria variaveis CSS automaticamente em certos componentes. No Content do Select:

- `--radix-select-trigger-width` — largura do Trigger
- `--radix-select-trigger-height` — altura do Trigger

O Tailwind entende que `--` no inicio de um valor arbitrario significa `var()`. Entao:
- `w-[--radix-select-trigger-width]` compila para `width: var(--radix-select-trigger-width)`
- Nao precisa escrever `w-[var(--radix-select-trigger-width)]` (funciona tambem, mas e desnecessario)

## Propriedades do Content

- **`side="bottom"`** — abre o select para baixo
- **`position="popper"`** — usa o sistema de posicionamento do Radix (vs `item-aligned` que alinha com o item selecionado)
- **`sideOffset={8}`** — 8px de distancia entre o Trigger e o Content

## O problema do outline

Ao remover o outline para customizar o select, e crucial saber ONDE colocar `outline-none`:
- O **Item** e quem recebe foco (nao o Content)
- Colocar `outline-none` no Content nao resolve
- Colocar no Item remove o outline, mas precisa compensar com `data-[highlighted]:bg-zinc-50` para manter feedback visual

## Next.js App Router: use client

Componentes Radix precisam de JavaScript client-side. No Next.js App Router, todos os componentes sao Server Components por padrao. A solucao e:
1. Criar o componente Select em arquivo separado
2. Adicionar `'use client'` no topo
3. Importar normalmente na page (que continua Server Component)

## Renomeando imports para evitar conflitos

Como o componente customizado se chama `Select` e o import do Radix tambem, a convencao e:
```tsx
import * as SelectPrimitive from '@radix-ui/react-select'
```
Assim, dentro do componente usa-se `SelectPrimitive.Root`, `SelectPrimitive.Trigger`, etc.