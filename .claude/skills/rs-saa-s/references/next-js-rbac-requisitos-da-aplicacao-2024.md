---
name: rs-saas-nextjs-rbac-requisitos
description: "Applies SaaS multi-tenant application requirements planning when designing backends with RBAC. Use when user asks to 'plan a SaaS', 'design multi-org system', 'create RBAC permissions', 'structure a multi-tenant app', or 'define roles and permissions'. Enforces organization-member-project hierarchy, billing role separation, and conditional permissions. Make sure to use this skill whenever architecting a SaaS backend with role-based access control. Not for frontend implementation, UI design, or database schema creation."
---

# Requisitos de Aplicacao SaaS com RBAC

> Antes de implementar, mapeie todas as features por modulo, defina roles com permissoes granulares, e documente restricoes condicionais.

## Rules

1. **Organize features por modulo** — Authentication, Organizations, Members, Billing, e cada recurso gerenciado (Projects), porque facilita a implementacao incremental e o mapeamento de permissoes
2. **Defina roles com permissoes explicitas** — crie uma tabela role x permissao antes de codar, porque elimina ambiguidade durante a implementacao
3. **Identifique permissoes condicionais** — marque onde a permissao depende de ownership (ex: "member pode update projeto apenas se criou"), porque exige logica de autorizacao diferente
4. **Separe billing como role especial** — billing nao conta como membro pagante e e limitado a 1 por organizacao, porque e padrao de SaaS nao cobrar pelo membro de faturamento
5. **Projetos sao o recurso gerenciado** — mantenha entidades de dominio simples quando o foco e autorizacao, porque a complexidade deve estar no controle de acesso, nao na regra de negocio do recurso
6. **Shutdown nao e delete** — organizacoes podem precisar de soft-delete para manter dados de billing/auditoria, porque SaaS tem obrigacoes legais e financeiras

## Estrutura de Modulos

### Authentication
- Login com e-mail e senha
- Login com OAuth (GitHub)
- Recuperacao de senha por e-mail
- Criacao de conta

### Organizations
- Criar organizacao
- Listar organizacoes do usuario
- Atualizar organizacao
- Shutdown (soft-delete)
- Transferir ownership

### Members (Invites)
- Convidar membro (e-mail + role)
- Aceitar convite
- Revogar convite pendente
- Listar membros da organizacao
- Atualizar role de membro

### Projects (CRUD)
- Listar projetos
- Criar projeto
- Atualizar projeto
- Deletar projeto

### Billing
- Retornar informacoes de faturamento
- Formula: $20/projeto + $10/membro (excluindo role billing)

## Tabela de Permissoes

| Permissao | Admin | Member | Billing |
|-----------|-------|--------|---------|
| Criar projeto | sim | sim | nao |
| Listar projetos | sim | sim | sim |
| Atualizar projeto | sim | condicional (owner) | nao |
| Deletar projeto | sim | condicional (owner) | nao |
| Criar organizacao | sim | nao | nao |
| Atualizar organizacao | sim | nao | nao |
| Shutdown organizacao | sim | nao | nao |
| Transferir organizacao | sim (owner) | nao | nao |
| Convidar membro | sim | nao | nao |
| Revogar convite | sim | nao | nao |
| Atualizar role | sim | nao | nao |
| Ver billing | sim | nao | sim |

## Heuristics

| Situacao | Faca |
|----------|------|
| Permissao sem restricao listada | Todos os roles podem executar |
| Permissao com "condicional" | Implemente verificacao de ownership alem do role |
| Acao GET (list/detail) | Trate como mesma permissao — acesso ao recurso e unico |
| Role billing | Limite a 1 por organizacao, exclua da contagem de cobranca |
| Shutdown de organizacao | Use soft-delete, mantenha dados para billing/auditoria |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Implementar sem mapear permissoes antes | Crie tabela role x permissao primeiro |
| Hard-delete de organizacao | Soft-delete com flag de shutdown |
| Cobrar billing member | Exclua billing da formula de pricing |
| Permitir N billing members | Limite a 1 billing por organizacao |
| Misturar logica de negocio complexa no recurso | Mantenha Projects simples, foco na autorizacao |
| Tratar list e get-by-id como permissoes diferentes | Use mesma permissao para ambos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-requisitos-da-aplicacao-2024/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-requisitos-da-aplicacao-2024/references/code-examples.md)
