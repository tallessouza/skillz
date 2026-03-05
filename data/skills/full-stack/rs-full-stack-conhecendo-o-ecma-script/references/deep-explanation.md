# Deep Explanation: Conhecendo o ECMAScript

## Historia completa

### 1995 — Nascimento
Brendan Eich criou a linguagem enquanto trabalhava na Netscape. A linguagem passou por tres nomes:
1. **Mocha** — nome original interno
2. **LiveScript** — primeiro nome publico
3. **JavaScript** — nome final, escolhido por razoes de marketing (Java era popular na epoca)

### 1996 — Padronizacao
A Netscape decidiu submeter o JavaScript a ECMA International (European Computer Manufacturers Association). A ECMA e uma associacao que realiza especificacao e padronizacao de sistemas de informacao. O objetivo: criar um padrao que qualquer fabricante de browser pudesse implementar de forma consistente.

Da uniao ECMA + JavaScript nasceu o nome **ECMAScript**.

### A analogia do instrutor
O instrutor Skillz usa uma distincao clara:
- **JavaScript** = a linguagem que voce escreve e executa
- **ECMAScript** = a especificacao que define como a linguagem deve se comportar

Pense assim: ECMAScript e a "receita oficial", JavaScript e o "prato servido" no browser.

### Guardioes da linguagem
O instrutor destaca que por tras do JavaScript existem "guardioes" — o comite TC39 e a ECMA International — que cuidam nao apenas da padronizacao, mas da **longevidade** da tecnologia. Isso explica por que JavaScript continua moderna e popular: tem governanca ativa garantindo evolucao continua.

## Ciclo de vida de uma feature

1. **Proposta** — alguem do TC39 propoe uma nova feature
2. **Stages 0-4** — a proposta passa por estagios de maturidade
3. **Especificacao** — quando chega no Stage 4, entra na proxima versao anual do ECMAScript
4. **Implementacao** — engines (V8, SpiderMonkey, etc) implementam
5. **Disponibilidade** — desenvolvedores podem usar

## Versoes importantes

| Versao | Ano | Destaque |
|--------|-----|----------|
| ES1 | 1997 | Primeira especificacao |
| ES3 | 1999 | RegExp, try/catch |
| ES5 | 2009 | strict mode, JSON, Array methods |
| ES6/ES2015 | 2015 | let/const, arrow functions, classes, modules, promises, destructuring — a maior atualizacao |
| ES2016 (ES7) | 2016 | Array.includes, exponentiation operator |
| ES2017 (ES8) | 2017 | async/await, Object.entries/values |
| ES2020 (ES11) | 2020 | Optional chaining, nullish coalescing |
| ES2023 (ES14) | 2023 | Array findLast, hashbang grammar |

## Por que o instrutor considera isso fundamental

O instrutor enfatiza que antes de estudar "funcionalidades do JavaScript moderno", e preciso entender de onde vem essas funcionalidades. Sem saber o que e ECMAScript, o desenvolvedor:
- Nao entende por que certas features "nao funcionam" em ambientes antigos
- Nao sabe como acompanhar novidades da linguagem
- Nao compreende a diferenca entre "JavaScript do browser" e "a especificacao"

## Recurso oficial

O instrutor mostra o site oficial: **ecma-international.org**, onde a especificacao completa de cada versao pode ser consultada e baixada em HTML ou PDF.