---
name: rs-full-stack-componente-de-pagination
description: "Enforces pagination component patterns when building page navigation UI with React and Tailwind CSS. Use when user asks to 'create pagination', 'add page navigation', 'build paginator', 'navigate between pages', or 'switch pages component'. Applies typed props for current/total pages, icon buttons for prev/next, flex layout with gap spacing, and semantic text styling. Make sure to use this skill whenever implementing any list pagination UI. Not for server-side pagination logic, infinite scroll, or data fetching."
---

# Componente de Pagination

> Construa componentes de paginacao com props tipadas, botoes de navegacao com icones, e layout centralizado via Tailwind CSS.

## Rules

1. **Crie arquivo dedicado para o componente** — `pagination.tsx` na pasta de componentes, porque paginacao e reutilizavel em multiplas paginas
2. **Tipe as props com `type`** — defina `current` (number) e `total` (number) como propriedades obrigatorias, porque garante contrato claro entre componente pai e filho
3. **Use botoes com variante icon** — botoes de avancar/retroceder usam variante `icon-small` com imagens SVG importadas, porque mantem consistencia visual com o design system
4. **Exiba pagina atual e total em span** — formato `{current} / {total}`, porque da feedback imediato ao usuario sobre onde esta na navegacao
5. **Centralize com flex e gap** — use `flex justify-center items-center gap-4` no container, porque distribui botoes e texto uniformemente
6. **Estilize o texto com classes utilitarias** — `text-sm text-gray-200` no span de paginas, porque mantem hierarquia visual adequada

## How to write

### Estrutura do componente

```tsx
import leftSvg from '../assets/left.svg'
import rightSvg from '../assets/right.svg'
import { Button } from './button'

type Props = {
  current: number
  total: number
}

export function Pagination({ current, total }: Props) {
  return (
    <div className="flex flex-1 justify-center items-center gap-4">
      <Button variant="icon-small">
        <img src={leftSvg} alt="Ícone de voltar" />
      </Button>

      <span className="text-sm text-gray-200">
        {current} / {total}
      </span>

      <Button variant="icon-small">
        <img src={rightSvg} alt="Ícone de avançar" />
      </Button>
    </div>
  )
}
```

### Uso do componente

```tsx
import { Pagination } from './components/pagination'

// Dentro do JSX da pagina
<Pagination current={1} total={10} />
```

## Example

**Before (sem estrutura):**
```tsx
export function Pagination() {
  return (
    <div>
      <button>←</button>
      <p>1 de 10</p>
      <button>→</button>
    </div>
  )
}
```

**After (com esta skill aplicada):**
```tsx
type Props = {
  current: number
  total: number
}

export function Pagination({ current, total }: Props) {
  return (
    <div className="flex flex-1 justify-center items-center gap-4">
      <Button variant="icon-small">
        <img src={leftSvg} alt="Ícone de voltar" />
      </Button>
      <span className="text-sm text-gray-200">
        {current} / {total}
      </span>
      <Button variant="icon-small">
        <img src={rightSvg} alt="Ícone de avançar" />
      </Button>
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Lista com muitos itens | Adicione componente Pagination abaixo da listagem |
| Props de navegacao | Sempre tipe `current` e `total` como number |
| Icones de seta | Importe SVGs e use dentro de Button com variante icon |
| Layout do paginador | `flex-1 justify-center items-center gap-4` |
| Texto de paginas | `text-sm text-gray-200` para hierarquia visual secundaria |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<button>←</button>` (texto como icone) | `<Button variant="icon-small"><img src={leftSvg} /></Button>` |
| `<p>Pagina 1 de 10</p>` (tag semantica errada) | `<span className="text-sm text-gray-200">{current} / {total}</span>` |
| Props sem tipagem | `type Props = { current: number; total: number }` |
| Valores hardcoded no componente | Receba `current` e `total` via props |
| `style={{ display: 'flex' }}` | `className="flex justify-center items-center gap-4"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre estrutura do componente e decisoes de layout
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes