# Deep Explanation: Identificando a Moeda

## Por que constantes UPPER_CASE?

O instrutor Rodrigo explica que constantes em caixa alta sao uma **convencao**, nao uma regra da linguagem. O codigo funciona igual com `const usd = 4.87`. Porem, a convencao existe porque:

1. **Legibilidade** — ao ver `USD` no meio do codigo, qualquer dev sabe que e uma referencia definida em outro lugar
2. **Manutencao** — se a cotacao muda (e muda com frequencia), voce altera em um unico ponto
3. **Escala** — imagine o valor `4.87` espalhado em 30 lugares; sem constante, voce teria que encontrar e substituir todos manualmente

### O que e uma convencao?

Rodrigo diferencia claramente: "Uma convencao nao e uma regra, nao e uma coisa que se voce nao fizer o seu codigo deixa de funcionar. Sao recomendacoes da comunidade de programadores e programadoras para melhorar a legibilidade do codigo."

Isso e importante porque iniciantes confundem convencoes com regras sintaticas. UPPER_CASE para constantes e uma convencao amplamente aceita em JavaScript.

## Por que switch-case e nao if-else?

Quando voce tem multiplas opcoes fixas e conhecidas (USD, EUR, GBP), o switch-case:

1. **Expressa intencao** — "estou selecionando entre opcoes" e mais claro que "estou testando condicoes"
2. **Facilita adicao** — novo case = nova moeda, sem mexer na logica existente
3. **Evita erros** — cada case e isolado com break

### O papel do break

Sem `break`, o JavaScript executa o case correspondente E todos os seguintes (fall-through). Isso e um comportamento intencional da linguagem mas quase sempre e um bug. Por isso, sempre inclua `break` a menos que tenha um motivo explicito para fall-through.

## Por que parametros explicitos na funcao?

A funcao `convertCurrency(amount, price, symbol)` recebe tres parametros em vez de acessar variaveis globais porque:

1. **Testabilidade** — voce pode chamar `convertCurrency(100, 4.87, "US$")` sem depender do DOM
2. **Reusabilidade** — a mesma funcao serve para qualquer moeda
3. **Clareza** — olhando a assinatura, voce sabe exatamente o que a funcao precisa

## Teste incremental

Rodrigo enfatiza: "Conforme voce vai desenvolvendo, vai testando, nao deixa pra testar tudo de ultima vez nao." Ele demonstra isso colocando um `console.log(amount, price, symbol)` dentro da funcao antes de implementar a logica de conversao, verificando que os parametros estao chegando corretamente.

Essa pratica evita acumular bugs invisiveis — se algo esta errado, voce descobre imediatamente, nao 10 passos depois.

## Dica pratica: simbolos especiais

Para simbolos como € (euro) e £ (libra) que nao tem tecla obvia no teclado, Rodrigo sugere simplesmente buscar "simbolo euro" no Google, copiar e colar. Pratico e sem erro.