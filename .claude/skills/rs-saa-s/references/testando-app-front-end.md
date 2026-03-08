---
name: rs-saas-nextjs-rbac-testando-app-frontend
description: "Guides frontend deploy testing and domain configuration for Next.js apps on Vercel with Render backend. Use when user asks to 'configure custom domain', 'test deployed frontend', 'fix deploy errors', 'debug production timeout', or 'troubleshoot Render free tier'. Covers DNS setup, SSL certificates, cookie import fixes, and cold start diagnosis. Make sure to use this skill whenever deploying Next.js frontends or diagnosing post-deploy failures. Not for local development, backend deploy setup, or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: testing
  tags: [saas, nextjs, server-actions]
---

# Testando App Front-end em Producao

> Ao testar um frontend deployado, valide dominio, DNS, SSL, importacoes server-side e disponibilidade do backend antes de concluir o deploy.

## Steps

### Step 1: Configurar dominio customizado

1. Acessar settings do projeto no Vercel (ou plataforma de hosting)
2. Adicionar dominio sem prefixo de API (ex: `app.seudominio.dev`)
3. Copiar registros DNS exigidos (TXT ou CNAME)

### Step 2: Configurar DNS no provedor

```
# Se dominio ja aponta para Vercel:
Tipo: TXT
Nome: _vercel
Valor: (valor fornecido pela plataforma)

# Se dominio novo:
Tipo: CNAME
Nome: subdominio
Valor: cname.vercel-dns.com (ou equivalente)
```

Aguardar propagacao e emissao do certificado SSL.

### Step 3: Testar fluxo completo

1. Acessar dominio publico
2. Testar signup/login
3. Se erro ocorrer, inspecionar logs da plataforma

### Step 4: Diagnosticar erros comuns

| Erro | Causa provavel | Solucao |
|------|---------------|---------|
| `Cannot read property of undefined reading 'getCookie'` | Import default ao inves de named export | `import { getCookie } from 'cookies-next'` |
| `Task timed out after 10 seconds` | Backend no plano free desligou (cold start) | Aguardar backend reiniciar ou upgrade para plano pago |
| Requisicao pendente sem resposta | Backend offline no Render free tier | Verificar status no dashboard do Render |

### Step 5: Corrigir import de cookies-next

```typescript
// ERRADO — import default
import cookies from 'cookies-next'
cookies.getCookie('token')

// CORRETO — named import
import { getCookie } from 'cookies-next'
getCookie('token')
```

Commitar e fazer push para trigger novo deploy.

### Step 6: Validar backend com Postman

```http
POST https://sua-api.onrender.com/users
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

Se nao responder, o backend esta em cold start. Aguardar 30-60s e tentar novamente.

## Verificacao final

- [ ] Dominio customizado resolvendo com HTTPS
- [ ] SSL certificate emitido
- [ ] Signup funciona end-to-end
- [ ] Login retorna sessao valida
- [ ] CRUD de organizacoes/projetos funciona

## Heuristics

| Situacao | Acao |
|----------|------|
| Erro em server action do Next.js | Verificar logs do Vercel, nao do browser |
| Timeout na primeira requisicao apos inatividade | Cold start do Render free — aguardar e retry |
| Projeto vai ter usuarios reais | Usar plano pago (Render $7/mes minimo) |
| Dominio ja aponta para outro servico | Adicionar apenas registro TXT, nao trocar CNAME |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Deploy em free tier para producao real | Use plano pago para evitar cold starts |
| Ignorar erro de import em producao | Verificar docs do pacote para import correto |
| Testar apenas pelo browser | Validar API isoladamente com Postman/curl |
| Assumir que DNS propaga instantaneamente | Aguardar e verificar com `dig` ou refresh |

## Troubleshooting

### Token invalido ou expirado
**Symptom:** Requisicao autenticada retorna 401
**Cause:** Token JWT expirou ou foi assinado com secret diferente
**Fix:** Verifique que o JWT_SECRET e o mesmo entre geracao e verificacao, e que o token nao expirou

### Server action nao executa
**Symptom:** Formulario submete mas nada acontece
**Cause:** A funcao nao tem a diretiva 'use server' ou o componente nao esta usando 'use client'
**Fix:** Adicione 'use server' no topo do arquivo da action e 'use client' no componente do formulario

### Cookie nao persiste entre requisicoes
**Symptom:** Token desaparece apos refresh da pagina
**Cause:** Cookie configurado sem `path: '/'` ou com `httpOnly` incorreto
**Fix:** Configure o cookie com `path: '/'` e verifique que `httpOnly` esta correto para o caso de uso

### Deploy falha com erro de build
**Symptom:** Build funciona localmente mas falha no deploy
**Cause:** Variaveis de ambiente nao configuradas na plataforma de deploy
**Fix:** Configure todas as variaveis de ambiente necessarias no dashboard da plataforma

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
