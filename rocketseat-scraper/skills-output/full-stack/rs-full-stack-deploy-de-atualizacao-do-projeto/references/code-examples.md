# Code Examples: Deploy de Atualização do Projeto

## Exemplo 1: Validação de recurso não encontrado (a mudança feita na aula)

### Antes (bug — retornava null)

```typescript
// delivery-logs-controller.js — método show
async show(request, response) {
  const { id } = request.params

  const delivery = await knex("deliveries").where({ id }).first()

  // Se delivery não existe, retorna null sem status adequado
  return response.json(delivery)
}
```

### Depois (com validação 404)

```typescript
// delivery-logs-controller.js — método show
async show(request, response) {
  const { id } = request.params

  const delivery = await knex("deliveries").where({ id }).first()

  if (!delivery) {
    return response.status(404).json({ message: "Delivery not found" })
  }

  return response.json(delivery)
}
```

## Exemplo 2: Comandos Git completos para deploy de atualização

```bash
# 1. Verificar o que mudou
git status
git diff

# 2. Adicionar todas as mudanças
git add .

# 3. Commit com prefixo semântico
git commit -m "fix: show delivery not found case"

# 4. Enviar para o GitHub (branch principal)
git push

# 5. Acompanhar no dashboard do serviço (Render, Vercel, etc.)
# → O deploy inicia automaticamente ao detectar push na branch principal
```

## Exemplo 3: Variações de commits semânticos

```bash
# Correção de bug
git commit -m "fix: return 404 when delivery not found"

# Nova funcionalidade
git commit -m "feat: add delivery status filter endpoint"

# Configuração / manutenção
git commit -m "chore: add PORT to .env.example"

# Documentação
git commit -m "doc: update API endpoints in README"

# Correção com escopo
git commit -m "fix(delivery): validate existence before returning logs"

# Feature com escopo
git commit -m "feat(auth): add JWT token refresh endpoint"
```

## Exemplo 4: Padrão de validação de recurso para outros controllers

```typescript
// Padrão reutilizável: sempre validar existência antes de operar

// users-controller.js
async show(request, response) {
  const { id } = request.params
  const user = await knex("users").where({ id }).first()

  if (!user) {
    return response.status(404).json({ message: "User not found" })
  }

  return response.json(user)
}

// orders-controller.js
async update(request, response) {
  const { id } = request.params
  const order = await knex("orders").where({ id }).first()

  if (!order) {
    return response.status(404).json({ message: "Order not found" })
  }

  // ... lógica de update
}
```

## Exemplo 5: Verificação pós-deploy com curl

```bash
# Testar endpoint que foi corrigido
curl -s https://minha-app.onrender.com/deliveries/99999/logs | jq .
# Esperado: {"message": "Delivery not found"}

# Verificar status code
curl -o /dev/null -s -w "%{http_code}" https://minha-app.onrender.com/deliveries/99999/logs
# Esperado: 404

# Testar endpoint com ID válido (deve continuar funcionando)
curl -s https://minha-app.onrender.com/deliveries/1/logs | jq .
# Esperado: dados do delivery
```