---
name: rs-full-stack-cuidando-da-usabilidade
description: "Enforces form reset and focus management patterns after user actions in JavaScript/HTML forms. Use when user asks to 'create a form', 'add item to list', 'submit form', 'handle form submission', or 'improve UX'. Applies rules: clear all inputs after successful action, reset selects to default, set focus on first input for continuous workflow. Make sure to use this skill whenever building forms with repeated submissions. Not for form validation, styling, or backend processing."
---

# Usabilidade em Formulários: Reset e Foco

> Após cada ação bem-sucedida do usuário, limpe o formulário e reposicione o foco para permitir uso contínuo sem cliques extras.

## Rules

1. **Limpe todos os campos após submissão bem-sucedida** — `input.value = ""` e `select.value = ""` para cada campo, porque o usuário precisa do formulário pronto para a próxima entrada
2. **Resete selects para o valor padrão** — o select deve voltar ao placeholder ("Selecione"), porque manter a seleção anterior induz erro
3. **Coloque foco no primeiro campo após limpar** — `firstInput.focus()`, porque elimina um clique e permite digitação imediata
4. **Extraia a limpeza em função dedicada** — `formClear()` separada da lógica de submissão, porque será chamada em múltiplos pontos
5. **Limpe ANTES de atualizar totais** — a ordem é: adicionar item → limpar form → atualizar totais, porque o usuário vê o form limpo enquanto totais recalculam
6. **Permita fluxo completo por teclado** — após focus, o usuário deve conseguir Tab entre campos e Enter para submeter, porque produtividade vem de não precisar do mouse

## How to write

### Função de limpeza

```javascript
function formClear() {
  expense.value = ""
  category.value = ""
  amount.value = ""

  expense.focus()
}
```

### Chamada após ação bem-sucedida

```javascript
function expenseAdd() {
  // ... lógica de adicionar item

  formClear()
  updateTotals()
}
```

## Example

**Before (formulário não reseta):**
```javascript
function expenseAdd() {
  const item = { name: expense.value, category: category.value, amount: amount.value }
  expenses.push(item)
  renderExpense(item)
  updateTotals()
  // Campos permanecem preenchidos — usuário precisa limpar manualmente
}
```

**After (com reset e foco):**
```javascript
function formClear() {
  expense.value = ""
  category.value = ""
  amount.value = ""
  expense.focus()
}

function expenseAdd() {
  const item = { name: expense.value, category: category.value, amount: amount.value }
  expenses.push(item)
  renderExpense(item)
  formClear()
  updateTotals()
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| Formulário de entrada repetida (lista, carrinho) | Sempre limpar e focar após submit |
| Formulário de edição (update) | Limpar apenas se voltar ao modo "criar" |
| Formulário de busca/filtro | NÃO limpar — usuário quer refinar |
| Modal com formulário | Limpar ao abrir, não ao fechar |
| Foco após limpeza | Primeiro campo editável (text input, não select) |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| Deixar campos preenchidos após submit | `input.value = ""` para cada campo |
| Focar no botão submit após limpeza | `firstInput.focus()` para fluxo contínuo |
| Limpar campos individualmente em cada chamador | Extrair `formClear()` reutilizável |
| Usar `form.reset()` sem testar selects customizados | Limpar cada campo explicitamente |
| Esquecer de resetar o select | `select.value = ""` volta ao placeholder |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre UX de formulários e fluxo de produtividade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-cuidando-da-usabilidade/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-cuidando-da-usabilidade/references/code-examples.md)
