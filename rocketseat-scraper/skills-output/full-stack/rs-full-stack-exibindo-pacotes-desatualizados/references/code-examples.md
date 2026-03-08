# Code Examples: Exibindo Pacotes Desatualizados

## Exemplo 1: Comando básico

```bash
npm outdated
```

Saída típica:

```
Package          Current  Wanted  Latest  Location              Depended by
express          4.19.0   4.21.1  4.21.1  node_modules/express  meu-projeto
jsonwebtoken     9.0.0    9.0.2   9.0.2   node_modules/jwt      meu-projeto
```

## Exemplo 2: Usando a abreviação

```bash
npm out
```

Produz exatamente o mesmo resultado que `npm outdated`.

## Exemplo 3: Interpretando cenários

### Cenário A — Atualização simples (Current < Wanted = Latest)

```
Package       Current  Wanted  Latest
express       4.19.0   4.21.1  4.21.1
```

Current (4.19.0) está atrás. Wanted e Latest são iguais (4.21.1). Atualização segura com `npm update`.

### Cenário B — Major disponível (Wanted < Latest)

```
Package       Current  Wanted  Latest
some-lib      2.3.0    2.5.1   3.0.0
```

Wanted (2.5.1) respeita o range `^2.3.0`. Latest (3.0.0) é uma nova major. Para ir para 3.0.0, precisa alterar o `package.json` manualmente e verificar breaking changes.

### Cenário C — Tudo atualizado

```bash
npm outdated
# (sem saída — nenhum pacote desatualizado)
```

Se não aparecer nenhuma linha, todas as dependências estão na versão mais recente compatível.

## Exemplo 4: Verificando no contexto do package.json

```json
{
  "dependencies": {
    "express": "^4.19.0",
    "jsonwebtoken": "^9.0.0"
  }
}
```

Com esse `package.json`, ao rodar `npm outdated`:
- Express: Current 4.19.0, Wanted 4.21.1 (porque `^4` permite qualquer 4.x.x)
- JWT: Current 9.0.0, Wanted 9.0.2 (porque `^9` permite qualquer 9.x.x)

## Dica: Limpar terminal antes de rodar

```bash
# Linux/Mac
clear

# Ou atalho Ctrl+L

# Windows
cls
```

Útil para ter uma visualização limpa do resultado do `npm outdated`.