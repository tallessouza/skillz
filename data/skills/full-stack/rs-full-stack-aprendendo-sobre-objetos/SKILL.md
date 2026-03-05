---
name: rs-full-stack-aprendendo-sobre-objetos
description: "Enforces correct JavaScript object modeling with properties and methods when creating objects to represent real-world entities. Use when user asks to 'create an object', 'model a domain entity', 'define a class', or 'represent something in code'. Applies abstraction principles: properties for characteristics (values), methods for behaviors (functions), named by domain not structure. Make sure to use this skill whenever modeling domain entities in JavaScript/TypeScript. Not for array manipulation, DOM handling, or async patterns."
---

# Modelagem de Objetos em JavaScript

> Objetos representam entidades do mundo real atraves de propriedades (caracteristicas) e metodos (comportamentos).

## Rules

1. **Nomeie o objeto pela entidade que representa** — `carro`, `pessoa`, `departamento`, porque o objeto e uma abstracao de algo real ou conceitual
2. **Propriedades descrevem caracteristicas** — valores como texto ou numeros que definem O QUE o objeto e, porque propriedades sao a identidade do objeto
3. **Metodos descrevem comportamentos** — funcoes que definem O QUE o objeto faz, porque comportamentos sao as acoes que a entidade executa no mundo real
4. **Separe abstracao concreta de abstrata** — carro (palpavel) vs departamento (conceitual), ambos sao validos como objetos, porque nem toda entidade e fisica
5. **Propriedades iguais, valores diferentes** — a estrutura do objeto e a mesma para todas as instancias, o que muda sao os valores, porque o modelo e unico mas as representacoes variam
6. **Objeto pode existir so com propriedades** — metodos sao opcionais, nem todo objeto precisa de comportamentos, porque algumas entidades sao apenas dados

## How to write

### Objeto com propriedades

```javascript
// Propriedades representam caracteristicas da entidade
const carro = {
  modelo: "Civic",
  numeroDePortas: 4,
  anoDeFabricacao: 2024,
  cor: "prata"
}
```

### Objeto com propriedades e metodos

```javascript
// Metodos representam comportamentos — acoes que a entidade executa
const carro = {
  modelo: "Civic",
  numeroDePortas: 4,
  anoDeFabricacao: 2024,
  cor: "prata",
  ligar() {
    return "Carro ligado"
  },
  desligar() {
    return "Carro desligado"
  },
  acelerar() {
    return "Acelerando..."
  }
}
```

### Abstracao nao concreta (conceitual)

```javascript
// Entidades abstratas tambem viram objetos
const departamento = {
  nome: "Engenharia",
  responsavel: "Maria",
  quantidadeFuncionarios: 42
}
```

## Example

**Before (sem modelagem clara):**
```javascript
const d = { n: "Eng", r: "Maria", q: 42 }
const c = { m: "Civic", p: 4, a: 2024 }
```

**After (com esta skill aplicada):**
```javascript
const departamento = {
  nome: "Engenharia",
  responsavel: "Maria",
  quantidadeFuncionarios: 42
}

const carro = {
  modelo: "Civic",
  numeroDePortas: 4,
  anoDeFabricacao: 2024,
  cor: "prata",
  ligar() { return "Carro ligado" },
  acelerar() { return "Acelerando..." }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Entidade tem apenas dados | Crie objeto so com propriedades |
| Entidade executa acoes | Adicione metodos ao objeto |
| Mesma entidade com valores diferentes | Mesma estrutura, valores distintos |
| Entidade abstrata (departamento, pedido) | Modele como objeto normalmente |
| Propriedade e um numero com unidade implicita | Inclua a unidade no nome: `precoEmCentavos` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `const d = { n: "Eng" }` | `const departamento = { nome: "Engenharia" }` |
| Propriedades como `p1`, `p2`, `p3` | Propriedades descritivas: `modelo`, `cor`, `ano` |
| Metodo fora do objeto que manipula o objeto | Metodo dentro do objeto como comportamento |
| Array de valores soltos para representar entidade | Objeto com propriedades nomeadas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre abstracao, analogias concreto vs abstrato, e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes