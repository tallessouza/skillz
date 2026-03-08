---
name: rs-full-stack-continuando-o-dashboard
description: "Enforces Tailwind CSS dashboard layout patterns when building admin pages, applying min-width constraints, typography utilities, and responsive containers. Use when user asks to 'create a dashboard', 'build an admin page', 'add a page title', or 'set up responsive layout with min-width'. Applies rules: min-width for horizontal scroll prevention, flex-1 for fluid titles, text/font utility composition for headings. Make sure to use this skill whenever scaffolding dashboard pages or admin panels with Tailwind. Not for form components, navigation bars, or sidebar layouts."
---

# Continuando o Dashboard — Layout com Tailwind CSS

> Estruture paginas de dashboard com min-width para controle horizontal e utilitarios de tipografia compostos para hierarquia visual.

## Rules

1. **Use min-width no container principal** — `min-w-[768px]` garante que o conteudo nao quebre em telas menores, porque permite scroll horizontal controlado em vez de layout quebrado
2. **Compose utilitarios de tipografia no titulo** — combine `text-gray-100`, `font-bold`, `text-xl` no h1, porque cada classe resolve uma dimensao diferente (cor, peso, tamanho)
3. **Use flex-1 em titulos dentro de containers flex** — `flex-1` faz o titulo ocupar o espaco disponivel, porque permite que elementos irmaos (botoes, filtros) fiquem alinhados sem calculo manual

## How to write

### Container de dashboard com min-width

```tsx
function Dashboard() {
  return (
    <div className="min-w-[768px]">
      <h1 className="text-gray-100 font-bold text-xl flex-1">
        Solicitações
      </h1>
    </div>
  )
}
```

### Titulo responsivo com flex

```tsx
<div className="flex items-center">
  <h1 className="text-gray-100 font-bold text-xl flex-1">
    Solicitações
  </h1>
  {/* Botoes ou filtros aqui ocupam apenas o espaco necessario */}
</div>
```

## Example

**Before (sem estrutura de dashboard):**
```tsx
function Dashboard() {
  return (
    <div>
      <h1>Solicitações</h1>
    </div>
  )
}
```

**After (com min-width e tipografia Tailwind):**
```tsx
function Dashboard() {
  return (
    <div className="min-w-[768px]">
      <h1 className="text-gray-100 font-bold text-xl flex-1">
        Solicitações
      </h1>
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Pagina de dashboard com tabela ou grid | Use `min-w-[768px]` no container para evitar colapso |
| Titulo principal da pagina | Combine cor + peso + tamanho em classes separadas |
| Titulo ao lado de acoes (botoes, filtros) | Adicione `flex-1` ao titulo dentro de um container flex |
| Tela diminui abaixo do min-width | Deixe o scroll horizontal acontecer — o layout interno permanece intacto |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `style={{ minWidth: '768px' }}` | `className="min-w-[768px]"` |
| `<h1 style={{color: 'gray', fontWeight: 'bold'}}>` | `<h1 className="text-gray-100 font-bold text-xl">` |
| `width: 100%` sem min-width em dashboards | `min-w-[768px]` para garantir legibilidade minima |
| Titulo sem flex-1 em layout flex | `flex-1` no titulo para ocupar espaco restante |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre min-width vs breakpoints e composicao de utilitarios
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes