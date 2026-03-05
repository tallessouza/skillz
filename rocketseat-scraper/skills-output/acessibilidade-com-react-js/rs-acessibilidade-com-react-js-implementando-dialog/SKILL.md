---
name: rs-acessibilidade-react-implementando-dialog
description: "Enforces accessible dialog/modal implementation using Radix UI React Dialog. Use when user asks to 'create a modal', 'implement a dialog', 'add a popup', 'build an overlay modal', or any modal-related UI task in React. Applies Radix Dialog anatomy: Root, Trigger, Portal, Overlay, Content, Title, Description, Close. Ensures automatic focus trap, keyboard navigation (ESC, Tab), and screen reader support. Make sure to use this skill whenever building modals in React projects. Not for toast notifications, tooltips, or non-modal UI overlays."
---

# Implementando Dialog Acessivel com Radix UI

> Modais acessiveis usam Radix Dialog para garantir focus trap, navegacao por teclado e anuncio em leitores de tela automaticamente, sem codigo programatico manual.

## Rules

1. **Use Radix Dialog, nao implemente manualmente** — `@radix-ui/react-dialog` gerencia foco, ESC, Tab e trap de foco automaticamente, porque reimplementar isso e fragil e propenso a erros de acessibilidade
2. **Respeite a anatomia completa** — Root > Trigger > Portal > Overlay + Content > Title + Description + Close, porque cada componente tem uma responsabilidade semantica especifica
3. **Use asChild quando o Trigger ou Close ja e um botao** — evita botao dentro de botao (HTML invalido), porque `Dialog.Trigger` e `Dialog.Close` renderizam `<button>` por padrao
4. **Sempre inclua Dialog.Title** — leitores de tela anunciam o titulo ao entrar no modal, porque sem ele o modal nao tem contexto semantico
5. **Portal renderiza no body** — o conteudo do modal sai do DOM pai e vai para o body, porque isso evita problemas de z-index e overflow
6. **Overlay precisa de position fixed + inset 0** — cobre toda a viewport, porque sem isso o fundo escuro nao funciona corretamente

## How to write

### Estrutura completa do Dialog

```tsx
import * as Dialog from "@radix-ui/react-dialog";

// Dentro do componente, o Root envolve Trigger + Portal
<Dialog.Root>
  <Dialog.Trigger asChild>
    <button>Abrir modal</button>
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Overlay className={styles.overlay} />
    <Dialog.Content className={styles.modal}>
      <Dialog.Title>Titulo do Modal</Dialog.Title>
      <Dialog.Description>Descricao opcional</Dialog.Description>

      {/* conteudo do modal */}

      <Dialog.Close asChild>
        <button>Fechar</button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### Estilizacao do Overlay

```css
.overlay {
  background-color: rgba(0, 0, 0, 0.75);
  position: fixed;
  inset: 0;
}
```

## Example

**Before (modal manual, sem acessibilidade):**
```tsx
const [isOpen, setIsOpen] = useState(false);
// codigo manual de focus trap, ESC handler, aria-controls...
<div role="dialog" aria-modal="true" id="modal">
  <button onClick={() => setIsOpen(false)}>Fechar</button>
</div>
```

**After (com Radix Dialog):**
```tsx
import * as Dialog from "@radix-ui/react-dialog";

<Dialog.Root>
  <Dialog.Trigger asChild>
    <button>Termos de uso</button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className={styles.overlay} />
    <Dialog.Content className={styles.modal}>
      <Dialog.Title>Termos de Servico</Dialog.Title>
      <Dialog.Description>Leia os termos abaixo.</Dialog.Description>
      <Dialog.Close asChild>
        <button className={styles.closeModalButton}>Fechar</button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Trigger ja e um `<button>` customizado | Use `asChild` no `Dialog.Trigger` |
| Modal sem descricao, so titulo | Omita `Dialog.Description`, mantenha `Dialog.Title` |
| Precisa de comportamento controlado | Use props `open` e `onOpenChange` no `Dialog.Root` |
| Multiplos botoes de fechar | Coloque quantos `Dialog.Close` precisar dentro do Content |
| Overlay nao cobre tela toda | Verifique `position: fixed` e `inset: 0` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `<button><Dialog.Trigger><button>` (botao aninhado) | `<Dialog.Trigger asChild><button>` |
| Implementar focus trap manual com JS | Usar Radix Dialog (focus trap automatico) |
| Usar `useState` + `addEventListener('keydown')` para ESC | Radix ja gerencia ESC nativamente |
| Colocar Content fora do Portal | Content sempre dentro de `Dialog.Portal` |
| Omitir `Dialog.Title` | Sempre incluir para leitores de tela |
| Overlay sem `position: fixed` | `position: fixed; inset: 0` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
