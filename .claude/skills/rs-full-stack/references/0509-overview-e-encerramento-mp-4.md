---
name: rs-full-stack-0509-overview-e-encerramento
description: "Enforces best practices for connecting React frontends to Node.js APIs, including authentication flows, form validation, pagination, search filtering, file uploads, and API documentation consumption. Use when user asks to 'connect frontend to API', 'implement login flow', 'add pagination', 'upload files from React', 'consume REST API', or 'build full-stack app'. Make sure to use this skill whenever integrating a React SPA with a backend API. Not for backend-only development, database schema design, or DevOps deployment."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [react, node, full-stack, api-integration, authentication]
---

# Conectando React com API Node.js — Fluxo Completo

> Implemente a conexao front-end/back-end seguindo o fluxo: autenticacao → rotas protegidas → CRUD com validacao → paginacao/busca → upload de arquivos.

## Rules

1. **Sempre consulte a documentacao da API antes de implementar** — APIs bem feitas disponibilizam endpoints, parametros e retornos documentados, porque implementar sem documentacao gera retrabalho
2. **Use JSON como padrao de comunicacao** — independente da tecnologia do backend (Node, Python, Java), o contrato e JSON, porque e o formato universal de APIs REST
3. **Valide no frontend E no backend** — validacoes de formulario (campos obrigatorios, tamanho minimo, confirmacao de senha) devem existir em ambas as camadas, porque o frontend valida UX e o backend valida seguranca
4. **Separe rotas de autenticacao de rotas protegidas** — rotas publicas (login, cadastro) e rotas autenticadas (dashboard, solicitacoes) devem ser grupos distintos, porque facilita o controle de acesso
5. **Use contexto para estado de autenticacao** — o estado do usuario logado deve estar em Context API, porque permite desconectar e redirecionar automaticamente de qualquer ponto da aplicacao
6. **Paginacao e busca sao parametros da requisicao** — envie page, perPage e search como query params para a API, porque o backend controla os dados retornados

## How to write

### Estrutura de rotas por perfil

```typescript
// Rotas publicas (autenticacao)
<Route path="/sign-in" element={<SignIn />} />
<Route path="/sign-up" element={<SignUp />} />

// Rotas protegidas por perfil
<Route path="/employee/*" element={<EmployeeLayout />} />
<Route path="/dashboard/*" element={<ManagerLayout />} />
```

### Requisicao com paginacao e busca

```typescript
const perPage = 3
const [page, setPage] = useState(1)
const [search, setSearch] = useState("")

const response = await api.get("/refunds", {
  params: { page, perPage, search },
})
```

### Fluxo de cadastro com validacao

```typescript
// Validar campos antes de enviar
if (password.length < 6) {
  setError("Senha deve ter pelo menos 6 digitos")
  return
}
if (password !== confirmPassword) {
  setError("Senhas nao conferem")
  return
}

await api.post("/users", { name, email, password })
```

## Example

**Before (sem estrutura):**
```typescript
// Tudo misturado, sem separacao de rotas
fetch("http://localhost:3000/users")
fetch("http://localhost:3000/login")
// Sem validacao, sem paginacao, sem auth context
```

**After (com esta skill aplicada):**
```typescript
// 1. API centralizada com baseURL
const api = axios.create({ baseURL: "http://localhost:3333" })

// 2. Rotas separadas: auth vs protegidas
// 3. Context gerencia usuario logado
// 4. Validacoes no formulario
// 5. Paginacao e busca via query params
// 6. Upload de arquivo via FormData
```

## Heuristics

| Situation | Do |
|-----------|-----|
| API sem documentacao | Abra o codigo do backend e identifique rotas, metodos e parametros esperados |
| Testar endpoint rapidamente | Use o navegador para GET (ele executa GET por padrao) ou Insomnia/Postman para outros metodos |
| Precisa de autenticacao | Armazene token no contexto, envie no header Authorization |
| Upload de arquivo | Use FormData e input type="file", nao JSON |
| Perfis diferentes (admin/user) | Separe em grupos de rotas distintos com layouts proprios |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Hardcode URLs em cada componente | Centralize baseURL em instancia axios/fetch |
| Validar apenas no backend | Valide no frontend (UX) e no backend (seguranca) |
| Guardar estado auth em useState local | Use Context API para estado global de autenticacao |
| Buscar todos os registros e filtrar no frontend | Envie parametros de paginacao e busca para a API |
| Implementar sem ler documentacao da API | Consulte documentacao ou codigo do backend primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre integracao frontend-backend, documentacao de APIs e fluxo de autenticacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| CORS bloqueando requisicoes do frontend | Backend sem configuracao de CORS | Configure CORS no Express/Fastify para permitir a origem do frontend |
| Token nao enviado nas requisicoes | Header Authorization nao configurado | Configure interceptor no Axios para adicionar `Bearer ${token}` |
| Validacao so funciona no frontend | Backend nao valida dados de entrada | Implemente validacao em ambas as camadas |
| Upload de arquivo falha | Usando JSON em vez de FormData | Use `new FormData()` e `input type="file"` para uploads |