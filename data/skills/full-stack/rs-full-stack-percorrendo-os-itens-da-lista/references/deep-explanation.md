# Deep Explanation: Percorrendo Itens da Lista

## Por que querySelector escopado?

O insight central desta aula e que `querySelector` pode ser chamado em **qualquer elemento DOM**, nao apenas em `document`. Quando voce chama `itens[i].querySelector(".expense-amount")`, a busca acontece **apenas dentro daquele `<li>` especifico**.

Isso e fundamental porque:
- Uma lista tem multiplos itens com a mesma classe `.expense-amount`
- `document.querySelector` sempre retorna o **primeiro** elemento encontrado no documento inteiro
- Se voce usar `document.querySelector` dentro do loop, vai somar o mesmo valor N vezes

### A analogia do escopo

Pense assim: `document.querySelector` e como perguntar "quem tem esse nome?" em uma cidade inteira — voce sempre recebe a primeira pessoa. `itens[i].querySelector` e perguntar dentro de uma casa especifica — voce recebe exatamente quem mora ali.

## O padrao acumulador

O instrutor enfatiza a criacao de `let total = 0` **antes** do loop. Isso segue o padrao classico de acumulacao:

1. Inicializa variavel com valor neutro (0 para soma, "" para string, [] para array)
2. Percorre a colecao
3. Em cada iteracao, agrega ao acumulador
4. Apos o loop, o acumulador contem o resultado final

### Por que nao usar `const`?

Porque o total muda a cada iteracao. `const` impediria a reatribuicao com `+=`.

## Variavel de controle e `itens.length`

O instrutor usa `itens.length` como limite do loop em vez de um numero fixo. Isso e critico porque:
- A lista e dinamica — o usuario adiciona itens
- Hardcodar um numero (ex: `i < 3`) quebraria quando a lista muda
- `itens.length` sempre reflete o estado atual da colecao

## O que `querySelector` retorna

O instrutor mostra via `console.log` que `itemAmount` retorna o **elemento DOM** (a tag `<span>`), nao o texto. Para obter o valor numerico, e preciso:
1. Acessar `.innerText` ou `.textContent` para obter a string
2. Converter com `parseFloat()` ou `Number()` para obter o numero

Esse e um erro muito comum de iniciantes: tentar somar elementos DOM diretamente resulta em `[object HTMLElement][object HTMLElement]` (concatenacao de strings).

## Console.log como ferramenta de debug

O instrutor demonstra um comportamento importante: ao adicionar um novo item a lista, o loop roda novamente sobre **todos** os itens. Isso explica por que no console aparecem mais logs do que o esperado — cada adicao recalcula o total percorrendo a lista inteira.

Esse comportamento e esperado e correto para recalculo de totais, mas e importante entender para nao confundir com um bug.