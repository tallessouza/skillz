# Deep Explanation: Testando Listagem de Transacoes

## Principio fundamental: isolamento total de testes

O Diego enfatiza com muita forca: **"Eu jamais, e isso e uma regra, jamais posso escrever um teste que depende de outro teste. Se isso esta acontecendo, se um teste depende de outro, eles deveriam ser o mesmo."**

Essa regra existe porque:
- Testes podem rodar em qualquer ordem
- Testes podem rodar em paralelo
- Um teste falhando nao deve causar falha em cascata em outros
- Cada teste deve funcionar como se fosse o unico no arquivo

## Como cookies funcionam no Supertest

Quando voce cria uma transacao, o servidor responde com um header `Set-Cookie` contendo o `sessionId`. No Supertest, existem duas formas de extrair:

1. `response.get('Set-Cookie')` — metodo generico para pegar qualquer header
2. `response.getSetCookie()` — metodo dedicado do Supertest

Para reenviar o cookie em outra requisicao, use `.set('Cookie', cookies)`. O metodo `.set()` do Supertest seta headers na requisicao. Isso esta na documentacao do Supertest.

## Por que objectContaining e nao toEqual completo

Campos como `id` e `created_at` sao gerados pelo banco de dados. Voce tem duas opcoes:

1. **expect.any(String)** — valida que o campo existe e e uma string:
   ```typescript
   { id: expect.any(String), title: 'Test', created_at: expect.any(String) }
   ```

2. **expect.objectContaining** — valida apenas os campos que voce conhece:
   ```typescript
   expect.objectContaining({ title: 'Test', amount: 5000 })
   ```

O Diego prefere a segunda abordagem porque e mais limpa e foca no que importa.

## Armadilha da estrutura de resposta

Um erro comum que o Diego demonstra ao vivo: a API retorna `{ transactions: [...] }`, nao `[...]` diretamente. O teste falhou porque ele comparou `body` (um objeto) com um array.

A mensagem de erro do Vitest e muito util aqui — mostra em azul o que era esperado e em vermelho o que foi retornado. Use isso para debugar.

## Funcoes uteis de controle de testes

- **`it.skip`** — pula o teste (nao executa, mas aparece como skipped)
- **`it.todo('descricao')`** — marca como pendente para implementar depois
- **`it.only`** — executa APENAS esse teste no arquivo (util durante desenvolvimento)

Quando usa `it.only`, nao precisa de `it.skip` nos outros — eles sao automaticamente ignorados.

## O campo `type` nao e validado na listagem

Detalhe importante: o `type` (credit/debit) nao e salvo como coluna separada no banco — ele e usado apenas para calcular se o `amount` e positivo ou negativo. Por isso nao aparece na listagem e nao deve ser validado no teste.