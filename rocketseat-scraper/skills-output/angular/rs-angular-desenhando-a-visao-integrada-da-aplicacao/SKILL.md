---
name: rs-angular-visao-integrada-aplicacao
description: "Generates integrated view diagrams mapping component-to-component and component-to-service relationships in Angular applications. Use when user asks to 'document architecture', 'map dependencies', 'visualize component flow', 'draw integration diagram', or 'understand app structure'. Applies hierarchical mapping: components call components, components inject services, services manage state. Make sure to use this skill whenever planning or documenting Angular application architecture. Not for UML class diagrams, database schemas, or infrastructure diagrams."
---

# Visao Integrada da Aplicacao

> Desenhe um mapa hierarquico que liga cada componente aos componentes filhos e aos services que injeta, revelando o fluxo completo de chamadas e dependencias.

## Rules

1. **Comece pelo AppComponent e desca hierarquicamente** — `AppComponent → HeaderComponent, MainContentComponent → ...`, porque a arvore visual precisa espelhar a arvore real de componentes
2. **Diferencie componentes de services visualmente** — componentes sao nos da arvore, services sao dependencias injetadas, porque confundir os dois obscurece a separacao de responsabilidades
3. **Pare o fluxo quando nao houver mais filhos nem injecoes** — se um componente nao chama nenhum outro componente nem service, o fluxo dele termina ali, porque nos folha nao precisam de ramificacao
4. **Services que abrem modais devem apontar para os componentes modais** — `ModalControllerService → TaskFormModalComponent, TaskCommentsModalComponent`, porque modais sao componentes instanciados via service
5. **Nomeie services pela responsabilidade unica** — `TaskService` (fonte de verdade), `ModalControllerService` (abertura unificada de modais), porque o nome revela a separacao de responsabilidades
6. **Anote nos services os metodos e dados principais** — no `TaskService`: listas por status (toDo, doing, done) + metodos CRUD, porque isso transforma o diagrama de visual em documentacao util

## How to write

### Formato texto (quando nao ha ferramenta visual)

```
AppComponent
├── HeaderComponent (sem filhos, sem services)
├── MainContentComponent
│   ├── WelcomeSectionComponent
│   │   ├── [injeta] TaskService
│   │   └── [injeta] ModalControllerService
│   │       ├── TaskFormModalComponent
│   │       └── TaskCommentsModalComponent
│   └── TaskListSectionComponent
│       ├── [injeta] TaskService
│       └── TaskCardComponent
│           ├── [injeta] TaskService
│           └── [injeta] ModalControllerService
```

### Anotacao de service

```
TaskService
  - listas: toDo[], doing[], done[]
  - metodos: create, updateStatus, delete, edit, updateComments

ModalControllerService
  - abre: TaskFormModalComponent, TaskCommentsModalComponent
```

## Example

**Before (sem visao integrada):**
```
Componentes: AppComponent, HeaderComponent, MainContentComponent,
WelcomeSectionComponent, TaskListSectionComponent, TaskCardComponent
Services: TaskService, ModalControllerService
```
Impossivel entender quem chama quem.

**After (com visao integrada):**
```
AppComponent
├── HeaderComponent
└── MainContentComponent
    ├── WelcomeSectionComponent
    │   ├── [injeta] TaskService (criar tarefa)
    │   └── [injeta] ModalControllerService (abrir modal de criacao)
    └── TaskListSectionComponent
        ├── [injeta] TaskService (atualizar status ao mover entre colunas)
        └── TaskCardComponent
            ├── [injeta] TaskService (deletar, editar, gerenciar comentarios)
            └── [injeta] ModalControllerService (abrir modal de edicao/comentarios)
```
Fluxo de dados e dependencias ficam imediatamente claros.

## Heuristics

| Situacao | Acao |
|----------|------|
| Componente so exibe dados sem interacao | Nao precisa de service, fluxo termina |
| Multiplos componentes injetam o mesmo service | Marcar o service como fonte unica de verdade |
| Modal aberto por mais de um componente | Centralizar abertura num ModalControllerService |
| Componente precisa alterar estado global | Injetar o service responsavel, nunca passar dados por chain de inputs |
| Diagrama ficou com mais de 4 niveis | Considerar refatorar componentes intermediarios |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Listar componentes e services sem conexoes | Desenhar a arvore com setas de chamada |
| Omitir services dos componentes | Anotar `[injeta]` em cada componente que usa DI |
| Misturar fluxo de dados com fluxo de navegacao | Manter visao integrada focada em chamadas/injecoes |
| Deixar services sem anotacao de metodos | Listar metodos e dados principais de cada service |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
