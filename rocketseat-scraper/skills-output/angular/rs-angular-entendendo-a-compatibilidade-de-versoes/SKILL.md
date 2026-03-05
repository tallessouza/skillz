---
name: rs-angular-compatibilidade-versoes
description: "Ensures correct Node.js, Angular CLI, and NPM version compatibility when setting up Angular projects. Use when user asks to 'create angular project', 'setup angular', 'install angular', 'ng new', or reports 'ng serve error', 'ng build error', 'compatibility error'. Make sure to use this skill whenever creating or troubleshooting Angular projects. Not for React, Vue, or other framework setups."
---

# Compatibilidade de Versoes Angular

> Antes de criar qualquer projeto Angular, verificar a compatibilidade entre Angular CLI, Node.js e NPM na documentacao oficial.

## Rules

1. **Sempre consulte a tabela oficial** — acesse `angular.dev/reference/versions` antes de criar um projeto, porque versoes incompativeis causam erros silenciosos e dificeis de debugar
2. **Node.js e a dependencia critica** — o Angular CLI usa o Node por baixo dos panos para build, serve e todas as operacoes, entao a versao do Node determina se o CLI funciona
3. **NPM vem junto com o Node** — ao instalar o Node na versao correta, o NPM compativel ja vem incluso, nao precisa gerenciar separadamente
4. **Se a versao do Node nao e compativel, desinstale e reinstale** — nao tente contornar, instale a versao correta do Node para a versao do Angular CLI que vai usar

## Decision framework

| Situacao | Acao |
|----------|------|
| Criar projeto Angular novo | Verificar tabela em `angular.dev/reference/versions`, instalar Node compativel |
| Erro em `ng serve` ou `ng build` | Primeiro verificar compatibilidade Node vs Angular CLI |
| Trocar versao do Angular | Verificar se Node atual e compativel, trocar se necessario |
| Usar `npx` para Angular CLI | Mesma regra — o Node instalado precisa ser compativel |

## Verificacao rapida

```bash
# 1. Verificar versao do Node
node -v

# 2. Verificar versao do Angular CLI
ng version

# 3. Comparar com a tabela oficial
# https://angular.dev/reference/versions
```

## Exemplo: Angular 19

| Angular CLI | Node.js compativel |
|-------------|-------------------|
| 19.x | ^18.19.1, ^20.11.1, ^22.0.0 |

Node v1, v16, v17 — **nao funciona** com Angular 19.

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Ignorar erro de compatibilidade e tentar workarounds | Consultar tabela oficial e instalar versao correta |
| Assumir que qualquer Node funciona com qualquer Angular | Verificar compatibilidade antes de criar o projeto |
| Instalar Node sem checar qual Angular vai usar | Decidir versao do Angular primeiro, depois instalar Node compativel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
