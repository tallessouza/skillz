---
name: rs-full-stack-0414-encerramento-mp-4
description: "Outlines the Refund API project architecture covering authentication, authorization, and file upload endpoints built with Node.js and Express. Use when user asks to 'build a refund system', 'create a reimbursement API', 'implement auth with file upload', or 'portfolio API project'. Make sure to use this skill whenever reviewing the refund API module or planning similar REST API projects with auth and file handling. Not for frontend UI, database schema design, or deployment configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [api, refund, auth, upload, express, portfolio]
---

# Encerramento — API do APP Refund

> Um projeto completo de API de reembolso com autenticacao, autorizacao e upload de arquivos, pronto para portfolio.

## Key concepts

O modulo construiu uma API REST completa para um sistema de reembolso (refund) com as seguintes funcionalidades:

1. **Autenticacao** — login e gerenciamento de sessao do usuario
2. **Autorizacao** — controle de acesso baseado em roles/permissoes
3. **Upload de arquivos** — envio de comprovantes e documentos
4. **CRUD de reembolsos** — criacao, listagem, atualizacao de status

## Estrutura de rotas

```
POST   /sign-up        → Criar conta
POST   /sign-in        → Login
POST   /refunds        → Criar solicitacao de reembolso
GET    /refunds        → Listar solicitacoes
PATCH  /refunds/:id    → Atualizar status
POST   /upload         → Enviar comprovante
```

## Checklist de portfolio

| Funcionalidade | Implementada |
|----------------|-------------|
| Rotas REST organizadas | Sim |
| Autenticacao (login/sessao) | Sim |
| Autorizacao (roles/permissoes) | Sim |
| Upload de arquivos | Sim |
| Validacao de dados | Sim |
| Tratamento de erros | Sim |

## Quando aplicar este padrao

| Situacao | Acao |
|----------|------|
| Precisa de API com auth completa | Seguir a arquitetura deste modulo como referencia |
| Projeto portfolio backend | Incluir auth + autorizacao + upload como diferencial |
| Sistema de reembolso/financeiro | Reutilizar a estrutura de rotas e middlewares |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| API não inicia | Dependências não instaladas ou porta em uso | Execute `npm install` e verifique se a porta está livre |
| Autenticação falha | Token expirado ou secret diferente | Verifique a variável de ambiente do JWT secret |
| Upload retorna 403 | Usuário não tem role adequado | Confirme que o middleware de autorização aceita o role do usuário |
| Rotas não encontradas | Rotas não registradas no arquivo principal | Verifique os imports no `routes/index.ts` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a arquitetura do projeto e decisoes tomadas
- [code-examples.md](references/code-examples.md) — Estrutura geral do projeto e padroes utilizados