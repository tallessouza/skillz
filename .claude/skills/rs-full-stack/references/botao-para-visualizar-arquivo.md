---
name: rs-full-stack-botao-para-visualizar-arquivo
description: "Enforces conditional rendering patterns for action buttons that switch between upload and view modes based on route parameters. Use when user asks to 'create a view/edit toggle', 'show different buttons based on route', 'open file in new tab', 'conditional link vs button', or 'style action links with Tailwind'. Applies rules: check route params to decide component, use anchor with target _blank for external viewing, style links as buttons with Tailwind flex utilities. Make sure to use this skill whenever building dual-mode pages (create vs view). Not for form validation, file upload logic, or backend route configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react
  tags: [react, conditional-rendering, routing, tailwind, links, buttons]
---

# Botão para Visualizar Arquivo

> Renderize condicionalmente um link ou botão de upload baseado na existência de parâmetros de rota, garantindo navegação correta e estilização consistente.

## Rules

1. **Verifique o parâmetro de rota antes de renderizar** — use `params.id` para decidir entre modo visualização (link) e modo criação (upload), porque a mesma página serve dois propósitos distintos
2. **Use `<a>` com `target="_blank"` para abrir comprovantes** — links de visualização abrem em nova aba, porque o usuário precisa manter o contexto da página atual
3. **Estilize links como botões com Tailwind** — aplique `flex items-center justify-center` + tipografia + espaçamento, porque links precisam ter affordance visual de ação
4. **Adicione transições sutis no hover** — use `transition ease-linear` com `hover:opacity-70`, porque feedback visual suave melhora a experiência sem distrair
5. **Importe ícones SVG como componentes** — coloque ícones ao lado do texto com alt text descritivo, porque acessibilidade e clareza visual andam juntas
6. **Respeite o contexto da rota** — em rotas sem o parâmetro `id`, mostre o formulário de upload; com `id`, mostre visualização somente leitura, porque cada rota tem uma intenção diferente

## How to write

### Renderização condicional por parâmetro

```typescript
// Verifica se existe ID na rota para decidir o modo
{params.id ? (
  <a
    href={fileUrl}
    target="_blank"
    className="text-sm text-green-500 font-semibold flex items-center justify-center gap-2 my-6 hover:opacity-70 transition ease-linear"
  >
    <img src={fileSvg} alt="Ícone de arquivo" />
    Abrir comprovante
  </a>
) : (
  <UploadButton />
)}
```

### Importação de ícone SVG

```typescript
import fileSvg from "../assets/file.svg"

// Uso dentro do link
<img src={fileSvg} alt="Ícone de arquivo" />
```

## Example

**Before (botão fixo sem condicional):**
```tsx
<button type="submit" className="btn-primary">
  Enviar
</button>
```

**After (condicional por rota com link estilizado):**
```tsx
{params.id ? (
  <a
    href={receiptUrl}
    target="_blank"
    className="text-sm text-green-500 font-semibold flex items-center justify-center gap-2 my-6 hover:opacity-70 transition ease-linear"
  >
    <img src={fileSvg} alt="Ícone de arquivo" />
    Abrir comprovante
  </a>
) : (
  <button type="submit" className="btn-primary">
    Enviar
  </button>
)}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Página serve para criar E visualizar | Condicional por `params.id` |
| Link abre documento/comprovante | `target="_blank"` sempre |
| Link precisa parecer botão | Tailwind flex + text + font utilities |
| Hover em link de ação | `hover:opacity-70 transition ease-linear` |
| Campos em modo visualização | Marque como somente leitura (`readOnly`) |
| Botão em modo visualização | Troque por "Voltar" em vez de "Enviar" |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Link sem `target="_blank"` para comprovante | `<a href={url} target="_blank">` |
| Botão de submit em página de visualização | Link de "Abrir comprovante" ou botão "Voltar" |
| Hover abrupto sem transição | `transition ease-linear` + opacidade gradual |
| Ícone sem texto alternativo | `<img src={icon} alt="Ícone de arquivo" />` |
| Mesma UI para criar e visualizar | Condicional baseado em `params.id` |


## Troubleshooting

| Problema | Solução |
|----------|---------|
| **Button shows in view mode instead of link** | Check that `params.id` is being read correctly from the route — undefined means create mode, truthy means view mode. |
| **File opens in same tab** | Ensure the `<a>` tag has `target='_blank'` to open the file in a new browser tab. |
| **Link not styled like a button** | Apply Tailwind flex utilities: `flex items-center justify-center gap-2` plus font and color classes. |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre dual-mode pages e navegação entre rotas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações