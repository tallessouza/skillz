# Code Examples: Versionamento Semântico

## Exemplo base do instrutor

A versão usada como exemplo na aula:

```
1.12.7
│  │  └── PATCH = 7  (sétima correção de bug nesta minor)
│  └───── MINOR = 12 (décima segunda adição de funcionalidade nesta major)
└──────── MAJOR = 1  (primeira versão estável)
```

## Lendo versões no package.json

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "knex": "~3.1.0",
    "pg": "8.11.3"
  }
}
```

### Interpretação:

| Dependência | Versão | Range | Significado |
|-------------|--------|-------|-------------|
| express | ^4.18.2 | >= 4.18.2, < 5.0.0 | Aceita MINOR e PATCH — seguro dentro do MAJOR 4 |
| knex | ~3.1.0 | >= 3.1.0, < 3.2.0 | Aceita apenas PATCH — mais conservador |
| pg | 8.11.3 | exatamente 8.11.3 | Versão fixa — nenhuma atualização automática |

## Cenário: Atualização segura (PATCH)

```bash
# Versão atual no package.json: "express": "^4.18.2"
# Versão disponível: 4.18.3

# O que mudou? PATCH (2 → 3)
# Risco: Nenhum — correções de bugs apenas
npm update express
# ✅ Seguro
```

## Cenário: Nova funcionalidade (MINOR)

```bash
# Versão atual: "express": "^4.18.2"
# Versão disponível: 4.19.0

# O que mudou? MINOR (18 → 19) e PATCH resetou (2 → 0)
# Risco: Baixo — funcionalidades novas, compatível com 4.x
npm update express
# ✅ Seguro, mas teste a aplicação
```

## Cenário: Breaking change (MAJOR)

```bash
# Versão atual: "express": "^4.18.2"
# Versão disponível: 5.0.0

# O que mudou? MAJOR (4 → 5)
# Risco: ALTO — breaking changes possíveis
# O ^ não vai puxar automaticamente (< 5.0.0)

# ⚠️ ANTES de atualizar:
# 1. Ler changelog/migration guide do Express 5
# 2. Verificar quais APIs foram removidas/alteradas
# 3. Atualizar código afetado
# 4. Testar toda a aplicação

npm install express@5.0.0
# ⚠️ Requer verificação manual
```

## Verificando versões instaladas vs disponíveis

```bash
# Ver versões desatualizadas
npm outdated

# Saída exemplo:
# Package  Current  Wanted  Latest  Location
# express  4.18.2   4.19.1  5.0.0   node_modules/express
# knex     3.1.0    3.1.2   3.2.0   node_modules/knex

# Current: versão instalada
# Wanted: maior versão dentro do range do package.json
# Latest: última versão publicada (pode ser MAJOR novo)
```

## Instalando versão específica

```bash
# Instalar versão exata
npm install express@4.18.2

# Instalar última MINOR de um MAJOR
npm install express@^4.0.0

# Instalar última PATCH de uma MINOR
npm install express@~4.18.0
```

## Timeline de uma biblioteca (conceito do instrutor)

```
Biblioteca "exemplo-lib":

0.1.0 → 0.2.0 → 0.3.0 → 1.0.0 → 1.0.1 → 1.1.0 → 1.1.1 → 2.0.0
│                         │         │         │         │         │
│ Desenvolvimento         │ Estável │ Bug fix │ Feature │ Fix     │ Breaking
│ inicial (instável)      │         │         │         │         │ change
```

Cada bump conta uma história:
- `0.x.x` — biblioteca em desenvolvimento, API instável
- `1.0.0` — primeira versão estável, contrato público definido
- `1.0.1` — correção de bug (PATCH)
- `1.1.0` — nova funcionalidade compatível (MINOR)
- `1.1.1` — correção dentro da nova funcionalidade (PATCH)
- `2.0.0` — mudança incompatível, novo contrato (MAJOR)