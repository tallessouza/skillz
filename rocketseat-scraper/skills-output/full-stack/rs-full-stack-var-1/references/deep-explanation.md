# Deep Explanation: Declaracao de Variaveis com var

## Por que `var` existe

Em JavaScript, `var` e a forma original de declarar variaveis. A palavra reservada sinaliza ao interpretador: "reserve um espaco na memoria com este nome". Sem essa declaracao, o JavaScript nao sabe que a variavel existe.

## Tres operacoes distintas

O instrutor enfatiza que existem tres operacoes separadas, e confundi-las e um erro comum:

### 1. Declaracao (criar a variavel)
```javascript
var user;
```
Aqui voce esta dizendo ao JavaScript: "crie uma variavel chamada `user`". Nenhum valor foi atribuido, entao o conteudo e `undefined` — literalmente "nao definido".

### 2. Declaracao com atribuicao (criar e dar valor)
```javascript
var email = "rodrigo@email.com";
```
Duas coisas acontecem em uma linha: a variavel e criada E recebe um valor inicial. O `=` aqui e o operador de atribuicao.

### 3. Reatribuicao (substituir o valor)
```javascript
email = "joao@email.com";
```
A variavel ja existe. Nao use `var` de novo. Apenas atribua o novo valor. O valor anterior e completamente sobrescrito.

## Por que nao repetir `var`

O instrutor destaca explicitamente: "pode ver que aqui eu nao usei a palavra reservada var de novo, porque nesse momento eu nao estou criando a variavel email, porque ela ja existe."

Repetir `var` para a mesma variavel no mesmo escopo nao causa erro em JavaScript (diferente de `let`), mas e confuso porque sugere que voce esta criando uma nova variavel quando na verdade esta apenas mudando o valor.

## O tipo `undefined`

Quando uma variavel e declarada sem valor, seu conteudo e `undefined`. O instrutor menciona que vai explicar esse tipo com mais profundidade em aula futura. Por ora, o importante e entender que `undefined` significa "esta variavel existe, mas ninguem colocou nada dentro dela ainda".

## O sinal de igual como atribuicao

O instrutor reforça: "o sinal de igual e atribuicao". Em matematica, `=` significa igualdade. Em JavaScript, significa "coloque o valor da direita dentro da variavel da esquerda". Essa distincao e fundamental para iniciantes.

## Analogia implicita

Pense na variavel como uma caixa com uma etiqueta (o nome). `var user;` cria a caixa vazia com a etiqueta "user". `var email = "rodrigo@email.com";` cria a caixa ja com algo dentro. `email = "joao@email.com";` abre a caixa existente, tira o que tinha e coloca algo novo.