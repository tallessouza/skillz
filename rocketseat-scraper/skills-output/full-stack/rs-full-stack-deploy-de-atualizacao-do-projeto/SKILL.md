---
name: rs-full-stack-deploy-de-atualizacao-do-projeto
description: "Enforces production update workflow when deploying code changes to hosted services like Render. Use when user asks to 'update production', 'deploy changes', 'push fix to production', 'update my app', or 'redeploy'. Applies git semantic commit conventions (fix/feat/chore/doc), auto-deploy from GitHub branch detection, and post-deploy verification. Make sure to use this skill whenever pushing updates to a deployed application or writing commit messages. Not for initial deploy setup, Docker/K8s orchestration, or CI/CD pipeline configuration."
---

# Deploy de Atualização do Projeto

> Atualize aplicações em produção com commits semânticos, push para GitHub, e verificação pós-deploy.

## Prerequisites

- Aplicação já deployada em serviço conectado ao GitHub (Render, Vercel, Railway)
- Repositório Git com remote configurado
- Acesso ao dashboard do serviço de deploy para acompanhar logs

## Steps

### Step 1: Fazer a alteração no código

Implemente a correção ou feature. Valide localmente antes de commitar.

```typescript
// Exemplo: adicionar validação de recurso não encontrado
if (!delivery) {
  return response.status(404).json({ message: "Delivery not found" })
}
```

### Step 2: Commit com convenção semântica

```bash
git add .
git commit -m "fix: show delivery not found case"
```

**Prefixos semânticos:**

| Prefixo | Quando usar |
|---------|-------------|
| `fix` | Correção de bug ou comportamento incorreto |
| `feat` | Nova funcionalidade |
| `chore` | Configuração, dependências, tarefas internas |
| `doc` | Atualização de documentação |

### Step 3: Push para o GitHub

```bash
git push
```

O serviço de deploy (Render, Vercel) detecta automaticamente mudanças na branch principal e inicia um novo build.

### Step 4: Acompanhar o deploy

1. Abrir o dashboard do serviço (ex: Render)
2. Verificar que o deploy foi detectado automaticamente
3. Acompanhar os logs do build em andamento
4. Aguardar conclusão sem erros

### Step 5: Verificar em produção

Testar o endpoint ou funcionalidade alterada diretamente na URL de produção.

```bash
# Exemplo: testar endpoint que antes retornava null
curl https://minha-app.onrender.com/deliveries/999/logs
# Esperado: {"message": "Delivery not found"} com status 404
```

## Output format

```
1. Código alterado e testado localmente
2. Commit semântico criado (fix/feat/chore/doc: mensagem descritiva)
3. Push realizado para branch principal
4. Deploy automático detectado no dashboard
5. Versão atualizada verificada em produção
```

## Error handling

- Se o deploy falhar nos logs → verificar erros de build no dashboard, corrigir e fazer novo push
- Se a mudança não for detectada → verificar se o push foi para a branch correta (a configurada no serviço)
- Se a versão antiga ainda aparece → aguardar conclusão do build, verificar se não há cache

## Heuristics

| Situação | Faça |
|----------|------|
| Bug fix simples | Prefixo `fix:` no commit |
| Nova rota ou endpoint | Prefixo `feat:` no commit |
| Atualização de .env.example | Prefixo `chore:` no commit |
| Múltiplas mudanças não relacionadas | Commits separados, um por mudança |
| Precisa validar antes de deploy | Testar localmente com dados reais |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|-----------|-------------------|
| Commit genérico `"update"` ou `"fix bug"` | `"fix: return 404 when delivery not found"` |
| Push sem testar localmente | Validar o comportamento antes do commit |
| Ignorar logs do deploy | Acompanhar build até conclusão |
| Assumir que deploy foi instantâneo | Verificar endpoint em produção após build |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre commits semânticos, auto-deploy e fluxo de atualização
- [code-examples.md](references/code-examples.md) — Exemplos de código de validação e comandos git expandidos