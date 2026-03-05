# Deep Explanation: Filtrando Valores com WHERE

## O papel do WHERE

A clausula WHERE e o mecanismo fundamental de filtragem no SQL. Sem ela, um SELECT retorna todos os registros da tabela. Com ela, voce controla exatamente quais linhas aparecem no resultado.

## Os 6 operadores de comparacao

### `=` (igual)
O mais direto. Retorna apenas registros onde o valor da coluna e exatamente o especificado. Usado quando voce sabe o valor exato que procura.

**Insight do instrutor:** "Eu to procurando aqui por produtos que o preco seja igual a 800. O unico produto que tem esse preco e o headset, entao se a gente executa, veja que so ele aparece."

### `<>` (diferente)
Formado pela juncao dos sinais `<` e `>`. Retorna todos os registros EXCETO os que tem o valor especificado. E o inverso logico do `=`.

**Insight do instrutor:** "Quando a gente utiliza aqui o menor e o maior junto no SQL, ele forma o diferente, o operador de diferente. Nesse caso, ele vai mostrar os outros produtos, e o headset agora e o produto que nao vai aparecer."

### `>` (maior que — estrito)
Retorna apenas registros onde o valor e SUPERIOR ao especificado. O valor exato do limite NAO entra no resultado. Este e o ponto onde mais se comete erros.

**Exemplo concreto da aula:** Com `price > 550`, o produto de R$550,00 (teclado) ficou de fora. So apareceram produtos acima de 550.

### `<` (menor que — estrito)
Retorna apenas registros onde o valor e INFERIOR ao especificado. Mesma logica do `>` mas na direcao oposta.

**Exemplo concreto da aula:** Com `price < 550`, apenas o mouse (R$45,90) apareceu. Com `price < 600`, apareceram mouse (R$45,90), outro produto (R$500,50) e teclado (R$550,00).

### `>=` (maior ou igual)
Combina `>` com `=`. O valor limite ENTRA no resultado. Use quando o valor especificado deve ser o ponto de partida inclusivo.

**Insight do instrutor:** "E se eu quisesse usar esse valor como um ponto de partida e nao descartar ele tambem? A gente pode utilizar aqui o operador de maior ou igual."

**Exemplo:** `price >= 550` — o produto de R$550,00 volta a aparecer porque "nao e maior, mas e igual a 550".

### `<=` (menor ou igual)
Combina `<` com `=`. O valor limite ENTRA no resultado.

**Exemplo da aula:** `price < 800` exclui o headset (R$800). `price <= 800` inclui o headset porque "800 nao e menor do que 800, mas e igual a 800".

## O erro mais comum

Confundir `>` com `>=` (ou `<` com `<=`). O instrutor demonstrou isso varias vezes na aula: ao usar `> 550`, o produto de exatamente R$550 desaparece. Ao mudar para `>= 550`, ele reaparece.

**Regra mental:** Se voce quer INCLUIR o valor do limite, use o operador com `=`. Se quer EXCLUIR, use o operador estrito.

## Nota sobre decimais

O instrutor observou que o banco omite zeros decimais na exibicao: R$500,50 aparece como `500.5` e R$550,00 aparece como `550`. Isso e comportamento de display, nao afeta a filtragem. O valor armazenado continua sendo o correto.