# Deep Explanation: CORS — Cross-Origin Resource Sharing

## O que é CORS

CORS significa **Cross-Origin Resource Sharing** — é uma funcionalidade de segurança implementada pelos navegadores que permite (ou bloqueia) que uma página web acesse recursos de uma origem diferente daquela que a serviu.

## O conceito de "origem"

Uma **origem** é definida pela combinação de:
- **Protocolo** (http vs https)
- **Host** (localhost, meusite.com)
- **Porta** (3000, 3333, 80)

Se qualquer um desses três elementos for diferente, o navegador considera como **origens diferentes**.

### Exemplos de mesma origem:
- `http://localhost:3000/index.html` → `http://localhost:3000/api/users` ✓

### Exemplos de origens diferentes:
- `http://localhost:3000` → `http://localhost:3333` ✗ (porta diferente)
- `http://meufront.com` → `http://api.meufront.com` ✗ (host diferente)
- `http://meusite.com` → `https://meusite.com` ✗ (protocolo diferente)

## A analogia dos dois servidores (do instrutor)

O instrutor usa uma analogia clara: imagine dois servidores separados.

**Servidor A** hospeda o frontend — a aplicação que o usuário acessa no navegador. **Servidor B** hospeda o backend/API — que fornece os dados.

Quando o frontend (Servidor A) tenta fazer uma requisição para a API (Servidor B), o navegador detecta que são origens diferentes e **bloqueia a requisição por padrão**. Isso é a Same-Origin Policy em ação.

Se o frontend estivesse no **mesmo servidor** que o backend, usando a mesma porta e o mesmo canal de comunicação, seria **mesma origem** e não haveria bloqueio.

## Como o CORS funciona tecnicamente

### 1. Requisição do frontend
O navegador envia a requisição com um header `Origin` indicando de onde veio:
```
GET /api/refunds HTTP/1.1
Host: api.meusite.com
Origin: http://meufront.com
```

### 2. Resposta do servidor (com CORS habilitado)
O servidor responde com headers de controle de acesso:
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://meufront.com
Access-Control-Allow-Credentials: true
```

### 3. Verificação do navegador
O navegador verifica se o header `Access-Control-Allow-Origin` da resposta corresponde à origem da requisição. Se sim, libera os dados para o JavaScript. Se não, bloqueia.

### 4. Preflight requests (requisições OPTIONS)
Para requisições "não simples" (PUT, DELETE, headers customizados), o navegador envia primeiro uma requisição OPTIONS (preflight) perguntando ao servidor se a requisição real será aceita:

```
OPTIONS /api/refunds HTTP/1.1
Host: api.meusite.com
Origin: http://meufront.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Content-Type, Authorization
```

O servidor responde:
```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://meufront.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

## Headers CORS importantes

| Header | Função |
|--------|--------|
| `Access-Control-Allow-Origin` | Quais origens podem acessar (o "bloqueio" que o instrutor menciona) |
| `Access-Control-Allow-Methods` | Quais métodos HTTP são permitidos |
| `Access-Control-Allow-Headers` | Quais headers customizados são permitidos |
| `Access-Control-Allow-Credentials` | Se cookies/auth headers são permitidos |
| `Access-Control-Max-Age` | Quanto tempo o preflight fica em cache |

## Por que CORS existe

CORS é uma **relaxação controlada** da Same-Origin Policy. Sem ele, nenhuma página web poderia fazer requisições para APIs em outros domínios — o que quebraria praticamente toda aplicação moderna.

O ponto chave do instrutor: **sem CORS na API, o frontend vai ser barrado**. O erro típico que aparece no console do navegador é:

```
Access to fetch at 'http://localhost:3333/refunds' from origin 
'http://localhost:3000' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## CORS é do navegador, não do servidor

Um ponto crucial: CORS é uma política **enforced pelo navegador**. O servidor apenas envia os headers — quem decide bloquear ou liberar é o navegador. Por isso:

- **curl**, **Insomnia**, **Postman** — ignoram CORS completamente
- **fetch() no navegador** — respeita CORS
- **Server-to-server** — CORS não se aplica

Isso explica por que a API funciona no Insomnia mas não no frontend.

## Quando NÃO precisa de CORS

- Frontend e API servidos pelo mesmo servidor (mesma origem)
- Comunicação server-to-server (não passa pelo navegador)
- Proxy reverso que coloca frontend e API sob o mesmo domínio
- Server-Side Rendering onde o fetch acontece no servidor