# Deep Explanation: Estrutura de Projeto .NET com Solution Compartilhada

## Por que mesma Solution?

O instrutor (Ellison) explica que a decisao de colocar API e aplicativo mobile na mesma Solution vem de um principio pratico: **evitar duplicacao de codigo**. Em .NET, o sistema de tipos converte classes em JSON automaticamente. Se API e app compartilham as mesmas classes de request/response (projeto Communication), nao faz sentido manter duas copias.

A analogia central: "E tudo .NET, e tudo C Sharp, todos os projetos fazem parte do mesmo contexto." Se os projetos se comunicam entre si (app envia request para API, API devolve response para app), eles pertencem ao mesmo contexto e devem compartilhar codigo.

## Pipeline com Path Filter — A resposta para a duvida mais comum

O instrutor menciona que a pergunta mais frequente que recebe e: "Se tudo esta na mesma Solution, como controlar os pipelines?"

A resposta esta nos **path filters** dos pipelines (GitHub Actions, Azure DevOps, etc.):

- O trigger nao e apenas "houve commit na master"
- E "houve commit na master **E** foi dentro de uma pasta especifica"
- Alem disso, voce pode usar `!` para excluir arquivos (ex: `!**/README.md`)

O instrutor mostra um exemplo real do proprio GitHub — dois pacotes NuGet publicados automaticamente, cada um com pipeline independente usando path filters diferentes (`src/PinCodes/**` vs `src/MauiDays/**`).

## Pasta shared vs backend

A separacao em pastas nao e apenas organizacional — e **funcional para pipelines**:

- `src/backend/` — projetos que vao para o servidor (API, Application, Domain, Infrastructure)
- `src/shared/` — projetos referenciados por multiplos targets (Communication, Exception)
- `src/mobile/` — projeto do aplicativo (sera adicionado durante o curso)

### Por que Exception fica em shared?

O instrutor explica uma nuance: ele nao lanca exceptions dentro do aplicativo mobile (usa outro design pattern). Porem, se fosse um projeto Blazor (server-side), as exceptions poderiam ser compartilhadas. Por isso Exception fica em shared — pela **potencialidade** de reuso, nao apenas pelo uso atual.

## Desvantagens reconhecidas

O instrutor e honesto sobre duas desvantagens:

1. **Performance de carregamento** — Solutions com muitos projetos (ex: 100) podem ficar lentas. Porem, e contornavel e geralmente indica que a Solution esta grande demais para um unico contexto.

2. **Permissionamento de times** — Uma Solution = um repositorio Git. Se times separados (ex: time mobile vs time backend) nao podem ver o codigo um do outro, a mesma Solution nao funciona. Nesse caso, repositorios separados sao necessarios.

O instrutor opina que na maioria dos casos, essa restricao de permissionamento "nao faz sentido", mas reconhece que pode ser requisito em algumas empresas.

## Verificacao de SDK

Passo critico antes de abrir qualquer template: `dotnet --version`. O template usa .NET 9, e abrir com SDK incompativel causa erros. O download do SDK esta em download.dotnet.microsoft.com, com instalacao simples (next > next > install).

## Contexto do projeto

O template PlanShare e uma evolucao do projeto CashFlow (trilha anterior). Mantem a mesma arquitetura em camadas (API, Application, Communication, Domain, Exception, Infrastructure) com a adicao da organizacao em pastas backend/shared. O projeto ja contem codigo funcional (controllers para dashboard, login, users) que sera modificado e expandido durante o curso.