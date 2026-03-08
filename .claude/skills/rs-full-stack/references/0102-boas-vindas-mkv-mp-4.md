---
name: rs-full-stack-0102-boas-vindas-mkv-mp-4
description: "Applies refund API project architecture patterns when building REST APIs with authentication, authorization, role-based access (employee/manager), pagination, and file upload. Use when user asks to 'build a refund system', 'create an API with roles', 'implement pagination', 'add file upload to API', or 'design employee/manager permissions'. Make sure to use this skill whenever architecting multi-role CRUD APIs with auth flows. Not for frontend implementation, CSS styling, or database schema design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [api, refund, roles, pagination, file-upload, authentication, authorization]
---

# API de Reembolso — Arquitetura do Projeto

> Ao projetar uma API de reembolso, estruture em camadas: autenticação (sign-up/sign-in), autorização por perfil (employee/manager), CRUD com paginação, e upload de arquivos.

## Key concepts

1. **Autenticação** — sign-up (criar conta com nome, email, senha) e sign-in (login), porque toda API multi-usuário precisa de identidade antes de autorização
2. **Autorização por perfil (role)** — dois perfis: `employee` (solicita reembolsos) e `manager` (gerencia/lista/pesquisa solicitações), porque cada perfil tem escopo de acesso diferente
3. **CRUD de reembolsos** — colaborador cria solicitações, gerente visualiza todas com filtros, porque a separação de responsabilidades protege dados sensíveis
4. **Paginação** — retornar dados em páginas (ex: 10 por vez) com cálculo de total de páginas, porque trazer milhares de registros numa única consulta degrada performance
5. **Pesquisa** — filtrar solicitações por nome do colaborador, porque listagens sem busca são inutilizáveis em produção
6. **Upload de arquivo** — salvar e recuperar arquivos (comprovantes) dentro da aplicação back-end, porque reembolsos precisam de comprovação documental

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Múltiplos perfis de usuário | Separar roles (employee/manager) com middleware de autorização por rota |
| Listagens com muitos registros | Paginação server-side com limit/offset e retorno de totalPages |
| Dados sensíveis entre perfis | Employee só vê próprias solicitações, manager vê todas |
| Necessidade de comprovantes | Upload de arquivo com armazenamento local ou cloud |
| Criação de conta + login | Rotas separadas: POST /sign-up e POST /sign-in |

## Contextos de reembolso

| Tipo | Exemplo |
|------|---------|
| Deslocamento | Colaborador viaja para atender cliente ou participar de evento |
| Hospedagem | Estadia necessária durante viagem a trabalho |
| Ferramentas | Compra de software/hardware para uso profissional |
| Eventos | Inscrição e custos de participação em conferências |

## Estrutura de rotas esperada

```
POST   /sign-up              → Criar conta (nome, email, senha)
POST   /sign-in              → Login (email, senha) → retorna token
POST   /refunds              → Employee cria solicitação (+ upload)
GET    /refunds              → Manager lista com paginação e pesquisa
GET    /refunds/:id          → Detalhes de uma solicitação
```

## Heuristics

| Situação | Ação |
|----------|------|
| API serve frontend específico | Modelar rotas pelas necessidades das telas |
| Dois perfis com permissões distintas | Middleware de autorização verificando role do token |
| Tabela com milhares de registros | Nunca retornar tudo — sempre paginar |
| Comprovantes de despesa | Implementar upload com validação de tipo/tamanho |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| Retornar todos os registros sem paginação | Paginar com limit/offset e totalPages |
| Employee acessar rotas de manager | Middleware de autorização por role em cada rota |
| Misturar autenticação com autorização | Auth = quem é você, Authz = o que pode fazer |
| Guardar arquivo sem organização | Pasta dedicada com nomes únicos (uuid) |

## Troubleshooting

### Problem: All records returned without pagination causing slow responses
- **Cause**: Missing server-side pagination with limit/offset parameters
- **Fix**: Implement pagination on every list endpoint using query params (e.g., `?page=1&perPage=10`) and return `totalPages` in the response

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre arquitetura do sistema de reembolso, analogias e decisões de design
- [code-examples.md](references/code-examples.md) — Exemplos de código para cada funcionalidade: auth, roles, paginação, upload