# Code Examples: Atualizando Dependências Major

## Listando atualizações disponíveis (agrupadas)

```bash
# Lista todas as atualizações disponíveis, agrupadas por tipo (major/minor/patch)
npx npm-check-updates --format group
```

Saída típica mostra seções separadas para major, minor e patch updates.

## Modo interativo (selecionar uma por vez)

```bash
# Abre interface interativa para selecionar quais atualizar
npx npm-check-updates --interactive --format group
```

Fluxo:
1. Lista aparece com todas as dependências
2. Use **barra de espaço** para marcar/desmarcar (bolinha verde = selecionada)
3. Selecione apenas UMA dependência major
4. Enter para confirmar seleção
5. Y para confirmar instalação

## Exemplo real: Express 4 → 5

```bash
# Antes
"express": "^4.17.21"

# Depois (via npm-check-updates interativo)
"express": "^5.0.0"
```

## Verificação pós-update

### Iniciar a aplicação

```bash
npm run dev
# Verificar se o servidor inicia sem erros no console
```

### Testar rotas manualmente (Insomnia ou curl)

```bash
# Criar usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João", "email": "joao@test.com", "password": "123456"}'

# Login
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@test.com", "password": "123456"}'

# Listar recursos
curl http://localhost:3000/deliveries \
  -H "Authorization: Bearer <token>"
```

### Verificação de tipagem

```bash
# Checar todos os erros de tipo do projeto
npx tsc --noEmit
```

## Erros típicos do Express 4 → 5 (tipagem)

### Problema: métodos de rota com tipagem incompatível

```typescript
// Express 4 — tipagem aceita
router.get("/users", (request: Request, response: Response) => {
  // ...
})

// Express 5 — tipagem mudou, pode exigir ajustes nos generics
// O erro aparece nos métodos get, post, put, delete
// Todos com o mesmo padrão de erro
```

### Locais mais afetados

```
src/
├── app.ts              ← 1 erro (middleware/configuração)
├── routes/
│   ├── user.routes.ts  ← erros nos métodos HTTP
│   ├── delivery.routes.ts ← erros nos métodos HTTP
│   └── session.routes.ts  ← erros nos métodos HTTP
├── controllers/        ← sem erros (lógica pura)
├── middlewares/         ← sem erros
└── server.ts           ← sem erros
```

Total: 8 problemas, todos relacionados à tipagem dos métodos de rota.

## Revertendo se necessário

```bash
# Se algo deu muito errado, reverta antes de tentar de novo
git checkout package.json package-lock.json
npm install
```

## Fluxo completo recomendado

```bash
# 1. Ver o que tem para atualizar
npx npm-check-updates --format group

# 2. Atualizar UMA major por vez
npx npm-check-updates --interactive --format group
# Selecionar apenas uma, confirmar

# 3. Testar runtime
npm run dev
# Testar rotas no Insomnia/curl

# 4. Verificar tipagem (abrir cada arquivo OU)
npx tsc --noEmit

# 5. Resolver TODOS os erros

# 6. Commit
git add .
git commit -m "chore: update express to v5"

# 7. Repetir para a próxima dependência major
```