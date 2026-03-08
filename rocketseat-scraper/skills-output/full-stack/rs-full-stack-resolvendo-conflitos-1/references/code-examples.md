# Code Examples: Resolvendo Conflitos de Dependências

## Exemplo 1: Diagnóstico com `any` (apenas para teste)

O instrutor demonstra este padrão **apenas para confirmar** que o erro é de tipagem:

```typescript
// ANTES — error handler com tipagem correta (mas incompatível com @types/express@5.0.0)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})
// ❌ Erro: overload matches this call

// TESTE TEMPORÁRIO — confirmar que é problema de tipagem
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})
// ✅ Sem erro — confirmado: é conflito de tipagem
// ⚠️ REVERTER IMEDIATAMENTE — any nunca é solução
```

## Exemplo 2: Erros em rotas (overload matches)

```typescript
// Arquivo de rotas — deliveries.routes.ts
import { Router } from 'express'

const router = Router()

// Com @types/express@5.0.0 — ERRO
router.post('/deliveries', (req: Request, res: Response) => {
  // ❌ Overload matches this call
  // Os parâmetros não batem com a assinatura esperada
})

// Com @types/express@4.17.21 — OK
router.post('/deliveries', (req: Request, res: Response) => {
  // ✅ Tipagem compatível
})
```

## Exemplo 3: Busca da versão compatível e instalação

```bash
# 1. Ver qual versão está causando problema
npm ls @types/express
# └── @types/express@5.0.0

# 2. No site do NPM, buscar versões da major 4
# Ou via CLI:
npm view @types/express versions --json | grep "4.17"

# 3. Instalar a versão compatível mais recente da major 4
npm i @types/express@4.17.21

# 4. Verificar que instalou corretamente
npm ls @types/express
# └── @types/express@4.17.21

# 5. Confirmar que não há mais erros
npx tsc --noEmit
```

## Exemplo 4: Verificação com npm outdated

```bash
npm outdated

# Saída esperada após o rollback:
# Package          Current   Wanted   Latest
# @types/express   4.17.21   4.17.21  5.0.0
# @types/node      ...       ...      ...

# @types/express mostra Latest como 5.0.0
# mas Current e Wanted são 4.17.21 (nossa escolha consciente)
```

## Exemplo 5: Commits incrementais durante atualização

```bash
# Commit 1: Atualizou dependências menores (sem problemas)
git add .
git commit -m "chore: update minor dependencies"

# Commit 2: Tentou atualizar @types/express, encontrou conflito, fez rollback
git add .
git commit -m "fix: @types/express compatibility"

# Se precisar reverter apenas o rollback:
git revert HEAD  # reverte só o último commit

# Se precisar reverter tudo:
git revert HEAD~1..HEAD  # reverte os últimos 2 commits
```

## Exemplo 6: Buscando o erro nas Issues do GitHub

```
1. Acesse https://www.npmjs.com/package/express
2. Clique em "Repository" → abre o GitHub
3. Vá em "Issues"
4. Cole o texto do erro: "overload matches this call"
5. Filtre por Open issues
6. Procure issues classificadas como "bug"
7. Leia os comentários para encontrar soluções
```

## Exemplo 7: Estrutura do package.json após resolução

```json
{
  "dependencies": {
    "express": "^5.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.0.0"
  }
}
```

Note que `express` está na v5, mas `@types/express` está na v4. Isso é válido — a API em runtime do Express 5 é compatível com os types da v4 para a maioria dos casos de uso.