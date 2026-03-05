# Deep Explanation: Abertura — API de Restaurante

## Por que reunir tudo em um projeto?

O instrutor enfatiza que ate este ponto do curso, os alunos aprenderam cada peca isoladamente:

1. **Banco de dados** — como criar tabelas, relacionamentos, migrations
2. **Query Builder** — como construir queries de forma programatica sem SQL raw
3. **Express** — como criar rotas, middlewares, controllers

O problema de aprender isoladamente e que o aluno nao sabe como conectar as pecas. Este projeto existe para resolver exatamente isso: forcar a integracao de todos os conhecimentos em uma aplicacao real.

## A filosofia "do zero"

O instrutor diz explicitamente "vamos desenvolver uma nova aplicacao do zero". Isso significa:

- Nao usar boilerplate pronto
- Configurar cada camada manualmente
- Entender cada decisao de arquitetura
- Sentir a dor de montar tudo para valorizar frameworks/geradores no futuro

## O que esperar das proximas aulas

A abertura nao revela detalhes do projeto propositalmente. O instrutor usa a tecnica de "teaser" — cria curiosidade para manter engajamento. Na proxima aula serao revelados:

- Quais entidades o restaurante tera
- Quais rotas/endpoints serao implementados
- Quais regras de negocio existem
- Como os dados se relacionam

## Mental model: API como camadas

```
[Cliente HTTP] → [Express Routes] → [Controllers] → [Query Builder] → [Database]
     ↑                                                                      |
     └──────────────────── Response ←──────────────────────────────────────┘
```

Cada camada tem uma responsabilidade unica:
- **Routes**: Mapear URL + metodo HTTP para um controller
- **Controllers**: Orquestrar logica de negocio
- **Query Builder**: Traduzir operacoes de negocio em queries
- **Database**: Persistir e recuperar dados