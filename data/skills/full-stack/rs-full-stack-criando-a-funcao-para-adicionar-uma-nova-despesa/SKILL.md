---
name: rs-full-stack-funcao-adicionar-despesa
description: "Enforces try-catch error handling pattern when creating functions that modify DOM lists or collections. Use when user asks to 'add item to list', 'create add function', 'insert element', 'append to DOM', or any function that manipulates a list/collection. Applies rules: always wrap list mutations in try-catch, show user-friendly alert on error, log technical error to console, separate object creation from list insertion. Make sure to use this skill whenever generating functions that add/remove/update items in a list or DOM. Not for API calls, async operations, or form validation logic."
---

# Funções de Manipulação de Lista com Try-Catch

> Toda função que adiciona, remove ou modifica itens em uma lista deve ter tratamento de exceções com feedback duplo: técnico no console, amigável para o usuário.

## Rules

1. **Separe criação do objeto da inserção na lista** — primeiro crie o objeto com os dados, depois chame a função que insere, porque isso isola responsabilidades e facilita debug
2. **Sempre envolva manipulação de lista em try-catch** — operações de DOM e lista podem falhar silenciosamente, e o usuário fica sem feedback
3. **Feedback duplo no catch: console + alert** — `console.log(error)` para o desenvolvedor analisar, `alert()` com mensagem amigável para o usuário saber que algo falhou
4. **Receba o item completo como parâmetro** — a função de adição recebe o objeto pronto, não monta o objeto internamente, porque mantém a função focada em uma responsabilidade
5. **Nomeie funções como verbo + substantivo** — `expenseAdd`, `itemRemove`, porque descreve a ação sobre o recurso

## How to write

### Função de adição com try-catch

```javascript
function expenseAdd(newExpense) {
  try {
    // Lógica de manipulação da lista/DOM aqui
  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar a lista de despesas.")
  }
}
```

### Fluxo completo: criação + chamada

```javascript
// 1. Cria o objeto com os dados
const newExpense = {
  id: new Date().getTime(),
  expense: expenseName,
  category_id: categoryId,
  amount: expenseAmount,
}

// 2. Chama a função que adiciona na lista
expenseAdd(newExpense)
```

## Example

**Before (sem tratamento de erro):**
```javascript
function addItem(item) {
  list.push(item)
  renderList()
}
```

**After (com this skill applied):**
```javascript
function itemAdd(newItem) {
  try {
    list.push(newItem)
    renderList()
  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar a lista.")
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Função modifica DOM ou array visível ao usuário | Sempre try-catch com feedback duplo |
| Testando o fluxo de erro | Use `throw new Error("erro de teste")` temporariamente dentro do try |
| Erro precisa de detalhes técnicos | `console.log(error)` — nunca exponha stack trace ao usuário |
| Mensagem para o usuário | Genérica e útil: "Não foi possível X" — sem jargão técnico |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `function add(d) {}` | `function expenseAdd(newExpense) {}` |
| `catch (e) { /* silêncio */ }` | `catch (error) { console.log(error); alert("...") }` |
| `alert(error.message)` para o usuário | `alert("Não foi possível atualizar a lista.")` |
| Criar objeto E inserir na mesma função | Separar: criar objeto fora, passar como parâmetro |
| `catch (e) { console.log("erro") }` sem alert | Sempre feedback duplo: console + alert |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação de responsabilidades e fluxo try-catch
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações