# Deep Explanation: Angular Pipes

## Filosofia do instrutor

O ponto central da aula e que **voce nao precisa decorar pipes**. O instrutor reforça isso multiplas vezes: o importante e saber que pipes existem para resolver problemas comuns. Quando precisar, consulte a documentacao ou revise o material.

A analogia implicita: pipes sao como funcoes utilitarias de uma biblioteca padrao — voce nao reescreve `Math.round()`, voce usa. Da mesma forma, nao recrie `toUpperCase()` no template quando `UpperCasePipe` ja existe.

## Pipes puros vs impuros

### Pipes puros (default)
- So reexecutam quando a **referencia** do input muda
- Angular usa memoizacao internamente
- Performance otimizada — nao reexecuta a cada cycle de change detection

### Pipes impuros
- Reexecutam em **todo** change detection cycle
- Necessarios quando o pipe depende de estado externo ou quando o input e mutado sem trocar referencia (ex: push em array)
- Devem ser usados com cautela por impacto em performance

### Pipe vs metodo no componente
- **Metodo no componente:** executado a cada change detection cycle (como pipe impuro)
- **Pipe puro:** executado so quando input muda (otimizado)
- **Conclusao:** para transformacoes no template, pipe puro e sempre preferivel a metodo

## Sistema de locale

Tres pipes dependem de locale configurado via `LOCALE_ID` injection token:
- `CurrencyPipe` — simbolo da moeda, separador decimal/milhar
- `PercentPipe` — separador decimal, posicao do %
- `DatePipe` — formato de data, nomes de meses/dias

Quando voce configura `LOCALE_ID` para `pt-BR`, todos esses pipes automaticamente formatam para o padrao brasileiro.

## DatePipe e UTC

O instrutor detalhou bastante a questao de datas:
- Datas do backend geralmente vem em **UTC**
- O `DatePipe` precisa saber o timezone para exibir corretamente
- Voce pode configurar timezone default ou passar como parametro
- Entender UTC e offset e fundamental para sistemas com usuarios em diferentes fusos

## Pipes customizados — quando criar

A regra e simples: se a mesma logica de transformacao aparece em **2 ou mais componentes**, extraia para um pipe customizado. Isso:
- Elimina duplicacao de codigo
- Centraliza a logica em um unico lugar
- Facilita manutencao (corrigir em 1 lugar corrige em todos)
- Torna o template mais legivel

## Lista completa de pipes cobertos no modulo

O Miro do instrutor mostrou:
- `SlicePipe` — cortar arrays e strings
- `LowerCasePipe` — texto minusculo
- `UpperCasePipe` — texto maiusculo  
- `TitleCasePipe` — primeira letra maiuscula de cada palavra
- `JsonPipe` — debug de objetos no template
- `PercentPipe` — formatacao de porcentagem com locale
- `CurrencyPipe` — formatacao de moeda com locale
- `DatePipe` — formatacao de data com locale e timezone
- `AsyncPipe` — resolver Observables/Promises diretamente no template