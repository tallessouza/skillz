# Deep Explanation: Prototype Chain em JavaScript

## O modelo mental do instrutor

O instrutor apresenta prototype como uma **cadeia de heranca** que todo valor em JavaScript possui automaticamente. A analogia implicita e de uma **arvore genealogica**: todo objeto tem um "pai" (seu prototype), que por sua vez tem outro "pai", ate chegar na "raiz" que e null.

### Por que isso importa?

Quando voce acessa `address.hasOwnProperty("city")`, o JavaScript:
1. Procura `hasOwnProperty` em `address` → nao encontra
2. Sobe para `address.__proto__` (que e `Object.prototype`) → encontra!
3. Executa o metodo

Esse mecanismo e chamado **prototype chain lookup**. E por isso que todo objeto tem metodos como `toString()`, `hasOwnProperty()`, etc — eles vem de `Object.prototype`.

### A cadeia por tipo

```
Objeto literal:  { } → Object.prototype → null
Array:           [] → Array.prototype → Object.prototype → null
String:          "" → String.prototype → Object.prototype → null
Number:          42 → Number.prototype → Object.prototype → null
Function:        fn → Function.prototype → Object.prototype → null
```

Observe o padrao: **tudo termina em Object.prototype → null**. Object.prototype e o ancestral comum de todos os tipos.

### Por que o console se comporta diferente?

O instrutor mostra que:
- Objetos e arrays mostram `[[Prototype]]` diretamente no `console.dir()`
- Strings **nao** mostram — voce precisa acessar `.__proto__` explicitamente

Isso acontece porque o console do navegador trata primitivos de forma especial. Quando voce faz `console.dir("texto")`, o navegador mostra o valor primitivo, nao o wrapper object. Mas ao acessar `.__proto__`, o JS faz **autoboxing** — cria temporariamente um `String` object para acessar a propriedade.

### __proto__ vs [[Prototype]] vs Object.getPrototypeOf()

- `[[Prototype]]` — o slot interno real (voce ve no console como `[[Prototype]]`)
- `__proto__` — accessor property herdado de `Object.prototype`, forma legada de acessar `[[Prototype]]`
- `Object.getPrototypeOf(obj)` — forma moderna e recomendada para producao

O instrutor usa `__proto__` porque e o mais visual e didatico no console.

### O significado de null no fim

Null no fim da cadeia e um design deliberado. Significa "nao ha mais nenhum prototype para consultar". Se o JS nao encontrar a propriedade em nenhum nivel da cadeia, retorna `undefined`.

```javascript
const obj = {}
console.log(obj.propriedadeInexistente) // undefined
// JS procurou em obj → Object.prototype → null (fim) → retorna undefined
```

### Insight do instrutor: "isso vai desbloquear muita coisa"

O instrutor enfatiza que entender prototype e pre-requisito para:
- Heranca com classes (que sao syntax sugar sobre prototypes)
- Entender por que metodos de array/string existem
- Debugging de propriedades inesperadas
- Polyfills e extensao de tipos nativos
- Entender o `this` em contextos de heranca

## Edge cases

### Object.create(null)
Cria um objeto **sem prototype**:
```javascript
const bare = Object.create(null)
console.log(bare.__proto__) // undefined (nao null!)
console.log(bare.hasOwnProperty) // undefined — nao herda nada
```

### Shadowing
Se voce define uma propriedade que existe no prototype, ela "sombreia" a versao herdada:
```javascript
const obj = { toString: () => "custom" }
obj.toString() // "custom" (nao chama Object.prototype.toString)
```