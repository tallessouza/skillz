# Code Examples: setTimeout

## Exemplo 1: Basico da aula

Exatamente como demonstrado pelo instrutor:

```javascript
setTimeout(() => {
  console.log("Ola, tudo bem?")
}, 1000)
```

Saida apos 1 segundo: `Ola, tudo bem?`

## Exemplo 2: Aumentando o delay

O instrutor muda o valor para demonstrar o efeito:

```javascript
setTimeout(() => {
  console.log("Ola, tudo bem?")
}, 3000)
```

Saida apos 3 segundos: `Ola, tudo bem?`

## Exemplo 3: Variacoes praticas

### Mostrar loading e depois conteudo

```javascript
showLoadingSpinner()

const contentDelayInMs = 2000

setTimeout(() => {
  hideLoadingSpinner()
  showContent()
}, contentDelayInMs)
```

### Redirecionar apos mensagem de sucesso

```javascript
const redirectDelayInMs = 3000

displaySuccessMessage("Cadastro realizado!")

const redirectTimerId = setTimeout(() => {
  window.location.href = "/dashboard"
}, redirectDelayInMs)
```

### Toast notification que desaparece

```javascript
const toastDurationInMs = 5000

function showToast(message) {
  const toast = createToastElement(message)
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, toastDurationInMs)
}
```

## Exemplo 4: Cancelamento com clearTimeout

```javascript
const autoSaveDelayInMs = 10000

const autoSaveTimerId = setTimeout(() => {
  saveFormData()
}, autoSaveDelayInMs)

// Usuario clicou salvar manualmente — cancela o auto-save
saveButton.addEventListener("click", () => {
  clearTimeout(autoSaveTimerId)
  saveFormData()
})
```

## Exemplo 5: Erro comum — invocar em vez de referenciar

```javascript
// ERRADO: greet() executa AGORA, setTimeout recebe o retorno (undefined)
function greet() {
  console.log("Ola!")
}
setTimeout(greet(), 1000) // "Ola!" aparece imediatamente

// CORRETO: passa a referencia
setTimeout(greet, 1000) // "Ola!" aparece apos 1 segundo

// CORRETO: wrapping em arrow function (util se precisa passar argumentos)
setTimeout(() => greet(), 1000)
```

## Exemplo 6: setTimeout com 0ms

```javascript
console.log("Primeiro")

setTimeout(() => {
  console.log("Terceiro") // executa DEPOIS, mesmo com 0ms
}, 0)

console.log("Segundo")

// Saida:
// Primeiro
// Segundo
// Terceiro
```

Isso acontece porque setTimeout coloca o callback na task queue, e o event loop so o executa apos esvaziar a call stack.