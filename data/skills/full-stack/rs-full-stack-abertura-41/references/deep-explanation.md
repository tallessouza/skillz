# Deep Explanation: API de Entregas — Abertura

## Por que essa stack?

O instrutor escolheu essa combinacao de ferramentas porque cada uma resolve um problema especifico no desenvolvimento de APIs modernas:

### Docker
- Garante que o ambiente de desenvolvimento eh identico para todos
- Elimina o classico "funciona na minha maquina"
- Facilita subir o Postgres sem instalar localmente

### PostgreSQL
- Banco relacional maduro, ideal para dados com relacionamentos (pedidos, entregas, usuarios, enderecos)
- Suporte robusto a transacoes — critico para operacoes de delivery onde consistencia importa

### Prisma
- ORM que gera tipos TypeScript a partir do schema do banco
- Migrations automaticas facilitam evolucao do schema
- Query builder type-safe elimina erros de SQL em runtime

### Zod
- Validacao de dados na borda da API (requests)
- Inferencia de tipos TypeScript a partir dos schemas
- Composavel — schemas podem ser combinados e reutilizados

## Filosofia do projeto

O instrutor enfatiza que este projeto reune TUDO que foi aprendido ate o momento no curso. Nao eh um exercicio isolado — eh a integracao de conceitos em um projeto realista e portfolio-ready.

A abordagem eh "do zero" (from scratch), construindo passo a passo, o que significa que cada decisao arquitetural sera explicada e justificada nas aulas seguintes.

## Contexto de delivery/entregas

Uma API de delivery envolve:
- **Pedidos** — criacao, atualizacao de status, cancelamento
- **Entregas** — rastreamento, atribuicao a entregadores
- **Usuarios** — clientes e entregadores com papeis diferentes
- **Enderecos** — origem e destino de cada entrega

Esses dominios criam relacionamentos complexos que justificam o uso de um banco relacional como Postgres.