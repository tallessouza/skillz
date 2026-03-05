---
name: rs-devops-enviando-imagem-repositorio
description: "Applies Docker image push workflow in CI/CD pipelines using GitHub Actions. Use when user asks to 'push docker image', 'publish to Docker Hub', 'configure CI/CD for containers', 'setup docker login in actions', or 'push image to registry'. Covers login, build with proper tagging, push, and secrets configuration. Make sure to use this skill whenever setting up container image publishing in GitHub Actions. Not for Kubernetes deployment, Docker Compose, or local Docker builds."
---

# Enviando Imagem Docker para o Repositorio via CI/CD

> Toda pipeline de container precisa de tres steps sequenciais: login no registry, build com tag correta, e push — nessa ordem, porque falha no login deve impedir o build.

## Rules

1. **Login antes do build** — coloque o step de login antes do build, porque se o login falhar, nao faz sentido gastar tempo buildando a imagem
2. **Nome completo no tag** — use `username/repo-name:tag`, porque o Docker Hub exige o username como prefixo do repositorio e o push falha silenciosamente sem ele
3. **Secrets para credenciais** — use repository secrets (nao variables) para username e token, porque sao informacoes sensiveis que nao devem ficar expostas nos logs
4. **Token, nunca senha** — gere um access token no Docker Hub ao inves de usar a senha da conta, porque tokens podem ser escopados e revogados individualmente
5. **Tag vinculada ao commit** — use o SHA do commit como tag da imagem, porque garante rastreabilidade entre a imagem no registry e o codigo fonte

## Steps

### Step 1: Configurar secrets no GitHub

Em Settings > Security > Secrets and variables > Actions > Repository secrets:
- `DOCKERHUB_USERNAME` — seu username do Docker Hub
- `DOCKERHUB_TOKEN` — access token gerado no Docker Hub (nao a senha)

### Step 2: Gerar token no Docker Hub

1. Docker Hub > My Account > Security > Access Tokens
2. Create new token com permissao minima necessaria (write para push)
3. Copiar e salvar como secret no GitHub

### Step 3: Pipeline completa

```yaml
steps:
  - name: Login into the container registry
    uses: docker/login-action@v3
    with:
      username: ${{ secrets.DOCKERHUB_USERNAME }}
      password: ${{ secrets.DOCKERHUB_TOKEN }}

  - name: Build Docker image
    run: docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/rocketseat-ci-api:${{ github.sha }} .

  - name: Push image
    run: docker push ${{ secrets.DOCKERHUB_USERNAME }}/rocketseat-ci-api:${{ github.sha }}
```

## Example

**Before (push vai falhar — falta username no tag):**
```yaml
- name: Build Docker image
  run: docker build -t rocketseat-ci-api:${{ github.sha }} .

- name: Push image
  run: docker push rocketseat-ci-api:${{ github.sha }}
```

**After (tag completa com username/repo:tag):**
```yaml
- name: Login into the container registry
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}

- name: Build Docker image
  run: docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/rocketseat-ci-api:${{ github.sha }} .

- name: Push image
  run: docker push ${{ secrets.DOCKERHUB_USERNAME }}/rocketseat-ci-api:${{ github.sha }}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Docker Hub | Use `docker/login-action@v3` |
| AWS ECR | Use action especifica do ECR (modulo 5) |
| Google Cloud | Use action especifica do GCloud |
| Precisa so de push | Token com permissao `write` basta |
| Verificar se push funcionou | Confira no Docker Hub se a tag corresponde ao SHA do commit |
| Build demora muito | Considere instalar dependencias fora do Dockerfile e copiar node_modules |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|-----------|
| `password: ${{ secrets.MINHA_SENHA }}` | `password: ${{ secrets.DOCKERHUB_TOKEN }}` (token, nao senha) |
| Build antes do login | Login como primeiro step |
| Tag sem username: `app:latest` | Tag completa: `user/app:sha` |
| Credenciais em variables | Credenciais em secrets |
| Token com full access sem necessidade | Token escopado para write apenas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
