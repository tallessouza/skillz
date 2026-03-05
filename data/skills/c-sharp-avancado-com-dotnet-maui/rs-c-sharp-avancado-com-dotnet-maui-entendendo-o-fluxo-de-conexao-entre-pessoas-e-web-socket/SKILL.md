---
name: rs-csharp-maui-websocket-flow
description: "Applies WebSocket connection flow patterns when building real-time features in .NET MAUI or mobile apps. Use when user asks to 'implement real-time', 'connect users', 'add websocket', 'bidirectional communication', or 'invite code flow'. Enforces correct understanding of WebSocket vs HTTP lifecycle, connection persistence, and client-only disconnection. Make sure to use this skill whenever designing real-time communication between mobile clients and APIs. Not for REST API design, HTTP-only endpoints, or database schema work."
---

# Fluxo de Conexao WebSocket para Comunicacao em Tempo Real

> Quando a API precisa enviar mensagens sem ser perguntada, use WebSocket — HTTP e passivo e unidirecional.

## Conceito central

HTTP funciona como request-response: cliente pergunta, API responde, conexao morre. WebSocket mantem conexao persistente e bidirecional — ambos os lados enviam mensagens a qualquer momento.

## Rules

1. **Use WebSocket quando a API precisa iniciar comunicacao** — no HTTP a API e passiva e so responde a requests, porque o protocolo nao suporta server-push nativo
2. **Conexao WebSocket comeca com HTTP handshake, depois faz upgrade** — o handshake inicial e HTTP, depois o protocolo muda para WS/WSS, porque o upgrade e parte da spec WebSocket
3. **Somente o cliente pode encerrar a conexao** — a API nao consegue fechar uma conexao WebSocket aberta, porque o protocolo atribui controle de lifecycle ao cliente
4. **WebSocket trabalha com mensagens, nao request-response** — nao existe conceito de "resposta" no WebSocket, ambos os lados enviam mensagens independentes, porque o modelo e bidirecional
5. **Conexao persiste ate o cliente desconectar** — apos o handshake, a conexao fica aberta indefinidamente, porque WebSocket e um canal persistente
6. **Use WSS (WebSocket Secure) em producao** — assim como HTTPS, WSS criptografa a comunicacao, porque dados em transito precisam de protecao

## Quando usar WebSocket vs HTTP

| Cenario | Protocolo | Motivo |
|---------|-----------|--------|
| CRUD simples (criar, ler, atualizar, deletar) | HTTP | Request-response e suficiente |
| Notificacao em tempo real | WebSocket | API precisa enviar sem ser perguntada |
| Fluxo de convite/aprovacao entre usuarios | WebSocket | Ambos os lados trocam mensagens |
| Upload de arquivo | HTTP | Operacao unica, sem persistencia |
| Chat ou mensageria | WebSocket | Comunicacao bidirecional continua |

## Fluxo de conexao entre pessoas (padrao convite)

### Passo 1: Gerar codigo
```
Cliente A → HTTP POST /api/invite → API gera codigo associado ao usuario A
API retorna codigo (ex: "1234") → Cliente A exibe na tela
```

### Passo 2: Digitar codigo
```
Cliente B → WebSocket mensagem: { code: "1234", token: "auth-B" }
API valida codigo → encontra associacao com usuario A
```

### Passo 3: Notificar via WebSocket
```
API → WebSocket mensagem para Cliente A: { requestFrom: "Usuario B", action: "connect" }
Cliente A exibe popup: aceitar ou rejeitar
```

### Passo 4: Resposta em tempo real
```
Cliente A → WebSocket mensagem: { accepted: true }
API processa → WebSocket mensagem para Cliente B: { status: "approved" }
```

## Lifecycle HTTP vs WebSocket

### HTTP
```
1. Conexao TCP (handshake)
2. Cliente envia REQUEST
3. API devolve RESPONSE
4. FIM da conexao
-- Proxima requisicao? Repete tudo do zero --
```

### WebSocket
```
1. Conexao TCP (handshake via HTTP)
2. Upgrade de protocolo: HTTP → WS/WSS
3. Cliente envia mensagem ↔ API envia mensagem (bidirecional)
4. ... tempo passa, conexao permanece aberta ...
5. Somente o cliente solicita FIM da conexao
```

## Heuristics

| Situacao | Faca |
|----------|------|
| API precisa notificar cliente sem request | WebSocket |
| Comunicacao e one-shot (envia e esquece) | HTTP |
| Dois usuarios precisam interagir em tempo real | WebSocket com canal por sessao |
| Cliente perde internet | Conexao morre naturalmente, implemente reconexao |
| Precisa fechar conexao programaticamente | Chame stop/close no cliente, nunca na API |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Polling HTTP para simular tempo real | Abra conexao WebSocket |
| Tentar fechar conexao pelo lado da API | Sinalize ao cliente para ele fechar |
| Misturar request-response com WebSocket | Use mensagens puras no WebSocket |
| Abrir nova conexao WebSocket a cada mensagem | Reutilize a conexao persistente |
| Usar WS sem criptografia em producao | Use WSS (WebSocket Secure) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
