---
name: rs-angular-intro-analisando-projeto
description: "Guides Angular project setup, structure analysis, and CLI usage when starting a new Angular project. Use when user asks to 'create angular project', 'analyze angular structure', 'angular cli commands', 'debug angular app', or 'start angular application'. Applies rules for project creation, dependency installation, CLI workflows, and debugging techniques. Make sure to use this skill whenever scaffolding or onboarding into an Angular project. Not for React, Vue, or other framework projects."
---

# Analisando um Projeto Angular

> Ao iniciar um projeto Angular, entenda a estrutura completa antes de escrever codigo.

## Key concept

Um projeto Angular segue uma estrutura padronizada criada pelo Angular CLI. Antes de implementar qualquer funcionalidade, domine cinco areas fundamentais: criacao do projeto, estrutura de arquivos, instalacao de dependencias, comandos do CLI, e tecnicas de debug.

## Decision framework

| Quando voce precisa | Faca |
|---------------------|------|
| Criar um novo projeto | `ng new nome-do-projeto` via Angular CLI |
| Entender um arquivo desconhecido | Consulte a estrutura padrao do Angular antes de modificar |
| Instalar dependencias | `npm install` na raiz do projeto |
| Criar componente ou service | Use Angular CLI (`ng generate component/service`) em vez de criar manualmente |
| Encontrar um bug | Aplique tecnicas de debug sistematicas antes de alterar codigo |

## How to think about it

### Estrutura do projeto
Cada arquivo em um projeto Angular tem uma funcao especifica. Nao modifique arquivos de configuracao sem entender seu papel. A estrutura padrao existe para manter consistencia entre projetos.

### Angular CLI como ferramenta principal
O CLI nao serve apenas para criar o projeto inicial. Ele gera componentes, services e outros artefatos seguindo as convencoes do framework. Criar arquivos manualmente introduz inconsistencias.

### Debug sistematico
Bugs em Angular frequentemente vem de bindings incorretos, dependencias nao importadas, ou lifecycle hooks mal utilizados. Ter tecnicas de debug definidas economiza horas de investigacao.

## Common misconceptions

| Muitos pensam | Realidade |
|---------------|-----------|
| Posso criar componentes manualmente | O CLI garante convencoes, imports e declaracoes automaticas no module |
| A estrutura de pastas e opcional | A estrutura padrao e esperada por ferramentas, testes e outros devs |
| `npm install` so precisa rodar uma vez | Sempre rode apos clonar ou atualizar branches com mudancas em `package.json` |

## When to apply

- Ao criar qualquer projeto Angular do zero
- Ao fazer onboarding em um projeto Angular existente
- Ao ensinar alguem que esta comecando com Angular
- Ao debugar problemas de estrutura ou configuracao

## Limitations

- Esta skill cobre a visao geral da estrutura. Para patterns especificos de componentes, services ou state management, consulte skills dedicadas.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
