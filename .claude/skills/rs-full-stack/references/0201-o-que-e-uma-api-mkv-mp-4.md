---
name: rs-full-stack-o-que-e-uma-api
description: "Applies API architecture mental models when designing or explaining client-server systems. Use when user asks to 'create an API', 'build a REST endpoint', 'explain API concepts', 'design client-server architecture', or 'setup routes'. Ensures correct understanding of request-response cycle, route structure, and HTTP protocol. Make sure to use this skill whenever building or discussing APIs in Node.js projects. Not for frontend-only components, database schema design, or deployment configuration."
---

# O que é uma API

> Uma API separa a logica de negocio (back-end) da interface (front-end), expondo funcionalidades via rotas HTTP sem exigir que o consumidor saiba como foram implementadas.

## Key concept

API significa Application Programming Interface — uma interface que disponibiliza funcionalidades para serem consumidas por qualquer cliente (web, mobile, desktop) sem que o cliente precise conhecer a implementacao interna. O cliente envia uma requisicao, a API processa no servidor e retorna uma resposta.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Front-end precisa de dados ou acoes do back-end | Criar rota na API que recebe requisicao e retorna resposta |
| Multiplas plataformas (web + mobile) consomem mesma logica | Extrair logica para uma API unica consumida por todos os clientes |
| Cliente aguardando resposta | Sempre retornar uma resposta (sucesso ou erro), nunca deixar sem resposta |
| Definindo como cliente se conecta ao servidor | Usar rotas HTTP com URLs especificas para cada funcionalidade |

## How to think about it

### Analogia do restaurante

O cliente (usuario) faz um pedido ao garcom (API), que conhece o cardapio e sabe processar. O garcom leva o pedido a cozinha (servidor), que prepara e devolve o prato pronto (resposta). O garcom sempre volta com algo — mesmo que seja "esse prato nao esta disponivel".

### Estrutura de uma URL de API

```
https://meu-servidor.com.br/products
|____| |_____________________| |______|
protocolo   endereco servidor     rota
```

- **Protocolo:** HTTP/HTTPS — padrao de comunicacao cliente-servidor (HTTPS = com criptografia)
- **Endereco:** onde o servidor esta hospedado
- **Rota:** ponto de extremidade que associa uma URL a uma funcao especifica

### Fluxo requisicao-resposta

```
Cliente (front-end)
    │
    ├── Requisicao (ex: POST /patients com dados)
    ▼
   API (garcom)
    │
    ├── Processa no servidor (ex: salva no banco)
    ▼
  Resposta (sucesso ou erro)
    │
    └── Retorna ao cliente
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| API e front-end sao a mesma coisa | API e back-end separado — front-end apenas consome |
| Se deu erro, nao precisa responder | API sempre deve retornar resposta, mesmo negativa, senao o cliente fica aguardando ate timeout |
| API so serve para aplicacoes web | Qualquer cliente pode consumir: web, mobile, desktop, outro servidor |
| Preciso saber como a API foi feita para usa-la | O consumidor so precisa conhecer as rotas e o formato de comunicacao |

## When to apply

- Ao iniciar qualquer projeto que separe front-end de back-end
- Ao definir a arquitetura de comunicacao entre cliente e servidor
- Ao criar endpoints em Node.js (Express, Fastify, etc.)
- Ao explicar para alguem como funciona a comunicacao web

## Limitations

- Este modelo cobre APIs REST sobre HTTP — nao se aplica diretamente a WebSockets, GraphQL ou gRPC sem adaptacoes
- A analogia do restaurante simplifica: APIs reais lidam com autenticacao, rate limiting, versionamento e outros concerns

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias expandidas e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos de codigo com variacoes de rotas e requisicoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0201-o-que-e-uma-api-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0201-o-que-e-uma-api-mkv-mp-4/references/code-examples.md)
