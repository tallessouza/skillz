---
name: rs-full-stack-promovendo-para-producao
description: "Follows the workflow to promote a Vercel preview build to production using Git merge and push. Use when user asks to 'deploy to production', 'promote preview to production', 'merge feature branch to main', 'push to production', or 'create a pull request for deploy'. Covers git checkout, git pull, git merge, and git push flow for Vercel CI/CD. Make sure to use this skill whenever promoting a Vercel preview deployment or merging a feature branch into main for production release. Not for initial project setup, Vercel configuration, or backend deployment to other platforms."
---

# Promovendo Build de Preview para Produção

> Promova uma build de preview para produção integrando a feature branch na main via Git, acionando o deploy automático na Vercel.

## Prerequisitos

- Projeto conectado à Vercel com deploy automático configurado
- Feature branch com build de preview já gerada na Vercel
- Acesso ao repositório no GitHub

## Caminhos disponíveis

| Método | Quando usar |
|--------|-------------|
| **Git CLI (recomendado)** | Controle total, histórico limpo |
| **GitHub Pull Request** | Revisão de código necessária, equipe |
| **Painel da Vercel** | Promoção rápida sem merge no Git |

## Steps

### Step 1: Voltar para a branch main

```bash
git checkout main
```

O código local muda para refletir o estado da main — a feature ainda não existe aqui.

### Step 2: Atualizar a main local

```bash
git pull origin main
```

Garante que a main local está sincronizada com o remoto, porque evita conflitos no merge.

### Step 3: Fazer merge da feature branch

```bash
git merge feat/nome-da-feature
```

Integra as mudanças da feature branch na main local. O código da feature aparece na main.

### Step 4: Verificar o histórico

```bash
git log --oneline
```

Confirme que o merge commit aparece no histórico com a junção da main com a feature branch. Saia com `:q`.

### Step 5: Enviar para o remoto

```bash
git push origin main
```

A Vercel detecta automaticamente o push na main e gera uma nova build de produção.

### Step 6: Verificar na Vercel

Atualize o painel da Vercel — a nova build aparece como **Production**, porque o push foi direto na main.

## Output format

Após completar o fluxo:
- Build de produção visível no painel da Vercel
- URL de produção atualizada com as mudanças da feature
- Histórico Git limpo com merge commit documentado

## Método alternativo: Painel da Vercel

Na lista de deployments, clique nos três pontinhos (`...`) do preview build e selecione **Promote to Production** — promove sem merge no Git.

## Método alternativo: GitHub Pull Request

O GitHub detecta automaticamente a nova branch e exibe o botão **Compare & pull request**. Crie a PR, revise e faça merge pela interface.

## Error handling

- Se `git pull` trouxer conflitos: resolva manualmente antes do merge
- Se `git merge` gerar conflitos: edite os arquivos conflitantes, faça `git add .` e `git commit`
- Se a build falhar na Vercel: verifique os logs no painel, corrija e faça novo push

## Verification

- Acesse a URL de produção da Vercel
- Confirme que a feature está funcionando (teste visual)
- No painel da Vercel, verifique que o deployment mais recente está marcado como **Production**

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre fluxo Git + Vercel CI/CD
- [code-examples.md](references/code-examples.md) — Comandos Git expandidos com variações e cenários