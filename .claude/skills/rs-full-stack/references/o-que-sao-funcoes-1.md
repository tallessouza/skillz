---
name: rs-full-stack-o-que-sao-funcoes-1
description: "Applies JavaScript function fundamentals when writing or explaining functions. Use when user asks to 'create a function', 'write a function', 'explain functions', 'organize code', or 'refactor into functions'. Enforces single responsibility, descriptive naming, and reusability principles. Make sure to use this skill whenever creating new functions or refactoring code into functions. Not for async patterns, closures, or advanced function composition."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos-javascript
  tags: [javascript, funcoes, reutilizacao, responsabilidade-unica, beginner]
---

# O que são Funções

> Funções são blocos de código definidos uma vez e invocados quantas vezes necessário, cada uma com uma única responsabilidade.

## Key concept

Uma função encapsula uma tarefa específica — calcular um valor, processar dados, executar uma ação. Definir uma vez, chamar quantas vezes quiser. Os termos "chamar", "executar" e "invocar" significam a mesma coisa: acionar a função.

A analogia do controle de videogame: cada botão tem uma função específica. O botão de pular sempre faz pular. Não faz pular E atacar. Uma responsabilidade por botão, uma responsabilidade por função.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Código repetido em 2+ lugares | Extrair para uma função reutilizável |
| Bloco de código fazendo múltiplas coisas | Separar em funções com responsabilidade única |
| Código difícil de entender | Extrair para função com nome descritivo |
| Necessidade de calcular um valor | Criar função que recebe inputs e retorna o resultado |

## How to think about it

### Responsabilidade única

```javascript
// Cada função = um botão do controle
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

function formatCurrency(valueInCents) {
  return `R$ ${(valueInCents / 100).toFixed(2)}`
}

function displayOrderTotal(items) {
  const total = calculateTotal(items)
  return formatCurrency(total)
}
```

Cada função faz UMA coisa. `calculateTotal` calcula. `formatCurrency` formata. `displayOrderTotal` orquestra.

### Reutilização

```javascript
// Definiu uma vez
function greetUser(name) {
  return `Olá, ${name}!`
}

// Chama quantas vezes quiser
greetUser('Maria')   // "Olá, Maria!"
greetUser('João')    // "Olá, João!"
greetUser('Ana')     // "Olá, Ana!"
```

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Função precisa ser grande e complexa | Funções pequenas e focadas são melhores — facilita entender e reutilizar |
| Criar muitas funções é exagero | Funções bem nomeadas tornam o código auto-documentado |
| Chamar, invocar e executar são coisas diferentes | São sinônimos — todos significam acionar a função |

## When to apply

- Ao criar qualquer bloco de código que realiza uma tarefa específica
- Ao encontrar código duplicado que pode ser centralizado
- Ao refatorar código longo em partes menores e compreensíveis
- Ao nomear funções — o nome deve descrever exatamente o que ela faz

## Limitations

- Esta skill cobre o conceito fundamental de funções, não padrões avançados como closures, higher-order functions ou composição funcional
- Para convenções de nomenclatura detalhadas, consultar skill específica de nomenclatura

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Funcao retorna `undefined` | Esqueceu a instrucao `return` | Adicione `return` com o valor que deseja retornar |
| Funcao nao executa | Definiu mas nao chamou a funcao | Adicione `nomeFuncao()` com parenteses para invocar |
| Parametro chega como `undefined` | Argumento nao foi passado na chamada | Verifique se esta passando o argumento correto na invocacao |
| Funcao faz muitas coisas | Violacao do principio de responsabilidade unica | Divida em funcoes menores, cada uma com uma tarefa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-o-que-sao-funcoes-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-o-que-sao-funcoes-1/references/code-examples.md)
