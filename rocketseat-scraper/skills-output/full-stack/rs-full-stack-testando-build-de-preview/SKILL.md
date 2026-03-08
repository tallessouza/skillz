---
name: rs-full-stack-testando-build-de-preview
description: "Guides testing and navigating Vercel preview builds when deploying frontend applications. Use when user asks to 'test a preview build', 'check preview deployment', 'compare preview vs production', 'verify deployment changes', or 'navigate Vercel preview URLs'. Ensures correct workflow for inspecting preview deployments, comparing commits, and validating implemented features before production. Make sure to use this skill whenever reviewing Vercel preview deployments or validating changes in non-production environments. Not for production deployment, backend deploy, or CI/CD pipeline configuration."
---

# Testando Build de Preview

> Antes de promover para producao, valide cada preview build navegando suas URLs, comparando commits e testando as funcionalidades implementadas.

## Prerequisites

- Projeto deployado na Vercel com integracao GitHub
- Branch com push recente (preview build gerada automaticamente)
- Acesso ao dashboard da Vercel

## Steps

### Step 1: Localizar a preview build

Acesse o dashboard da Vercel e localize a build de preview. Cada push para uma branch que nao seja a principal gera automaticamente uma preview build.

### Step 2: Inspecionar informacoes do build

Na pagina da build, identifique tres links importantes:

1. **Link para a branch** — leva direto para a branch no GitHub
2. **Link para o codigo/diff** — mostra exatamente o que mudou nessa build comparado com a versao anterior
3. **Link para o commit** — associado ao commit especifico que gerou a build

### Step 3: Entender as opcoes de URL

Existem duas opcoes de preview:

| Opcao | Baseada em | Quando usar |
|-------|-----------|-------------|
| URL da branch | Ultimo commit da branch | Ver sempre a versao mais recente da branch |
| URL do commit | Commit especifico | Testar exatamente o que aquele commit introduziu |

### Step 4: Diferenciar preview de producao

A URL de preview e diferente da URL de producao. Compare:

- **Producao:** `seu-projeto.vercel.app`
- **Preview (commit):** `seu-projeto-{hash}-{user}.vercel.app`

A build de producao possui a opcao de URL principal visivel. A preview nao possui essa URL — apenas URLs temporarias.

### Step 5: Testar funcionalidades implementadas

Navegue pela preview e valide os feedbacks/features que foram implementados naquela build. Teste os cenarios relevantes diretamente na URL de preview.

## Output format

Checklist de validacao de preview:

```
- [ ] Preview build gerada com sucesso
- [ ] Diff revisado (o que mudou vs anterior)
- [ ] URL de preview acessivel
- [ ] Funcionalidades implementadas testadas
- [ ] Pronto para merge/producao
```

## Error handling

- Se a preview nao gerar: verifique se o push foi feito e se a integracao Vercel-GitHub esta ativa
- Se a URL retornar erro: aguarde a build finalizar (cheque o status no dashboard)
- Se o diff nao mostrar mudancas: confirme que o commit correto foi enviado

## Verification

- Compare visualmente a preview com a versao de producao
- Confirme que as funcionalidades do commit estao funcionando
- Valide que a URL de preview e diferente da URL de producao

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre navegacao de preview builds e fluxo de validacao
- [code-examples.md](references/code-examples.md) — Exemplos praticos de URLs e navegacao no dashboard Vercel