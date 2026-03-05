# Deep Explanation: Validacao de Dados com Zod

## Por que Zod e nao validacao manual?

O instrutor demonstra o problema de forma pratica: sem validacao, ao omitir o campo `price` no body da requisicao, o endpoint simplesmente retorna o `name` sem o `price` — nenhum erro, nenhum aviso. Isso criaria registros invalidos no banco.

Validacao manual com `if (!name)` funciona para casos simples, mas escala mal:
- Cada campo precisa de verificacao individual
- Tipos nao sao garantidos (price pode chegar como string)
- Mensagens de erro ficam inconsistentes
- Nao ha desestruturacao automatica dos dados validados

## parse() como extrator + validador

A sacada central da aula: `bodySchema.parse(request.body)` faz duas coisas simultaneamente:
1. **Valida** todos os campos contra as regras
2. **Extrai** os campos validados com tipos corretos

Isso elimina a necessidade de `const { name, price } = request.body` seguido de validacoes separadas.

## Decisao: gt(0) vs min(1)

O instrutor testa com price = 0 e mostra que `gt(0)` rejeita corretamente. A diferenca:
- `gt(0)` = "greater than 0" — exclui o zero
- `min(1)` = "minimum 1" — tambem exclui o zero, MAS semanticamente e diferente para decimais

Para precos, `gt(0)` e mais preciso porque permite valores como 0.50 (que `min(1)` rejeitaria).

## Mensagens de erro: quando customizar?

O instrutor faz um experimento interessante ao vivo:
1. Primeiro adiciona mensagem custom: `{ message: "Value must be greater than 0" }`
2. Depois remove e testa a mensagem padrao do Zod
3. Conclui que a mensagem padrao ("Number must be greater than 0") e ate melhor

**Regra pratica derivada:** teste a mensagem padrao primeiro. So customize se ela nao for clara para o usuario final.

Para campos obrigatorios (required), o Zod automaticamente gera "Required" quando o campo esta ausente — nao precisa de mensagem custom.

## trim() antes de min()

O instrutor usa `z.string().trim().min(6)`. A ordem importa:
- `trim()` remove espacos antes da validacao
- Sem trim, `"   "` (3 espacos) + "abc" passaria em `min(6)`
- Com trim, so o conteudo real conta

## Fluxo de erros com try/catch + next()

O padrao Express para tratamento de erros:
```
request → controller try block → parse falha → catch → next(error) → error middleware
```

O Zod lanca um `ZodError` quando parse falha. O middleware de erro (nao mostrado nesta aula mas referenciado como "mirror") recebe esse erro e formata a resposta adequada.

## O que NAO validar no bodySchema

O instrutor destaca que o schema so inclui `name` e `price` — nao inclui `id`, `created_at`, ou `updated_at` porque esses sao gerados automaticamente pelo banco. O bodySchema deve espelhar APENAS o que o cliente envia.