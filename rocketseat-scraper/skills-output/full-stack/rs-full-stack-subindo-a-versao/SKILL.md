---
name: rs-full-stack-subindo-a-versao
description: "Enforces npm version pinning best practices when installing specific package versions, upgrading dependencies, or managing library versions in Node.js projects. Use when user asks to 'install a specific version', 'upgrade a package', 'pin a dependency', 'update express', or 'check package versions'. Applies semver-aware installation with @version syntax and post-install verification. Make sure to use this skill whenever installing or upgrading npm packages to specific versions. Not for npm publish, package authoring, or monorepo workspace management."
---

# Subindo a Versão — Instalação de Versões Específicas com NPM

> Ao instalar dependências, especifique a versão exata para garantir reprodutibilidade e evitar quebras silenciosas.

## Rules

1. **Sempre consulte as versões disponíveis antes de instalar** — use o site do npmjs.com ou `npm view {pacote} versions` para verificar quais versões existem, porque instalar uma versão inexistente causa erro silencioso ou fallback inesperado
2. **Prefira a versão estável (latest/listed)** — a tag `latest` indica a versão estável recomendada; evite `next` ou `beta` em produção, porque versões instáveis podem conter breaking changes
3. **Use a sintaxe @versão para pinning exato** — `npm i pacote@x.y.z` instala exatamente aquela versão, porque sem o @ o npm resolve para latest automaticamente
4. **Faça double check após instalar** — rode `npm i` após forçar versões específicas para garantir que a árvore de dependências está consistente, porque instalações forçadas podem deixar o lock file dessincronizado
5. **Filtre versões por major version** — no semver.npmjs.com use `4.x` para listar apenas versões compatíveis com a major 4, porque misturar major versions causa breaking changes

## Steps

### Step 1: Consultar versões disponíveis

```bash
# Via terminal
npm view express versions --json

# Ou filtrar por major version no semver.npmjs.com
# URL: semver.npmjs.com — campo: pacote, range: 4.x
```

### Step 2: Instalar versão específica

```bash
# Sintaxe: npm i <pacote>@<versão-exata>
npm i express@4.19.0
npm i jsonwebtoken@9.0.0
```

### Step 3: Verificar instalação no package.json

```json
{
  "dependencies": {
    "express": "^4.19.0",
    "jsonwebtoken": "^9.0.0"
  }
}
```

### Step 4: Double check das dependências

```bash
# Sempre rodar após forçar versões específicas
npm i
```

## Example

**Before (instalação sem controle de versão):**
```bash
npm i express
# Instala whatever latest é — pode ser 5.x com breaking changes
```

**After (com esta skill aplicada):**
```bash
# 1. Consultar versões disponíveis
npm view express versions --json

# 2. Instalar versão específica da faixa desejada
npm i express@4.19.0

# 3. Double check
npm i
```

## Heuristics

| Situação | Faça |
|----------|------|
| Projeto novo | Use latest estável, mas pin a versão exata |
| Projeto existente com major antigo | Instale na mesma faixa major (`4.x`, não `5.x`) |
| Precisa de feature de versão nova | Consulte changelog antes de subir major |
| Após forçar qualquer versão | Rode `npm i` para sincronizar lock file |
| Múltiplas libs para atualizar | Instale uma por vez e teste entre cada uma |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| `npm i express` sem saber a versão | `npm i express@4.19.0` com versão explícita |
| Instalar versão `next`/`beta` em produção | Usar a versão com tag `latest` |
| Subir major version sem verificar changelog | Consultar breaking changes antes de subir |
| Ignorar `npm i` após instalação forçada | Sempre rodar `npm i` como double check |
| Instalar sem consultar versões disponíveis | `npm view pacote versions` antes de instalar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre semver, tags de versão e estratégias de atualização
- [code-examples.md](references/code-examples.md) — Todos os exemplos de instalação expandidos com variações