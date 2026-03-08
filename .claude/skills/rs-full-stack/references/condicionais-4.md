---
name: rs-full-stack-condicionais
description: "Applies conditional structure patterns when writing JavaScript/TypeScript control flow. Use when user asks to 'add an if statement', 'check a condition', 'handle login validation', 'control program flow', or 'make decisions in code'. Enforces clear boolean test extraction, early returns, and structured true/false branching. Make sure to use this skill whenever generating conditional logic, even for simple checks. Not for loops, error handling strategies, or async flow control."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, conditionals, if-else, logic, control-flow]
---

# Estrutura de Condição

> Toda condicional começa com um teste lógico claro que resulta em verdadeiro ou falso — extraia a condição antes de escrever o bloco.

## Rules

1. **Identifique a condição primeiro** — antes de escrever `if`, defina em palavras o teste lógico ("o email e senha estão corretos?"), porque condicionais confusas nascem de testes mal definidos
2. **Sempre trate os dois caminhos** — todo `if` deve ter um `else` explícito ou um early return, porque caminhos falsos ignorados causam bugs silenciosos
3. **Nomeie booleanos pela condição, não pelo efeito** — `isPasswordCorrect` não `shouldShowError`, porque a condição é reutilizável em múltiplos contextos
4. **Prefira early return para o caminho falso** — reduza aninhamento retornando cedo quando a condição falha, porque código flat é mais legível
5. **Uma condição por teste** — se o `if` testa mais de duas coisas, extraia para variável nomeada ou função, porque condições longas são ilegíveis

## How to write

### Padrão básico: teste lógico com dois caminhos

```javascript
// Condição: o usuário forneceu credenciais corretas?
const isCredentialsValid = email === storedEmail && password === storedPassword

if (isCredentialsValid) {
  allowAccess(user)
} else {
  showError("E-mail ou senha incorretos")
}
```

### Early return para reduzir aninhamento

```javascript
function enterDoor(door) {
  // Condição: a porta está aberta?
  if (!door.isOpen) {
    door.open()
  }

  door.enter()
}
```

### Condições compostas extraídas

```javascript
// Extraia condições complexas para variáveis descritivas
const isAdult = user.age >= 18
const hasPermission = user.role === "admin" || user.role === "editor"
const canPublish = isAdult && hasPermission

if (canPublish) {
  publishArticle(article)
} else {
  saveDraft(article)
}
```

## Example

**Before (condição sem clareza):**
```javascript
if (a && b !== "" && c > 0) {
  doStuff()
}
```

**After (com esta skill aplicada):**
```javascript
const isUserActive = a
const hasUsername = b !== ""
const hasPositiveBalance = c > 0
const canProceed = isUserActive && hasUsername && hasPositiveBalance

if (canProceed) {
  processTransaction()
} else {
  notifyIncompleteProfile()
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Condição simples (uma comparação) | `if` direto, sem extrair variável |
| Condição com 2+ operadores lógicos | Extraia para variável booleana nomeada |
| Caminho falso é um erro/retorno | Use early return |
| Múltiplos caminhos possíveis | Use `else if` ou `switch` |
| Condição usada em mais de um lugar | Extraia para função |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `if (x) { ... }` sem tratar o `else` | Trate ambos os caminhos ou use early return |
| `if (a && b && c && d)` inline | Extraia para `const isReady = a && b && c && d` |
| `if (isOpen === true)` | `if (isOpen)` — booleanos não precisam de comparação |
| `if (!isNotValid)` | `if (isValid)` — evite dupla negação |
| Condicionais aninhados 3+ níveis | Refatore com early returns ou extraia funções |


## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Condicional sempre executa o mesmo caminho | Condicao mal formulada ou sempre true/false | Teste a condicao isoladamente com `console.log` para verificar o valor |
| Dupla negacao dificulta leitura | Uso de `!isNotValid` em vez de `isValid` | Renomeie a variavel para forma positiva: `isValid` |
| Muitos niveis de aninhamento | Condicionais encadeadas sem early return | Refatore com early returns para reduzir aninhamento |
| Else nao tratado causa bug silencioso | Caminho falso ignorado | Sempre trate ambos os caminhos ou use early return |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações