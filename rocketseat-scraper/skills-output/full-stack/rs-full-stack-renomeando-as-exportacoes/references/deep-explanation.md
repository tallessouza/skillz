# Deep Explanation: Renomeando Exportações

## Por que renomear exports?

Quando voce cria uma funcao, o nome interno faz sentido dentro do contexto do arquivo. Mas quando outro modulo importa, o nome pode nao ser claro o suficiente. O `as` permite manter o nome interno simples e expor um nome mais descritivo.

## O mecanismo por tras

Ao usar `export { sum as sumTwoNumbers }`:
1. A funcao `sum` continua existindo internamente no arquivo com o nome `sum`
2. Para qualquer arquivo que importa, o nome `sum` **nao existe** — so `sumTwoNumbers`
3. O IntelliSense/autocomplete do editor mostra apenas o nome exportado

## Quando centralizar exports no final

O instrutor demonstra um padrao importante: remover `export` e `export default` das declaracoes inline e mover tudo para um unico `export { ... }` no final do arquivo. Isso e util porque:

- **Visibilidade**: um unico lugar mostra tudo que o modulo expoe
- **Renomeacao facil**: basta adicionar `as novoNome` na lista
- **Evita conflitos**: nao mistura `export default` com named exports acidentalmente

## Relacao com export default

Na aula anterior, `sum` era `export default`. Ao mover para export nomeado centralizado, o import muda:

```javascript
// ANTES (default):
import sum from './calc.js'

// DEPOIS (named, renomeado):
import { sumTwoNumbers } from './calc.js'
```

Se voce tentar importar como default um modulo que so tem named exports, o erro sera:
> "module does not provide a default export"

## Diferenca entre renomear no export vs no import

Voce pode renomear nos dois lados:

```javascript
// No export:
export { sum as sumTwoNumbers }
// Import usa o nome novo:
import { sumTwoNumbers } from './calc.js'

// No import:
export { sum }
import { sum as sumTwoNumbers } from './calc.js'
```

A preferencia do instrutor e renomear no **export**, porque assim todos os consumidores usam o mesmo nome consistente. Renomear no import e local — cada arquivo pode dar um nome diferente, o que pode causar confusao.

## Edge case: renomear e default ao mesmo tempo

```javascript
export { sum as default, multiply as multiplyTwoNumbers }
```

Isso exporta `sum` como o export default do modulo. E valido mas pouco comum e pode confundir.