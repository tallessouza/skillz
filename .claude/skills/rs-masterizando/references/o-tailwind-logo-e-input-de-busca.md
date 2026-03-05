---
name: rs-tailwind-logo-input-busca
description: "Applies Tailwind CSS patterns for building sidebar layouts with logo and search input components. Use when user asks to 'create a sidebar', 'build a search input', 'add a logo component', 'layout with icon inside input', or 'fake input with icon in Tailwind'. Enforces flex composition, space-y spacing, placeholder styling, and accessibility-first patterns. Make sure to use this skill whenever building sidebar navigation or input components with icons in Tailwind. Not for form validation, backend logic, or non-Tailwind styling approaches."
---

# Sidebar: Logo e Input de Busca com Tailwind

> Componentes de sidebar usam composicao flex, espacamento com space-y, e inputs fake (div + input) para suportar icones internos.

## Rules

1. **Extraia componentes em pastas quando tiverem subcomponentes** — `components/sidebar/index.tsx` em vez de `sidebar.tsx`, porque a sidebar tera varios componentes internos (logo, nav, input)
2. **Use div wrapper como input fake para icones internos** — input HTML nao suporta icones, entao crie uma div estilizada como input contendo o icone e o input real lado a lado
3. **Use space-y para espacamento vertical uniforme** — `space-y-6` aplica margin-top automaticamente em todos os filhos exceto o primeiro, porque evita repetir margin-top manualmente em cada elemento
4. **Use placeholder: prefix para estilizar placeholder** — `placeholder:text-zinc-600` define cor do placeholder diretamente no Tailwind, sem CSS customizado
5. **Prefira sr-only a hidden para textos acessiveis** — `sr-only` esconde visualmente mas mantem no leitor de tela, porque hidden/display-none remove completamente da acessibilidade
6. **Use shadow-sm para profundidade sutil** — as sombras pre-definidas do Tailwind dao efeito de profundidade suave sem configuracao manual

## How to write

### Estrutura de pasta sidebar
```
components/
  sidebar/
    index.tsx    # Componente principal
    logo.tsx     # SVG do logo isolado
```

### Logo com texto
```tsx
<strong className="flex items-center gap-2 text-xl font-semibold text-zinc-900">
  <Logo />
  <span>Untitled UI</span>
</strong>
```

### Input fake com icone
```tsx
<div className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
  <Search className="h-5 w-5 text-zinc-500" />
  <input
    type="text"
    placeholder="Search"
    className="flex-1 border-0 bg-transparent p-0 text-zinc-900 placeholder:text-zinc-600"
  />
</div>
```

### Sidebar com espacamento uniforme
```tsx
export function Sidebar() {
  return (
    <aside className="flex flex-col space-y-6">
      <Logo />
      <SearchInput />
      <Nav />
    </aside>
  )
}
```

## Example

**Before (margin manual repetido):**
```tsx
<aside>
  <Logo />
  <div className="mt-6">
    <SearchInput />
  </div>
  <div className="mt-6">
    <Nav />
  </div>
</aside>
```

**After (space-y automatico):**
```tsx
<aside className="flex flex-col space-y-6">
  <Logo />
  <SearchInput />
  <Nav />
</aside>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Icone dentro de input | Div wrapper com flex + input border-0 bg-transparent |
| Texto que some no mobile | `sr-only` no span (acessivel), nao `hidden` |
| SVG externo para React | Use transform.tools para converter props em camelCase |
| Espacamento uniforme entre filhos | `space-y-{n}` no pai, nao margin em cada filho |
| Sombra sutil em inputs | `shadow-sm` pre-definido do Tailwind |
| Export de componente | Named export (`export function`), nao `export default` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<input>` com icone via background-image | Div wrapper flex com icone SVG + input |
| `mt-6` repetido em cada filho | `space-y-6` no elemento pai |
| `hidden` para texto de logo no mobile | `sr-only` (mantem acessibilidade) |
| `export default function` | `export function Logo()` (named export) |
| SVG com props kebab-case no React | Converter via transform.tools para camelCase |
| Input com borda e fundo padrao | `border-0 bg-transparent p-0` no input real |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-logo-e-input-de-busca/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-logo-e-input-de-busca/references/code-examples.md)
