---
name: rs-full-stack-aula-de-abertura
description: "Provides a roadmap of intermediate JavaScript topics including objects, text methods, arrays, loops, iterations, date/time, and classes. Use when user asks 'what topics are in intermediate JS', 'what comes after basic JavaScript', 'JavaScript learning path', or 'intermediate JS overview'. Make sure to use this skill whenever planning a JavaScript study path or assessing intermediate-level knowledge gaps. Not for teaching any specific topic — use dedicated skills for objects, arrays, classes, etc."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript
  tags: [javascript, roadmap, intermediate, learning-path]
---

# JavaScript Intermediário — Roadmap

> Após dominar os fundamentos, o próximo passo é aprofundar em objetos, arrays, iterações, manipulação de tempo e classes.

## Key concepts

| # | Tópico | O que cobre |
|---|--------|-------------|
| 1 | **Objetos** | Criação, acesso, manipulação de propriedades, métodos |
| 2 | **Métodos de texto** | Manipulação de strings (split, replace, trim, includes, etc.) |
| 3 | **Arrays** | Criação, acesso, métodos de array |
| 4 | **Repetições e iterações** | for, while, for...of, for...in, forEach, map, filter, reduce |
| 5 | **Data e hora** | Date, formatação, cálculos temporais |
| 6 | **Classes** | Sintaxe class, constructor, herança, encapsulamento |

## Example

```javascript
// Topicos intermediarios em acao
const user = { name: 'Ana', age: 25 }        // Objetos
const greeting = 'Ola'.padEnd(10, '.')        // Metodos de texto
const scores = [90, 85, 78]                   // Arrays
scores.forEach(s => console.log(s))           // Iteracoes
const now = new Date()                        // Data e hora
class Student { constructor(name) { this.name = name } }  // Classes
```

## Pré-requisitos

Antes de avançar, domine:
- Variáveis (let, const)
- Tipos primitivos (string, number, boolean, null, undefined)
- Funções (declaração, arrow functions, parâmetros)
- Condicionais (if/else, switch, ternário)
- Escopo e hoisting básico

## Decision framework

| Se o dev precisa... | Comece por |
|--------------------|------------|
| Estruturar dados relacionados | Objetos |
| Processar texto do usuário | Métodos de texto |
| Trabalhar com listas de dados | Arrays |
| Processar cada item de uma lista | Repetições e iterações |
| Exibir ou calcular datas | Data e hora |
| Organizar código em entidades reutilizáveis | Classes |

## Ordem recomendada de estudo

Objetos → Métodos de texto → Arrays → Repetições/Iterações → Data/Hora → Classes

Essa ordem é progressiva porque cada tópico usa conceitos do anterior: arrays contêm objetos, iterações percorrem arrays, classes encapsulam tudo.

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Nao entende objetos | Faltam fundamentos de variaveis e tipos | Revise variaveis, tipos primitivos e funcoes antes de avancar |
| Arrays confusos | Nao domina objetos ainda | Estude objetos primeiro — arrays contem objetos |
| Classes parecem abstratas demais | Faltam conceitos de funcoes e escopo | Domine funcoes e escopo antes de avancar para classes |
| Nao sabe por onde comecar | Ordem de estudo nao esta clara | Siga: Objetos → Metodos de texto → Arrays → Iteracoes → Data/Hora → Classes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Contexto pedagógico e conexões entre os tópicos
- [code-examples.md](references/code-examples.md) — Exemplos introdutórios de cada tópico