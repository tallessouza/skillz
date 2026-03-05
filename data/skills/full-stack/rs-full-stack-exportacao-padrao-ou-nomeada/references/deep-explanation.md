# Deep Explanation: Exportação Padrão ou Nomeada

## Por que preferir named exports?

O instrutor (Rodrigo) deixa claro sua preferência pessoal: **sempre usar named exports**. O raciocínio é pragmático:

1. **Rastreabilidade** — quando você usa named export, o nome no import é idêntico ao nome na declaração. Um simples `grep "multiply"` encontra tanto a definição quanto todos os usos no projeto inteiro.

2. **Default export permite qualquer nome** — o instrutor demonstra isso de forma memorável renomeando `sum` para `batata` no import. Funciona perfeitamente! Mas isso significa que em um projeto grande, a mesma função pode ser importada com 10 nomes diferentes em 10 arquivos, tornando busca e refactoring um pesadelo.

3. **Clareza de intenção** — named exports obrigam o consumidor a saber exatamente o que está importando. Não há ambiguidade.

## O mecanismo por trás

### Named export
Quando você escreve `export function multiply()`, o módulo cria uma **binding nomeada**. Quem importa DEVE usar esse nome exato entre chaves: `{ multiply }`. Tentar `{ salada }` causa erro porque `salada` não existe como binding no módulo.

### Default export
Quando você escreve `export default function sum()`, o módulo cria uma binding especial chamada `default`. Quem importa sem chaves recebe essa binding. O nome usado no import é apenas um alias local — não precisa corresponder ao nome original.

## Combinando os dois

Um módulo pode ter:
- **Exatamente um** default export
- **Quantos quiser** named exports

Na importação combinada, a sintaxe é:
```javascript
import defaultExport, { named1, named2 } from './module.js'
```

O default SEMPRE vem antes da vírgula, os named SEMPRE dentro de chaves após a vírgula.

## Duas formas de declarar exports

### Inline (preferida pelo instrutor)
```javascript
export function sum(a, b) { return a + b }
export function multiply(a, b) { return a * b }
```

### No final do arquivo
```javascript
function sum(a, b) { return a + b }
function multiply(a, b) { return a * b }
export { sum, multiply }
```

Ambas são equivalentes. A inline é preferida porque mantém a informação de export junto com a declaração — você não precisa ir até o final do arquivo para saber o que é público.

## Edge cases

1. **Re-exportação** — `export { sum } from './calc.js'` funciona para barrel files
2. **Renomear no import** — `import { multiply as mult } from './calc.js'` é válido para named exports
3. **Import tudo** — `import * as calc from './calc.js'` agrupa todas as named exports em um objeto
4. **Default + import tudo** — `calc.default` acessa o default quando usando `import *`

## Quando default export é aceitável

Apesar da preferência por named, default exports são comuns e aceitos em:
- Componentes React (um componente por arquivo é convenção)
- Classes principais de um módulo
- Configurações (ex: `export default { port: 3000 }`)

O ponto do instrutor não é que default é "errado", mas que named é mais seguro como padrão geral.