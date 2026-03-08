---
name: rs-full-stack-o-projeto-que-vamos-usar
description: "Enforces project verification workflow before updating Node.js dependencies. Use when user asks to 'check if project works', 'verify project setup', 'prepare for dependency update', 'test existing API', or 'validate project before changes'. Guides through Docker container verification, database connection testing, API endpoint validation, and Prisma Studio inspection. Make sure to use this skill whenever onboarding to an existing Node.js project or preparing for dependency upgrades. Not for creating new projects, writing business logic, or deploying applications."
---

# Verificação de Projeto Antes de Atualização de Dependências

> Antes de atualizar qualquer dependência, verifique que o projeto funciona corretamente no estado atual — banco de dados, API e ferramentas de teste.

## Prerequisites

- Docker instalado e rodando (para containers de banco de dados)
- Node.js e npm instalados
- Insomnia ou similar para testar endpoints da API
- Projeto clonado com `node_modules` instalado (`npm install`)

## Steps

### Step 1: Verificar imagem e container Docker

```bash
# Verificar se a imagem do banco existe
docker image ls

# Verificar se o container está em execução
docker ps
```

Se o container não estiver rodando, suba-o antes de prosseguir.

### Step 2: Verificar conexão com o banco de dados

```bash
# Verificar via cliente (BKeeper, pgAdmin, ou similar)
# Dados padrão para projetos locais:
# Host: localhost
# Porta: 5432
# Usuário: postgres
# Senha: postgres
# Banco: rocketlog
```

Confirme que as tabelas existem (migrations já foram executadas).

### Step 3: Executar a aplicação

```bash
npm run dev
```

Verifique que a API inicia sem erros.

### Step 4: Testar endpoint via Insomnia/cliente HTTP

```json
// POST para criar usuário (ou qualquer endpoint existente)
{
  "name": "Ana Paula"
}
```

Confirme que a resposta retorna sucesso.

### Step 5: Visualizar dados no Prisma Studio

```bash
npx prisma studio
```

Confirme que os dados criados no Step 4 aparecem no banco.

### Step 6: Encerrar processos

```bash
# Parar Prisma Studio (Ctrl+C)
# Parar a aplicação (Ctrl+C)
```

Projeto verificado — pronto para atualização de dependências.

## Output format

Checklist de verificação completa:
- [ ] Imagem Docker presente
- [ ] Container rodando
- [ ] Banco de dados acessível com tabelas criadas
- [ ] API inicia sem erros (`npm run dev`)
- [ ] Endpoint responde corretamente
- [ ] Dados persistem no banco (Prisma Studio)

## Error handling

- Se container não existe: verificar `docker-compose.yml` e rodar `docker compose up -d`
- Se banco não tem tabelas: executar `npx prisma migrate dev`
- Se API não inicia: verificar `.env` com variáveis de conexão do banco
- Se endpoint falha: verificar se o banco está acessível e migrations aplicadas

## Verification

O projeto está pronto para atualização quando TODOS os itens do checklist passam. Não prossiga com atualizações de dependências sem verificação completa.

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto baixado do zero (link da descrição) | Rodar `npm install` antes de tudo |
| Container parado mas imagem existe | `docker start <container_name>` |
| Banco vazio mas container roda | `npx prisma migrate dev` |
| Arquivo `insomnia-routes.json` disponível | Importar no Insomnia: Create → Import |
| Pasta `build/` já existe | Projeto já teve build anterior, OK |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Atualizar dependências sem testar o projeto primeiro | Verificar que tudo funciona no estado atual |
| Assumir que o banco está pronto sem verificar | Rodar `docker ps` e testar conexão |
| Pular teste de endpoint | Fazer ao menos uma requisição de teste |
| Ignorar `.env` ao clonar projeto | Verificar variáveis de ambiente antes de rodar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que verificar antes de atualizar e organização de projetos
- [code-examples.md](references/code-examples.md) — Comandos Docker, Prisma e configurações expandidos