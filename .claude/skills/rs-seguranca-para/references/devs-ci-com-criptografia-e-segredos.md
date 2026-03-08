---
name: rs-seguranca-devs-ci-criptografia-segredos
description: "Enforces secure CI/CD pipeline practices with secret management, SSH key handling, and least-privilege deployment when automating deployments. Use when user asks to 'setup CI/CD', 'configure GitHub Actions', 'deploy with SSH', 'manage secrets in pipeline', 'automate deployment', 'setup systemd service', or 'create deploy script'. Applies rules: secrets always encrypted at rest via platform secrets (never env vars), least-privilege sudoers with single-command scope, SSH keys per service, systemd for daemon processes. Make sure to use this skill whenever creating deployment pipelines or managing credentials in infrastructure. Not for application-level authentication (use devs-boas-praticas-para-autenticacao), OAuth flows, or API design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: infrastructure-security
  tags: [security, ci-cd, github-actions, secrets, ssh, systemd, deployment, least-privilege]
---

# CI com Criptografia e Segredos

> Segredos nunca no codigo, sempre criptografados em repouso, com permissao minima possivel em cada camada.

## Rules

1. **Segredos sao secrets, nunca variaveis** — use GitHub Secrets (ou equivalente), nunca variaveis de ambiente visiveis, porque segredos criptografados nao podem ser lidos nem por funcionarios da plataforma
2. **Chaves SSH com escopo minimo** — crie um usuario dedicado com chave propria para deploy, nunca reutilize chaves pessoais, porque compromisso de uma chave nao deve comprometer tudo
3. **Sudoers com comando unico** — conceda `NOPASSWD` apenas para o comando especifico de deploy, nunca `ALL`, porque permissao minima limita o blast radius
4. **Disco criptografado para segredos em servidor** — senhas de banco, chaves de API devem estar em disco criptografado, porque criptografia em repouso impede acesso fisico
5. **Servicos como daemon, nunca em terminal** — use systemd (ou Docker) para manter aplicacoes rodando, porque processos em terminal morrem quando a sessao fecha
6. **Script de deploy isolado e imutavel** — de propriedade do root, executavel por todos mas editavel so pelo root, porque o usuario de deploy nao pode alterar o que executa com sudo

## How to write

### Systemd service unit

```ini
[Unit]
Description=App Seguro

[Service]
User=seguro
WorkingDirectory=/home/seguro/seguro
ExecStart=/home/seguro/seguro/run
Restart=always

[Install]
WantedBy=multi-user.target
```

### GitHub Actions com SSH seguro

```yaml
name: deploy prod
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      SSHKEY: ${{ secrets.SSH_KEY }}
    steps:
      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "$SSHKEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
      - name: Deploy and restart
        run: |
          ssh -o StrictHostKeyChecking=no seguro@servidor ./deploy.sh projeto
          ssh -o StrictHostKeyChecking=no seguro@servidor sudo /usr/local/bin/deploy-seguro.sh
```

### Sudoers com comando unico

```bash
# /etc/sudoers.d/seguro
seguro ALL=(ALL) NOPASSWD: /usr/local/bin/deploy-seguro.sh
```

## Example

**Before (inseguro):**
```yaml
env:
  DB_PASSWORD: "minhasenha123"       # Segredo visivel
# seguro ALL=(ALL) NOPASSWD: ALL     # Sudoers permissivo
# ssh -i ~/.ssh/id_rsa_pessoal root@servidor  # Chave pessoal como root
```

**After (com esta skill aplicada):**
```yaml
env:
  DB_PASSWORD: ${{ secrets.DB_PASSWORD }}  # Criptografado
# seguro ALL=(ALL) NOPASSWD: /usr/local/bin/deploy-seguro.sh  # Comando unico
# ssh seguro@servidor sudo /usr/local/bin/deploy-seguro.sh    # Usuario dedicado
```

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Chave privada commitada no repo | Chave no GitHub Secrets |
| `sudo su` para usuario de deploy | `sudo /usr/local/bin/comando-especifico.sh` |
| Rodar app com `node app.js &` no terminal | Criar systemd service com `Restart=always` |
| Mesma chave SSH para tudo | Uma chave por servico/usuario de deploy |
| Segredos como GitHub Variables | Segredos como GitHub Secrets (criptografados) |

## Troubleshooting

### Segredo aparece no log do CI
**Symptom:** Senha ou chave visivel nos logs da pipeline
**Cause:** Segredo armazenado como Variable (visivel) em vez de Secret (mascarado)
**Fix:** Mova para Secrets da plataforma. GitHub Actions mascara automaticamente valores de secrets nos logs.

### Servico nao restarta apos deploy
**Symptom:** Aplicacao para de rodar depois que o deploy termina
**Cause:** Aplicacao executada em foreground no terminal SSH — morre quando a sessao fecha
**Fix:** Crie unit systemd com `Restart=always`. Verifique com `systemctl status app-name`.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-ci-com-criptografia-e-segredos/references/deep-explanation.md) — Diferenca entre secrets e variables, blast radius de sudoers permissivo, script imutavel
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-ci-com-criptografia-e-segredos/references/code-examples.md) — Workflow completo GitHub Actions, systemd unit, sudoers, deploy script
