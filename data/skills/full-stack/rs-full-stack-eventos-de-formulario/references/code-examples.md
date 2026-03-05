# Code Examples: Eventos de Formulário

## HTML base usado na aula

```html
<form>
  <input type="text" placeholder="Digite algo" />
  <button type="submit">Adicionar</button>
</form>
```

## Seleção do formulário

```javascript
const form = document.querySelector('form')
```

## Exemplo 1: onsubmit básico (Arrow Function)

```javascript
form.onsubmit = (event) => {
  event.preventDefault()
  console.log('Você fez submit no formulário')
}
```

## Exemplo 2: addEventListener equivalente

```javascript
form.addEventListener('submit', (event) => {
  event.preventDefault()
  console.log('Você fez submit no formulário')
})
```

## Exemplo 3: Prova de sobrescrita com onsubmit

```javascript
// Este listener é IGNORADO (sobrescrito pelo próximo)
form.onsubmit = (event) => {
  event.preventDefault()
  console.log('Você fez submit no formulário 1')
}

// Este listener SOBRESCREVE o anterior
form.onsubmit = (event) => {
  event.preventDefault()
  console.log('Você fez submit no formulário 2')
}

// Ambos executam normalmente
form.addEventListener('submit', (event) => {
  event.preventDefault()
  console.log('Você fez submit no formulário 3')
})

form.addEventListener('submit', (event) => {
  event.preventDefault()
  console.log('Você fez submit no formulário 4')
})

// Resultado ao clicar: mensagens 2, 3, 4
// Mensagem 1 foi sobrescrita pela 2
```

## Variação: Formulário com múltiplos inputs

```html
<form id="user-form">
  <input type="text" name="name" />
  <input type="email" name="email" />
  <input type="password" name="password" />
  <button type="submit">Cadastrar</button>
</form>
```

```javascript
const userForm = document.querySelector('#user-form')

userForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(userForm)
  const name = formData.get('name')
  const email = formData.get('email')

  console.log({ name, email })
})
```

## Variação: Submit via Enter

```javascript
// O listener de submit captura AMBOS os casos:
// 1. Usuário clica no botão "Cadastrar"
// 2. Usuário pressiona Enter em qualquer input do form
form.addEventListener('submit', (event) => {
  event.preventDefault()
  processForm()
})

// Se usasse click no botão, Enter nos inputs NÃO seria capturado:
const button = document.querySelector('button')
button.addEventListener('click', (event) => {
  event.preventDefault()
  processForm() // Só executa com clique no mouse
})
```

## Variação: Separação de responsabilidades com múltiplos listeners

```javascript
// Módulo de validação
form.addEventListener('submit', (event) => {
  event.preventDefault()
  const nameInput = form.querySelector('[name="name"]')
  if (!nameInput.value.trim()) {
    nameInput.classList.add('error')
    return
  }
})

// Módulo de analytics
form.addEventListener('submit', (event) => {
  event.preventDefault()
  trackEvent('form_submitted', { formId: form.id })
})

// Módulo de envio
form.addEventListener('submit', (event) => {
  event.preventDefault()
  submitToAPI(new FormData(form))
})
```