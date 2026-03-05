# Deep Explanation: FluentMigrator — Setup e Introdução

## O que são Migrations

Migrations são scripts que gerenciam a criação e alteração de tabelas e colunas em bancos de dados relacionais. Cada migration tem uma versão (1, 2, 3...) e o sistema compara a última versão executada no banco com a última versão na base de código para saber quais scripts precisam ser executados.

### Versionamento automático

O FluentMigrator (assim como o EF) verifica: "Qual foi o último script executado no banco?" Se o banco está na versão 1, mas o código tem até a versão 3, ele executa as versões 2 e 3 em sequência. Isso elimina o trabalho manual de controlar quais alterações já foram aplicadas.

## Por que múltiplos ambientes importam

O instrutor enfatiza que empresas têm vários ambientes (produção, staging, etc.), cada um com seu próprio banco de dados. Criar tabelas e colunas manualmente em cada ambiente é impraticável:

- **Produção**: dados reais dos clientes
- **Staging**: dados de teste, ambiente igual ao de produção
- Pode haver 3-4 ambientes diferentes

Cada alteração de schema (renomear coluna, deletar coluna, adicionar coluna) precisaria ser replicada manualmente em todos — "misericórdia, não quero nem pensar nisso."

## Por que o instrutor rejeita EF Migrations

O instrutor deixa claro: "Eu adoro o Entity Framework, uso bastante nos meus projetos, nas empresas que eu trabalho, mas eu odeio as migrations do próprio Entity Framework."

### Problemas concretos identificados:

1. **Arquivos extras**: cada migration gera DOIS arquivos (`.cs` + `.Designer.cs`) mais um `ModelSnapshot` que é modificado a cada migration
2. **Código feio e extenso**: uma migration simples pode gerar 80+ linhas de código verboso
3. **Impact no code review**: como o código é confuso, na prática em empresas com pull requests, quando aparece uma migration, as pessoas aprovam sem ler — "é migração, tá aprovado" — e ninguém verifica se está criando tabelas com nomes errados, tipos errados ou colunas desnecessárias

### A analogia do instrutor sobre legibilidade

"FluentMigrator" — fluent vem de fluido. A sintaxe encadeada (fluent syntax) permite que você "leia" a migration como uma frase: Create.Table("Users").WithColumn("Id").AsGuid()... É muito mais fácil de revisar em um PR.

## Arquitetura da solução

A migration é executada no startup da API (`Program.cs`). Quando a API começa a executar:

1. Cria um scope de DI (Dependency Injection)
2. Resolve `IMigrationRunner` do container
3. Chama `ListMigrations()` para preparar o FluentMigrator
4. Chama `MigrateUp()` para executar migrations pendentes

O padrão é colocar a classe `DatabaseMigration` em `Infrastructure/Migrations/` como classe estática, recebendo o `IServiceProvider` como parâmetro.

## Contexto do curso

Esta é a primeira de uma sequência de aulas sobre migrations. O instrutor optou por dividir em aulas menores ("cada aula a gente aprende uma coisinha nova") ao invés de uma aula enorme. Nas próximas aulas, serão criadas as migrations propriamente ditas usando a fluent syntax.