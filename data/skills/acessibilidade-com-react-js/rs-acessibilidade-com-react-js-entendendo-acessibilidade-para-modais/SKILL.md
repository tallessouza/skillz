---
name: rs-acessibilidade-react-modais
description: "Enforces accessible modal implementation patterns in React applications. Use when user asks to 'create a modal', 'build a dialog', 'implement a popup', 'add overlay', or any modal/dialog component. Applies rules: role=dialog, aria-labelledby/describedby referencing content, tabIndex=-1 with programmatic focus via useRef+useEffect, aria-controls on trigger button. Make sure to use this skill whenever generating modal or dialog components, even if the user doesn't mention accessibility. Not for toast notifications, tooltips, or non-modal overlays."
---

# Acessibilidade para Modais no React

> Todo modal customizado precisa de role="dialog", nomes acessiveis via aria-labelledby/describedby, foco programatico, e conexao explicita com o botao que o controla.

## Rules

1. **Adicione `role="dialog"` em modais customizados** — porque sem isso leitores de tela nao identificam o elemento como modal; o elemento HTML `<dialog>` ja tem semantica nativa, mas modais customizados precisam da role explicitamente
2. **Use `aria-labelledby` apontando para o titulo, nunca `aria-label` generico** — `aria-label="modal"` e redundante porque a role dialog ja informa que e um dialog; o titulo do conteudo e o nome real
3. **Use `aria-describedby` apontando para a descricao** — porque leitores de tela lerao o titulo E a descricao ao entrar no dialog
4. **Use IDs unicos com prefixo do modal** — `modal1-title`, `modal1-description`, porque multiplos modais na pagina causam conflitos de ID
5. **Adicione `tabIndex={-1}` no container do modal** — porque permite foco programatico sem que o usuario foque o modal via Tab, mantendo navegacao presa nos elementos interativos internos
6. **Foque o modal programaticamente ao abrir** — use `useRef` + `useEffect` para chamar `.focus()` quando o modal abre, porque sem isso leitores de tela nao anunciam a entrada no dialog
7. **Conecte o botao ao modal com `aria-controls`** — o botao que abre o modal deve ter `aria-controls="modal1"` apontando para o ID do modal

## How to write

### Modal acessivel completo

```tsx
const modalRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (isModalOpen) {
    modalRef.current?.focus()
  }
}, [isModalOpen])

// Botao trigger
<button aria-controls="modal1" onClick={() => setIsModalOpen(true)}>
  Abrir termos
</button>

// Modal
{isModalOpen && (
  <div
    ref={modalRef}
    id="modal1"
    role="dialog"
    aria-labelledby="modal1-title"
    aria-describedby="modal1-description"
    tabIndex={-1}
  >
    <h2 id="modal1-title">Termos de uso</h2>
    <p id="modal1-description">
      Leia atentamente os termos antes de continuar.
    </p>
  </div>
)}
```

## Example

**Before (modal inacessivel):**
```tsx
<button onClick={() => setOpen(true)}>Abrir</button>

{open && (
  <div className="modal">
    <h2>Termos de uso</h2>
    <p>Conteudo dos termos...</p>
  </div>
)}
```

**After (com esta skill aplicada):**
```tsx
<button aria-controls="terms-modal" onClick={() => setOpen(true)}>
  Abrir
</button>

{open && (
  <div
    ref={modalRef}
    id="terms-modal"
    role="dialog"
    aria-labelledby="terms-modal-title"
    aria-describedby="terms-modal-description"
    tabIndex={-1}
  >
    <h2 id="terms-modal-title">Termos de uso</h2>
    <p id="terms-modal-description">Conteudo dos termos...</p>
  </div>
)}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Modal so com texto (sem inputs) | `role="dialog"` + `aria-labelledby` + `tabIndex={-1}` + foco programatico |
| Modal com formulario/inputs | Tudo acima + focus trap para prender navegacao nos inputs |
| Multiplos modais na pagina | IDs com prefixo unico: `modal1-title`, `modal2-title` |
| Modal usando `<dialog>` nativo | Nao precisa de `role="dialog"` — ja e semantico nativamente |
| Botao que abre o modal | Sempre `aria-controls` apontando para o ID do modal |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `<div className="modal">` sem role | `<div role="dialog">` |
| `aria-label="modal"` | `aria-labelledby="modal1-title"` referenciando o H2 |
| Modal sem foco ao abrir | `useRef` + `useEffect` com `.focus()` |
| `tabIndex={0}` no modal | `tabIndex={-1}` — focavel so programaticamente |
| IDs genericos: `id="title"` | IDs com escopo: `id="modal1-title"` |
| Botao sem conexao ao modal | `<button aria-controls="modal1">` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
