# Deep Explanation: Entidade de Notificacao e Subdominios DDD

## Por que subdominos replicam estrutura

O instrutor enfatiza que os subdominios "quase vao existir de forma independente". Isso significa que `domain/notification/` replica a mesma hierarquia de `domain/forum/` — nao por burocracia, mas porque quando voce eventualmente separar em microservicos, cada subdominio ja esta pronto para ser extraido sem dependencias cruzadas.

## A analogia da barbearia

Uma das explicacoes mais poderosas da aula: quando voce pergunta a um barbeiro sobre as pessoas envolvidas no negocio, ele nao diz "o usuario chega, o usuario atende o outro usuario". Ele diz "o **cliente** chega, e atendido por um **barbeiro**, o **fornecedor** entrega os produtos".

Isso ilustra o conceito de **Ubiquitous Language** do DDD — cada contexto tem seu proprio vocabulario. No subdominio de notificacoes, quem recebe a notificacao e um **recipiente** (recipient), nao um "usuario".

## Desenvolver como se o outro subdominio nao existisse

O instrutor e explicito: "eu nao posso criar esse servico de notificacao pensando nas coisas que ja existem dentro do forum". Isso e fundamental porque:

1. **Desacoplamento real** — se voce referencia entidades do forum, criou acoplamento
2. **Preparacao para microservicos** — em microservicos, o servico de notificacao literalmente nao sabe que o forum existe
3. **Integracao via Domain Events** — a comunicacao entre subdominios vem depois, atraves de eventos, nao de imports diretos

## O padrao static create

O `static create()` nao e apenas conveniencia. Ele serve para:

- Gerar `createdAt` automaticamente quando e uma notificacao nova
- Aceitar `id` quando esta reconstituindo uma entidade do banco de dados
- Manter o construtor da classe base Entity limpo e consistente

## readAt como campo opcional

`readAt?: Date | null` representa um estado — a notificacao pode nunca ser lida. Isso e diferente de `createdAt` que sempre existe. O `null` explicito comunica que "verificamos e ainda nao foi lida", enquanto `undefined` significaria "nao sabemos".