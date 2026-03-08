---
name: rs-full-stack-0101-abertura-mp-4
description: "Structures architecture decisions when building a refund system API with Node.js, including authentication, authorization, file upload, and database integration. Use when user asks to 'create a refund API', 'build an expense reimbursement system', 'implement file upload with validation', or 'design a corporate expense API'. Make sure to use this skill whenever planning or scaffolding a refund/reimbursement backend project. Not for frontend implementation, CSS styling, or non-Node.js backends."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [api, refund, architecture, node, authentication, file-upload]
---

# API de Sistema de Reembolso — Visão do Projeto

> Ao projetar uma API de reembolso, modele em torno do fluxo do colaborador: solicitação → upload de comprovante → validação → aprovação → reembolso.

## Key concepts

Uma API de sistema de reembolso corporativo fornece dados e funcionalidades para que colaboradores solicitem reembolso de despesas (visitas a clientes, palestras, substituição de peças/equipamentos). O sistema atende uma ou múltiplas empresas.

## Funcionalidades-chave

1. **Autenticação** — identificar o usuário (login, JWT, sessões)
2. **Autorização** — controlar quem pode aprovar, quem pode solicitar
3. **Banco de dados** — persistir solicitações, usuários, status de reembolso
4. **Upload de arquivos** — receber comprovantes (notas fiscais, recibos)
5. **Validação de arquivos** — verificar tipo, tamanho e integridade do arquivo enviado
6. **Manipulação de arquivos** — armazenar, servir e gerenciar os comprovantes

## Framework de decisão

| Quando encontrar | Aplique |
|-----------------|---------|
| Modelar entidades do domínio | Colaborador, Reembolso, Comprovante, Empresa como entidades separadas |
| Definir rotas | Separar por recurso: `/users`, `/refunds`, `/files` |
| Controlar acesso | Roles distintos: colaborador (solicita), gestor (aprova), admin (configura) |
| Receber arquivos | Validar tipo MIME, tamanho máximo, extensões permitidas ANTES de salvar |
| Armazenar arquivos | Separar storage de metadados — arquivo no disco/S3, referência no banco |

## Estrutura de rotas esperada

```
POST   /users          → Cadastro de colaborador
POST   /sessions       → Login (autenticação)
POST   /refunds        → Criar solicitação de reembolso (+ upload)
GET    /refunds        → Listar solicitações (com filtros)
PATCH  /refunds/:id    → Aprovar/rejeitar reembolso
POST   /files          → Upload de comprovante
```

## Cenários de aplicação

### Solicitação de reembolso
O colaborador visitou um cliente e precisa ser reembolsado. Ele cria uma solicitação com valor, motivo e anexa o comprovante via upload. A API valida o arquivo, persiste os dados e notifica o aprovador.

### Fluxo de aprovação
O gestor consulta solicitações pendentes, visualiza comprovantes e aprova ou rejeita. A autorização garante que apenas gestores acessem essa funcionalidade.

## Limitações

- Este skill cobre a visão arquitetural do projeto, não implementação detalhada de cada endpoint
- Para padrões específicos de autenticação JWT, consulte skills de autenticação
- Para padrões de upload com Multer/Fastify, consulte skills específicas de file handling

## Troubleshooting

### Problem: Unclear separation between authentication and authorization
- **Cause**: Mixing identity verification (who are you?) with permission checks (what can you do?) in the same middleware
- **Fix**: Create separate middleware layers — one for authentication (JWT/session validation) and another for authorization (role/permission checks)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre decisões arquiteturais e fluxo do sistema
- [code-examples.md](references/code-examples.md) — Estrutura base e exemplos de scaffolding do projeto