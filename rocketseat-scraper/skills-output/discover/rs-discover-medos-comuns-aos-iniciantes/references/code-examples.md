# Code Examples: Medos Comuns dos Iniciantes em Programação

> Esta aula é conceitual/motivacional, sem exemplos de código diretos. Os cenários abaixo traduzem os conceitos em situações práticas que um iniciante pode enfrentar.

## Cenário 1: "Não memorizei o código" — Pesquisar é o processo

### Situação
Você precisa inverter uma string em JavaScript. Não lembra como.

### O que o iniciante tenta fazer (errado)
Tenta lembrar de cabeça, fica frustrado, acha que deveria saber.

### O que o programador faz (correto)
Pesquisa: "how to reverse a string javascript"

```javascript
// Encontrou na pesquisa:
const reversed = "hello".split("").reverse().join("")
// resultado: "olleh"
```

Anota no caderninho: "Para inverter string: split → reverse → join"

Na próxima vez, talvez lembre. Se não lembrar, pesquisa de novo. Ambos os caminhos são válidos.

## Cenário 2: "Entendi a aula mas não consigo aplicar"

### Situação
O professor mostrou como fazer um loop com `for`. Você entendeu. Agora pedem: "mostre todos os números pares de 1 a 100."

### O gap entre entender e aplicar

```javascript
// Você entendeu isso na aula:
for (let i = 0; i < 10; i++) {
  console.log(i)
}

// Mas agora precisa adaptar para:
// 1. Ir até 100 (não 10)
// 2. Mostrar só pares

// Primeira tentativa (talvez com ajuda de pesquisa):
for (let i = 1; i <= 100; i++) {
  if (i % 2 === 0) {
    console.log(i)
  }
}
```

O gap é normal. A aula deu a peça do Lego (`for`). O desafio pede que monte algo diferente com essa peça. Prática fecha esse gap.

## Cenário 3: "Não tenho raciocínio lógico"

### Exercício mental — Lógica do dia a dia

Você já programa sem saber:

```
ALGORITMO: Fazer café
1. Verificar se tem água na chaleira
2. SE não tem → encher
3. Ligar fogo
4. ENQUANTO água não ferver → esperar
5. Colocar pó no filtro
6. Despejar água
7. Servir
```

```
ALGORITMO: Se vestir
1. Colocar cueca/calcinha     (ANTES da calça)
2. Colocar calça              (ANTES do sapato)
3. Colocar meia               (ANTES do sapato)
4. Colocar sapato
// Inverter a ordem = erro lógico (bug!)
```

Se você faz isso certo todo dia, você TEM raciocínio lógico. Só precisa treinar para aplicar no contexto de código.

## Cenário 4: "Não sou bom em matemática"

### O que programação web realmente usa

```javascript
// Regra de três — calcular desconto
const precoOriginal = 100
const percentualDesconto = 15
const desconto = (precoOriginal * percentualDesconto) / 100
// resultado: 15

// Soma, multiplicação — calcular total do carrinho
const itens = [29.90, 45.00, 12.50]
const total = itens.reduce((soma, item) => soma + item, 0)
// resultado: 87.40

// Divisão — paginação
const totalItens = 47
const itensPorPagina = 10
const totalPaginas = Math.ceil(totalItens / itensPorPagina)
// resultado: 5
```

Isso é o nível de matemática que você usa 99% do tempo em programação web.

## Cenário 5: Qualidade vs Quantidade de estudo

### Abordagem ruim (quantidade)
- Assistir 5 horas de vídeo por dia
- Fazer 3 cursos simultaneamente
- Copiar código do professor sem pausar
- Pular exercícios para "avançar mais rápido"

### Abordagem boa (qualidade)
- Assistir 1 aula, pausar, tentar fazer sozinho
- Quando travar, pesquisar antes de ver a resposta
- Anotar conceitos novos no caderninho
- Fazer o exercício de 3 formas diferentes
- Explicar o que aprendeu para alguém (ou para si mesmo)

### Métrica real de progresso
Não é "quantas aulas assisti" — é "quantos problemas consigo resolver sozinho que antes não conseguia".