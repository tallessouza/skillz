---
name: rs-ia-node-processando-batches-criados
description: "Applies OpenAI Batch API result processing patterns when parsing batch output files, extracting embeddings from JSONL responses, and saving to database. Use when user asks to 'process batch results', 'parse batch output', 'extract embeddings from batch', 'handle OpenAI batch response', or 'save batch embeddings'. Make sure to use this skill whenever working with OpenAI Batch API output files or JSONL parsing in Node.js. Not for creating batches, generating embeddings in real-time, or non-OpenAI batch processing."
---

# Processando Resultados de Batch da OpenAI

> Ao processar resultados de batch, faca a engenharia reversa do JSONL: split por newline, parse cada linha, filtre nulos, e mapeie para o formato final.

## Rules

1. **Verifique status antes de processar** — cheque `batch.status === 'completed'` e existencia de `output_file_id`, porque o batch pode ainda estar em processamento
2. **Retorne null para batch incompleto** — nao lance erro, retorne null e responda 200 com mensagem informativa, porque o caller pode tentar novamente depois
3. **Faca engenharia reversa do JSONL** — use `content.split('\n')` + `JSON.parse()` por linha, porque o output da OpenAI e JSONL (uma linha JSON por resultado)
4. **Use try-catch por linha** — o split gera uma linha vazia extra no final que falha no parse, entao proteja cada parse individualmente e retorne null no erro
5. **Filtre nulos antes de mapear** — use `.filter()` com type predicate para garantir tipagem correta apos remover linhas invalidas
6. **Mantenha processamento no modulo da OpenAI** — como o formato e proprietario da OpenAI, a logica de parsing fica no modulo openai, nao na rota

## Steps

### Step 1: Verificar completude do batch

```typescript
const batch = await getBatch(batchId)

if (batch.status !== 'completed' || !batch.output_file_id) {
  return null
}
```

### Step 2: Obter conteudo do arquivo de output

```typescript
const fileContent = await getFileContent(batch.output_file_id)
```

### Step 3: Fazer engenharia reversa do JSONL

```typescript
const lines = fileContent.split('\n')

const parsed = lines.map(line => {
  try {
    const parse = JSON.parse(line) as {
      custom_id: string
      response: {
        body: {
          data: Array<{ embedding: number[] }>
        }
      }
    }
    return parse
  } catch (error) {
    return null
  }
})
```

### Step 4: Filtrar e mapear para formato final

```typescript
const results = parsed
  .filter((r): r is NonNullable<typeof r> => r !== null)
  .map(r => ({
    id: Number(r.custom_id),
    embeddings: r.response.body.data[0].embedding
  }))
```

### Step 5: Salvar no banco de dados

```typescript
for (const result of results) {
  await setEmbedding(result.id, result.embeddings)
}
```

## Output format

A funcao retorna `Array<{ id: number, embeddings: number[] }> | null`:
- `null` = batch ainda nao completou
- Array = resultados prontos com id (convertido de custom_id) e vetor de embeddings

## Error handling

- Se batch incompleto → retorna null, rota responde 200 com mensagem "still processing"
- Se linha JSONL invalida → try-catch retorna null, filtrado depois
- Se linha vazia extra do split → tratada pelo mesmo try-catch (comportamento esperado)

## Heuristics

| Situacao | Faca |
|----------|------|
| Batch nao completou | Retorne null, nao lance erro |
| Precisa mostrar embeddings na API | Trunce com `.slice(0, 3)` porque sao 1536 dimensoes |
| custom_id era numero | Converta de volta com `Number()` |
| Processamento em background | Use Batch API para economizar custos e ter limites maiores |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `JSON.parse(entireFile)` | `file.split('\n').map(line => JSON.parse(line))` |
| Ignorar linha vazia do split | Try-catch por linha, filtrar nulos |
| Processar sem checar status | Verificar `completed` + `output_file_id` |
| Lancar erro para batch incompleto | Retornar null, deixar caller decidir |
| Parsing de JSONL na rota | Manter no modulo OpenAI (formato proprietario) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
