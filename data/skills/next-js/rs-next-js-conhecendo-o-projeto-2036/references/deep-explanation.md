# Deep Explanation: Pet Shop Dashboard — Conhecendo o Projeto

## Filosofia do projeto

O instrutor enfatiza que, apesar do dashboard parecer simples visualmente, ele serve como veiculo para ensinar conceitos avancados. A simplicidade do dominio (agendamentos) permite focar em profundidade tecnica em vez de complexidade de negocio.

> "Por mais que ele pareca simples, a gente vai conseguir abordar muita coisa massa e muita coisa avancada tambem."

## Por que esta stack?

### Next.js App Router (ultima versao)
O projeto usa a versao mais recente do Next.js deliberadamente. O App Router habilita Server Components por padrao e Server Actions como mecanismo de mutacao — substituindo a necessidade de API routes para operacoes CRUD simples.

### Tailwind + ShadCN (com componentes manuais)
O instrutor faz questao de destacar que, embora ShadCN seja usado para componentes base, tambem serao criados componentes na mao. Isso indica uma abordagem equilibrada: aproveitar o ecossistema sem depender exclusivamente dele.

> "A gente vai utilizar tambem a ShadCN para a gente utilizar os componentes e aproveitar algumas coisas de la tambem. Mas a gente vai criar componentes na mao, entao pode ficar tranquilo."

### Server Actions — Introducao gradual
Este e um ponto pedagogico importante. O instrutor reconhece que Server Actions podem ser novidade para muitos e propoe uma abordagem incremental:

> "Talvez pra voce seja novidade, mas aqui eu quero trazer de uma forma mais simples inicialmente para a gente comecar a entender e a medida que as aulas vao progredindo a gente comecar a avancar um pouquinho nessas server actions e o que elas resolvem de fato."

A estrategia e: comecar com uso simples de Server Actions e ir aumentando a complexidade conforme o entendimento cresce.

### Prisma + Postgres + Docker
Stack classica para projetos Next.js full-stack. Prisma fornece type-safety no acesso ao banco, Postgres e o banco relacional padrao, e Docker garante que o ambiente local seja reproduzivel sem instalar Postgres na maquina.

## Organizacao por sessoes

O dashboard organiza agendamentos em tres periodos: manha, tarde e noite. Isso implica:
- Regras de horario para classificar cada agendamento em sua sessao
- Filtro de data como mecanismo principal de navegacao
- UI que agrupa visualmente os agendamentos por periodo

## Escopo funcional completo

O projeto cobre o CRUD completo:
1. **Leitura** — Dashboard com listagem filtrada por data
2. **Criacao** — Tela dedicada para novo agendamento
3. **Edicao** — Modificar agendamentos existentes
4. **Remocao** — Deletar agendamentos
5. **Filtro** — Selecao de data para visualizacao

Alem disso, ha versao mobile (MOBO), indicando responsividade como requisito.

## Principio pedagogico central

A simplicidade do dominio e intencional. Um dashboard de agendamentos e familiar o suficiente para nao exigir explicacao de regras de negocio complexas, liberando tempo para aprofundar em:
- App Router e seus patterns
- Server Actions e quando usa-las
- Prisma como ORM type-safe
- Docker para desenvolvimento local
- Tailwind + ShadCN para UI produtiva