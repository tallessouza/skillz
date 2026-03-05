# Deep Explanation: Estrategia de Refresh Token

## Por que JWT precisa de refresh token?

O JWT e stateless — nao e salvo no banco de dados. Isso significa que **nao existe forma nativa de invalidar um token**. Se um usuario faz logout, o token anterior continua valido ate expirar. Se alguem rouba o token, tem acesso ate a expiracao.

A solucao e usar **expiracao curta** no access token (10 minutos). Mas isso criaria uma experiencia horrivel: o usuario teria que fazer login a cada 10 minutos.

O refresh token resolve esse dilema: o usuario recebe **dois tokens** no login:

1. **Access token** (10min) — usado nas requisicoes, visivel ao frontend
2. **Refresh token** (7 dias) — usado apenas para renovar o access token, invisivel ao frontend

## O fluxo completo

```
Login (email + senha)
  → Backend gera access token (10min) + refresh token (7 dias)
  → Access token vai no body da resposta (frontend armazena)
  → Refresh token vai em cookie HttpOnly (frontend NAO ve)

Requisicao normal:
  → Frontend envia access token no header Authorization
  → Backend valida, responde normalmente

Access token expirou (apos 10min):
  → Backend rejeita com 401
  → Frontend faz requisicao para rota de refresh
  → Cookie com refresh token e enviado automaticamente pelo browser
  → Backend valida refresh token, gera NOVO access token
  → Ciclo recomeca

Refresh token expirou (apos 7 dias sem acesso):
  → Usuario precisa fazer login novamente com email/senha
```

## Por que separar em dois tokens?

A analogia do instrutor: o access token e como um cracha de visitante com validade curta. Se alguem roubar, tem acesso por 10 minutos. O refresh token e como a chave do cofre — fica guardado em lugar seguro (cookie HttpOnly) onde ninguem consegue acessar via JavaScript.

## Opcoes de seguranca do cookie explicadas

### `httpOnly: true`
O cookie **nao aparece** no `document.cookie` do JavaScript. Um atacante com XSS nao consegue ler o valor. O cookie so trafega nas requisicoes HTTP entre browser e servidor.

### `secure: true`
O cookie so e enviado em conexoes HTTPS. Em localhost sem HTTPS, o cookie ainda e visivel no dev tools (comportamento esperado em desenvolvimento), mas em producao o browser encripta o transporte.

### `sameSite: true` (equivale a `strict`)
O cookie so e enviado em requisicoes originadas do mesmo dominio. Previne ataques CSRF onde um site malicioso tenta fazer requisicoes ao seu backend usando os cookies do usuario.

### `path: '/'`
Define quais rotas do backend podem ler o cookie. Com `/`, todas as rotas tem acesso. Voce poderia restringir para `/token/refresh` se quisesse que apenas a rota de refresh lesse o cookie.

## Signed vs unsigned cookies

O instrutor configura `signed: false`. Assinatura de cookie e um processo onde o backend aplica um hash ao valor do cookie para garantir que ele foi gerado pelo proprio backend. No caso do refresh token, essa assinatura e **redundante** porque o proprio JWT ja tem assinatura interna (o secret do JWT). Assinar o cookie seria assinar algo que ja e assinado.

## Estrategias alternativas mencionadas

O instrutor menciona que existem varias estrategias para refresh token:

1. **Refresh token stateless (a implementada)** — ambos tokens sao JWTs, nenhum salvo no banco
2. **Refresh token no banco** — salvar o refresh token no banco permite invalidacao explicita no logout (deletar o registro)
3. **Refresh token com rotacao** — cada vez que o refresh token e usado, um novo e gerado e o anterior e invalidado

A estrategia 1 e a mais simples mas nao permite invalidacao antes da expiracao. Para apps que precisam de logout real (revogar acesso imediato), a estrategia 2 e recomendada.

## Integracao com frontend

Quando o frontend e separado do backend (SPA), os cookies nao sao enviados automaticamente em requisicoes cross-origin. E necessario:

**No servidor (Fastify):**
```typescript
app.register(cors, {
  origin: true,
  credentials: true, // permite envio de cookies cross-origin
})
```

**No cliente (Axios):**
```typescript
const api = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true, // envia cookies em toda requisicao
})
```

Sem essas configuracoes, o browser simplesmente nao seta o cookie recebido do backend.