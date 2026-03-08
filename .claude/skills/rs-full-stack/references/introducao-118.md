---
name: rs-full-stack-introducao-118
description: "Establishes foundational mental model for Node.js dependency management — why versions are pinned, when to update, and what to expect in real-world projects. Use when user asks about 'managing dependencies', 'why pin versions', 'updating packages', 'version strategy', or 'dependency maintenance'. Make sure to use this skill whenever discussing npm version strategies or onboarding onto existing Node.js projects. Not for specific update commands, semver calculation, or package.json syntax details."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: nodejs-dependency-management
  tags: [nodejs, npm, dependencies, versioning, maintenance]
---

# Gerenciamento de Dependências em Node.js — Introdução

> Mantenha dependências atualizadas com consciência: saiba POR QUE versões são fixadas, QUANDO atualizar, e O QUE fazer quando algo quebra.

## Key concept

Dependências são bibliotecas externas que o projeto consome. Fixar versões garante reprodutibilidade — todos que instalam o projeto obtêm o mesmo comportamento. Atualizar versões garante segurança e acesso a melhorias. O equilíbrio entre estabilidade e atualização é a essência do gerenciamento de dependências.

Fixar versões durante aprendizado elimina ruído — o foco é na didática, não em resolver incompatibilidades. No mundo real, o foco muda para manutenção ativa: verificar versões disponíveis, atualizar com segurança e corrigir quebras.

## Decision framework

| Quando você encontra | Aplique |
|---------------------|---------|
| Projeto novo sendo criado | Use versões mais recentes estáveis no momento da criação |
| Projeto legado em empresa | Aceite versões anteriores como normal — não force atualização sem planejamento |
| Tutorial ou curso | Fixe a versão exata do instrutor para evitar ruído no aprendizado |
| Dependência com vulnerabilidade conhecida | Priorize atualização dessa dependência específica |
| Atualização quebrou o código | Identifique a mudança breaking, refatore o código afetado |

## How to think about it

### Versões fixas em ambiente de aprendizado

Ao instalar dependências durante estudo, use versão exata:

```bash
npm i express@4.21.1
```

Isso garante que o comportamento do código seja idêntico ao do material de referência, porque versões diferentes podem ter APIs diferentes, comportamentos diferentes, ou bugs diferentes.

### Projetos reais em empresas

Ao entrar em uma empresa, projetos existentes terão versões de quando foram criados. Isso é normal e esperado. Não tente atualizar tudo de uma vez — entenda primeiro o estado atual, depois planeje atualizações incrementais.

### Manutenção de longo prazo

Pela longevidade do projeto, manter dependências atualizadas é importante para:
- Correções de segurança
- Correções de bugs
- Novas funcionalidades
- Compatibilidade com o ecossistema

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Sempre devo usar a versão mais recente | Projetos legados usam versões anteriores e isso é normal |
| Versão fixa é ruim | Versão fixa garante reprodutibilidade — essencial para times e aprendizado |
| Atualizar dependência é só mudar o número | Atualizações podem exigir refatoração no código que consome a dependência |
| Projeto antigo com versões antigas está errado | É consequência natural da longevidade — o importante é ter plano de manutenção |

## When to apply

- Ao iniciar um novo projeto Node.js e decidir estratégia de versionamento
- Ao entrar em projeto existente e avaliar estado das dependências
- Ao planejar ciclo de manutenção de dependências
- Ao seguir tutoriais e cursos (fixar versões exatas)

## Limitations

- Este modelo mental não cobre comandos específicos de atualização (ver skills seguintes do módulo)
- Não aborda semver em detalhe (major.minor.patch)
- Não cobre monorepos ou workspaces com dependências compartilhadas

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `npm install` instala versão diferente da esperada | Versão no package.json usa range (`^` ou `~`) em vez de exata | Remova o prefixo e fixe a versão exata (ex: `"express": "4.21.1"`) |
| Projeto funciona localmente mas falha no CI | node_modules não está no `.gitignore` ou `package-lock.json` não foi commitado | Commite o `package-lock.json` e garanta que `node_modules/` está no `.gitignore` |
| Atualização de dependência quebrou o projeto | Breaking change na versão major da dependência | Leia o changelog da dependência e refatore o código afetado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que fixar versões, analogias do instrutor, e contexto empresarial
- [code-examples.md](references/code-examples.md) — Exemplos de instalação com versão fixa e cenários de atualização