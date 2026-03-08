---
name: rs-full-stack-conhecendo-o-ecma-script
description: "Applies ECMAScript version knowledge when discussing JavaScript features, compatibility, or modern syntax. Use when user asks about 'ES6', 'ES2023', 'ECMAScript', 'JavaScript versions', 'modern JavaScript', or 'browser compatibility'. Provides decision framework for identifying which ES version introduced a feature. Make sure to use this skill whenever referencing JavaScript specification versions or explaining why a feature exists. Not for teaching JavaScript syntax, writing code, or debugging."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [ecmascript, es6, es2015, javascript-versions, browser-compatibility, tc39]
---

# Conhecendo o ECMAScript

> Ao referenciar funcionalidades do JavaScript, identifique a versao do ECMAScript que as introduziu para garantir compatibilidade e contexto historico.

## Key concepts

JavaScript e a linguagem que se escreve e executa nos navegadores. ECMAScript e a especificacao que define como o JavaScript deve se comportar. Sao coisas distintas: JavaScript e a implementacao, ECMAScript e o padrao.

A linguagem foi criada em 1995 por Brendan Eich na Netscape (nomes anteriores: Mocha, LiveScript). Em 1996, a Netscape uniu o JavaScript a ECMA International (European Computer Manufacturers Association), criando o ECMAScript como padrao oficial.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Usuario menciona "ES6", "ES2015" | Mesma coisa — ES6 = ECMAScript 2015, a maior atualizacao da linguagem |
| Usuario pergunta "posso usar X?" | Identifique em qual ESx o recurso foi introduzido, verifique suporte do target |
| Codigo usa syntax moderna sem contexto | Referencie a versao ES que introduziu aquele recurso |
| Discussao sobre compatibilidade | Mapeie features para versoes ES e verifique suporte nos runtimes alvo |

## How to think about it

### Versionamento

As versoes do ECMAScript seguem duas convencoes de nomenclatura:

- **Numerica sequencial:** ES1, ES2, ... ES6, ES7, ... ES14
- **Por ano:** ES2015, ES2016, ... ES2023

A partir do ES6/ES2015, a convencao por ano se tornou predominante. ES6 = ES2015 e o marco divisor entre "JavaScript antigo" e "JavaScript moderno".

### Ciclo de atualizacao

Desde 2015, o ECMAScript recebe atualizacoes anuais. Cada versao traz novos recursos que passaram pelo processo TC39 (comite tecnico responsavel). O site oficial da ECMA (ecma-international.org) publica a especificacao completa a cada versao.

### Por que isso importa na pratica

A padronizacao garante que diferentes engines (V8, SpiderMonkey, JavaScriptCore) implementem os mesmos comportamentos. Quando alguem diz "isso e ES2023", significa que o recurso faz parte da especificacao daquele ano e engines modernas devem suporta-lo.

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| JavaScript e ECMAScript sao a mesma coisa | JavaScript e a linguagem/implementacao, ECMAScript e a especificacao/padrao |
| ES6 e ES2015 sao versoes diferentes | Sao a mesma versao com duas nomenclaturas |
| Toda feature nova funciona em todo browser | Depende de qual versao ES o engine suporta — sempre verifique |
| ECMAScript so se aplica a browsers | Node.js, Deno, Bun tambem seguem a especificacao ECMAScript |

## When to apply

- Ao explicar por que uma syntax existe ou quando foi introduzida
- Ao recomendar features modernas e precisar justificar compatibilidade
- Ao configurar targets de transpilacao (tsconfig, Babel, esbuild)
- Ao comparar "JavaScript antigo" vs "JavaScript moderno"

## Code example

```javascript
// Features introduzidas no ES6/ES2015
const name = 'world'           // const (ES6)
const greet = () => `Hello ${name}` // arrow function + template literal (ES6)
const [a, b] = [1, 2]         // destructuring (ES6)
const obj = { name, greet }   // shorthand properties (ES6)
```

## Limitations

- Esta skill nao ensina syntax especifica — apenas contextualiza versoes
- Nao cobre APIs do browser (DOM, Fetch) que nao fazem parte do ECMAScript
- Nao substitui verificacao real de compatibilidade (caniuse, MDN)

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Feature ES2023 nao funciona no browser | Browser nao suporta a versao ES | Verificar compatibilidade em caniuse.com ou MDN |
| Confusao entre ES6 e ES2015 | Nomenclatura dupla | Sao a mesma versao — ES6 e o numero sequencial, ES2015 e o ano |
| Transpilacao nao converte feature moderna | Target do Babel/TS muito recente | Ajustar target para versao ES que o runtime alvo suporta |
| Feature funciona no Chrome mas nao no Safari | Diferentes engines implementam ES em ritmos diferentes | Adicionar polyfill ou ajustar targets de transpilacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Historia completa, analogias e contexto do ecossistema
- [code-examples.md](references/code-examples.md) — Mapeamento de features por versao ES com exemplos