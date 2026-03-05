# Deep Explanation: Setup OpenAI com Structured Outputs

## Por que usar responses.parse em vez de responses.create

O metodo `.parse()` e um wrapper do SDK da OpenAI que integra diretamente com Zod. Quando voce passa um schema via `zodTextFormat`, o SDK:
1. Converte o schema Zod para JSON Schema automaticamente
2. Envia para a API como formato de resposta esperado
3. Parseia o retorno e popula `response.outputParsed` ja tipado
4. Se o parsing falhar, `outputParsed` sera `null` em vez de lancar erro

Isso elimina completamente a necessidade de `JSON.parse()` manual e os bugs associados.

## Por que discriminatedUnion em vez de optional

O instrutor descobriu na pratica que a OpenAI nao lida bem com campos `optional` no schema. Quando voce usa `z.optional()`, a AI pode ou nao preencher o campo de forma imprevisivel. Com `discriminatedUnion`, cada variante tem um formato fixo — a AI e forcada a escolher um `type` e preencher exatamente os campos daquela variante.

Isso tambem melhora o TypeScript: ao checar `action.type === 'suggest_cards'`, o TS automaticamente sabe que `action.payload.input` existe.

## Estrategia de prompt do instrutor

O prompt foi construido iterativamente. Pontos-chave que o instrutor descobriu:

1. **AI pergunta demais por padrao** — Sem instrucao explicita, a AI quer saber detalhes como "chocolate meio amargo ou ao leite?" antes de sugerir um carrinho. A solucao foi adicionar: "nao precisa ir a fundo em detalhes, sugira ingredientes basicos"

2. **Separacao clara de acoes** — O prompt define exatamente quando usar `send_message` (conversar, pedir mais info) vs `suggest_cards` (so quando tem TODAS as informacoes). Isso evita que a AI dispare sugestoes prematuras.

3. **Campo `input` como contexto enriquecido** — O `input` dentro de `suggest_cards` nao e a mensagem pro usuario, e uma descricao contextualizada do pedido que sera usada depois para embedding e calculo de relevancia de produtos. Isso separa a comunicacao com o usuario da comunicacao interna do sistema.

## ngrok para webhooks locais

A OpenAI precisa fazer requisicoes HTTP para sua API quando eventos acontecem (como `batch_completed`). Em desenvolvimento local, sua API so roda em `localhost:3000`, inacessivel externamente. O ngrok cria um tunel publico:

```
Internet → https://abc123.ngrok.io → localhost:3000
```

Registre o webhook como `https://abc123.ngrok.io/webhooks/openai` — endpoint especifico para nao expor toda a API.

## Arquitetura de servico no NestJS

O instrutor optou por criar `LLMService` como um simples `@Injectable()` em vez de um modulo separado. A justificativa: para um projeto mais robusto, um modulo separado permitiria configurar versoes fake (para testes) vs real (para producao) via DI. Mas para o escopo do curso, um service direto e suficiente.

O service e registrado como provider no `ChatModule` e injetado no `ChatService` via constructor injection padrao do NestJS.

## Variaveis de ambiente necessarias

| Variavel | Uso |
|----------|-----|
| `OPENAI_API_KEY` | Autenticacao do cliente OpenAI |
| `OPENAI_WEBHOOK_SECRET` | Validacao de webhooks recebidos da OpenAI |

Ambas configuradas no `.env` e acessadas via `ConfigService` do NestJS.