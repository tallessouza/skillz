# Deep Explanation: Banco de Dados em Memória para Testes de Integração

## Por que não usar banco real nos testes?

O instrutor Wellerson explica com um exemplo prático: ao executar testes de integração sem isolamento, um registro "Rafael" apareceu no banco de dados real. Isso acontece porque o teste lê a connection string do `appsettings.development.json` e opera diretamente no banco de desenvolvimento.

Os problemas vão além de poluir dados:
- **Serviços pagos:** Se o `appsettings.development.json` contém chaves de conexão para serviços que cobram por uso (APIs externas, cloud services), os testes de integração vão consumir esses serviços e gerar custos
- **Dados inconsistentes:** Testes criam dados que interferem no desenvolvimento manual
- **Dependência externa:** Testes falham se o banco real estiver offline

## Como funciona o servidor customizado

O .NET fornece `WebApplicationFactory<Program>` como classe base que representa o servidor onde a API executa. Em vez de implementar um servidor do zero (o instrutor enfatiza: "nem de jeito nenhum, vai dar um trabalhão danado"), a estratégia é herdar dessa classe e sobrescrever apenas o método `ConfigureWebHost`.

A herança permite que o `CustomWebApplicationFactory` mantenha toda a infraestrutura do servidor real, alterando apenas:
1. O ambiente de execução (de "Development" para "test")
2. O provider de banco de dados (de MySQL/SQL Server para InMemory)

## O mecanismo de ambientes do .NET

Quando se usa `builder.UseEnvironment("test")`, o sistema de configuração do .NET automaticamente procura por `appsettings.test.json`. Isso é o "serviço de gestão de dependência" mencionado pelo instrutor — o framework resolve qual arquivo de configuração usar baseado no ambiente ativo.

O nome do ambiente é livre. O instrutor escolhe "test" mas enfatiza: "você pode dar o nome que quiser". O importante é que o nome do arquivo `appsettings.{nome}.json` corresponda.

## Por que remover a ConnectionString do appsettings.test.json

O `appsettings.test.json` é uma cópia do `appsettings.development.json` mas sem a seção `ConnectionStrings`. Isso é proposital: como o banco será em memória, não existe connection string para configurar. Se a connection string permanecesse, o registro original do DbContext (feito em `DependencyInjectionExtension`) tentaria lê-la e falharia.

## O ciclo de vida do banco em memória

1. Testes iniciam → `CustomWebApplicationFactory` cria o servidor
2. Servidor configura DbContext com InMemory provider
3. Testes executam, dados são gravados na memória
4. Todos os testes terminam → servidor é "desligado/matado"
5. Dados em memória são descartados

O instrutor destaca: "Tem algum problema? Nenhum. Isso é proposital." — o descarte dos dados é feature, não bug.

## O problema das Migrations

O instrutor aponta que duas coisas não podem executar no ambiente de teste:
1. O registro do DbContext com `UseMySql`/`UseSqlServer` (no `DependencyInjectionExtension`)
2. A chamada a `MigrateDatabase()`

No código original, existe um `if` que verifica `IsUnitTestEnvironment` lendo uma propriedade do `appsettings`. O instrutor menciona que essa abordagem "funcionar até funciona" mas "não é a melhor forma" — prometendo uma solução melhor na aula seguinte.

## Regra de versionamento de pacotes NuGet

Regra prática enfatizada pelo instrutor: a major version do pacote NuGet deve corresponder à versão do .NET. Projeto em .NET 9 → instalar pacotes que começam com 9.x.x. Isso vale para:
- `Microsoft.EntityFrameworkCore.InMemory`
- `Microsoft.AspNetCore.Mvc.Testing`
- Qualquer pacote do ecossistema Microsoft