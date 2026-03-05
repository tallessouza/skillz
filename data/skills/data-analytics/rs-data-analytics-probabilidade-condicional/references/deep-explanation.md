# Deep Explanation: Probabilidade Condicional

## O que e probabilidade condicional

P(A|B) — leia "probabilidade de A dado B" — e a chance de o evento A ocorrer **sabendo que B ja aconteceu**. O ponto crucial e que B redefine o universo de possibilidades. Voce nao esta mais olhando para todos os casos, apenas para aqueles onde B e verdade.

## A analogia do funil de e-commerce (do instrutor)

O instrutor Rodolfo usa um exemplo concreto:
- 1000 pessoas visitaram o site
- 300 colocaram produtos no carrinho
- 90 finalizaram a compra

A pergunta e: "qual a probabilidade de alguem comprar **sabendo que** colocou algo no carrinho?"

O erro mais comum e usar 1000 como denominador. Mas a condicao ("sabendo que colocou no carrinho") restringe o universo para 300. Logo:

P(compra | carrinho) = 90/300 = 3/10 = 30%

## Por que o espaco amostral muda

O instrutor enfatiza: "Sera que o seu espaco amostral sao os mil clientes que visitaram o site? Ou sao as 300 pessoas que colocaram algum produto no carrinho? Tem que ter atencao a isso."

Essa e a essencia da condicional — a condicao **redefine** o espaco amostral. O denominador nao e mais o total geral, e sim o total do subconjunto condicionante.

## Conexao com a aula anterior

Na aula anterior, o instrutor ja havia trabalhado com probabilidade condicional sem nomea-la: pegou 200 clientes que clicaram num e-mail e calculou quantos compraram. O espaco amostral nao era todos os 1000 clientes, mas apenas os 200 que clicaram.

## Aplicacoes praticas mencionadas pelo instrutor

1. **Teste A/B** — "Qual a chance daquele caso dar certo condicionado a alguma coisa que ja aconteceu?"
2. **Churn** — "Qual a probabilidade da pessoa sair, tendo em vista comportamentos que ja aconteceram no passado?"
3. **Modelos preditivos** — "A probabilidade da pessoa comprar uma vez que ela entrou no meu site, colocou algo no carrinho, preencheu tudo..."

O instrutor destaca que "quase tudo que trabalhamos e com uma probabilidade condicional" — o analista sempre trabalha com dados que ja aconteceram para prever o futuro.

## A frase de Laplace

O instrutor encerra com Pierre-Simon Laplace: "A teoria das probabilidades e nada mais do que bom senso reduzido ao calculo."

A interpretacao do instrutor: probabilidade nao e so matematica. E matematica + bom senso juntos. Voce precisa alinhar o calculo com o entendimento do contexto para fazer uma boa analise. Um numero sem interpretacao de negocio nao gera valor.

## Armadilha classica: P(A|B) ≠ P(B|A)

Embora o instrutor nao entre nesse detalhe, e uma extensao natural:
- P(compra | carrinho) = 90/300 = 30%
- P(carrinho | compra) = 90/90 = 100% (todos que compraram passaram pelo carrinho)

Sao perguntas completamente diferentes com respostas diferentes. Confundir as duas e um dos erros mais comuns em analise de dados.