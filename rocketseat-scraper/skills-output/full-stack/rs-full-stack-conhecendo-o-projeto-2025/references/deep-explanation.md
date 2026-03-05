# Deep Explanation: Projeto Conversor de Moedas

## Por que apenas numeros inteiros?

O instrutor explica que o requisito de aceitar apenas numeros inteiros vem de um cenario real: casas de cambio geralmente trabalham com valores cheios. Nao faz sentido comprar "50 centavos de dolares". Isso simula um pre-requisito que viria de um cliente real que contratou o desenvolvimento.

Essa restricao e didaticamente valiosa porque forca o aluno a implementar validacao de input no JavaScript, bloqueando:
- Letras (a-z, A-Z)
- Virgulas
- Pontos
- Qualquer caractere nao-numerico

## Filosofia do projeto: HTML/CSS prontos, JS do zero

O instrutor fornece HTML e CSS para download propositalmente. O objetivo e isolar o aprendizado de JavaScript. O aluno nao precisa se preocupar com layout ou estilizacao — vai direto para a logica de programacao.

Isso reflete um cenario real onde um desenvolvedor frontend recebe um design pronto (do designer/CSS) e precisa "dar vida" com JavaScript.

## Funcionalidades apresentadas

### Conversao
- Usuario digita um valor (ex: 50)
- Seleciona uma moeda (ex: dolar americano)
- Clica em "converter em reais"
- Resultado aparece abaixo mostrando:
  - Taxa unitaria: "1 dolar = R$ 4,87"
  - Valor total: "50 dolares = R$ 243,50"

### Selecao de moeda
- Tres opcoes iniciais: dolar americano, euro, libra esterlina
- O simbolo da moeda muda dinamicamente no resultado
- O instrutor incentiva adicionar mais moedas como exercicio

### Validacao de input
- Demonstracao ao vivo: ao tentar digitar letras, nada acontece
- Virgula e ponto tambem sao bloqueados
- Apenas digitos 0-9 sao aceitos

## Recomendacao de portfolio

O instrutor explica que este e um projeto ideal para portfolio porque:
- E visualmente atraente (design pronto)
- Demonstra manipulacao de DOM, eventos, validacao
- Pode ser expandido com novas moedas, API real, historico de conversoes
- E um caso de uso real que recrutadores entendem

## Valores de cambio

Os valores usados na aula sao hipoteticos/exemplos:
- 1 USD = R$ 4,87
- 1 EUR = R$ 5,32
- Libra esterlina tambem tem valor de exemplo

O instrutor deixa claro que sao valores de exemplo que podem variar.