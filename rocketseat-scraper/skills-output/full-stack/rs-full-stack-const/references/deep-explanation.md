# Deep Explanation: Const

## Raciocínio do instrutor

O instrutor apresenta `const` como uma evolução natural da ideia de variável: "tem a mesma ideia e princípio de uma variável — um valor armazenado temporariamente na memória — só que é um valor fixo."

A analogia central é: **variável = gaveta que pode trocar o conteúdo; constante = gaveta trancada.** Você pode olhar o que tem dentro, mas não pode substituir pelo conteúdo de outra coisa.

## Por que const por padrão?

Quando o leitor encontra `const`, ele sabe imediatamente: "esse valor não vai mudar referência." Isso reduz a carga cognitiva durante code review e debugging. Se tudo é `let`, o leitor precisa rastrear o arquivo inteiro para descobrir se houve reatribuição.

## A exceção de objetos e arrays

O instrutor menciona explicitamente: "Vai ter algumas exceções quando a gente for trabalhar com objetos, arrays." Isso é crucial porque iniciantes confundem `const` com imutabilidade total.

`const` protege a **referência** (o ponteiro para o endereço na memória), não o **conteúdo**:

```javascript
const user = { name: "Ana" }
user.name = "Bob"  // OK — mesma referência, conteúdo diferente
user = {}          // TypeError — tentativa de mudar a referência
```

Para imutabilidade real de objetos, seria necessário `Object.freeze()` — mas isso está fora do escopo desta aula.

## O erro que o JavaScript gera

Quando você tenta reatribuir uma constante, o engine gera:
```
TypeError: Assignment to constant variable.
```

O instrutor demonstrou isso ao vivo: declarou `const number = 42`, tentou `number = 55`, e o erro apareceu imediatamente. Isso é uma proteção em tempo de execução que ajuda a capturar bugs cedo.

## Quando usar let

`let` existe para os casos genuínos de reatribuição:
- Contadores em loops clássicos (`for (let i = 0; ...)`)
- Acumuladores (`let total = 0; total += item.price`)
- Flags que mudam de estado (`let isLoading = true; ... isLoading = false`)
- Variáveis condicionais (`let result; if (x) result = a; else result = b`)

No último caso, muitas vezes um ternário com `const` é melhor:
```javascript
const result = x ? a : b
```

## Por que nunca var

`var` tem dois problemas históricos:
1. **Escopo de função** — vaza para fora de blocos `if`/`for`
2. **Hoisting** — a declaração sobe para o topo da função, mas o valor fica `undefined`

`const` e `let` resolvem ambos com escopo de bloco e temporal dead zone.