# Deep Explanation: Comentarios em Python

## Por que comentar?

O instrutor destaca dois motivos fundamentais:

### 1. Memoria propria
Programadores escrevem muitas linhas de codigo em diversos projetos. Chega um momento em que voce nao lembra o que quis fazer em determinado trecho. Comentarios funcionam como notas para o seu "eu do futuro". A chave e: **nao precisa comentar tudo**, apenas trechos com logica mais complexa.

### 2. Trabalho em equipe
Voce nunca trabalha sozinho. Outros programadores precisam entender como voce pensou para resolver um problema. Comentarios reduzem o tempo que outro dev gasta tentando decifrar sua logica.

## Os dois tipos de comentario

### Comentario de uma linha (`#`)
- O simbolo `#` (jogo da velha, cerquilha, hashtag) marca tudo apos ele como comentario
- Pode ser usado no inicio da linha (toda a linha vira comentario) ou apos um comando (so o que vem depois do `#` e ignorado)
- Quando usado antes: `# isso e um comentario` — a linha inteira nao executa
- Quando usado depois: `print("Olá")  # saudacao` — o `print` executa, o comentario nao

### Comentario de varias linhas
Tres formas:
1. **Multiplos `#`**: um por linha — funciona sempre, mais explicito
2. **Triple aspas simples** (`'''...'''`): bloco inteiro entre tres aspas simples
3. **Triple aspas duplas** (`"""..."""`): bloco inteiro entre tres aspas duplas

O instrutor mostra as tres formas como equivalentes para comentarios multi-linha. Porem, ha uma nuance importante que o instrutor nao aprofunda: triple quotes dentro de funcoes/classes no inicio do corpo se tornam **docstrings** (documentacao acessivel via `help()`), nao simples comentarios. Fora de funcoes, sao strings nao atribuidas que o interpretador descarta.

## Insight do instrutor sobre quando comentar

A frase-chave: *"Eu nao preciso comentar todo tipo de codigo, mas aqueles principais, aqueles que possuem principalmente uma logica mais dificil."*

Isso reflete uma pratica profissional importante — comentar demais e tao ruim quanto nao comentar. O excesso de comentarios cria ruido, dificulta leitura e gera manutencao extra (comentarios desatualizados que mentem sobre o codigo).