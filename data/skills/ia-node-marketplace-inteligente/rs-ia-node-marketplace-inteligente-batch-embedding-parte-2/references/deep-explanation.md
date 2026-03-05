# Deep Explanation: Batch Embedding — Webhook, Storage e Busca por Similaridade

## Por que o bootstrap e o lugar certo para iniciar batch embedding

O instrutor usa `OnApplicationBootstrap` do NestJS para que o CatalogService automaticamente verifique e embedde produtos pendentes ao iniciar a aplicacao. A ideia e que o sistema seja auto-curavel — se novos produtos foram adicionados sem embedding, o proximo restart resolve isso automaticamente.

O detalhe critico e pular isso em ambiente de teste (`NODE_ENV === 'test'`), porque os testes instanciam a aplicacao multiplas vezes e cada instancia dispararia um batch desnecessario na OpenAI, gerando custos e interferencia nos testes.

## O problema do body parser e webhooks

A OpenAI recomenda que o body do webhook chegue como string crua (sem parse) para que a validacao de assinatura funcione corretamente. O NestJS por padrao aplica body parsing JSON em todas as rotas, entao e necessario:

1. Desativar o body parser global no `NestFactory.create` com `{ bodyParser: false }`
2. Criar dois middlewares separados: um `RawBodyMiddleware` para a rota do webhook e um `JsonBodyMiddleware` para todas as outras rotas
3. Configurar via `MiddlewareConsumer` no `AppModule.configure()`

Essa e uma armadilha comum — muitos desenvolvedores esquecem que middlewares de webhook precisam de tratamento especial de body.

## O bug do ID errado — event.id vs event.data.id

O instrutor encontrou um bug real durante a aula: ao processar o webhook, ele pegou `event.id` (que e o ID do evento) em vez de `event.data.id` (que e o ID do batch). O erro da OpenAI foi claro: "expected an id that starts with batch_".

A estrutura do evento de webhook da OpenAI e:
```json
{
  "id": "evt_xxx",        // ID do evento
  "type": "batch.completed",
  "data": {
    "id": "batch_xxx",    // ID do batch — este e o correto
    ...
  }
}
```

## Armazenamento de vetores com pgvector

Para salvar o embedding no PostgreSQL com pgvector:
1. Primeiro fazer `JSON.stringify()` do array de floats
2. Na query SQL, fazer cast para `::vector`

O formato esperado pelo pgvector e uma string tipo `[0.1, 0.2, ...]`, que coincide com o JSON.stringify de um array de numeros.

## Busca por similaridade e threshold de distancia

O instrutor usa um threshold de 0.65 de distancia maxima para filtrar produtos relevantes. Quanto mais proximo de zero, mais similar o produto e ao input. Exemplos da aula com input "bolo de chocolate":

- Chocolate em po: distancia mais baixa (mais similar) ✓
- Fermento: proximo ✓
- Farinha de mandioca: questionavel mas dentro do threshold
- Acucar refinado: dentro do threshold

Os resultados precisam ser ordenados por distancia para que os mais relevantes aparecam primeiro — o instrutor notou durante a aula que os resultados estavam voltando desordenados.

## Ngrok e webhooks em desenvolvimento

O instrutor destaca que ao reiniciar o Ngrok (sem dominio fixo), uma nova URL e gerada e e necessario atualizar no dashboard da OpenAI. Alem disso, o path completo (`/webhooks/openai`) deve ser incluido na URL do webhook, nao apenas o dominio base.

## Idempotencia de webhooks

O instrutor notou que o webhook foi recebido duas vezes (provavelmente por ter salvo o arquivo duas vezes, o que reiniciou o servidor e re-registrou o webhook). Isso reforça a necessidade de implementar idempotencia — verificar se o embedding ja foi salvo antes de processar novamente.

## Timeouts em testes end-to-end

Os testes end-to-end desse projeto fazem chamadas reais a OpenAI e ao banco de dados, entao naturalmente demoram mais. O instrutor aumentou o timeout para 30 segundos, explicando que isso e aceitavel para testes que validam a integracao completa do sistema.