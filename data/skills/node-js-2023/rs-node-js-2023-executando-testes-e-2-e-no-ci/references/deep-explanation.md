# Deep Explanation: E2E Tests no CI

## Por que separar E2E de unit tests no CI?

O instrutor explica que testes E2E precisam do "ambiente completo da aplicacao" — banco de dados, servidor, todas as pontas no ar. Isso os torna significativamente mais lentos que testes unitarios. A implicacao pratica: rodar E2E em cada push seria "extremamente pesado" e poderia estourar o plano gratuito do GitHub Actions.

A estrategia e clara: **unit tests rodam em cada push (rapidos, baratos), E2E rodam somente em pull requests (testam a feature completa, nao cada commit).**

## Service Containers vs Docker Compose

O insight mais valioso da aula e a conversao de um servico do `docker-compose.yml` para a sintaxe de services do GitHub Actions. O instrutor literalmente copia o servico do Docker Compose e adapta — mas descobre na pratica que a sintaxe difere:

1. **`environment` no Docker Compose → `env` no GitHub Actions** — O instrutor errou isso ao vivo e teve que corrigir. Ele ate se confundiu achando que era `environment` no Actions, mas e `env`.

2. **`=` no Docker Compose → `:` no GitHub Actions** — Outra diferenca sintatica que causou falha. No Docker Compose voce escreve `POSTGRES_USER=docker`, no GitHub Actions YAML e `POSTGRES_USER: docker`.

3. **Estrutura do YAML** — O instrutor precisou ajustar a indentacao e estrutura ao converter.

## O problema do Health Check

O instrutor menciona um conceito importante: **health check** (checagem de vida). O problema: os testes nao podem executar antes do Postgres estar realmente disponivel para operacoes. Ele buscou na documentacao do Bitnami Postgres mas nao encontrou health check configurado automaticamente.

Na pratica, o GitHub Actions tem opcoes de health check nativas para service containers que resolvem isso:

```yaml
options: >-
  --health-cmd "pg_isready"
  --health-interval 10s
  --health-timeout 5s
  --health-retries 5
```

## Variaveis ambiente sem .env

No ambiente local, a aplicacao le variaveis de um arquivo `.env`. No CI, esse arquivo nao existe (e nao deve ser commitado). A solucao e passar as variaveis diretamente no step do workflow via `env:`.

Para variaveis sensiveis (como JWT_SECRET em producao), o correto seria usar GitHub Secrets. Mas para testes, um valor hardcoded como "testing" e aceitavel — o instrutor usa exatamente essa abordagem.

## Workflow novo so ativa apos merge

Um detalhe sutil que o instrutor demonstra na pratica: quando ele criou o workflow de E2E numa branch e abriu uma PR, os testes E2E nao rodaram. O workflow so passou a funcionar apos o merge para main. Isso porque o GitHub Actions precisa que o arquivo de workflow exista na branch base (main) para ser ativado em PRs subsequentes.

## Fluxo completo demonstrado

1. Criar branch (`git checkout -b e2e`)
2. Adicionar workflow file
3. Commit e abrir PR (usando `gh pr create`)
4. Merge para main (para o workflow existir na branch base)
5. Criar nova branch com qualquer mudanca
6. Abrir nova PR → agora os E2E rodam
7. Na PR, checks mostram tanto unit tests quanto E2E

## Initialize Containers

O instrutor destaca que o GitHub Actions tem uma etapa automatica chamada "Initialize Containers" onde ele sobe o container do Postgres, e ao final dos testes, para os containers — "como se fosse o docker compose".