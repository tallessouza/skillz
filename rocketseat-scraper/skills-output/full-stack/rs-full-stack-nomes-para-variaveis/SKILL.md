---
name: rs-full-stack-nomes-para-variaveis
description: "Enforces JavaScript variable naming conventions when writing JS/TS code. Use when user asks to 'create a variable', 'write a function', 'name this', or any code generation in JavaScript/TypeScript. Applies camelCase by default, prohibits accents, numbers as first char, Portuguese names, and meaningless names like x/temp/data. Make sure to use this skill whenever generating JS/TS variables or functions. Not for Python, Ruby, or non-JS languages where snake_case is standard."
---

# Nomes para Variáveis JavaScript

> Nomes de variáveis descrevem o conteúdo em inglês, usando camelCase, sem acentos e sem abreviações.

## Rules

1. **Escreva em inglês** — `productName` não `nomeProduto`, porque o padrão da indústria é inglês e elimina problemas com acentos automaticamente
2. **Use camelCase para variáveis e funções** — `firstName` não `first_name`, porque é a convenção dominante em JavaScript (snake_case é para objetos/configs quando explícito)
3. **Primeira palavra toda minúscula, próximas iniciam com maiúscula** — `lastName`, `productPrice`, porque a "corcova do camelo" marca visualmente a separação entre palavras
4. **Nunca comece com número** — `user1` é válido, `1user` causa erro de sintaxe, porque JS interpreta número inicial como literal numérico
5. **Nomes descritivos sempre** — `productName` não `x`, porque ao ler o código você entende imediatamente o que a variável armazena
6. **Sem acentos nem caracteres especiais no meio** — `action` não `ação`, porque acentos causam confusão e problemas de encoding

## How to write

### camelCase (padrão JS)

```javascript
// Primeira palavra minúscula, próximas iniciam com maiúscula
let firstName = "Rodrigo"
let lastName = "Gonçalves"
let productName = "Teclado"
```

### snake_case (alternativa conhecida)

```javascript
// Tudo minúsculo, separado por underline — comum em configs e objetos
let first_name = "Rodrigo"
let product_name = "Teclado"
```

### Caracteres especiais válidos (mas evite)

```javascript
// Pode iniciar com _ ou $ (usado por convenção em frameworks)
let _email = "test@test.com"    // prefixo _ = privado por convenção
let $element = document.body     // prefixo $ = DOM/jQuery por convenção
```

## Example

**Before (erros comuns de iniciante):**
```javascript
let ação = "cadastro"           // acento — problemático
let nomeProduto = "Teclado"     // português — fora do padrão
let x = "Rodrigo"               // sem significado
let 1user = "Ana"               // número no início — erro de sintaxe
let productname = "Mouse"       // sem separação visual
```

**After (com esta skill aplicada):**
```javascript
let action = "register"
let productName = "Teclado"
let firstName = "Rodrigo"
// 1user — impossível, use user1 ou firstUser
let productName = "Mouse"
```

## Heuristics

| Situação | Faça |
|----------|------|
| Nome composto (duas+ palavras) | camelCase: `productName`, `firstName` |
| Não sabe a tradução | Google Tradutor → aprende vocabulário |
| Variável temporária em loop curto | `i`, `j`, `k` são aceitáveis |
| Constante de configuração | UPPER_SNAKE: `MAX_RETRY_COUNT` |
| Propriedade de objeto/JSON | snake_case é aceitável se API exige |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `let ação = ...` | `let action = ...` |
| `let nomeProduto = ...` | `let productName = ...` |
| `let x = "Rodrigo"` | `let firstName = "Rodrigo"` |
| `let 1user = ...` | `let firstUser = ...` |
| `let productname = ...` | `let productName = ...` |
| `let product name = ...` | `let productName = ...` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre case-sensitivity, padrões e recomendações
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações