---
name: rs-full-stack-o-que-e-uma-api-2025
description: "Applies foundational API concepts when building client-server applications in JavaScript. Use when user asks to 'consume an API', 'make HTTP requests', 'connect to a server', 'fetch data', or 'integrate with external service'. Covers client-server model, HTTP methods (GET/POST/PUT/DELETE/PATCH), routes, JSON format, and API communication patterns. Make sure to use this skill whenever the user is working with APIs for the first time or needs guidance on request structure. Not for advanced API design, GraphQL, WebSockets, or backend API creation."
---

# O que é uma API

> Ao consumir APIs, estruture requisições com o método HTTP correto, a rota adequada e dados em JSON, entendendo a relação cliente-servidor.

## Key concept

API (Application Programming Interface) é uma interface que disponibiliza funcionalidades prontas para uso na sua aplicação. O valor central: usar recursos desenvolvidos por terceiros sem precisar implementar a lógica internamente. APIs podem ser locais, de rede ou remotas, gratuitas ou pagas.

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Precisa de dados externos (CEP, clima, cotação) | Buscar uma API que forneça o recurso, consultar documentação |
| Precisa listar/ler dados | Método `GET` |
| Precisa criar um recurso novo | Método `POST` com dados em JSON no body |
| Precisa atualizar completamente um recurso | Método `PUT` com dados completos |
| Precisa atualizar parcialmente (ex: só a foto) | Método `PATCH` com dados parciais |
| Precisa remover um recurso | Método `DELETE` |
| Precisa enviar/receber dados estruturados | Formato JSON (chave-valor) |

## How to think about it

### Anatomia de uma rota

```
https://meuservidor.com.br/produtos
  │          │                    │
  │          │                    └─ Recurso (o que quero acessar)
  │          └─ Endereço do servidor (onde a API está)
  └─ Protocolo de comunicação
```

### Cliente-servidor como via dupla

```
[Sua Aplicação]  ──requisição──▶  [API no Servidor]
   (cliente)     ◀──resposta───     (servidor)
```

A aplicação faz requisições (pedidos) e a API devolve respostas. Exemplo: envio o CEP na requisição, recebo os detalhes do endereço na resposta.

### JSON como idioma comum

```json
{
  "user": {
    "id": 1,
    "name": "Rodrigo Gonzalez"
  },
  "roles": ["admin", "editor"]
}
```

JSON é o "idioma" padrão entre cliente e servidor — assim como português é o padrão no Brasil e inglês nos EUA, porque ambos os lados precisam entender o formato dos dados.

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa de funcionalidade complexa (pagamento, geolocalização) | Procure uma API antes de implementar do zero |
| API tem documentação | Leia a documentação antes de consumir |
| Não sabe qual método HTTP usar | Pergunte: estou lendo, criando, atualizando ou deletando? |
| API retorna erro | Verifique: rota correta? Método correto? Dados no formato JSON? |
| Precisa de recurso em tempo real (cotação) | Busque API que forneça dados atualizados |

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Preciso entender como a API funciona internamente | Só precisa saber COMO usar (rota, método, formato) — a lógica interna é responsabilidade do provedor |
| Toda API é gratuita | Existem APIs pagas, gratuitas e parcialmente gratuitas (freemium) |
| GET e POST são a mesma coisa | Cada método HTTP comunica uma intenção diferente ao servidor |
| PUT e PATCH são iguais | PUT atualiza tudo, PATCH atualiza parcialmente |

## Anti-patterns

| Evite | Faça |
|-------|------|
| Implementar lógica de CEP/endereço do zero | Usar API de CEP (ex: ViaCEP) |
| Enviar dados sem formato padronizado | Usar JSON para comunicação |
| Usar GET para criar recursos | Usar POST para criação |
| Usar POST para buscar dados | Usar GET para leitura |
| Ignorar documentação da API | Sempre consultar docs antes de consumir |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre cliente-servidor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos práticos de consumo de API com fetch e JSON