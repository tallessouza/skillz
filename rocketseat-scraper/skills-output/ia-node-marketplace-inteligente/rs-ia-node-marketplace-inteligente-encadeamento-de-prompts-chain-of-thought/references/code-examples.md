# Code Examples: Chain of Thought

## Exemplo 1: Prompt ANTES do Chain of Thought

Este e o prompt original que o instrutor mostrou, usando apenas uma instrucao direta:

```typescript
// Prompt simples — sem chain of thought
const prompt = `Retorna uma lista com 5 produtos que satisfaçam a necessidade do usuário.

Produtos disponíveis:
${chunkedProducts}

Necessidade do usuário: ${userInput}`
```

**Resultado para "lasanha de frango com molho branco":**
- frango
- molho de soja
- queijo
- manteiga
- creme dental

O modelo associou diretamente "lasanha" com alguns ingredientes obvios e preencheu o resto com itens irrelevantes.

## Exemplo 2: Prompt COM Chain of Thought

O instrutor reescreveu o prompt adicionando etapas numeradas e um exemplo completo:

```typescript
const prompt = `
Etapas:
1. Divida o prato em componentes principais.
2. Para cada componente, forneça uma lista de produtos que podem ser usados para prepará-lo.
3. Liste todos os produtos necessários para todos os componentes.

Exemplo:
---
Produtos disponíveis nesse exemplo: farinha de trigo, açúcar, manteiga, sal, limão, ovos, creme de leite, morango

Necessidade do usuário: torta de limão

1. Componentes principais: massa, recheio, cobertura
2. Produtos por componente:
   - Massa: farinha de trigo, manteiga, sal
   - Recheio: limão, açúcar, ovos
   - Cobertura: creme de leite, açúcar
3. Produtos necessários: farinha de trigo, açúcar, manteiga, sal, limão, ovos, creme de leite
---

Produtos disponíveis:
${chunkedProducts}

Necessidade do usuário: ${userInput}
`
```

**Resultado para "lasanha de frango com molho branco":**
- leite (para o molho branco)
- cebola (para o molho branco)
- alho (para o molho branco)
- sal
- pimenta
- frango
- mussarela

## Exemplo 3: Estrutura do exemplo few-shot (detalhada)

O instrutor construiu o exemplo passo a passo durante a aula. A estrutura e:

```
1. Separar claramente os dados de entrada (produtos disponiveis)
2. Declarar a necessidade do usuario
3. Mostrar CADA etapa preenchida:
   - Etapa 1: componentes identificados
   - Etapa 2: produtos mapeados POR componente
   - Etapa 3: lista consolidada (sem duplicatas)
```

Nota importante: na etapa 3, o instrutor destacou que nao se deve repetir produtos. Acucar aparecia em recheio e cobertura, mas na lista final aparece uma unica vez.

## Exemplo 4: Configuracao de chunking usada junto

```typescript
// O instrutor aumentou o chunk size para 100 nesse contexto
// porque havia poucos itens (~50 produtos)
const chunkSize = 100
```

O chunking e complementar ao chain of thought — um trata do volume de dados, outro da qualidade do raciocinio.

## Padrao geral para aplicar Chain of Thought

```typescript
const buildChainOfThoughtPrompt = (
  steps: string[],
  exampleInput: string,
  exampleSteps: string[],
  exampleOutput: string,
  actualInput: string
) => `
Etapas:
${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Exemplo:
---
${exampleInput}

${exampleSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Resultado: ${exampleOutput}
---

${actualInput}
`
```