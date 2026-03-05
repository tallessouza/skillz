# Deep Explanation: Implementando Cache com Redis

## Por que Redis para cache?

O Redis é descrito pelo instrutor como "um banco incrível e muito completo". Ele suporta estruturas alem de simples key-value:

- **Strings**: `set`/`get` — o basico para cache
- **Hashes** (prefixo H): `HGet`, `HDel` — armazenar objetos
- **Listas** (prefixo L): armazenar colecoes ordenadas
- **JSON**: modulo adicional necessario (`RedisJSON`)
- **Search**: busca full-text dentro do Redis

## Opcoes do comando SET

O instrutor navega pela documentacao oficial do Redis para explicar as opcoes do `SET`:

| Opcao | Significado | Exemplo |
|-------|-------------|---------|
| `EX` | Expiracao em segundos | `SET key value EX 900` (15 min) |
| `PX` | Expiracao em milissegundos | `SET key value PX 900000` |
| `EXAT` | Expira em timestamp Unix (segundos) | `SET key value EXAT 1700000000` |
| `PXAT` | Expira em timestamp Unix (ms) | `SET key value PXAT 1700000000000` |
| `NX` | Só seta se a chave NAO existe | Util para locks/idempotencia |
| `XX` | Só seta se a chave JA existe | Util para updates condicionais |

Essas opcoes podem ser combinadas. Por exemplo: `SET key value EX 900 NX` — seta com expiracao de 15 min, mas so se a chave nao existir.

## Por que expiracao é obrigatoria

O instrutor enfatiza: "geralmente o cache eu nao quero manter ele eternamente... é até perigoso isso, para evitar aquelas coisas de informacao desatualizada por muito tempo". Cache sem TTL é uma bomba-relogio — consome memoria e serve dados stale.

## Padrao de implementacao: Repository Pattern

A implementacao segue o mesmo padrao usado para banco de dados no curso:

1. **Interface** (`CacheRepository`) — define o contrato no dominio
2. **Implementacao** (`RedisCacheRepository`) — implementa com Redis
3. **Module wiring** — `provide: CacheRepository, useClass: RedisCacheRepository`
4. **Export** — exporta o `CacheRepository` para outros modulos

Isso permite trocar Redis por Memcached, DynamoDB, ou qualquer outro backend de cache sem alterar o dominio.

## Diferenca entre `del` e `get` no retorno

O `del` do Redis retorna um numero (quantidade de chaves deletadas), mas a interface do `CacheRepository` espera `void`. Por isso o instrutor usa `await` sem `return`:

```typescript
async delete(key: string): Promise<void> {
  await this.redis.del(key) // retorno numerico descartado
}
```

## Erros comuns encontrados durante a aula

### 1. Dependency resolution failure
**Erro:** `Can't resolve dependencies of RedisCacheRepository at index [0]`
**Causa:** O instrutor colocou `EnvService` nos providers em vez de `RedisService`
**Fix:** Corrigir o provider para o service correto

### 2. Missing @Injectable()
**Erro:** `Cannot read properties of undefined (reading 'get')`
**Causa:** Faltou o decorator `@Injectable()` na classe `RedisCacheRepository`
**Fix:** Adicionar `@Injectable()` antes da classe

### 3. Missing export
**Erro:** Outro modulo nao consegue injetar `CacheRepository`
**Causa:** `CacheModule` nao exportava o `CacheRepository`
**Fix:** Adicionar `CacheRepository` ao array `exports` do module

## Imagem Redis: dev vs producao

| Ambiente | Imagem | Razao |
|----------|--------|-------|
| Desenvolvimento | `redis` | Simples, sem configuracao |
| Producao | `bitnami/redis` | Configuracoes de seguranca, non-root, autenticacao |

## Volume mapping

O Redis armazena dados em `/data` dentro do container (diferente do Postgres que usa `/data/postgres`). O mapeamento local usa `./data/redis:/data`.