---
name: rs-next-js-formulario-de-comentarios
description: "Applies inline submit button form pattern when building comment forms or input-with-action layouts in Next.js with Tailwind CSS. Use when user asks to 'create a comment form', 'add inline submit button', 'build input with button inside', or 'comment input component'. Enforces absolute positioning for submit button over input, disabled state opacity, and correct centering with translate. Make sure to use this skill whenever building forms where the submit action is visually inside the input field. Not for standalone buttons, modal forms, or multi-field forms."
---

# Formulario de Comentarios — Inline Submit Pattern

> Ao criar formularios de comentario com botao inline, posicione o botao com absolute sobre o input e reserve espaco com padding-right.

## Rules

1. **Use relative no container e absolute no botao** — o container do form recebe `relative` e o botao recebe `absolute` + `right-3` + `top-1/2` + `-translate-y-1/2`, porque isso centraliza o botao verticalmente dentro do input
2. **Reserve espaco com padding-right no input** — use `pr-24` (ou valor adequado) no input para evitar que o texto digitado fique atras do botao
3. **Nao reutilize componente Button generico quando o botao e muito diferente** — se o botao de submit tem estilo completamente diferente dos demais botoes da aplicacao, crie markup direto ao inves de forcar o componente generico, porque manter flexibilidade e mais importante que DRY forçado
4. **Adicione disabled:opacity-50 no botao de submit** — durante o envio, o botao deve indicar visualmente que esta processando, porque feedback visual previne duplo-clique
5. **Sempre inclua placeholder no input** — um input sem placeholder deixa o usuario sem orientacao sobre o que escrever
6. **Use cursor-pointer no botao** — e o padrao esperado em aplicacoes web para elementos clicaveis

## How to write

### Container + Input + Botao Inline

```tsx
<form className="relative w-full">
  <input
    className="bg-nav-900 h-11 pr-24 w-full"
    placeholder="Leave a comment"
  />
  <button
    type="submit"
    className="flex items-center gap-2 text-indigo-400 absolute right-3 top-1/2 -translate-y-1/2 text-xs hover:text-indigo-300 cursor-pointer disabled:opacity-50"
  >
    Publish
    <MessageCirclePlus className="size-3" />
  </button>
</form>
```

## Example

**Before (botao fora do input):**
```tsx
<div>
  <input className="w-full" placeholder="Comment" />
  <button className="mt-2">Submit</button>
</div>
```

**After (botao inline dentro do input):**
```tsx
<form className="relative w-full">
  <input
    className="bg-nav-900 h-11 pr-24 w-full"
    placeholder="Leave a comment"
  />
  <button
    type="submit"
    className="flex items-center gap-2 text-indigo-400 absolute right-3 top-1/2 -translate-y-1/2 text-xs hover:text-indigo-300 cursor-pointer disabled:opacity-50"
  >
    Publish
    <MessageCirclePlus className="size-3" />
  </button>
</form>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Input com acao unica (comentar, buscar) | Botao inline com absolute |
| Form com multiplos campos | Botao separado abaixo do form |
| Botao de submit identico aos outros da app | Reutilize o componente Button |
| Botao de submit com estilo unico | Crie markup direto |
| Acao assincrona (POST) | Adicione disabled:opacity-50 durante loading |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<button>` sem `type="submit"` dentro de form | `<button type="submit">` |
| Input sem `placeholder` | Input com `placeholder="Leave a comment"` |
| Botao absolute sem `top-1/2 -translate-y-1/2` | Centralizacao completa com ambas classes |
| Input sem `pr-*` quando tem botao absolute | `pr-24` para reservar espaco do botao |
| Botao sem feedback visual de disabled | `disabled:opacity-50` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-formulario-de-comentarios-2024/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-formulario-de-comentarios-2024/references/code-examples.md)
