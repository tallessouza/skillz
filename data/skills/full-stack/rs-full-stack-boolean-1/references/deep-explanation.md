# Deep Explanation: Boolean

## Origem do nome

O tipo boolean é uma homenagem ao matemático e filósofo britânico **George Boole**, criador da **álgebra booleana** — o sistema matemático que fundamenta toda a lógica computacional. A álgebra booleana opera exclusivamente com dois valores: verdadeiro e falso, que mapeiam diretamente para `true` e `false` em JavaScript.

## O que é um boolean

Boolean é o tipo mais simples do JavaScript. Armazena **exclusivamente** dois valores possíveis:
- `true` (verdadeiro)
- `false` (falso)

Nunca ambos ao mesmo tempo. É um tipo primitivo, não um objeto.

## Por que a convenção `is` + gerúndio

O instrutor destaca o padrão `isLoading` como exemplo canônico. A razão:

1. **`is` transforma o nome numa pergunta** — ao ler `isLoading`, o cérebro processa como "está carregando?" e a resposta é naturalmente sim (`true`) ou não (`false`)
2. **Gerúndio (`-ing`) indica estado temporário** — `isLoading` implica que vai parar de carregar em algum momento, diferente de `loaded` que é definitivo
3. **Uso prático** — é muito comum usar essa estratégia para controlar estados da UI: "se está carregando, mostra spinner; se não, mostra conteúdo"

## typeof com boolean

O operador `typeof` aplicado a um boolean retorna a string `"boolean"`. Isso é útil para:
- Validação de inputs em funções genéricas
- Debug (verificar se o valor é realmente boolean e não uma string `"true"`)
- Type guards em TypeScript

## Edge cases

### Truthy vs Boolean
Em JavaScript, muitos valores se comportam como boolean em contextos condicionais (truthy/falsy), mas **não são** do tipo boolean:
- `0`, `""`, `null`, `undefined`, `NaN` → falsy
- Qualquer outro valor → truthy

Isso é diferente de um boolean real (`true`/`false`). O `typeof` distingue:
```javascript
typeof false      // "boolean"
typeof 0          // "number"  (mas é falsy)
typeof ""         // "string"  (mas é falsy)
```

### Boolean() como função de conversão
```javascript
Boolean(1)        // true
Boolean(0)        // false
Boolean("texto")  // true
Boolean("")       // false
```

### Nunca use `new Boolean()`
```javascript
const bad = new Boolean(false)
typeof bad        // "object" (!)
if (bad) { }      // entra! porque objeto é truthy
```
Isso é um anti-pattern histórico do JavaScript. Sempre use o primitivo.