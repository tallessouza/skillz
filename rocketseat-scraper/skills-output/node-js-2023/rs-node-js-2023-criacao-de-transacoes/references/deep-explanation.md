# Deep Explanation: Criacao de Transacoes

## Por que usar prefix no plugin do Fastify

O Fastify trabalha com um sistema de plugins onde cada arquivo de rotas e registrado como um plugin. Quando todas as rotas de um grupo compartilham o mesmo prefixo (ex: `/transactions`), faz sentido definir esse prefixo uma unica vez no momento do `register`, em vez de repetir em cada rota individual.

Isso significa que dentro do plugin, `app.post('/')` equivale a `POST /transactions`, `app.get('/:id')` equivale a `GET /transactions/:id`, etc. O codigo fica mais limpo e menos propenso a erros de digitacao.

## O request.body e `unknown` — e por que isso e bom

No Fastify com TypeScript, o `request.body` tem tipo `unknown`. Isso e intencional e desejavel, porque o servidor nao tem garantia de que o cliente enviou os dados no formato esperado. O tipo `unknown` forca o desenvolvedor a validar antes de usar.

O Zod resolve isso elegantemente: `schema.parse(request.body)` faz duas coisas simultaneamente:
1. **Valida** — se os dados nao batem, lanca erro automaticamente (throw)
2. **Infere tipos** — o retorno do parse tem os tipos corretos do TypeScript

Isso elimina a necessidade de `as any` ou type assertions manuais. A IDE passa a oferecer autocomplete e deteccao de erros apos o parse.

## Normalizacao de valores: credito positivo, debito negativo

O instrutor destaca uma decisao de design importante: em vez de armazenar o `type` (credit/debit) como coluna no banco e fazer logica condicional nas consultas, ele normaliza o valor no momento do insert:

- Credito: `amount` permanece positivo
- Debito: `amount` e multiplicado por `-1`

**Vantagem:** quando for calcular o resumo (soma total), basta fazer `SUM(amount)` — os valores positivos e negativos se cancelam naturalmente, sem precisar de `CASE WHEN type = 'debit' THEN -amount ELSE amount END`.

## HTTP 201 e a ausencia de corpo na resposta

O codigo HTTP 201 (Created) indica que um recurso foi criado com sucesso. Em APIs REST, rotas de criacao geralmente nao precisam retornar o recurso criado — o status 201 ja comunica o sucesso.

O instrutor menciona que o Knex tem um metodo `.returning()` que poderia retornar os dados inseridos, mas opta por nao usa-lo aqui, mantendo a resposta vazia. Isso e uma pratica comum em APIs onde o cliente nao precisa dos dados de volta imediatamente.

## Tratativa de erros do Zod

Quando o Zod detecta dados invalidos (ex: `type` com valor diferente de 'credit' ou 'debit'), ele lanca um erro. No momento da aula, esse erro resulta em um 500 (Internal Server Error), o que nao e ideal. O instrutor reconhece isso e menciona que a tratativa de erros sera melhorada depois.

O ponto importante e que mesmo sem tratativa personalizada, o Zod ja impede que dados invalidos cheguem ao banco de dados — a validacao funciona como uma barreira de seguranca.

## crypto.randomUUID() nativo do Node

O Node.js possui o modulo `node:crypto` com o metodo `randomUUID()` que gera UUIDs v4 sem necessidade de bibliotecas externas. O instrutor mostra duas formas de importar:

```typescript
// Importar o modulo inteiro
import crypto from 'node:crypto'
crypto.randomUUID()

// Ou importar apenas a funcao
import { randomUUID } from 'node:crypto'
randomUUID()
```

Ambas sao validas, a segunda e mais concisa.