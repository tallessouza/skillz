# Deep Explanation: Feature-Based Components no Angular

## Por que nao organizar por tipo?

O instrutor explica que a forma mais comum e didatica de organizar projetos Angular e por tipo: criar uma pasta `components/`, outra `services/`, outra `pipes/`. Quando voce cria um componente, pensa "e um componente, vai pra pasta components". Quando cria um service, vai pra `services/`.

O problema: em projetos grandes, voce acaba com 50 componentes numa unica pasta, 20 services em outra. Fica dificil dar manutencao porque as responsabilidades estao todas juntas sem contexto de dominio.

## O que e Feature-Based Components?

E um design pattern de organizacao de pastas onde voce agrupa arquivos por funcionalidade (feature) do sistema, nao por tipo tecnico. Tudo relacionado a uma feature fica junto: seus componentes, services, pipes, interfaces.

## Core vs Shared — qual a diferenca?

- **Core**: coisas que existem uma unica vez na aplicacao — layout (header, sidebar, footer), services globais (auth, http interceptors), interfaces base. Core e o "esqueleto" da app.
- **Shared**: coisas reutilizaveis que podem aparecer em multiplas features — componentes genericos (botao, modal, input customizado), pipes, directives.

A diferenca chave: Core = singleton, Shared = reutilizavel.

## Feature vs Tela

O instrutor destaca que uma feature nao e necessariamente uma tela. Uma feature e uma funcionalidade de dominio. Por exemplo, "tasks" e uma feature que pode ter multiplas telas (lista de tasks, formulario de criacao, detalhe da task).

## Regras de dependencia

As pastas tem uma hierarquia de dependencia unidirecional:
- `core/` nao depende de ninguem
- `shared/` pode depender de `core/`
- `features/` podem depender de `core/` e `shared/`
- Features idealmente nao dependem umas das outras

Isso cria um fluxo limpo onde mudancas em uma feature nao quebram outras.

## Angular 20 e a remocao de sufixos

Na versao 20 do Angular, os sufixos `.component.ts`, `.service.ts`, `.pipe.ts` foram removidos dos nomes de arquivo. Isso torna a organizacao por tipo ainda mais problematica — sem o sufixo no nome, voce perde o unico indicador de "o que e isso". Com feature-based, a pasta ja da o contexto.

## Expectativa do instrutor sobre aprendizado

O instrutor enfatiza que e normal ter duvidas, que ele mesmo nao se considera especialista, e que voce aprende aos poucos com tentativa e erro. O "feeling" de como estruturar projetos vem com a pratica de criar projetos bons e projetos nao tao bem estruturados.

## Exemplo pratico: Go Task

O projeto Go Task (feito no modulo anterior) sera refatorado para a estrutura feature-based:
- `core/` — interfaces, layout, services globais
- `domain/tasks/` — enums, interfaces, types do dominio
- `features/tasks/` — componentes e logica especifica de tasks
- `shared/` — elementos reutilizaveis