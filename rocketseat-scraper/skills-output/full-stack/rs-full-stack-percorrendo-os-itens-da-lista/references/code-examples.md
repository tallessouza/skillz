# Code Examples: Percorrendo Itens da Lista

## Exemplo base da aula

### Estrutura HTML assumida

```html
<ul>
  <li>
    <span class="expense-name">Almoco</span>
    <span class="expense-amount">35.60</span>
  </li>
  <li>
    <span class="expense-name">Janta</span>
    <span class="expense-amount">56.00</span>
  </li>
</ul>
```

### Codigo JavaScript da aula (passo a passo)

```javascript
// 1. Seleciona todos os itens da lista
const itens = document.querySelectorAll("li")

// 2. Exibe quantidade de itens
console.log("Quantidade de despesas:", itens.length)

// 3. Inicializa acumulador
let total = 0

// 4. Percorre cada item
for (let item = 0; item < itens.length; item++) {
  // 5. Seleciona o valor DENTRO do item atual (querySelector escopado)
  const itemAmount = itens[item].querySelector(".expense-amount")

  // 6. Debug: visualiza o elemento selecionado
  console.log(itemAmount) // <span class="expense-amount">35.60</span>

  // 7. Extrai o texto e converte para numero
  total += parseFloat(itemAmount.innerText)
}

console.log("Total das despesas:", total) // 91.60
```

## Variacao: usando textContent vs innerText

```javascript
// innerText — respeita CSS (ignora elementos hidden)
const valor = itens[i].querySelector(".expense-amount").innerText

// textContent — pega TODO o texto, mesmo de elementos ocultos
const valor = itens[i].querySelector(".expense-amount").textContent
```

Para valores numericos simples, ambos funcionam. Prefira `textContent` por ser mais performatico (nao causa reflow).

## Variacao: validacao de elemento nulo

```javascript
for (let i = 0; i < itens.length; i++) {
  const itemAmount = itens[i].querySelector(".expense-amount")

  // Protege contra itens sem a classe .expense-amount
  if (itemAmount) {
    total += parseFloat(itemAmount.innerText) || 0
  }
}
```

O `|| 0` protege contra `NaN` caso o texto nao seja um numero valido.

## Variacao: mesmo padrao com outras agregacoes

### Encontrar o maior valor

```javascript
let maiorDespesa = 0

for (let i = 0; i < itens.length; i++) {
  const itemAmount = itens[i].querySelector(".expense-amount")
  const valor = parseFloat(itemAmount.innerText)

  if (valor > maiorDespesa) {
    maiorDespesa = valor
  }
}
```

### Concatenar nomes das despesas

```javascript
let nomesDespesas = ""

for (let i = 0; i < itens.length; i++) {
  const itemName = itens[i].querySelector(".expense-name")
  nomesDespesas += itemName.innerText + ", "
}

// Remove a ultima virgula
nomesDespesas = nomesDespesas.slice(0, -2)
```

## Comparacao: for loop vs metodos de array

A aula ensina o `for` classico. Para referencia, o mesmo resultado com metodos modernos:

```javascript
// Com for (ensinado na aula)
let total = 0
for (let i = 0; i < itens.length; i++) {
  total += parseFloat(itens[i].querySelector(".expense-amount").innerText)
}

// Com forEach (alternativa moderna)
let total = 0
itens.forEach(item => {
  total += parseFloat(item.querySelector(".expense-amount").innerText)
})

// Com reduce (via Array.from, mais funcional)
const total = Array.from(itens).reduce((acc, item) => {
  return acc + parseFloat(item.querySelector(".expense-amount").innerText)
}, 0)
```

O `for` classico e ensinado primeiro porque torna explicito o mecanismo de iteracao (inicializacao, condicao, incremento), essencial para entender os metodos abstratos depois.