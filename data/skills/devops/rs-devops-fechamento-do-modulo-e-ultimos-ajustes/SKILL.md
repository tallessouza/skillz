---
name: rs-devops-docker-push-all-tags
description: "Enforces optimized Docker push workflows in CI/CD pipelines by using docker push --all-tags instead of duplicate push commands. Use when user asks to 'build docker image', 'push to registry', 'setup CI/CD pipeline', 'optimize docker workflow', or 'configure GitHub Actions for Docker'. Eliminates redundant push steps and ensures both version tag and latest tag are pushed in a single command. Make sure to use this skill whenever writing Dockerfiles or CI/CD pipelines that push images to registries. Not for Kubernetes deployments, Docker Compose, or local development workflows."
---

# Docker Push Otimizado com All-Tags

> Em pipelines CI/CD, use `docker push --all-tags` para enviar todas as tags de uma imagem em um unico comando, eliminando pushes duplicados.

## Rules

1. **Nunca duplique comandos docker push** — um push por imagem com `--all-tags` substitui multiplos pushes individuais, porque comandos duplicados aumentam tempo de pipeline e risco de falha parcial
2. **Separe build, tag e push** — `docker build` → `docker tag` → `docker push --all-tags`, porque cada etapa tem responsabilidade unica e facilita debug
3. **Sempre gere tag versionada E latest** — build com tag de versao, depois `docker tag` para latest, porque consumidores precisam de ambas
4. **Use variaveis/secrets para tags dinamicas** — nunca hardcode versoes no pipeline, porque tags vem de SHA, semver ou release

## How to write

### Pipeline CI/CD otimizado

```yaml
# GitHub Actions - Docker build and push
- name: Build Docker image
  run: docker build -t ${{ secrets.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ env.VERSION }} .

- name: Tag as latest
  run: docker tag ${{ secrets.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ env.VERSION }} ${{ secrets.REGISTRY }}/${{ env.IMAGE_NAME }}:latest

- name: Push all tags
  run: docker push ${{ secrets.REGISTRY }}/${{ env.IMAGE_NAME }} --all-tags
```

## Example

**Before (push duplicado):**
```yaml
- name: Build
  run: docker build -t registry/app:v1.0 .
- name: Push version
  run: docker push registry/app:v1.0
- name: Tag latest
  run: docker tag registry/app:v1.0 registry/app:latest
- name: Push latest
  run: docker push registry/app:latest
```

**After (com --all-tags):**
```yaml
- name: Build
  run: docker build -t registry/app:v1.0 .
- name: Tag latest
  run: docker tag registry/app:v1.0 registry/app:latest
- name: Push all tags
  run: docker push registry/app --all-tags
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Imagem precisa de tag versao + latest | Build com versao, tag para latest, push --all-tags |
| Pipeline tem multiplos `docker push` | Consolidar em um unico --all-tags |
| Release automatica via GitHub | Usar tag da release como versao da imagem |
| Registry requer autenticacao | docker login antes do push, credenciais em secrets |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Dois `docker push` separados para mesma imagem | `docker push --all-tags` unico |
| Tag hardcoded no pipeline (`v1.0`) | Variavel dinamica (`${{ env.VERSION }}`) |
| Push sem tag latest | Sempre taguear latest antes do push |
| Build e push na mesma linha | Separar em steps distintos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
