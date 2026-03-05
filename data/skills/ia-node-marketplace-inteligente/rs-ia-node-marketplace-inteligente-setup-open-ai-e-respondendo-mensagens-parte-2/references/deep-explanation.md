# Deep Explanation: Chat Message Flow com Ações

## Por que passar o histórico de mensagens?

O instrutor explica que quando o usuário envia uma mensagem, pode não ser a primeira do chat. Sem o contexto das mensagens anteriores, o LLM não consegue identificar corretamente as ações. A API da OpenAI suporta `previous_response_id` que encadeia as respostas, mantendo o contexto completo da conversa.

### Teste com null

O instrutor testou explicitamente se a OpenAI aceita `null` no campo `previous_response_id` (caso da primeira mensagem). Resultado: aceita sem erro. Isso simplifica o código — não precisa de condicional para omitir o campo.

## Arquitetura de ações

O modelo mental é: cada mensagem do assistente **pode** ter uma ação vinculada. A ação não é da mensagem do usuário — é gerada pelo LLM como resposta. Isso é importante porque:

1. A ação é um "efeito colateral" da resposta do LLM
2. No frontend, diferentes tipos de ação renderizam layouts diferentes
3. A ação passa por um ciclo: criada → confirmada → executada

### Ciclo de vida da ação

```
LLM identifica ação → Salva com created_at
→ Usuário confirma → confirmed_at
→ Sistema executa → executed_at
```

Cada etapa tem seu timestamp. Na aula, só a criação é implementada. A confirmação vem na próxima etapa.

## Por que JSON stringificado no payload?

O instrutor optou por `JSON.stringify()` no payload porque diferentes tipos de ação (suggest_cart, etc.) têm payloads com estruturas diferentes. Em vez de tipar fortemente no banco com colunas específicas, um campo JSON genérico permite flexibilidade. O instrutor diz: "todas as autorizações a gente stringifica dessa mesma forma aqui dentro do payload".

## LEFT JOIN com CASE WHEN

A query de leitura usa LEFT JOIN porque nem toda mensagem tem ação. O CASE WHEN evita retornar objetos vazios — se não há ação, retorna `null`. Isso facilita o frontend: `if (message.action)` é suficiente.

## Estrutura do response montado

```json
{
  "section": {
    "messages": [
      {
        "id": 1,
        "content": "Quero preparar um bolo de chocolate",
        "action": null
      },
      {
        "id": 2,
        "content": "Você solicitou preparar um bolo de chocolate. Confirmação para montar o carrinho.",
        "action": {
          "type": "suggest_cart",
          "payload": "{\"input\": \"ingredientes do bolo de chocolate...\"}",
          "created_at": "...",
          "confirmed_at": null,
          "executed_at": null
        }
      }
    ]
  }
}
```

## Validação no teste

O instrutor criou testes separados: um para mensagem simples (só texto) e outro para mensagem que gera ação. No teste de ação, a expectativa é que a mensagem do assistente tenha a property `action` com tipo `suggest_cart`. O banco é limpo entre testes.