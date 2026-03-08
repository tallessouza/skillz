# Code Examples: Minor Update de Dependências

## Comando principal: npm-check-updates interativo agrupado

```bash
# Formato completo usado na aula
npx npm-check-updates --interactive --format group
```

### O que acontece ao executar:

1. Lista todas as dependências com atualizações disponíveis
2. Agrupa em: patch, minor, major
3. Major vem desmarcada por padrão
4. Você seleciona/deseleciona com espaço
5. Confirma com Enter
6. Pergunta se quer instalar automaticamente (Y/n)

## Verificação pós-update

```bash
# Listar atualizações restantes (sem interativo)
npx npm-check-updates

# Resultado esperado após minor update:
# Apenas dependências major devem aparecer
# Ex: express 4.x → 5.x, @types/node 18.x → 20.x
```

## Executar e testar a aplicação

```bash
# Iniciar a aplicação
npm run dev

# Verificar no editor:
# 1. Aba Problems — sem erros novos
# 2. Navegar pelos arquivos principais (server.ts, app.ts, routes/, utils/)
```

## Teste com Insomnia/curl

```bash
# Listar recursos
curl http://localhost:3333/deliveries

# Atualizar status
curl -X PATCH http://localhost:3333/deliveries/{id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "sent"}'

# Consultar logs
curl http://localhost:3333/deliveries/{id}/logs
```

## Rollback em caso de problema

```bash
# Reverter package.json e lockfile
git checkout package.json package-lock.json

# Reinstalar dependências na versão anterior
npm install
```

## Variações úteis do npm-check-updates

```bash
# Apenas listar (sem alterar nada)
npx npm-check-updates

# Filtrar por tipo de dependência
npx npm-check-updates --dep prod      # apenas dependencies
npx npm-check-updates --dep dev       # apenas devDependencies

# Filtrar por pacote específico
npx npm-check-updates --filter express

# Atualizar apenas minor e patch (rejeitar major)
npx npm-check-updates --target minor -u

# O -u aplica as mudanças no package.json sem interativo
# Depois precisa rodar npm install manualmente
```

## Exemplo de output do npm-check-updates agrupado

```
Checking /path/to/project/package.json

 Minor Update  ────────────────────────
 @prisma/client  5.19.1  →  5.22.0
 prisma          5.19.1  →  5.22.0
 zod             3.22.4  →  3.22.8
 typescript      5.4.2   →  5.4.5

 Major Update  ────────────────────────
 express         4.18.2  →  5.0.0
 @types/node     18.19.3 →  20.11.5

Run npm install to install new versions.
```

Note como o agrupamento visual facilita a decisão: minor são seguras para atualizar em lote, major exigem análise individual.