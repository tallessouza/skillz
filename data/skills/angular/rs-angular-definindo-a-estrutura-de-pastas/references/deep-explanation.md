# Deep Explanation: Estrutura de Pastas Angular — Feature Based Components

## Por que 4 camadas e nao 3?

O instrutor inicialmente trabalhou com 3 camadas (Feature, Core, Shared) seguindo a convencao classica do Angular. O problema surgiu quando o TaskService (que mora no Core por ser singleton) precisou importar a interface ITask, que naturalmente moraria dentro da Feature de tasks.

Isso criou uma **dependencia circular**:
- Core → depende de Feature (por causa da interface ITask)
- Feature → depende de Core (por causa do TaskService)

A solucao foi criar a 4a camada: **Domain**. Domain e a camada mais baixa, sem dependencias, e serve como repositorio central de tipos/interfaces/enums.

## A decisao "Core vs Feature" para services

O instrutor destacou que essa decisao e "um pouquinho abstrata" e depende de pratica. O criterio principal:

**Core:** O service gerencia estado que e fonte unica de verdade para TODA a aplicacao. Ele e criado quando a aplicacao inicializa e vive ate o fim.

**Feature:** O service gerencia estado local, criado quando a feature e carregada e destruido quando o usuario sai dela.

No caso do GoTask, o TaskService gerencia TODAS as tarefas (fazendo, feito, concluido) independentemente de qual componente esta ativo. Por isso pertence ao Core.

O instrutor reconheceu que em aplicacoes muito pequenas (como o GoTask com apenas uma feature), a diferenca e sutil. Mas para escalabilidade, a separacao importa.

## Header e WelcomeSection: Shared ou Core?

O instrutor questionou a IA sobre colocar Header e WelcomeSection no Shared, ja que eles NAO sao reutilizaveis. A conclusao:

- **Shared (abordagem pragmatica):** Simplifica imports, mas viola o principio de que shared = reutilizavel
- **Core/layout (abordagem pura):** Trata componentes de layout como parte da fundacao da app, junto com services globais

O instrutor optou pela abordagem pura: core/components/layout/, porque manter o Shared limpo (apenas reutilizaveis) ajuda a escalabilidade.

## Escalando a pasta Domain

Quando a aplicacao cresce e tem muitas interfaces, a Domain pode virar uma bagunca. A solucao: separar por feature dentro do Domain.

```
domain/
├── task/
│   ├── task.model.ts
│   ├── task-form.model.ts
│   └── task-status.enum.ts
├── user/
│   ├── user.model.ts
│   └── user-role.enum.ts
└── comment/
    └── comment.model.ts
```

Cada sub-pasta espelha uma feature, mas contem apenas tipos puros (interfaces, enums, types) — nunca logica.

## Metodologia do instrutor: questionar a IA

O instrutor demonstrou um pattern valioso: nao aceitar a primeira sugestao da IA. Ele:
1. Deu contexto completo ao Gemini
2. Recebeu a proposta inicial
3. Questionou cada decisao (por que TaskService no Core? por que Header no Shared?)
4. Chegou a uma estrutura refinada

A mensagem: use IA como ponto de partida, mas questione ate chegar em um "denominador comum" que faca sentido para o seu caso.

## Regra de dependencia visual

```
Domain (camada 0 — sem dependencias)
   ↑
Core (camada 1 — depende so de Domain)
   ↑
Shared (camada 1 — depende so de Domain)
   ↑
Features (camada 2 — depende de Core, Shared e Domain)
```

Setas NUNCA apontam para baixo. Se apontarem, ha uma violacao de arquitetura.