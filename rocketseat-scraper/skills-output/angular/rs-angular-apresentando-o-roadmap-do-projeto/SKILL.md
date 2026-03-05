---
name: rs-angular-roadmap-gotask
description: "Applies the GoTask project development roadmap methodology when building Angular 19 applications. Use when user asks to 'create an Angular project', 'plan a task manager', 'structure a frontend project', or 'build a kanban board'. Enforces the 5-phase approach: base setup, layout-first with hardcoded values, data flow design, logic implementation, then persistence. Make sure to use this skill whenever planning or scaffolding an Angular project from scratch. Not for backend APIs, database design, or non-Angular frameworks."
---

# Roadmap de Projeto Angular — Metodologia GoTask

> Estruture projetos Angular em 5 fases sequenciais: setup base, layout primeiro, fluxo de dados, logica, persistencia.

## Conceito central

Projetos frontend bem-sucedidos seguem uma ordem especifica de construcao. Comecar pela logica antes do layout gera retrabalho. Comecar pelo layout sem definir fluxo de dados gera acoplamento. A ordem correta e: estrutura → visual → arquitetura de dados → logica → persistencia.

## As 5 fases

### Fase 1: Criacao do projeto base
- Criar projeto Angular 19
- Instalar Angular Material
- Configurar Prettier
- Deixar o projeto base bem estruturado antes de qualquer feature

### Fase 2: Layout dos componentes (Mobile First)
- Criar o layout de TODOS os componentes com valores hardcoded ("chumbados")
- Nenhuma logica nesta fase — apenas visual
- Aplicar conceitos de Mobile First e Tailwind
- Garantir responsividade antes de adicionar comportamento

### Fase 3: Definicao do fluxo de dados
- Fase teorica e de documentacao (usar Miro ou similar)
- Desenhar quais componentes chamam quais componentes
- Definir fluxo de dados entre componentes e services
- Objetivo: evitar acoplamento, facilitar manutencao e extensibilidade futura

### Fase 4: Logica dos componentes
- Dar vida ao projeto: criar, editar, excluir tarefas
- Adicionar/remover comentarios
- Drag and drop entre colunas
- Modais com Angular Material Dialog
- Passagem de dados entre classe e template
- Injecao de services nos componentes

### Fase 5: Persistencia
- Refatoracoes leves para salvar estado no Local Storage
- Pre-carregamento automatico ao recarregar a aplicacao

## Decision framework

| Situacao | Fase recomendada |
|----------|-----------------|
| Projeto novo do zero | Comece pela Fase 1 |
| Componente novo em projeto existente | Comece pela Fase 2 (layout hardcoded) |
| Componentes visuais prontos, sem comportamento | Fase 3 (definir fluxo) antes da Fase 4 |
| Tudo funciona mas perde estado ao recarregar | Fase 5 (persistencia) |
| Tentado a comecar pela logica | Pare — faca o layout primeiro |

## Heuristics

| Situacao | Faca |
|----------|------|
| Quer adicionar logica a um componente | Confirme que o layout ja esta pronto e responsivo |
| Componentes ficando acoplados | Volte a Fase 3, redesenhe o fluxo de dados |
| Precisa adicionar nova funcionalidade | Verifique se o fluxo de dados suporta sem refatoracao |
| Dados se perdem ao recarregar | Implemente persistencia (Local Storage ou backend) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Comecar pela logica sem layout pronto | Layout completo com dados hardcoded primeiro |
| Criar componentes acoplados diretamente | Definir fluxo de dados via services antes |
| Adicionar persistencia antes da logica funcionar | Logica completa e testada, depois persistencia |
| Pular a fase de documentacao do fluxo | Desenhar componentes e seus relacionamentos |
| Misturar responsividade com logica | Mobile First no layout, logica separada depois |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
