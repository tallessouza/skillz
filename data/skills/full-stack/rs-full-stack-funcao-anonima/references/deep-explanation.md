# Deep Explanation: Função Anônima

## Por que funções anônimas existem?

No JavaScript, funções são **first-class citizens** — podem ser tratadas como qualquer outro valor. Isso significa que você pode armazenar uma função dentro de uma variável, exatamente como armazena um número ou string.

A distinção fundamental que o Rodrigo enfatiza: **você não guarda o retorno da função, você guarda a própria função**. Isso é contraintuitivo para iniciantes que esperam que `const x = function() { return 5 }` coloque `5` dentro de `x`. Na verdade, `x` contém a função inteira, e só quando você faz `x()` é que o `5` é produzido.

## A analogia da "função sem nome"

O instrutor explica que uma função nomeada (`function show() {}`) existe como declaração independente — você cria ela separada e chama pelo nome depois. Uma função anônima não faz sentido sozinha, porque sem nome, como você chamaria ela? Por isso ela é **imediatamente** armazenada em algo (variável, argumento de callback, etc.).

## Quando usar função anônima vs nomeada

- **Função nomeada (declaration):** quando precisa de hoisting, quando é uma função principal do módulo
- **Função anônima em variável (expression):** quando quer tratar a função como dado, quando passa como callback
- A função anônima **não sofre hoisting** — só pode ser usada após a linha onde foi definida

## O "Fzinho" — inspecionando funções

O Rodrigo mostra que ao fazer `console.log(showMessage)` sem parênteses, o console exibe algo como `[Function: showMessage]`. Esse é o indicador de que a variável contém uma função, não um valor primitivo. Esse é um truque útil de debugging para confirmar que você armazenou a função corretamente.

## Parênteses como operador de execução

A diferença entre `showMessage` e `showMessage()`:
- `showMessage` — referência à função (o objeto função em si)
- `showMessage()` — invocação/execução da função (produz o retorno)

Isso é fundamental e aparece em callbacks: `array.map(minhaFuncao)` passa a referência, não executa. Se fizesse `array.map(minhaFuncao())`, passaria o retorno, não a função.

## `const` vs `let` para funções

O instrutor menciona que poderia usar `let`, mas escolhe `const` porque não vai modificar. Isso é uma boa prática: se a variável não será reatribuída, use `const`. Reatribuir uma função é raro e geralmente indica um problema de design.

## Múltiplos parâmetros

O instrutor reforça o padrão de vírgula para separar parâmetros: `function(message, name)`. Isso é consistente com toda a linguagem — argumentos de função, elementos de array, propriedades de objeto, tudo usa vírgula como separador.