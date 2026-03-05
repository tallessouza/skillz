---
name: rs-saas-nextjs-rbac-deploy-frontend
description: "Guides Next.js frontend deploy decisions when user asks to 'deploy Next.js', 'host frontend', 'choose hosting provider', 'deploy to Vercel', or 'deploy to AWS'. Covers Vercel, Cloudflare Pages, OpenNext/SST, Node hosting, and static export options with trade-offs. Make sure to use this skill whenever deploying or planning deployment of a Next.js application. Not for backend deploy, database hosting, or CI/CD pipeline configuration."
---

# Deploy de Frontend Next.js

> Escolha a estrategia de deploy baseada no nivel de controle, custo e funcionalidades do Next.js que o projeto utiliza.

## Framework de Decisao

| Situacao | Opcao recomendada |
|----------|-------------------|
| Quer facilidade maxima e custo se paga pelo faturamento | **Vercel** |
| Quer free tier generoso com full stack Next.js | **Cloudflare Pages** |
| Precisa de controle total na propria infra AWS | **OpenNext + SST** |
| Nao precisa de performance em nivel de milissegundos | **Qualquer hosting Node** (Render, Railway, etc.) |
| App sem SSR (blog, site estatico) | **Static Export** para qualquer CDN |

## Rules

1. **Vercel e o padrao** — deploy mais simples, ecossistema nativo do Next.js, porque o Next e mantido pela mesma empresa
2. **Avalie custo vs esforco** — mesmo a $400-500/mes, o custo se paga pelo esforco de infra que voce evita, porque tempo de engenheiro custa mais que hosting
3. **Cloudflare Pages suporta quase tudo** — unica feature nao suportada e Partial Pre-Rendering (experimental), porque todas as features estaveis do App Router funcionam
4. **Next.js e apenas Node** — qualquer servico que rode Node.js consegue hospedar Next, porque no fundo e um servidor Node com funcionalidades extras
5. **Static Export elimina servidor** — se nao usa SSR/SSG dinamico, exporte para HTML/JS/CSS, porque reduz custo a zero em CDNs gratuitas

## Opcoes detalhadas

### Vercel (Padrao)
```bash
# Deploy automatico via Git integration
# Ou manual via CLI
npx vercel --prod
```
- Deploy instantaneo com zero config
- Suporte completo a todas as features do Next.js
- Usa internamente: Lambdas (serverless), CDN (arquivos estaticos)

### Cloudflare Pages
- Free tier generoso para apps full stack Next.js
- Verificar features suportadas em: documentacao oficial do Cloudflare Pages
- App Router totalmente suportado

### OpenNext + SST (AWS)
```typescript
// sst.config.ts
new sst.aws.Nextjs("MeuApp", {
  path: "./apps/web"
});
```
- Roda na propria conta AWS com todas as funcionalidades
- Usa Lambda + CloudFront + S3 internamente
- SST e infra-as-code em TypeScript (baseado em Pulumi)
- Requer credenciais AWS configuradas nas variaveis de ambiente

### Node hosting generico
```bash
# Build e start como qualquer app Node
npm run build
npm start
```
- Render, Railway, Fly.io, ou qualquer PaaS que rode Node
- Funciona, mas sem otimizacoes serverless (edge functions, ISR distribuido)

### Static Export
```javascript
// next.config.js
const nextConfig = {
  output: 'export'
}
```
- Gera apenas HTML, JS, CSS
- Hospede em: GitHub Pages, Cloudflare Pages, S3, Netlify, qualquer CDN

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto comercial com faturamento | Vercel — custo se paga |
| Projeto pessoal ou MVP | Cloudflare Pages (free tier) |
| Empresa exige dados na propria AWS | OpenNext + SST |
| App ja roda em PaaS Node | Hospede Next no mesmo servico |
| Site sem interatividade server-side | Static Export |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Otimizar hosting antes de ter usuarios | Use Vercel e migre depois se necessario |
| Hospedar Next como Node se precisa de edge performance | Use Vercel ou Cloudflare Pages |
| Usar Static Export com features de SSR | Mantenha servidor ou remova SSR |
| Configurar AWS manualmente para Next.js | Use OpenNext + SST para automacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-opcoes-de-deploy-front-end/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-opcoes-de-deploy-front-end/references/code-examples.md)
