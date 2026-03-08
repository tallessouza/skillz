---
name: rs-full-stack-criando-formulario-1
description: "Enforces Tailwind CSS form construction patterns when building styled forms with semantic HTML structure, flex layouts, and responsive width constraints. Use when user asks to 'create a form', 'build a reimbursement form', 'style a form with Tailwind', 'add form inputs', or 'make a responsive form layout'. Applies rules: semantic header grouping inside forms, flex-col with gap for field stacking, responsive min-width with lg breakpoint, consistent bg/rounded/padding tokens. Make sure to use this skill whenever constructing form layouts with Tailwind CSS. Not for form validation logic, form submission handling, or backend processing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-tailwind-forms
  tags: [react, tailwind, form, layout, responsive, semantic-html]
---

# Criando Formulário com Tailwind CSS

> Construa formulários com estrutura semântica (header + campos), flex-col para empilhamento, e responsividade via min-width condicional.

## Rules

1. **Use `<form>` como container direto** — coloque todo o conteúdo dentro do form desde o início, porque o form será inserido via Outlet no layout e já herdará a centralização horizontal
2. **Agrupe título e descrição em `<header>` semântico** — header dentro do form não precisa de classes utilitárias, serve apenas para agrupamento semântico
3. **Empilhe campos com flex-col + gap** — `flex flex-col gap-6` mantém espaçamento consistente entre campos sem margin manual em cada um
4. **Use min-width condicional para responsividade** — `lg:min-w-[512px]` em telas grandes, sem restrição em telas menores (w-full se ajusta automaticamente)
5. **Aplique padding uniforme** — `p-10` em todas as direções para espaçamento interno consistente
6. **Importe componentes de input reutilizáveis** — use o componente Input com props `required` e `legend` para campos obrigatórios

## How to write

### Estrutura base do formulário

```tsx
<form className="bg-gray-500 w-full rounded-xl flex flex-col p-10 gap-6 lg:min-w-[512px]">
  <header>
    <h1 className="text-xl font-bold text-gray-100">
      Solicitação de Reembolso
    </h1>
    <p className="text-sm text-gray-200 mt-2 mb-4">
      Dados da despesa para solicitar reembolso.
    </p>
  </header>

  <Input required legend="Nome da solicitação" />
</form>
```

### Tipografia do header

```tsx
{/* Título: tamanho xl + bold + cor clara */}
<h1 className="text-xl font-bold text-gray-100">Título do Formulário</h1>

{/* Descrição: tamanho sm + cor mais escura + margens para separar */}
<p className="text-sm text-gray-200 mt-2 mb-4">Descrição do formulário.</p>
```

## Example

**Before (sem estrutura nem responsividade):**
```tsx
<div>
  <h1>Formulário</h1>
  <input type="text" placeholder="Nome" />
</div>
```

**After (com esta skill aplicada):**
```tsx
<form className="bg-gray-500 w-full rounded-xl flex flex-col p-10 gap-6 lg:min-w-[512px]">
  <header>
    <h1 className="text-xl font-bold text-gray-100">
      Solicitação de Reembolso
    </h1>
    <p className="text-sm text-gray-200 mt-2 mb-4">
      Dados da despesa para solicitar reembolso.
    </p>
  </header>

  <Input required legend="Nome da solicitação" />
</form>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Formulário dentro de layout com Outlet | Use form direto, sem wrapper extra |
| Header do form sem estilo visual | Apenas `<header>` semântico, sem classes |
| Telas pequenas | `w-full` se ajusta sozinho, sem breakpoint mobile |
| Telas grandes (lg+) | Aplique `lg:min-w-[512px]` para largura mínima |
| Espaçamento entre campos | Use `gap-6` no flex container, não margin nos filhos |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `<div>` como container de form | `<form>` direto com as classes |
| `mb-6` em cada campo individual | `gap-6` no form container |
| `width: 512px` fixo | `lg:min-w-[512px]` com `w-full` |
| Título e descrição soltos no form | `<header>` agrupando h1 + p |
| `<input>` nativo sem componente | `<Input required legend="..." />` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Formulario nao respeita largura minima no desktop | Falta breakpoint `lg:` no min-width | Use `lg:min-w-[512px]` para aplicar apenas em telas grandes |
| Campos colados sem espacamento | Usando `margin` individual em vez de `gap` | Substitua margins por `gap-6` no container flex |
| Formulario nao centraliza no layout | Container pai sem alinhamento | Verifique que o Outlet/layout pai tem `flex items-center justify-center` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre estrutura semantica, flex-col vs grid para forms, e estrategia de responsividade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes