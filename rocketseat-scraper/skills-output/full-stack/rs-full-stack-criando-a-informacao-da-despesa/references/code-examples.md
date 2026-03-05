# Code Examples: Criacao de Informacao da Despesa

## Exemplo da aula — codigo completo

```javascript
// Cria a info da despesa
const expenseInfo = document.createElement("div")
expenseInfo.classList.add("expense-info")

// Cria o nome da despesa
const expenseName = document.createElement("strong")
expenseName.textContent = newExpense.expense

// Cria a categoria da despesa
const expenseCategory = document.createElement("span")
expenseCategory.textContent = newExpense.categoryName

// Adiciona nome e categoria na div das informacoes da despesa
expenseInfo.append(expenseName, expenseCategory)

// Adiciona icone e info no item da lista
expenseItem.append(expenseIcon, expenseInfo)
```

## Contexto completo — funcao com todos os elementos

```javascript
function createExpenseItem(newExpense) {
  // Cria o item da lista
  const expenseItem = document.createElement("li")
  expenseItem.classList.add("expense")

  // Cria o icone da categoria
  const expenseIcon = document.createElement("img")
  expenseIcon.src = `img/${newExpense.categoryId}.svg`
  expenseIcon.alt = newExpense.categoryName

  // Cria a info da despesa
  const expenseInfo = document.createElement("div")
  expenseInfo.classList.add("expense-info")

  const expenseName = document.createElement("strong")
  expenseName.textContent = newExpense.expense

  const expenseCategory = document.createElement("span")
  expenseCategory.textContent = newExpense.categoryName

  // Monta a cascata
  expenseInfo.append(expenseName, expenseCategory)
  expenseItem.append(expenseIcon, expenseInfo)

  return expenseItem
}
```

## Variacao — adicionando mais campos (ex: valor)

```javascript
// Cria a info da despesa com valor
const expenseInfo = document.createElement("div")
expenseInfo.classList.add("expense-info")

const expenseName = document.createElement("strong")
expenseName.textContent = newExpense.expense

const expenseCategory = document.createElement("span")
expenseCategory.textContent = newExpense.categoryName

const expenseAmount = document.createElement("small")
expenseAmount.textContent = `R$ ${newExpense.amount}`

// Agrupa todos os filhos de uma vez
expenseInfo.append(expenseName, expenseCategory, expenseAmount)
```

## Variacao — lista de contatos (mesmo padrao, dominio diferente)

```javascript
const contactInfo = document.createElement("div")
contactInfo.classList.add("contact-info")

const contactName = document.createElement("strong")
contactName.textContent = contact.name

const contactEmail = document.createElement("span")
contactEmail.textContent = contact.email

contactInfo.append(contactName, contactEmail)
contactItem.append(contactAvatar, contactInfo)
contactList.append(contactItem)
```

## Variacao — card de produto

```javascript
const productCard = document.createElement("div")
productCard.classList.add("product-card")

const productName = document.createElement("h3")
productName.textContent = product.name

const productPrice = document.createElement("span")
productPrice.textContent = `R$ ${product.priceInCents / 100}`

const productDescription = document.createElement("p")
productDescription.textContent = product.description

productCard.append(productName, productPrice, productDescription)
productGrid.append(productCard)
```

## HTML equivalente (para referencia)

O codigo JavaScript acima produz esta estrutura HTML:

```html
<li class="expense">
  <img src="img/food.svg" alt="Alimentacao">
  <div class="expense-info">
    <strong>Almoco</strong>
    <span>Alimentacao</span>
  </div>
</li>
```

## Teste feito na aula

O instrutor testou com dois cenarios:
1. Nome: "Almoco" | Categoria: "Alimentacao" | Valor: 55
2. Nome: "Hotel" | Categoria: "Transporte" | Valor: 34

Ambos renderizaram corretamente com icone, nome e categoria exibidos na lista.