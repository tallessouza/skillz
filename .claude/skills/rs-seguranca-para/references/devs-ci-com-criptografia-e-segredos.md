---
name: rs-seguranca-devs-ci-criptografia-segredos
description: "Enforces secure CI/CD pipeline practices with secret management, SSH key handling, and least-privilege deployment. Use when user asks to 'setup CI/CD', 'configure GitHub Actions', 'deploy with SSH', 'manage secrets', 'automate deployment', or 'setup systemd service'. Applies rules: secrets always encrypted at rest, never in code, least-privilege sudoers, SSH keys scoped per service. Make sure to use this skill whenever creating deployment pipelines or managing credentials in infrastructure. Not for application-level authentication, OAuth flows, or API design."
---

# CI com Criptografia e Segredos

> Segredos nunca no codigo, sempre criptografados em repouso, com permissao minima possivel em cada camada.

## Rules

1. **Segredos sao secrets, nunca variaveis** — use GitHub Secrets (ou equivalente), nunca variáveis de ambiente visíveis, porque segredos criptografados nao podem ser lidos nem por funcionarios da plataforma
2. **Chaves SSH com escopo minimo** — crie um usuario dedicado com chave propria para deploy, nunca reutilize chaves pessoais, porque compromisso de uma chave nao deve comprometer tudo
3. **Sudoers com comando unico** — conceda `NOPASSWD` apenas para o comando especifico de deploy, nunca `ALL`, porque permissao minima limita o blast radius
4. **Disco criptografado para segredos em servidor** — senhas de banco, chaves de API no servidor devem estar em disco criptografado, porque criptografia em repouso impede acesso fisico
5. **Servicos como daemon, nunca em terminal** — use systemd (ou Docker) para manter aplicacoes rodando, porque processos em terminal morrem quando a sessao fecha
6. **Script de deploy isolado e imutavel** — o script que restarta servicos deve ser de propriedade do root, executavel por todos mas editavel so pelo root, porque o usuario de deploy nao pode alterar o que executa com sudo

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

      - name: Run deploy
        run: ssh -o StrictHostKeyChecking=no seguro@servidor ./deploy.sh projeto

      - name: Restart service
        run: ssh -o StrictHostKeyChecking=no seguro@servidor sudo /usr/local/bin/deploy-seguro.sh
```

### Sudoers com comando unico

```bash
# /etc/sudoers.d/seguro
seguro ALL=(ALL) NOPASSWD: /usr/local/bin/deploy-seguro.sh
```

### Script de deploy imutavel

```bash
#!/bin/bash
# /usr/local/bin/deploy-seguro.sh (owner: root, permissions: 755)
service seguro restart
```

## Example

**Before (inseguro):**
```yaml
# Segredo como variavel visivel
env:
  DB_PASSWORD: "minhasenha123"

# Sudoers permissivo
seguro ALL=(ALL) NOPASSWD: ALL

# Deploy com chave pessoal do dev
ssh -i ~/.ssh/id_rsa_pessoal root@servidor
```

**After (com esta skill aplicada):**
```yaml
# Segredo criptografado no GitHub Secrets
env:
  DB_PASSWORD: ${{ secrets.DB_PASSWORD }}

# Sudoers restrito a um comando
seguro ALL=(ALL) NOPASSWD: /usr/local/bin/deploy-seguro.sh

# Deploy com usuario dedicado e chave especifica
ssh -o StrictHostKeyChecking=no seguro@servidor sudo /usr/local/bin/deploy-seguro.sh
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa guardar senha/chave no CI | Use Secrets da plataforma, nunca variavel |
| Precisa restartar servico no deploy | Crie script root-owned + sudoers com comando unico |
| Aplicacao precisa rodar em background | Crie unit systemd ou use Docker |
| Precisa SSH do CI para servidor | Crie usuario dedicado com chave propria |
| Precisa verificar host SSH pela primeira vez | Use `-o StrictHostKeyChecking=no` no CI, mas entenda o tradeoff |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `echo $SECRET` no log do CI | Nunca imprima segredos; plataformas mascaram automaticamente |
| Chave privada commitada no repo | Chave no GitHub Secrets, referenciada via `${{ secrets.X }}` |
| `sudo su` para usuario de deploy | `sudo /usr/local/bin/comando-especifico.sh` |
| Rodar app com `node app.js &` no terminal | Criar systemd service com `Restart=always` |
| Mesma chave SSH para tudo | Uma chave por servico/usuario de deploy |
| Segredos como GitHub Variables | Segredos como GitHub Secrets (criptografados, invisiveis) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-ci-com-criptografia-e-segredos/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-ci-com-criptografia-e-segredos/references/code-examples.md)
