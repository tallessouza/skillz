# Code Examples: Finalizando Atualização de Dependências

## Fluxo completo de atualização seletiva

### 1. Executar ncu interativo

```bash
# Limpar terminal para visibilidade
clear

# Executar npm-check-updates no modo interativo agrupado
npx npm-check-updates --interactive --group
```

Saída esperada: lista de pacotes desatualizados com checkboxes.

**Navegação no modo interativo:**
- Setas ↑↓ para navegar entre pacotes
- Barra de espaço para marcar/desmarcar
- Enter para confirmar seleção
- `y` para confirmar atualização

### 2. Selecionar apenas o pacote alvo

```
# Na interface interativa:
# 1. Desmarcar tudo (barra de espaço em cada item marcado)
# 2. Navegar até @types/node
# 3. Marcar com barra de espaço
# 4. Enter
# 5. Confirmar com y
```

### 3. Verificar arquivos do projeto

Abrir e inspecionar cada camada:

```
# Controllers
src/controllers/DeliveriesController.ts
src/controllers/SessionsController.ts
src/controllers/UserController.ts

# Middlewares
src/middlewares/ensureAuthenticated.ts

# Rotas
src/routes/index.ts

# Prisma
prisma/schema.prisma

# Testes
src/__tests__/*.spec.ts

# Utils
src/utils/*.ts

# Tipagens
src/@types/express.d.ts
```

### 4. Executar aplicação

```bash
npm run dev
```

### 5. Testar endpoints com Insomnia ou curl

```bash
# Criar usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Maria", "email": "maria@email.com", "password": "123456"}'

# Login
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{"email": "maria@email.com", "password": "123456"}'

# Listar entregas (com token)
curl -X GET http://localhost:3000/deliveries \
  -H "Authorization: Bearer <token>"
```

### 6. Verificar dependências restantes

```bash
npm outdated
```

Saída esperada após atualização: apenas `@types/express` restante (decisão consciente de manter).

### 7. Commitar

```bash
git add .
git commit -m "updated @types/node"
```

## Variações

### Atualizar múltiplos pacotes seguros de uma vez

Quando há certeza de que vários pacotes são seguros (ex: pacotes não relacionados a tipagem):

```bash
# Ainda assim usar interativo para controle
npx npm-check-updates --interactive --group

# Selecionar os pacotes desejados
# Testar após cada grupo lógico
```

### Verificar changelog antes de atualizar

```bash
# Ver versão atual vs disponível
npm outdated

# Consultar changelog do pacote
npm view @types/node versions --json | tail -5
```

### Rollback se algo quebrar

```bash
# Se a atualização causou problemas
git checkout -- package.json package-lock.json
npm install
```