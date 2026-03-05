# Deep Explanation: Técnicas de Divisão (Chunking)

## Por que chunking existe

O problema fundamental: modelos de linguagem têm uma janela de contexto finita e, mesmo dentro dela, a "atenção" do modelo se degrada conforme o prompt cresce. O instrutor usa o exemplo de um marketplace com produtos — se você tem 10 mil produtos no banco e, após pré-filtragem, sobram 1000 produtos relevantes, enviar todos em um único prompt causa:

1. **Alucinação** — o modelo inventa produtos que não existem na lista
2. **Perda de detalhes** — ignora produtos que estão no meio/final da lista
3. **Degradação de qualidade** — as recomendações ficam genéricas em vez de específicas

## A analogia implícita

Chunking para prompts é como paginação para APIs: você não retorna 10 mil registros de uma vez para o frontend. Da mesma forma, não deveria enviar 1000 produtos em um único prompt. Divide, processa, junta.

## Decisão de chunk size

O instrutor enfatiza que chunk size é empírico. No exemplo da aula com ~50 produtos, usou 10 por chunk. Mas em produção com 1000 produtos, poderia ser 100 ou 250. Fatores que influenciam:

- **Janela de contexto do modelo** — GPT-4o-mini tem 128K tokens, mas atenção prática é menor
- **Complexidade da instrução** — se o system prompt é longo, sobra menos espaço para dados
- **Formato dos dados** — produtos com descrições longas ocupam mais tokens que simples nomes

## Promise.all vs sequencial

O instrutor destaca que usar `Promise.all` é essencial. Se você tem 10 chunks e cada um leva 2 segundos, sequencialmente seriam 20 segundos. Com `Promise.all`, são ~2 segundos (limitado pelo chunk mais lento). O custo é o mesmo em tokens, mas o tempo de resposta cai drasticamente.

## Merge strategy: filter + flatMap

O padrão de merge é elegante:

1. `filter(Boolean)` — remove chunks que falharam (retornaram null)
2. `flatMap(r => r.products)` — achata arrays aninhados em um único array

Isso é robusto porque falhas parciais não invalidam o resultado inteiro. Se 1 de 10 chunks falhar, você ainda tem 90% dos resultados.

## Tipagem com Generics

Um ponto técnico importante da aula: a função `generateResponse` sem generic retorna `never` para `outputParsed`, porque o TypeScript não consegue inferir o schema do Zod automaticamente. A solução é adicionar um generic `T` com default `null`:

```typescript
async function generateResponse<T = null>(params): Promise<T | null>
```

Quando chamado com `generateResponse<{ products: string[] }>()`, o TypeScript sabe exatamente o tipo do retorno. Isso é crucial para que o `filter` e `flatMap` subsequentes funcionem com type safety.

## Quando NÃO usar chunking

- Se o volume de dados cabe confortavelmente na janela do modelo e a qualidade está boa, chunking adiciona complexidade desnecessária
- Se os dados são interdependentes (ex: o modelo precisa comparar TODOS os itens entre si), chunking pode degradar a qualidade porque cada chunk não tem visão do todo
- Para RAG/embeddings, a técnica de splitting é diferente (text splitting com overlap, não prompt chunking)