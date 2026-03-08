---
name: rs-full-stack-criando-conta-github
description: "Configures through GitHub account creation when user asks to 'create GitHub account', 'sign up for GitHub', 'register on GitHub', or 'setup GitHub profile'. Covers registration flow, email verification, security puzzle, and initial configuration. Make sure to use this skill whenever someone needs help creating a new GitHub account. Not for Git configuration, SSH keys, repository creation, or GitHub CLI setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: git-github
  tags: [github, account-creation, registration, git]
---

# Criando uma Conta no GitHub

> Para usar Git com repositorios remotos, o primeiro passo e criar uma conta no GitHub.

## Prerequisites

- Navegador web
- Endereco de e-mail valido (para verificacao)

## Steps

### Step 1: Acessar o site
Acesse [github.com](https://github.com). Na pagina inicial, preencha o campo de e-mail.

### Step 2: Preencher dados de registro
1. **E-mail** — insira um e-mail valido (sera usado para verificacao)
2. **Senha** — crie uma senha forte (GitHub exige complexidade minima)
3. **Username** — escolha um nome de usuario unico, porque sera sua identidade publica (`github.com/seu-username`)
4. **E-mail marketing** — opcional, pode recusar

### Step 3: Resolver verificacao de seguranca
GitHub apresenta um puzzle visual (CAPTCHA) para confirmar que voce e humano. Cada pessoa recebe um puzzle diferente.

### Step 4: Verificar e-mail
GitHub envia um codigo de verificacao para o e-mail cadastrado. Copie o codigo e cole no campo de confirmacao.

### Step 5: Configuracoes opcionais
GitHub pergunta sobre:
- Tamanho do time (pode selecionar "Just me")
- Se e estudante
- Essas perguntas podem ser puladas — sao apenas personalizacao

### Step 6: Selecionar plano
Selecione "Continue for free" para o plano gratuito.

## Output format
Conta GitHub ativa e pronta para uso, acessivel em `github.com/{username}`.

## Verification
- Consegue fazer login em github.com
- Perfil acessivel em `github.com/{username}`

## Exemplo de verificacao

```bash
# Apos criar a conta, verificar acesso via GitHub CLI
gh auth login
gh auth status
# Deve mostrar: Logged in to github.com as {username}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Ja tem conta GitHub | Pule direto para configuracao de Git local |
| Precisa de conta para organizacao/empresa | Crie conta pessoal primeiro, depois aceite convite da org |
| Username desejado indisponivel | Adicione numeros ou variacao, mas mantenha profissional |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Username indisponivel | Ja existe conta com esse nome | Tente variacoes: adicione numeros ou iniciais |
| Codigo de verificacao nao chega | E-mail incorreto ou na pasta de spam | Verifique o e-mail digitado e cheque a caixa de spam |
| CAPTCHA falha repetidamente | Puzzle visual nao completado corretamente | Tente novamente com calma; recarregue a pagina se necessario |
| Pagina de registro nao carrega | Bloqueio de rede ou navegador desatualizado | Tente outro navegador ou verifique a conexao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolhas de username e configuracao
- [code-examples.md](references/code-examples.md) — Fluxo visual passo a passo com detalhes de cada tela