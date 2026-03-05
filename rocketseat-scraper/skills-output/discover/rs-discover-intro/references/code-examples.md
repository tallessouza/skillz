# Code Examples: Aprender a Aprender — Intro

## Nota sobre esta aula

Esta aula introdutória é conceitual e não contém exemplos de código. Os exemplos abaixo ilustram os princípios de aprendizado aplicados à prática de programação.

## Exemplo: Estudo passivo vs. ativo

### Abordagem passiva (método escolar)

```javascript
// Aluno assiste tutorial e copia exatamente:
const soma = (a, b) => a + b
console.log(soma(2, 3)) // 5
// "Entendi!" — mas não aprendeu
```

### Abordagem ativa (método reprogramado)

```javascript
// Passo 1: Assistir o conceito (arrow function)
// Passo 2: Fechar o tutorial e tentar sozinho
const multiplica = (x, y) => x * y

// Passo 3: Quebrar de propósito — o que acontece?
const divide = (x, y) => x / y
console.log(divide(10, 0)) // Infinity — por quê?

// Passo 4: Explorar variações
const potencia = (base, exp) => base ** exp
const modulo = (a, b) => a % b

// Passo 5: Aplicar em contexto real
const calcularDesconto = (preco, percentual) => preco * (1 - percentual / 100)
console.log(calcularDesconto(100, 15)) // 85
```

## Exemplo: Ciclo teoria-prática

```
❌ Método escolar:
   Ler capítulo 1 → Ler capítulo 2 → ... → Ler capítulo 10 → Tentar exercício

✅ Método reprogramado:
   Ler conceito → Praticar 10min → Errar → Corrigir → Próximo conceito → Repetir
```

## Exemplo: Repetição espaçada aplicada a programação

```
Dia 1: Aprende array methods (map, filter, reduce)
       → Faz 3 exercícios

Dia 2: Aprende promises/async
       → Faz 3 exercícios de promises
       → Faz 1 exercício de array methods (revisão)

Dia 4: Aprende fetch API
       → Faz 3 exercícios de fetch
       → Faz 1 exercício de promises (revisão)
       → Faz 1 exercício de array methods (revisão)

Dia 7: Projeto mini que combina os três
```

## Anti-padrões de estudo

| Hábito ineficiente | Alternativa eficiente |
|---------------------|----------------------|
| Assistir 4h de tutorial sem parar | Blocos de 25min (Pomodoro) com prática entre cada |
| Copiar código do instrutor | Pausar vídeo, tentar antes de ver a solução |
| Reler anotações antes de dormir | Tentar resolver um problema sem consultar anotações |
| Fazer o mesmo exercício até "decorar" | Variar o exercício mantendo o conceito |
| Seguir tutorial na ordem linear | Pular para o que precisa para o projeto atual |