# Code Examples: Conhecendo o Radix UI

## 1. Dialog do Radix — Estrutura DOM inspecionada

O instrutor inspeciona o DOM do Dialog do Radix e mostra:

```html
<!-- O modal e renderizado direto no body (Portal) -->
<body>
  <div id="__next">
    <!-- Conteudo da pagina -->
  </div>

  <!-- Modal fora da arvore da aplicacao -->
  <div role="dialog"
       aria-describedby="radix-342"
       tabindex="-1">
    <input placeholder="Name" />
    <input placeholder="Username" />
    <button>Save changes</button>
  </div>
</body>
```

Pontos chave:
- `role="dialog"` — identifica como dialog para screen readers
- `aria-describedby="radix-342"` — conecta a descricao (ID gerado pelo Radix)
- `tabindex="-1"` no container — foco vai para elementos internos, nao o container
- Renderizado fora de `#__next` via Portal

## 2. Botao Trigger com aria-controls

```html
<!-- O botao que abre o modal -->
<button aria-controls="radix-dialog-content-id">
  Edit profile
</button>
```

O `aria-controls` informa screen readers que este botao controla o dialog.

## 3. Instalacao de um primitive Radix

```bash
# Cada primitive e instalado separadamente
npm install @radix-ui/react-dialog
npm install @radix-ui/react-select
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-toast
npm install @radix-ui/react-tooltip
```

## 4. Dialog completo com Radix

```tsx
import * as Dialog from '@radix-ui/react-dialog'

function EditProfileModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Edit profile</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded">
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here.
          </Dialog.Description>

          {/* Foco automatico no primeiro input */}
          <label htmlFor="name">Name</label>
          <input id="name" defaultValue="Joseph Oliveira" />

          <label htmlFor="username">Username</label>
          <input id="username" defaultValue="@josepholiveira" />

          <Dialog.Close asChild>
            <button>Save changes</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

**Comportamento automatico:**
- Focus trap — Tab cicla apenas dentro do modal
- ESC fecha o modal
- Foco inicial no primeiro elemento focavel (input)
- Ao fechar, foco retorna ao trigger button
- Portal renderiza no body
- ARIA attributes automaticos

## 5. Select com Type Ahead

```tsx
import * as Select from '@radix-ui/react-select'

function FruitSelect() {
  return (
    <Select.Root>
      <Select.Trigger className="select-trigger">
        <Select.Value placeholder="Select a fruit…" />
        <Select.Icon />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="select-content">
          <Select.ScrollUpButton />
          <Select.Viewport>
            <Select.Item value="apple">
              <Select.ItemText>Apple</Select.ItemText>
              <Select.ItemIndicator>✓</Select.ItemIndicator>
            </Select.Item>
            <Select.Item value="banana">
              <Select.ItemText>Banana</Select.ItemText>
            </Select.Item>
            <Select.Item value="blueberry">
              <Select.ItemText>Blueberry</Select.ItemText>
            </Select.Item>
            <Select.Item value="beef">
              <Select.ItemText>Beef</Select.ItemText>
            </Select.Item>
            <Select.Item value="broccoli">
              <Select.ItemText>Broccoli</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
          <Select.ScrollDownButton />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
```

**Type Ahead em acao:**
- Apertar "B" → seleciona "Banana"
- Apertar "B" novamente → seleciona "Blueberry"
- Apertar "B" novamente → seleciona "Broccoli"
- Apertar "BE" rapidamente → pula direto para "Beef"

## 6. Toast acessivel

```tsx
import * as Toast from '@radix-ui/react-toast'

function ToastDemo() {
  const [open, setOpen] = useState(false)

  return (
    <Toast.Provider>
      <button onClick={() => setOpen(true)}>
        Salvar
      </button>

      <Toast.Root open={open} onOpenChange={setOpen}>
        <Toast.Title>Erro ao salvar</Toast.Title>
        <Toast.Description>
          Verifique os campos e tente novamente.
        </Toast.Description>
        <Toast.Action altText="Desfazer" asChild>
          <button>Desfazer</button>
        </Toast.Action>
        <Toast.Close asChild>
          <button>Fechar</button>
        </Toast.Close>
      </Toast.Root>

      <Toast.Viewport />
    </Toast.Provider>
  )
}
```

**Comportamento automatico:**
- Anunciado para screen readers ao aparecer
- Navegavel por teclado (foco vai para o toast)
- Action e Close acessiveis

## 7. Comparacao: Modal manual vs Radix Dialog

### Manual (incompleto)

```tsx
function ManualModal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  )
}
// Problemas: sem focus trap, sem ESC, sem Portal,
// sem ARIA, sem anuncio para screen readers
```

### Radix (completo)

```tsx
function RadixModal({ children }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Abrir</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="modal">
          <Dialog.Title>Titulo acessivel</Dialog.Title>
          <Dialog.Description>Descricao para screen readers</Dialog.Description>
          {children}
          <Dialog.Close asChild>
            <button>Fechar</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
// Tudo incluso: focus trap, ESC, Portal, ARIA,
// screen reader announcements, foco retorna ao trigger
```