# Code Examples: Depurando Código com Chrome DevTools

## Exemplo completo da aula

### HTML (estrutura do formulario)

```html
<form>
  <input type="text" placeholder="Digite seu nome" />
  <button type="submit">Adicionar</button>
</form>
```

### JavaScript (validacao com regex)

```javascript
const input = document.querySelector("input")
const form = document.querySelector("form")

form.onsubmit = function (event) {
  event.preventDefault()

  const value = input.value

  const hasNumberRegex = /\d+/g

  if (hasNumberRegex.test(value)) {
    alert("O texto contem numeros, por favor digite corretamente")
  } else {
    alert("Enviado")
  }
}
```

### Passo a passo do debug demonstrado na aula

1. Abrir DevTools (F12 ou Cmd+Option+I / Ctrl+Shift+I)
2. Ir para aba **Sources**
3. No painel esquerdo, encontrar o arquivo `.js`
4. Clicar na **linha 5** (`const value = input.value`) — breakpoint adicionado
5. Digitar "Rodrigo 123 Sobrenome" no input
6. Clicar em "Adicionar"
7. Codigo para na linha 5 (fica verde/destacada)
8. No painel Watch, clicar no `+` e digitar `value` → Enter
9. Neste momento, `value` aparece como **nao disponivel** (variavel ainda nao foi atribuida)
10. Clicar em **Step Over** → agora `value` tem o conteudo digitado
11. Adicionar no Watch: `hasNumberRegex.test(value)` → mostra `true` ou `false`
12. Clicar em Step Over novamente para ver qual caminho do `if` o codigo segue
13. Quando terminar, clicar **Play** para continuar execucao
14. Remover breakpoints clicando nos numeros das linhas

## Variacoes para praticar debug

### Variacao 1: Debug com multiplas condicoes

```javascript
form.onsubmit = function (event) {
  event.preventDefault()

  const value = input.value
  const minLength = 3
  const maxLength = 50
  const hasNumberRegex = /\d+/g
  const hasSpecialCharRegex = /[!@#$%^&*()]/g

  // Breakpoint aqui para ver todos os valores
  const isTooShort = value.length < minLength
  const isTooLong = value.length > maxLength
  const hasNumber = hasNumberRegex.test(value)
  const hasSpecialChar = hasSpecialCharRegex.test(value)

  // Breakpoint aqui para ver resultados das validacoes
  if (isTooShort) {
    alert("Texto muito curto")
  } else if (isTooLong) {
    alert("Texto muito longo")
  } else if (hasNumber) {
    alert("Texto contem numeros")
  } else if (hasSpecialChar) {
    alert("Texto contem caracteres especiais")
  } else {
    alert("Enviado com sucesso")
  }
}
```

**Pontos ideais para breakpoints:**
- Linha das atribuicoes de validacao (ver valores intermediarios)
- Primeira linha do bloco if/else (ver qual caminho segue)

### Variacao 2: Debug em loop

```javascript
const items = ["Rodrigo", "Maria123", "Jo@o", "Ana"]

// Breakpoint aqui para inspecionar cada iteracao
items.forEach(function (item, index) {
  const hasNumber = /\d+/g.test(item)

  // Watch: item, index, hasNumber
  if (hasNumber) {
    console.log(`Item ${index} (${item}) contem numeros`)
  }
})
```

**Dica:** Em loops, o breakpoint vai parar em CADA iteracao. Use o Watch para observar como `item` e `index` mudam a cada passo.

### Variacao 3: Debug em funcoes aninhadas

```javascript
function validateName(name) {
  // Breakpoint + Step Into para entrar aqui
  return name.length >= 2
}

function validateAge(age) {
  return age >= 18 && age <= 120
}

function processForm(name, age) {
  // Breakpoint aqui
  const isNameValid = validateName(name) // Step Into para entrar na funcao
  const isAgeValid = validateAge(age)

  // Watch: isNameValid, isAgeValid
  return isNameValid && isAgeValid
}
```

**Quando usar Step Into vs Step Over:**
- Step Into em `validateName(name)` → entra na funcao e para na primeira linha
- Step Over em `validateAge(age)` → executa a funcao inteira e vai para proxima linha

### Variacao 4: Debug com dados assincronos (fetch)

```javascript
async function loadUsers() {
  // Breakpoint aqui
  const response = await fetch("/api/users")
  // Step Over espera o await resolver — breakpoint aqui para ver response
  const users = await response.json()
  // Watch: users, users.length
  return users
}
```

**Nota:** Com `async/await`, Step Over em uma linha com `await` espera a Promise resolver antes de avancar. Breakpoints funcionam normalmente.