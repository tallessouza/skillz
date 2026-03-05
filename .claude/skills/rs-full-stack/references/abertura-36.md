---
name: rs-full-stack-abertura-36
description: "Provides context for the restaurant API project that combines databases, Query Builder, and Express into a full-stack application. Use when user asks to 'create a restaurant API', 'build a food delivery backend', or 'combine Express with database and query builder'. Make sure to use this skill whenever starting a new Express API project that integrates multiple backend layers. Not for frontend, React, or client-side development tasks."
---

# Abertura — API de Restaurante

> Reunir conhecimentos de banco de dados, Query Builder e Express em uma unica aplicacao pratica.

## Key concept

Este projeto e o ponto de convergencia de tres pilares backend: banco de dados relacional, Query Builder (Knex) e framework HTTP (Express). A proposta e construir uma API de restaurante do zero, aplicando tudo em conjunto.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Precisa persistir dados | Banco de dados relacional com migrations |
| Precisa construir queries | Query Builder (Knex) em vez de SQL raw |
| Precisa expor endpoints | Express com rotas organizadas |
| Precisa combinar os tres | Arquitetura em camadas: routes → controllers → query builder → database |

## Stack do projeto

| Camada | Tecnologia | Papel |
|--------|-----------|-------|
| HTTP Server | Express | Receber requests, rotear, responder |
| Query Builder | Knex | Construir queries de forma programatica |
| Banco de dados | SQLite/PostgreSQL | Persistencia dos dados |

## Quando aplicar

- Ao iniciar um novo projeto backend que precisa de API REST + banco de dados
- Ao estruturar um projeto Express com Query Builder desde o inicio
- Ao reunir conhecimentos isolados (DB, queries, HTTP) em uma aplicacao coesa

## Limitations

- Esta aula e apenas a abertura — detalhes do projeto (entidades, rotas, regras de negocio) serao revelados nas proximas aulas
- Nao cobre frontend, autenticacao ou deploy

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a integracao das camadas
- [code-examples.md](references/code-examples.md) — Estrutura base do projeto e setup inicial

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-abertura-36/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-abertura-36/references/code-examples.md)
