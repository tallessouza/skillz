# Code Examples: Funções de Manipulação de Lista com Try-Catch

## Exemplo 1: Código exato da aula

```javascript
// Criação do objeto (fora da função de adição)
const newExpense = {
  id: new Date().getTime(),
  expense: expense.value,
  category_id: category.value,
  amount: parseFloat(amount.value),
}

// Função de adição com try-catch
function expenseAdd(newExpense) {
  try {
    // Lógica de montagem do elemento e adição na lista
    // (implementado nas próximas aulas)
  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar a lista de despesas.")
  }
}

// Chamada após criar o objeto
expenseAdd(newExpense)
```

## Exemplo 2: Testando o fluxo de erro

```javascript
function expenseAdd(newExpense) {
  try {
    // Temporário: forçar erro para testar o catch
    throw new Error("erro de teste")
  } catch (error) {
    console.log(error) // Exibe "Error: erro de teste" no console
    alert("Não foi possível atualizar a lista de despesas.") // Alerta para o usuário
  }
}
```

Após verificar que o alert aparece e o console mostra o erro, remova o `throw new Error`.

## Exemplo 3: Variação — Lista de tarefas

```javascript
const newTask = {
  id: new Date().getTime(),
  title: taskInput.value,
  completed: false,
}

function taskAdd(newTask) {
  try {
    const taskList = document.querySelector(".task-list")
    const li = document.createElement("li")
    li.textContent = newTask.title
    taskList.appendChild(li)
  } catch (error) {
    console.log(error)
    alert("Não foi possível adicionar a tarefa.")
  }
}

taskAdd(newTask)
```

## Exemplo 4: Variação — Lista de contatos

```javascript
const newContact = {
  id: new Date().getTime(),
  name: nameInput.value,
  phone: phoneInput.value,
  email: emailInput.value,
}

function contactAdd(newContact) {
  try {
    contacts.push(newContact)
    renderContacts()
  } catch (error) {
    console.log(error)
    alert("Não foi possível adicionar o contato.")
  }
}

contactAdd(newContact)
```

## Exemplo 5: Anti-pattern — Tudo misturado (NÃO faça isso)

```javascript
// ERRADO: criação do objeto e inserção na mesma função
function addExpense() {
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    amount: parseFloat(amount.value),
  }
  list.push(newExpense)
  renderList()
}
```

```javascript
// CORRETO: separar criação da inserção
const newExpense = {
  id: new Date().getTime(),
  expense: expense.value,
  category_id: category.value,
  amount: parseFloat(amount.value),
}

function expenseAdd(newExpense) {
  try {
    list.push(newExpense)
    renderList()
  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar a lista de despesas.")
  }
}

expenseAdd(newExpense)
```

## Exemplo 6: Catch silencioso — NUNCA faça isso

```javascript
// ERRADO: catch vazio — erro desaparece
function expenseAdd(newExpense) {
  try {
    list.push(newExpense)
  } catch (error) {
    // silêncio total — impossível debugar
  }
}

// ERRADO: só console, sem feedback para o usuário
function expenseAdd(newExpense) {
  try {
    list.push(newExpense)
  } catch (error) {
    console.log(error)
    // usuário não sabe que falhou
  }
}

// CORRETO: feedback duplo
function expenseAdd(newExpense) {
  try {
    list.push(newExpense)
  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar a lista de despesas.")
  }
}
```