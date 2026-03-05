# Code Examples: Aplicação Prática das Técnicas de Aprendizado

## Como aplicar Active Recall em programação

### Cenário: Aprendeu sobre arrays em JavaScript

**Passo 1 — Estude o conceito normalmente**
```javascript
// Você assistiu a aula sobre métodos de array
const numbers = [1, 2, 3, 4, 5]
const doubled = numbers.map(n => n * 2)
const evens = numbers.filter(n => n % 2 === 0)
const sum = numbers.reduce((acc, n) => acc + n, 0)
```

**Passo 2 — Feche o material e tente reescrever**
```javascript
// SEM OLHAR: recrie os exemplos da memória
// Quais métodos de array você lembra?
// Como é a sintaxe de cada um?
// O que cada um retorna?

// Sua tentativa aqui (erros são parte do processo)
```

**Passo 3 — Compare, identifique lacunas, repita**

### Cenário: Aprendeu sobre funções

**Exercício de recall — escreva sem consultar:**
1. Uma função que recebe dois números e retorna a soma
2. Uma arrow function que filtra strings vazias de um array
3. Uma função com valor padrão para parâmetro

```javascript
// Tente primeiro, depois compare:

// 1. Soma
function sum(a, b) {
  return a + b
}

// 2. Filtrar vazias
const removeEmpty = (strings) => strings.filter(s => s !== '')

// 3. Valor padrão
function greet(name = 'World') {
  return `Hello, ${name}!`
}
```

## Como aplicar Feynman em programação

### Cenário: Explicar o que é uma Promise

**Sua explicação (em voz alta ou escrita):**
> "Uma Promise é como fazer um pedido num restaurante. Você faz o pedido (cria a Promise), o garçom leva para a cozinha (processamento assíncrono), e você recebe uma 'promessa' de que o prato vai chegar. Pode dar certo (resolve — prato chega) ou dar errado (reject — acabou o ingrediente). Enquanto espera, você pode fazer outras coisas (non-blocking)."

**Onde travou?** → Volte e estude esse ponto específico.

## Como aplicar Pomodoro em sessão de código

### Plano de estudo com Pomodoro

```
POMODORO 1 (25 min): Assistir aula/ler documentação [PASSIVO]
PAUSA (5 min): Levantar, água

POMODORO 2 (25 min): Tentar replicar sem olhar [ATIVO - Recall]
PAUSA (5 min): Alongar

POMODORO 3 (25 min): Resolver exercício novo [ATIVO - Prática]
PAUSA (5 min): Descanso

POMODORO 4 (25 min): Explicar o que aprendeu [ATIVO - Feynman]
PAUSA LONGA (15-30 min): Descanso real
```

### Proporção ideal
- 25% do tempo em consumo passivo (aula, documentação)
- 75% do tempo em prática ativa (recall, exercícios, projetos)

## Template de planejamento de estudo

```markdown
## Objetivo de Curto Prazo
[ ] Terminar módulo X até dia DD/MM

## Melhores Horários
- Manhã 7h-8h (alta energia)
- Noite 20h-21h (casa quieta)

## Cronograma Semanal
- Seg/Qua/Sex: 1h (2 pomodoros)
- Sáb: 2h (4 pomodoros)
- Total: 5h/semana

## Técnicas por Sessão
1. Pomodoro 1: Consumir conteúdo novo
2. Pomodoro 2: Active Recall do conteúdo
3. Pomodoro 3+: Prática / Projeto

## Regras Pessoais
- Sem celular durante pomodoro
- Dia off quando precisar (sem culpa)
- Revisar progresso toda sexta
```