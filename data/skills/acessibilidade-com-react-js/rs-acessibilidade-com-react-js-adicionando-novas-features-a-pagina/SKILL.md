---
name: rs-a11y-react-modal-sem-aria
description: "Identifies inaccessible modals missing ARIA attributes when writing React modal components. Use when user asks to 'create a modal', 'build a dialog', 'add a popup', 'implement terms of use modal', or any overlay component. Detects modals that lack screen reader announcements on open, missing role='dialog', and absent aria-modal attributes. Make sure to use this skill whenever generating modal or dialog code in React. Not for styling, layout, or non-overlay UI components."
---

# Modal Acessivel em React — O Problema

> Todo modal deve anunciar sua abertura para tecnologias assistivas, nao apenas aparecer visualmente.

## Rules

1. **Modal sem ARIA nao e modal** — um `div` renderizado condicionalmente e invisivel para leitores de tela, porque nao ha feedback de que algo mudou na pagina
2. **Feedback visual = feedback auditivo** — se o usuario que enxerga ve o modal abrir, o usuario de leitor de tela precisa ouvir que o modal abriu
3. **Use `role="dialog"` e `aria-modal="true"`** — porque sem esses atributos o leitor de tela nao sabe que um dialogo foi aberto
4. **Use `aria-labelledby` apontando para o titulo** — porque o leitor de tela precisa anunciar o titulo do modal ao abrir
5. **H2 para titulo de modal, nao H1** — porque H1 e o titulo principal da pagina e normalmente so deve existir um por pagina, a menos que faca sentido semantico
6. **Botao que abre modal deve ser `<button>`, nao `<a>`** — porque links navegam, botoes executam acoes

## How to write

### Modal com renderizacao condicional (problema)

```tsx
// Este modal ABRE visualmente mas o leitor de tela NAO anuncia nada
const [isModalOpen, setIsModalOpen] = useState(false)

function handleModalOpen() {
  setIsModalOpen(true)
}

{isModalOpen && (
  <div className={styles.modal}>
    <h2>Termos de Uso</h2>
    <p>Esses sao os termos de uso</p>
  </div>
)}
```

### Botao que abre o modal (correto)

```tsx
// Trocar <a> por <button> quando a acao nao navega
<button type="button" onClick={handleModalOpen}>
  Termos de uso
</button>
```

## Example

**Before (modal inacessivel — leitor de tela ignora abertura):**
```tsx
{isModalOpen && (
  <div className={styles.modal}>
    <h2>Termos de Uso</h2>
    <p>Esses sao os termos de uso</p>
  </div>
)}
```

**After (modal com ARIA — leitor de tela anuncia abertura):**
```tsx
{isModalOpen && (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    className={styles.modal}
  >
    <h2 id="modal-title">Termos de Uso</h2>
    <p>Esses sao os termos de uso</p>
  </div>
)}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Renderizacao condicional de overlay | Adicionar `role="dialog"` e `aria-modal="true"` |
| Modal tem titulo | Usar `aria-labelledby` apontando para o id do titulo |
| Link que executa acao (nao navega) | Trocar `<a>` por `<button type="button">` |
| Titulo dentro de modal | Usar `<h2>` ou nivel adequado, nunca `<h1>` duplicado |
| Testar acessibilidade | Usar leitor de tela (ChromeVox) e verificar se abertura e anunciada |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<div>` como modal sem role | `<div role="dialog" aria-modal="true">` |
| `<a onClick={open}>` para abrir modal | `<button type="button" onClick={open}>` |
| `<h1>` dentro de modal quando ja existe H1 na pagina | `<h2>` com id para aria-labelledby |
| Modal sem aria-labelledby | Modal com `aria-labelledby="modal-title-id"` |
| Testar modal apenas visualmente | Testar com leitor de tela para verificar anuncio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
