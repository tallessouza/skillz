# Deep Explanation: Spread Operator

## O que o instrutor explica

O spread operator (`...`) permite "espalhar" o conteúdo de um objeto iterável. A analogia central é: imagine um array como uma caixa com itens dentro — o spread abre a caixa e coloca cada item individualmente onde você precisa.

### Por que "espalhar"?

Quando você faz `console.log(numbers)`, o resultado é o array como um todo: `[1, 2, 3]`. Mas com `console.log(...numbers)`, cada elemento é tratado como argumento separado: `1 2 3`. O array foi "espalhado".

### Iteráveis

O spread funciona com qualquer objeto iterável — arrays, strings, Maps, Sets. O requisito é implementar o protocolo de iteração (`Symbol.iterator`). Arrays e strings são os casos mais comuns.

### Spread com objetos literais

Desde ES2018, spread funciona dentro de object literals `{ ...obj }`. Isso copia todas as propriedades enumeráveis próprias do objeto fonte para o novo objeto.

### Cópia rasa (shallow copy)

O spread cria uma cópia rasa. Para arrays de primitivos, funciona perfeitamente. Para arrays de objetos (como o exemplo `users` da aula), os objetos internos ainda são referências ao original. Modificar `clone[0].name` também modifica `original[0].name`.

### Ordem importa no merge

```typescript
const a = { x: 1, y: 2 }
const b = { y: 3, z: 4 }
const merged = { ...a, ...b } // { x: 1, y: 3, z: 4 }
```

Propriedades do último objeto sobrescrevem as anteriores. Isso é intencional e útil para padrões como defaults + overrides.

### Spread vs Rest

Mesmo operador (`...`), contextos opostos:
- **Spread:** expande elementos — `fn(...args)`, `[...arr]`
- **Rest:** coleta elementos — `function fn(...args)`, `const [first, ...rest] = arr`

A diferença é posicional: spread aparece onde valores são esperados, rest aparece onde nomes de variáveis são esperados.

### Performance

Spread cria um novo array/objeto a cada uso. Em loops de alta frequência com arrays grandes, isso pode impactar performance. Para a maioria dos casos de aplicações web, o impacto é negligível.