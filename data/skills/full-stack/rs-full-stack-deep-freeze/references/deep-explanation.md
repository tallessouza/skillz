# Deep Explanation: Deep Freeze

## Por que Object.freeze é insuficiente para objetos aninhados

O `Object.freeze()` do JavaScript congela apenas o **primeiro nível** de propriedades de um objeto. Propriedades primitivas (strings, numbers, booleans) ficam protegidas, mas propriedades que são referências a outros objetos **não são seguidas** pelo freeze.

Isso acontece porque o freeze opera sobre os **descritores de propriedade** do objeto alvo. Ele marca cada propriedade como `writable: false` e `configurable: false`. Porém, o **valor** de uma propriedade que aponta para outro objeto é a referência em si — e essa referência não muda. O objeto referenciado continua mutável.

### Analogia do instrutor

Pense no freeze como trancar a porta da frente de uma casa. As coisas no primeiro cômodo estão protegidas, mas se há portas internas para outros cômodos (objetos aninhados), essas portas internas não foram trancadas. Qualquer um que chegue a um cômodo interno pode mover coisas à vontade.

O deepFreeze é como trancar **todas** as portas da casa, recursivamente.

## Como a recursão resolve

A função `deepFreeze` aplica uma estratégia simples:

1. **Lista todas as propriedades** do objeto atual com `Reflect.ownKeys()`
2. **Para cada propriedade**, obtém o valor
3. **Verifica se o valor é um objeto ou função** — se for, chama `deepFreeze` nesse valor (recursão)
4. **Congela o objeto atual** com `Object.freeze()`

A recursão garante que **todos os níveis** do objeto sejam visitados e congelados, não importa quão profundamente aninhado.

### Por que Reflect.ownKeys e não Object.keys?

`Object.keys()` retorna apenas propriedades enumeráveis com chaves string. `Reflect.ownKeys()` retorna **todas** as propriedades próprias, incluindo:
- Propriedades não-enumeráveis
- Propriedades com chave Symbol

Isso garante que nenhuma propriedade escape do congelamento.

### Por que verificar typeof === "function"?

Em JavaScript, funções são objetos. Uma propriedade que armazena uma função poderia ter propriedades próprias que seriam mutáveis. Ao incluir `typeof === "function"` na verificação, garantimos que até funções armazenadas como propriedades sejam congeladas.

## Edge cases

### Referências circulares
A implementação básica mostrada na aula **não lida com referências circulares**. Se `obj.a.b === obj`, a recursão entraria em loop infinito. Para produção, considere manter um `WeakSet` de objetos já visitados:

```javascript
function deepFreeze(object, visited = new WeakSet()) {
  if (visited.has(object)) return object
  visited.add(object)
  // ... resto da lógica
}
```

### Arrays
Arrays são objetos em JavaScript, então `typeof [] === "object"` é true. O deepFreeze funciona naturalmente com arrays — cada índice é uma propriedade que será percorrida.

### null
`typeof null === "object"` é true em JavaScript (bug histórico da linguagem). Por isso a verificação `value &&` antes do typeof é essencial — ela evita chamar deepFreeze em `null`.

### Strict mode
Em strict mode, tentar modificar uma propriedade de um objeto congelado lança um `TypeError`. Sem strict mode, a mutação falha silenciosamente. Para desenvolvimento, sempre use strict mode para capturar essas tentativas.

## Quando NÃO usar deepFreeze

- **Objetos muito grandes ou profundos** — o custo de percorrer toda a árvore pode impactar performance
- **Objetos que precisam ser mutados depois** — freeze é irreversível, não existe "unfreeze"
- **State management com bibliotecas** — Redux, Immer, Zustand já lidam com imutabilidade de formas mais eficientes
- **Hot paths de performance** — objetos congelados podem ter otimizações diferentes nos engines JS