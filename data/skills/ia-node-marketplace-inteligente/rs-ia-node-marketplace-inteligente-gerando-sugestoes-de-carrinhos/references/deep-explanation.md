# Deep Explanation: Gerando Sugestoes de Carrinhos

## Fluxo Completo do Cart AI

O fluxo completo que o instrutor construiu segue esta sequencia:

1. **Usuario confirma acao** — a acao e salva como "executed"
2. **Input e embedado** — o texto do usuario vira embedding para busca semantica
3. **Produtos relevantes buscados** — por similaridade, agrupados por loja
4. **LLM gera sugestoes de carrinho** — com prompt estruturado e schema Zod
5. **Carrinhos salvos no banco** — inativos, vinculados a mensagem
6. **Mensagem salva** — tipo `suggest_cart_result`
7. **Mensagens populadas** — join com carrinhos e lojas ao retornar

## Engenharia de Prompt para Scoring

O instrutor destacou que o prompt precisa de exemplos concretos de como o score funciona. Nao basta dizer "calcule um score" — o LLM precisa ver:

- **Score alto (~95):** loja tem todos os ingredientes necessarios
- **Score medio (~70):** loja tem variacoes (ovos caipira em vez de ovos) ou faltam alguns itens
- **Score baixo (~20):** loja tem apenas 1 dos muitos itens necessarios

O instrutor mencionou que o score e "subjetivo" — o LLM decide com base no contexto. Isso funciona bem porque o prompt diz explicitamente o que diminui o score.

## Decisao de Schema: Por que Zod

O instrutor usa `responseParse` (provavelmente via Vercel AI SDK ou similar) que aceita um schema Zod. Isso garante:

- Resposta sempre no formato esperado
- Validacao automatica — se o LLM retornar formato errado, o parse falha
- Tipagem TypeScript automatica do retorno

## Vinculacao Carrinho-Mensagem

Uma decisao arquitetural importante: o instrutor adicionou `suggestedByMessageId` na tabela de carrinhos via `ALTER TABLE`. Isso permite:

- Saber qual sugestao do LLM gerou qual carrinho
- Popular mensagens com os carrinhos que ela sugeriu
- Nao perder o contexto do embedding original

O instrutor teve que reordenar a logica: salvar a mensagem ANTES dos carrinhos, para ter o `messageId` disponivel.

## Populacao de Mensagens

O instrutor criou uma funcao `populateMessages` que:

1. Itera sobre as mensagens
2. Se `messageType === 'suggest_cart_result'`, faz query nos carrinhos
3. Faz join com a tabela de lojas para pegar o nome
4. Retorna a mensagem enriquecida com dados dos carrinhos

Cuidado: o map retorna promises, entao e necessario `Promise.all()` antes do `.sort()`.

## Alteracao de Schema em Desenvolvimento

O instrutor optou por `ALTER TABLE` em vez de recriar a migration, admitindo que em producao seria diferente. Para desenvolvimento rapido:

```sql
ALTER TABLE carts ADD COLUMN score INTEGER;
ALTER TABLE carts ADD COLUMN suggested_by_message_id INTEGER;
```

## Debugging do Fluxo

Durante os testes, o instrutor encontrou varios problemas:

1. **404 no confirm** — servico errado sendo chamado
2. **Action not found** — funcao retornando void em vez do resultado
3. **Mensagens desordenadas** — faltava `.sort()` por data
4. **Promise nao resolvida** — `map` com async retorna array de promises, precisa de `Promise.all()`

Cada bug foi resolvido com logs estrategicos e analise do payload retornado.