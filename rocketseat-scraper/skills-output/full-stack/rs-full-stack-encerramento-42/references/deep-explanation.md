# Deep Explanation: Query Builder — Resumo do Módulo

## Raciocínio do instrutor

O módulo de Query Builder foi intencionalmente isolado do projeto principal. O instrutor separou o estudo do Knex em uma API Node simples para que o aluno pudesse focar exclusivamente no Query Builder sem se preocupar com a complexidade de uma aplicação completa.

Essa abordagem pedagógica — estudar a ferramenta isoladamente antes de aplicá-la em projeto — é uma prática comum nos cursos Rocketseat. O próximo módulo conecta esse conhecimento a um projeto real.

## O que é um Query Builder

Um Query Builder é uma camada de abstração entre o código da aplicação e o SQL puro. Em vez de escrever strings SQL diretamente, o desenvolvedor usa métodos encadeados que geram o SQL correspondente.

A vantagem não é apenas sintática — o Query Builder:
1. **Previne SQL injection** por padrão (parâmetros são escapados automaticamente)
2. **Oferece portabilidade** entre bancos de dados (mesma API para PostgreSQL, MySQL, SQLite)
3. **Facilita composição dinâmica** de queries (adicionar WHERE condicionalmente, por exemplo)
4. **Integra com TypeScript** para type-safety nas queries

## Migrations como versionamento do banco

O instrutor enfatizou que migrations são a forma de "versionar a evolução do banco de dados". A analogia correta é: migrations estão para o schema do banco assim como commits estão para o código.

Cada migration é um arquivo com timestamp que descreve:
- **up()**: a mudança a ser aplicada (criar tabela, adicionar coluna)
- **down()**: como reverter essa mudança (dropar tabela, remover coluna)

Isso permite que qualquer desenvolvedor da equipe reproduza o estado exato do banco executando as migrations na ordem correta.

## Hierarquia de abstrações de banco

O instrutor posiciona o Query Builder como meio-termo entre SQL puro e ORM:

| Nível | Ferramenta | Trade-off |
|-------|-----------|-----------|
| Baixo | SQL puro | Máximo controle, zero abstração, vulnerável a injection |
| Médio | Query Builder (Knex) | Bom controle, abstração de SQL, seguro por padrão |
| Alto | ORM (Prisma, TypeORM) | Mapeamento objeto-relacional, menos controle de queries |

O Query Builder é a escolha ideal quando se precisa de controle sobre as queries mas não se quer lidar com strings SQL.

## Conexão com o próximo módulo

O instrutor deixa claro que o próximo passo é criar uma aplicação real utilizando o Knex. O módulo atual foi preparatório — focado em conceitos e API do Query Builder. O módulo seguinte aplica esse conhecimento em um projeto com rotas, controllers e regras de negócio.