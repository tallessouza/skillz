# Code Examples: Acessibilidade para Modais

## Exemplo 1: Modal basico com role e aria attributes

```tsx
// Adicionando role="dialog" — sem isso, leitores de tela ignoram o modal
<div role="dialog" aria-labelledby="modal1-title" aria-describedby="modal1-description">
  <h2 id="modal1-title">Termos de uso</h2>
  <p id="modal1-description">
    Ao utilizar nosso serviço, você concorda com os seguintes termos...
  </p>
</div>
```

## Exemplo 2: Foco programatico com useRef + useEffect

```tsx
import { useRef, useEffect, useState } from 'react'

function TermsModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isModalOpen) {
      modalRef.current?.focus()
    }
  }, [isModalOpen])

  return (
    <>
      <button
        aria-controls="modal1"
        onClick={() => setIsModalOpen(true)}
      >
        Ver termos de uso
      </button>

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
            Ao utilizar nosso serviço, você concorda com os seguintes termos...
          </p>
        </div>
      )}
    </>
  )
}
```

## Exemplo 3: Multiplos modais na mesma pagina

```tsx
// Modal 1 — IDs com prefixo "terms"
<button aria-controls="terms-modal">Ver termos</button>
<div
  id="terms-modal"
  role="dialog"
  aria-labelledby="terms-modal-title"
  aria-describedby="terms-modal-description"
  tabIndex={-1}
>
  <h2 id="terms-modal-title">Termos de uso</h2>
  <p id="terms-modal-description">Conteudo dos termos...</p>
</div>

// Modal 2 — IDs com prefixo "privacy"
<button aria-controls="privacy-modal">Ver privacidade</button>
<div
  id="privacy-modal"
  role="dialog"
  aria-labelledby="privacy-modal-title"
  aria-describedby="privacy-modal-description"
  tabIndex={-1}
>
  <h2 id="privacy-modal-title">Politica de privacidade</h2>
  <p id="privacy-modal-description">Conteudo da politica...</p>
</div>
```

## Exemplo 4: aria-label generico vs aria-labelledby (comparacao)

```tsx
// RUIM — redundante, o leitor fala "modal, dialog"
<div role="dialog" aria-label="modal">
  <h2>Termos de uso</h2>
</div>

// RUIM — funciona mas duplica o texto
<div role="dialog" aria-label="Termos de uso">
  <h2>Termos de uso</h2>
</div>

// BOM — reutiliza o H2 existente como label
<div role="dialog" aria-labelledby="modal1-title">
  <h2 id="modal1-title">Termos de uso</h2>
</div>
```

## Exemplo 5: Sem foco vs com foco (comportamento do leitor de tela)

```tsx
// SEM FOCO — leitor de tela NAO anuncia o modal ao abrir
// Usuario clica no botao, leitor diz: "button, Ver termos"
// Modal aparece visualmente mas leitor nao sabe
<button onClick={() => setIsModalOpen(true)}>Ver termos</button>
{isModalOpen && (
  <div role="dialog" aria-labelledby="modal1-title">
    <h2 id="modal1-title">Termos de uso</h2>
  </div>
)}

// COM FOCO — leitor anuncia "Entering dialog. Termos de uso..."
const modalRef = useRef<HTMLDivElement>(null)
useEffect(() => {
  if (isModalOpen) modalRef.current?.focus()
}, [isModalOpen])

<button onClick={() => setIsModalOpen(true)}>Ver termos</button>
{isModalOpen && (
  <div
    ref={modalRef}
    role="dialog"
    aria-labelledby="modal1-title"
    tabIndex={-1}
  >
    <h2 id="modal1-title">Termos de uso</h2>
  </div>
)}
```

## Exemplo 6: Modal com formulario (cenario avancado mencionado)

```tsx
// Quando o modal tem inputs, o focus trap se torna importante
// O instrutor menciona mas nao implementa nesta aula
<div
  ref={modalRef}
  id="contact-modal"
  role="dialog"
  aria-labelledby="contact-modal-title"
  aria-describedby="contact-modal-description"
  tabIndex={-1}
>
  <h2 id="contact-modal-title">Fale conosco</h2>
  <p id="contact-modal-description">
    Preencha o formulario abaixo para entrar em contato.
  </p>
  <form>
    <label htmlFor="name">Nome</label>
    <input id="name" type="text" />
    <label htmlFor="email">Email</label>
    <input id="email" type="email" />
    <button type="submit">Enviar</button>
  </form>
</div>
```