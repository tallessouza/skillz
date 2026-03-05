# Code Examples: Implementando Dialog Acessivel com Radix UI

## Instalacao

```bash
yarn add @radix-ui/react-dialog
# ou
npm install @radix-ui/react-dialog
```

## Importacao

```tsx
import * as Dialog from "@radix-ui/react-dialog";
```

## Estrutura completa usada na aula

```tsx
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./styles.module.css";

function App() {
  return (
    <main>
      {/* ... conteudo da pagina ... */}

      <footer>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className={styles.triggerButton}>
              Termos de uso
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className={styles.overlay} />
            <Dialog.Content className={styles.modal}>
              <Dialog.Title>Termos de Servico</Dialog.Title>
              <Dialog.Description>
                Conteudo dos termos de servico aqui...
              </Dialog.Description>

              <Dialog.Close asChild>
                <button className={styles.closeModalButton}>
                  Fechar
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </footer>
    </main>
  );
}
```

## CSS do Overlay

```css
.overlay {
  background-color: rgba(0, 0, 0, 0.75);
  position: fixed;
  inset: 0;
}
```

## CSS do botao de fechar

```css
.closeModalButton {
  width: 100%;
  padding: 12px 20px;
  margin-top: 16px;
  background: #8257e5; /* cor principal Skillz */
  border-radius: 5px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}
```

## Uso com asChild — por que e necessario

```tsx
/* ERRADO: botao dentro de botao */
<Dialog.Trigger>
  <button>Abrir</button>  {/* Dialog.Trigger JA e um <button> */}
</Dialog.Trigger>

/* CORRETO: asChild delega para o filho */
<Dialog.Trigger asChild>
  <button>Abrir</button>  {/* Radix passa props para ESTE botao */}
</Dialog.Trigger>
```

O mesmo se aplica ao `Dialog.Close`:

```tsx
/* CORRETO */
<Dialog.Close asChild>
  <button className={styles.closeModalButton}>Fechar</button>
</Dialog.Close>
```

## Variacao: Dialog controlado

```tsx
const [open, setOpen] = useState(false);

<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <button>Abrir</button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className={styles.overlay} />
    <Dialog.Content className={styles.modal}>
      <Dialog.Title>Titulo</Dialog.Title>
      <Dialog.Close asChild>
        <button>Fechar</button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

## Variacao: multiplos botoes de fechar

```tsx
<Dialog.Content className={styles.modal}>
  <Dialog.Title>Termos</Dialog.Title>
  <Dialog.Description>Conteudo...</Dialog.Description>

  {/* Botao X no canto superior */}
  <Dialog.Close asChild>
    <button className={styles.closeIcon} aria-label="Fechar">
      X
    </button>
  </Dialog.Close>

  {/* Botao de aceitar que tambem fecha */}
  <Dialog.Close asChild>
    <button className={styles.acceptButton}>
      Aceitar e fechar
    </button>
  </Dialog.Close>
</Dialog.Content>
```

## Comportamento automatico do Radix (sem codigo)

O Radix fornece automaticamente, sem nenhum codigo adicional:

| Funcionalidade | Antes (manual) | Com Radix |
|---------------|----------------|-----------|
| Abrir/fechar | `useState` + `onClick` | Automatico via Trigger/Close |
| Fechar com ESC | `addEventListener('keydown')` | Automatico |
| Focus trap | Codigo complexo com `tabIndex`, `focusableElements` | Automatico |
| Foco no primeiro elemento | `useEffect` + `element.focus()` | Automatico |
| Retorno de foco ao fechar | Salvar `lastFocusedElement` + restaurar | Automatico |
| Portal para body | `ReactDOM.createPortal` manual | `Dialog.Portal` |
| Anuncio em leitor de tela | `role="dialog"` + `aria-modal` + `aria-labelledby` | Automatico |