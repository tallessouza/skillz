# Deep Explanation: Renomeando Importações

## Por que renomear importacoes?

O JavaScript nao permite dois identificadores com o mesmo nome no mesmo escopo. Quando voce importa uma funcao de um modulo e ja tem uma funcao local com o mesmo nome, o engine lanca um `SyntaxError: Identifier 'X' has already been declared`.

O mecanismo nativo para resolver isso e o `as` keyword dentro da clausula de import:

```javascript
import { nomeOriginal as nomeNovo } from './modulo.js'
```

## Diferenca entre renomear export e renomear import

- **Renomear na exportacao** (`export { sum as s }`) — muda o nome publico do modulo. Todos os consumidores veem o novo nome.
- **Renomear na importacao** (`import { sum as s }`) — muda apenas no arquivo que importa. O modulo continua exportando `sum`.

A renomeacao na importacao e mais flexivel porque cada consumidor pode escolher seu proprio alias sem afetar outros consumidores.

## Quando usar abreviacoes vs nomes descritivos

O instrutor mostra exemplos com `s` e `m` como aliases. Isso funciona em scripts curtos e demonstracoes, mas em codebases reais:

- **Prefira nomes descritivos**: `externalMultiply`, `mathSum`, `libMultiply`
- **Abreviacoes aceitaveis**: em callbacks inline, scripts de uma pagina, ou quando o contexto e obvio

## Edge cases

### Mesmo nome de dois modulos diferentes

```javascript
import { format as dateFormat } from './date-utils.js'
import { format as stringFormat } from './string-utils.js'
```

### Default import + named import com conflito

```javascript
import multiply, { sum as add } from './math.js'
// multiply e o default export, sum e renomeado para add
```

### Re-exportacao com renomeacao

```javascript
export { multiply as mult } from './math.js'
// Re-exporta multiply como mult sem importar no escopo local
```

## Relacao com namespace imports

Uma alternativa ao `as` em imports individuais e o namespace import:

```javascript
import * as MathUtils from './math.js'
MathUtils.sum(1, 2)
MathUtils.multiply(3, 4)
```

Isso evita qualquer conflito de nomes, mas adiciona um prefixo em todas as chamadas. Use quando importar muitas funcoes de um mesmo modulo.