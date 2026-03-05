---
name: rs-full-stack-o-que-sao-variaveis
description: "Applies fundamental variable concepts when teaching or explaining JavaScript basics. Use when user asks to 'explain variables', 'what are variables', 'how memory works in JS', 'teach JS basics', or 'explain RAM and variables'. Reinforces mental models: memory as closet, variables as labeled drawers, mutability as content replacement. Make sure to use this skill whenever explaining programming fundamentals to beginners. Not for advanced scoping, closures, hoisting, or memory management optimization."
---

# O que são Variáveis

> Variáveis são espaços nomeados na memória RAM do computador para armazenar informações temporárias que serão usadas e modificadas durante a execução do programa.

## Key concept

Uma variável reserva um espaço na memória RAM (Random Access Memory) para guardar dados temporariamente. RAM é volátil — ao desligar o computador, tudo se perde (diferente do HD, que persiste). Essa velocidade e temporalidade tornam a RAM ideal para dados que o programa manipula em tempo de execução.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Precisa guardar um valor para usar depois | Criar uma variável com nome descritivo |
| Valor muda ao longo do tempo | Usar variável mutável (não constante) |
| Valor nunca muda | Usar constante |
| Muitas variáveis no mesmo contexto | Nomear cada uma pelo conteúdo que armazena |

## How to think about it

### Analogia do armário e gavetas

A memória do computador é um armário. Cada gaveta é um espaço na memória. A variável é uma gaveta com etiqueta.

```
ARMÁRIO (memória RAM)
┌─────────────────────┐
│ [camisa]    👕      │  ← gaveta nomeada = variável com nome
│ [meia]      🧦      │  ← etiqueta evita abrir para saber o conteúdo
│ [calça]     👖      │  ← nome descreve o que está guardado
└─────────────────────┘
```

A etiqueta (nome da variável) permite saber o conteúdo sem precisar "abrir a gaveta" — ou seja, sem precisar inspecionar o valor. Por isso nomes descritivos importam.

### Variável pode variar

O conteúdo de uma gaveta pode ser substituído. Se antes guardava meias, agora pode guardar camisetas. Em JavaScript, por ser dinamicamente tipada, pode até trocar o tipo do conteúdo (guardar um número onde antes havia texto).

```javascript
let gaveta = "meia"      // guardou meia
gaveta = "camiseta"      // substituiu por camiseta (mesmo tipo)
gaveta = 42              // JS permite trocar o tipo (dinâmico)
```

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Variável guarda dados permanentemente | Variáveis vivem na RAM — memória temporária que esvazia ao desligar |
| Nome da variável não importa | Nomes descritivos evitam confusão quando há muitas variáveis (produto, preco, quantidade) |
| Variável nunca muda de valor | Variável, como o nome diz, pode variar — o conteúdo pode ser substituído |
| Toda linguagem permite trocar tipos | Tipos dinâmicos é característica de JS; outras linguagens exigem tipo fixo |

## When to apply

- Ao explicar fundamentos de programação para iniciantes
- Ao justificar por que nomes de variáveis importam
- Ao diferenciar memória RAM vs armazenamento persistente (HD/SSD)
- Ao introduzir tipagem dinâmica do JavaScript

## Limitations

- Este modelo mental não cobre escopo, hoisting, closures ou garbage collection
- A analogia do armário simplifica — memória real não funciona como gavetas físicas
- Tipagem dinâmica será aprofundada em aulas posteriores

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações