---
name: rs-ia-node-marketplace-confirmando-acao
description: "Applies the confirm-action workflow pattern for AI marketplace carts when building 'action confirmation flows', 'cart suggestion systems', 'embedding similarity search for products', or 'confirm then execute patterns'. Enforces: embed input, cosine similarity pre-filter, group by store, then send to AI. Make sure to use this skill whenever implementing confirmation flows that trigger AI-based cart generation or product similarity searches with pgvector. Not for basic CRUD, simple chat responses, or frontend confirmation UI."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: ai-cart-suggestions
  tags: [embeddings, ia-node, postgresql, node-js]
---

# Confirmando Acao — Fluxo de Confirmacao com Embedding e Similaridade

> Ao confirmar uma acao, primeiro embede o input, filtre produtos por similaridade de cosseno localmente, agrupe por loja, e so entao envie para a AI montar os carrinhos.

## Rules

1. **Confirme antes de executar** — salve `confirmed_at` no banco antes de iniciar o processamento, porque separa a intencao do usuario da execucao e permite retry
2. **Embede o input do usuario** — vetorize o payload.input com a API de embeddings (1536 dimensoes), porque o calculo de similaridade local e muito mais barato que enviar todos os produtos para a AI
3. **Use cosine distance (<=>) para similaridade** — operador `<=>` no pgvector, filtrando `< 0.65`, porque mede direcao do vetor e quanto mais perto de zero, mais similar
4. **Agrupe produtos por loja** — retorne `store_id` com array de produtos, porque a AI precisa montar carrinhos por loja, nao um carrinho unico misturado
5. **Stringify o vetor antes de enviar ao SQL** — `JSON.stringify(embedding)` no parametro, porque pgvector espera formato `[0.1, 0.2, ...]` como string
6. **Valide a session e a action antes de confirmar** — retorne 404 se session nao existe, 404 se action nao existe, 409 Conflict se ja foi confirmada, porque evita processamento duplicado

## How to write

### Fluxo confirm action no servico

```typescript
async confirmAction(sessionId: string, actionId: string) {
  const session = await this.getSession(sessionId)
  if (!session) throw new NotFoundException('Session not found')

  const action = await this.findUnconfirmedAction(actionId)
  if (!action) throw new NotFoundException('Action not found')
  if (action.confirmed_at) throw new ConflictException('Action already confirmed')

  await this.markActionConfirmed(actionId)

  if (action.action_type === 'suggest_cards') {
    const embedding = await this.llm.embed(action.payload.input)
    const relevantProducts = await this.findRelevantProducts(embedding)
    // Proxima etapa: enviar para AI montar carrinhos
  }
}
```

### Query de similaridade com pgvector

```sql
SELECT
  p.store_id,
  p.id, p.name, p.price,
  p.embedding <=> $1 AS similarity
FROM products p
WHERE p.embedding <=> $1 < 0.65
ORDER BY similarity ASC
```

### Agrupamento por loja no codigo

```typescript
const grouped: Record<string, Product[]> = {}
for (const row of result.rows) {
  if (!grouped[row.store_id]) grouped[row.store_id] = []
  grouped[row.store_id].push(row)
}
return grouped
```

## Example

**Before (erro comum — vetor nao stringificado):**
```typescript
const result = await sql`
  SELECT * FROM products
  WHERE embedding <=> ${embedding} < 0.65
`
// ERRO: "vector must start with ["
```

**After (com stringify):**
```typescript
const result = await sql`
  SELECT * FROM products
  WHERE embedding <=> ${JSON.stringify(embedding)} < 0.65
  ORDER BY embedding <=> ${JSON.stringify(embedding)} ASC
`
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Poucos produtos no banco | Nao limite com LIMIT, deixe o threshold de 0.65 filtrar |
| Muitos produtos (>10k) | Adicione LIMIT 50 e considere indice HNSW |
| Produtos sem embedding | Resultado vazio — embede os produtos primeiro |
| Action type desconhecido | Lance InternalServerError, nao ignore silenciosamente |
| Usuario confirma 2x | Retorne 409 Conflict, nao reprocesse |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Enviar todos os produtos para a AI decidir | Pre-filtrar por similaridade localmente |
| Usar distancia euclidiana para texto | Usar cosine distance (`<=>`) |
| Confirmar e executar na mesma operacao atomica | Salvar confirmed_at primeiro, executar depois |
| Retornar produtos flat sem agrupamento | Agrupar por store_id |
| Ignorar action types desconhecidos | Lancar erro explicito |
| Fazer JOIN com stores na query de similaridade | Query simples em products, agrupar no codigo |

## Troubleshooting

### Resultado inesperado do modelo
**Symptom:** Resposta da IA nao corresponde ao formato ou conteudo esperado
**Cause:** Prompt insuficiente, parametros mal configurados, ou modelo sem contexto adequado
**Fix:** Revise o prompt com exemplos concretos (few-shot), ajuste temperature, e verifique se os dados necessarios foram fornecidos ao modelo

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
