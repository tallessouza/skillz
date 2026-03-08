---
name: rs-full-stack-testando-projeto-em-producao
description: "Guides verification of frontend deployments in production on Vercel. Use when user asks to 'test deploy', 'verify production', 'check deployment status', 'view deploy dashboard', or 'access production URL'. Covers dashboard navigation, deploy info inspection, commit verification, and cross-device testing. Make sure to use this skill whenever validating a Vercel deployment after pushing code. Not for CI/CD pipeline setup, backend deployment, or Docker container orchestration."
---

# Testando Projeto em Produção

> Após o deploy, verifique sistematicamente o dashboard, as informações do commit e o acesso em produção antes de considerar o deploy completo.

## Prerequisites

- Projeto deployado na Vercel com sucesso
- Repositório Git com commits sincronizados
- Acesso ao dashboard da Vercel

## Steps

### Step 1: Acessar o dashboard do projeto

Navegue até o dashboard do projeto de duas formas:

1. **Direto:** Clique em "Continue to Dashboard" após o deploy
2. **Via Overview:** Acesse a página de overview da Vercel → localize o projeto na lista → clique nele

Se o projeto não aparecer na lista, recarregue a página — projetos recém-criados podem demorar alguns segundos para aparecer.

### Step 2: Verificar informações do deploy

No dashboard, confirme:

| Campo | O que verificar |
|-------|----------------|
| **Nome do projeto** | Corresponde ao repositório |
| **Branch** | Branch correta (geralmente `main`) |
| **Commit ID** | Mesmo hash do último commit no repositório |
| **Commit message** | Mensagem corresponde ao commit feito |
| **Status** | "Ready" (pronto para uso) |
| **Preview** | Thumbnail da aplicação visível |

### Step 3: Comparar commit com o repositório

```bash
# Verificar o último commit local
git log --oneline -1

# O hash e a mensagem devem coincidir com o dashboard da Vercel
```

### Step 4: Testar a aplicação em produção

1. Clique em "Visit" no dashboard para abrir a URL de produção
2. Confirme que a URL **não é localhost** — deve ser `https://{projeto}.vercel.app`
3. Teste todas as funcionalidades principais da aplicação
4. Acesse a URL em dispositivos diferentes (mobile, tablet, desktop)
5. Envie o link para outra pessoa testar de uma rede diferente

## Output format

Checklist de verificação:

```markdown
- [ ] Dashboard acessível
- [ ] Branch correta (main)
- [ ] Commit hash confere com repositório
- [ ] Status: Ready
- [ ] URL de produção abre corretamente
- [ ] Funcionalidades testadas no browser
- [ ] Testado em dispositivo diferente
```

## Error handling

- Se o projeto não aparece no overview → recarregue a página
- Se o status não é "Ready" → verifique os logs de build no dashboard
- Se a URL retorna erro → verifique se o build completou sem erros
- Se funciona local mas não em produção → verifique variáveis de ambiente configuradas na Vercel

## Verification

- A URL de produção carrega a aplicação completa
- O comportamento é idêntico ao ambiente local
- Outros dispositivos e redes conseguem acessar a aplicação

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre verificação de deploys e fluxo Vercel
- [code-examples.md](references/code-examples.md) — Comandos e exemplos práticos de verificação