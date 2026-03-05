---
name: rs-full-stack-utilizando-variavel-de-ambiente
description: "Enforces environment variable best practices in Node.js projects. Use when user asks to 'create env file', 'add environment variables', 'hide secrets', 'configure .env', 'setup JWT secret', or any task involving sensitive data in code. Applies rules: .env file at project root, UPPER_SNAKE_CASE naming, --env-file flag in scripts, .gitignore protection, .env.example for sharing. Make sure to use this skill whenever creating or modifying environment variables or sensitive configuration. Not for CI/CD pipeline env vars, Docker environment configuration, or cloud provider secret management."
---

# Variáveis de Ambiente em Node.js

> Dados sensíveis vivem em arquivo .env na raiz do projeto, nunca no código-fonte.

## Rules

1. **Crie o arquivo `.env` na raiz do projeto** — porque é o local padrão que ferramentas e flags reconhecem automaticamente
2. **Use UPPER_SNAKE_CASE para nomes** — `AUTH_SECRET` não `authSecret`, porque é a convenção universal para variáveis de ambiente e distingue visualmente de variáveis de código
3. **Sem espaços ao redor do `=`** — `USER_NAME="Rodrigo Gonçalves"` não `USER_NAME = valor`, porque espaços quebram o parsing do arquivo .env
4. **Use aspas duplas apenas quando o valor contém espaços** — `USER_CODE=abc123` sem aspas, `USER_NAME="Rodrigo Gonçalves"` com aspas, porque aspas desnecessárias podem causar problemas em alguns parsers
5. **Carregue com `--env-file .env` no script do package.json** — porque garante que as variáveis estão disponíveis via `process.env` sem dependências externas
6. **Adicione `.env` ao `.gitignore`** — porque dados sensíveis nunca devem ir para o repositório
7. **Crie `.env.example` com as chaves sem valores** — porque permite que outros desenvolvedores saibam quais variáveis configurar sem expor seus segredos
8. **Reinicie a aplicação após alterar o `.env`** — porque variáveis de ambiente são carregadas apenas na inicialização do processo

## How to write

### Arquivo .env

```bash
# .env — dados sensíveis, NUNCA commitar
AUTH_SECRET=seu_segredo_jwt_aqui
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
USER_NAME="Rodrigo Gonçalves"
```

### Arquivo .env.example

```bash
# .env.example — commitar este, sem valores sensíveis
AUTH_SECRET=
DATABASE_URL=
USER_NAME=
```

### package.json com --env-file

```json
{
  "scripts": {
    "dev": "tsx watch --env-file .env src/server.ts"
  }
}
```

### Acessando no código

```typescript
const secret = process.env.AUTH_SECRET
const userName = process.env.USER_NAME
```

### .gitignore

```gitignore
.env
```

## Example

**Before (segredo hardcoded no código):**

```typescript
const jwtSecret = "minha_senha_super_secreta"
const dbPassword = "postgres123"
```

**After (usando variáveis de ambiente):**

```bash
# .env
JWT_SECRET=minha_senha_super_secreta
DATABASE_PASSWORD=postgres123
```

```typescript
const jwtSecret = process.env.JWT_SECRET
const dbPassword = process.env.DATABASE_PASSWORD
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Segredo JWT, senha de banco, API key | Sempre em `.env`, nunca no código |
| Valor muda entre dev/staging/prod | Variável de ambiente |
| Alterou valor no `.env` | Reinicie a aplicação |
| Projeto compartilhado publicamente | `.env` no `.gitignore` + `.env.example` commitado |
| Valor com espaços | Aspas duplas: `NAME="Primeiro Ultimo"` |
| Valor sem espaços | Sem aspas: `CODE=abc123` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const secret = "hardcoded"` | `const secret = process.env.AUTH_SECRET` |
| `auth_secret=valor` (camelCase/lowercase) | `AUTH_SECRET=valor` (UPPER_SNAKE_CASE) |
| `USER_NAME = valor` (espaços no =) | `USER_NAME=valor` |
| Commitar `.env` no Git | Adicionar `.env` ao `.gitignore` |
| Compartilhar `.env` com valores reais | Criar `.env.example` sem valores |
| Alterar `.env` e esperar hot reload | Reiniciar a aplicação |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações