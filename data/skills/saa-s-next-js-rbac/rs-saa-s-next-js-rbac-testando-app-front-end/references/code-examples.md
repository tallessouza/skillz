# Code Examples: Testando App Front-end em Producao

## Correcao do import de cookies-next

### Codigo com erro (producao)

```typescript
// auth.ts ou similar
import cookies from 'cookies-next'

// Isso causa: Cannot read property of undefined reading 'getCookie'
const token = cookies.getCookie('token')
```

### Codigo corrigido

```typescript
import { getCookie } from 'cookies-next'

const token = getCookie('token')
```

### Commit message usado

```bash
git commit -m "fix: import named getCookie export from cookies-next"
git push
```

## Teste da API com Postman

### Request de criacao de usuario

```http
POST https://sua-app.onrender.com/users
Content-Type: application/json

{
  "name": "Diego Fernandes",
  "email": "diego@skillz.team",
  "password": "diego123"
}
```

### Comportamento esperado

- Resposta em < 2 segundos se backend ativo
- Se nao responder: backend em cold start, aguardar 30-60s
- Apos cold start, retry deve funcionar normalmente

## Configuracao de DNS na AWS Route 53

### Registro TXT (dominio ja apontando para Vercel)

```
Record name: _vercel
Record type: TXT
Value: (valor fornecido pelo Vercel)
```

### Registro CNAME (dominio novo)

```
Record name: app (ou subdominio desejado)
Record type: CNAME
Value: cname.vercel-dns.com
```

## Fluxo completo de teste pos-deploy

```
1. Acessar https://app.seudominio.dev
2. Criar conta (signup)
   - Name: "Test User"
   - Email: "test@seudominio.com"
   - Password: "senha123"
3. Fazer login com credenciais criadas
4. Criar organizacao
   - Nome: "Minha Org"
   - Dominio: "minha-org.com"
5. Criar projeto dentro da organizacao
6. Verificar listagem de projetos
```