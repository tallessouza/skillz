---
name: rs-devops-configurando-o-storage
description: "Applies MinIO MC client configuration patterns when setting up object storage in Docker Compose. Use when user asks to 'configure MinIO', 'create buckets', 'setup object storage', 'MC client docker', or 'MinIO Docker Compose'. Covers alias setup, bucket creation with MB/RB commands, ephemeral containers, and permission configuration. Make sure to use this skill whenever configuring MinIO or S3-compatible storage in containerized environments. Not for AWS S3 direct configuration, application-level file uploads, or database storage."
---

# Configurando Storage com MinIO MC Client

> Configure buckets MinIO via MC client em containers efemeros no Docker Compose, com alias, credenciais e permissoes corretas.

## Rules

1. **Sempre configure o alias antes de operar buckets** — `mc alias set minio http://minio:9000 ACCESS SECRET`, porque sem alias o MC nao sabe onde conectar e falha silenciosamente sem erro claro
2. **Use containers efemeros para setup de buckets** — container sobe, executa comandos MC, e morre com `exit 0`, porque bucket creation e uma operacao one-shot
3. **Nunca use restart: always em containers efemeros** — o `exit 0` no entrypoint causa loop infinito de restarts, porque o Docker interpreta qualquer exit como falha e reinicia
4. **Use depends_on no container MC** — depende do servico MinIO, porque o MC precisa do servidor disponivel para conectar
5. **Credenciais do alias devem ser as mesmas do MinIO** — `MINIO_ROOT_USER` e `MINIO_ROOT_PASSWORD`, porque access key e secret key divergentes causam falha silenciosa
6. **Use o DNS interno do Docker para o host** — `http://minio:9000` (nome do servico), porque containers na mesma rede Docker se resolvem por service name

## How to write

### Container MC no Docker Compose

```yaml
bucket:
  image: minio/mc
  container_name: mc
  depends_on:
    - minio
  entrypoint: >
    /bin/sh -c "
    /usr/bin/mc alias set minio http://minio:9000 $${MINIO_ROOT_USER} $${MINIO_ROOT_PASSWORD} &&
    /usr/bin/mc rm -r --force minio/BUCKET_NAME || true &&
    /usr/bin/mc mb minio/BUCKET_NAME &&
    /usr/bin/mc anonymous set public minio/BUCKET_NAME &&
    exit 0
    "
  environment:
    MINIO_ROOT_USER: ${MINIO_ROOT_USER}
    MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
```

### Comandos MC essenciais

```bash
# Criar bucket
mc mb minio/bucket-name

# Remover bucket recursivamente
mc rm -r --force minio/bucket-name

# Tornar bucket publico
mc anonymous set public minio/bucket-name

# Configurar alias (conexao)
mc alias set ALIAS_NAME http://HOST:9000 ACCESS_KEY SECRET_KEY
```

## Example

**Before (sem alias — falha silenciosa):**

```yaml
bucket:
  image: minio/mc
  restart: always  # ERRO: causa loop infinito
  entrypoint: >
    /bin/sh -c "
    /usr/bin/mc rm -r --force minio/lock &&
    /usr/bin/mc mb minio/lock &&
    /usr/bin/mc anonymous set public minio/lock &&
    exit 0
    "
```

**After (com alias e sem restart):**

```yaml
bucket:
  image: minio/mc
  container_name: mc
  depends_on:
    - minio
  entrypoint: >
    /bin/sh -c "
    /usr/bin/mc alias set minio http://minio:9000 $${MINIO_ROOT_USER} $${MINIO_ROOT_PASSWORD} &&
    /usr/bin/mc rm -r --force minio/lock || true &&
    /usr/bin/mc mb minio/lock &&
    /usr/bin/mc anonymous set public minio/lock &&
    exit 0
    "
  environment:
    MINIO_ROOT_USER: ${MINIO_ROOT_USER}
    MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Bucket precisa existir ao subir stack | Container efemero MC com depends_on no MinIO |
| Bucket pode ser publico (logs, assets) | `mc anonymous set public minio/bucket` |
| Bucket privado (dados sensiveis) | Nao use anonymous, configure policies via MC |
| Container MC reiniciando em loop | Remova `restart: always`, use `|| true` em rm |
| MC executa mas bucket nao aparece | Verifique alias — credenciais e host corretos |
| Precisa depurar MC | `docker logs mc` — verifique erros de credencial/URL |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `restart: always` em container efemero | Sem restart policy, deixe morrer com `exit 0` |
| MC sem `mc alias set` antes | Sempre configure alias como primeiro comando |
| Host `localhost:9000` dentro de container | Use nome do servico Docker: `minio:9000` |
| Hardcode credenciais no entrypoint | Use variaveis de ambiente `$${VAR}` |
| Ignorar logs quando bucket nao aparece | `docker logs mc` para diagnosticar |
| `mc mb` sem `|| true` no `mc rm` anterior | Adicione `|| true` no rm para primeira execucao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
