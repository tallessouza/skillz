---
name: rs-full-stack-o-que-e-uma-api-rest
description: "Applies REST architectural principles when designing or reviewing APIs. Use when user asks to 'create an API', 'design endpoints', 'build a REST API', 'review API design', or 'structure routes'. Enforces client-server separation, stateless requests, resource-based routing, JSON representations, layered architecture, and caching. Make sure to use this skill whenever building or evaluating HTTP APIs. Not for frontend components, database schema design, or authentication flows."
---

# API RESTful — Principios Arquiteturais

> Ao projetar uma API, siga as diretrizes REST para garantir simplicidade, escalabilidade e manutencao.

## Key concept

REST (Representational State Transfer) nao e uma linguagem ou tecnologia — e um conjunto de diretrizes para desenvolver aplicacoes distribuidas que se comunicam usando protocolos web (HTTP). Uma API e considerada RESTful quando cumpre esses principios.

A analogia do restaurante: o cliente (frontend) faz pedidos ao garcom (API), que processa na cozinha (servidor) e devolve a resposta. O cliente nao precisa saber como a cozinha funciona.

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Novo endpoint sendo criado | Resource-based: metodo HTTP + rota descritiva (`POST /products`) |
| Dados trafegando entre client/server | Representacao via JSON (formato de transporte ≠ formato de armazenamento) |
| Tentacao de guardar estado no servidor entre requests | Stateless: cada requisicao carrega todas as informacoes necessarias |
| Dados frequentemente requisitados sem mudanca | Cache: incentive o frontend a reutilizar recursos ja obtidos |
| Arquitetura crescendo em complexidade | Sistema em camadas: separe responsabilidades para manutenibilidade |
| Frontend acoplado ao backend | Client-server: separe interface do usuario do armazenamento/processamento |

## Os 6 principios REST

### 1. Client-Server
Separe a interface do usuario (cliente) das preocupacoes de armazenamento (servidor). O frontend nao sabe como os dados sao armazenados; o backend nao sabe como sao exibidos.

### 2. Stateless
Cada requisicao deve conter todas as informacoes necessarias para ser processada. O servidor nao guarda estado do cliente entre requisicoes.

### 3. Resource-Based
Use metodos HTTP para identificar acoes sobre recursos. A composicao da rota descreve o recurso:

```
POST   /products      → Cadastrar produto (dados no body JSON)
GET    /products      → Listar produtos
GET    /products/:id  → Obter produto especifico
PUT    /products/:id  → Atualizar produto
DELETE /products/:id  → Remover produto
```

### 4. Manipulacao via Representacoes
Recursos sao manipulados por meio de representacoes (JSON), nao diretamente. JSON e o formato de transporte — o banco pode armazenar em tabelas, documentos, etc. A API converte entre representacao e armazenamento.

### 5. Sistema em Camadas
Organize responsabilidades em camadas separadas para alcançar arquitetura eficaz e de facil manutencao (ex: controller → service → repository).

### 6. Cache
Incentive o frontend a reutilizar recursos ja obtidos em vez de repetir requisicoes identicas ao servidor.

## Heuristics

| Situacao | Faca |
|----------|------|
| Projetando nova rota | Nomeie pelo recurso (substantivo), nao pela acao |
| Escolhendo formato de dados | JSON como representacao padrao |
| Cliente precisa de estado | Envie tudo na requisicao (tokens, filtros, paginacao) |
| Resposta raramente muda | Configure cache headers |
| API ficando complexa | Adicione camadas (middleware, services, repositories) |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| REST e uma tecnologia/framework | E um conjunto de diretrizes arquiteturais |
| Toda API HTTP e REST | So e RESTful se seguir os 6 principios |
| JSON e obrigatorio | E a representacao mais comum, mas nao a unica |
| Stateless significa sem autenticacao | Significa que credenciais vem em cada request (ex: JWT no header) |

## When to apply

- Ao criar qualquer API HTTP que sera consumida por frontends (web, mobile)
- Ao revisar design de endpoints existentes
- Ao avaliar se uma API segue boas praticas

## Limitations

- REST nao resolve tudo: real-time (use WebSockets), operacoes complexas em batch, ou GraphQL para queries flexiveis
- Nem toda API precisa ser 100% RESTful — pragmatismo sobre purismo

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes