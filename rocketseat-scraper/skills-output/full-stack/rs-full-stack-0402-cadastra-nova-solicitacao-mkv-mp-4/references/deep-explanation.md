# Deep Explanation: Requisições Autenticadas com Token JWT

## Por que o token precisa estar no header?

A API possui middlewares de verificação em camadas. Quando uma requisição chega em `/refunds` (POST), ela passa por:

1. **ensureAuthenticated** — verifica se existe um token JWT no header `Authorization`. Se não encontrar, retorna `"JWT token not found"` com status 401.
2. **verifyUserAuthorization** — decodifica o token para extrair o ID do usuário e verifica se o perfil (role) tem permissão para a operação. No caso de criar solicitações, apenas usuários com role `employee` podem executar.

Sem o token, a requisição nem chega ao controller. O middleware bloqueia antes.

## A analogia do crachá

Pense no token como um crachá de identificação. O middleware `ensureAuthenticated` é o segurança na porta — sem crachá, você não entra. O `verifyUserAuthorization` é o controle de acesso por setor — mesmo com crachá, você só entra nas áreas permitidas para seu perfil.

## Por que usar `api.defaults.headers.common`?

O Axios permite configurar headers que serão enviados em TODAS as requisições feitas por aquela instância. O campo `common` aplica a todos os métodos HTTP (GET, POST, PUT, DELETE).

```typescript
api.defaults.headers.common["Authorization"] = `Bearer ${token}`
```

Isso é equivalente a "colocar o crachá uma vez e ele ficar visível em todas as interações". Sem isso, você precisaria passar o header manualmente em cada chamada — repetitivo e propenso a esquecimentos.

## O padrão Bearer

O prefixo `Bearer` segue a RFC 6750. Ele indica ao servidor que o valor que vem depois é um token de portador (bearer token). A API espera esse formato específico:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Sem o prefixo `Bearer`, mesmo que o token esteja correto, a API pode não reconhecê-lo.

## Fluxo completo: do login à requisição autenticada

```
1. Usuário preenche email + senha
2. POST /sessions → API valida credenciais → retorna { token, user }
3. Frontend salva token no localStorage (persistência)
4. Frontend configura api.defaults.headers.common["Authorization"] (uso imediato)
5. Usuário navega para criar solicitação
6. POST /refunds com dados → Axios anexa Authorization automaticamente
7. Middleware ensureAuthenticated → decodifica token → extrai userId
8. Middleware verifyUserAuthorization → verifica role do userId
9. Controller processa a requisição → cria registro no banco
```

## Por que restaurar o token no reload?

O `api.defaults` vive em memória. Quando o usuário recarrega a página (F5), o JavaScript reinicia e o Axios perde os defaults configurados. O localStorage persiste entre reloads, então o fluxo é:

1. App inicia → verifica localStorage
2. Se tem token e user → restaura `api.defaults.headers.common["Authorization"]`
3. Usuário continua autenticado sem precisar fazer login novamente

## Tratamento de erros em camadas

O instrutor enfatiza a ordem de verificação dos erros:

```typescript
catch (error) {
  if (error instanceof AxiosError) {
    // Mais específico: erro de HTTP com response.data.message
    alert(error.response?.data.message)
  } else if (error instanceof Error) {
    // Genérico: erro JavaScript padrão
    alert(error.message)
  }
}
```

A razão é que `AxiosError` estende `Error`, então se você verificar `Error` primeiro, nunca entrará no bloco do `AxiosError`. Sempre do mais específico para o mais genérico.

## O erro simulado na aula

O instrutor deliberadamente fez uma requisição SEM configurar o token para mostrar o erro:

- Requisição: `POST /refunds` sem header Authorization
- Resposta: `401 Unauthorized` com body `{ message: "Invalid JWT token" }`
- Console: erro visível no Network tab e no catch do AxiosError

Esse é um padrão didático importante: sempre testar o caminho de erro antes do caminho feliz para entender o que a API espera.

## Validação do lado da API

O controller de refunds espera os campos:
- `name` — nome da solicitação
- `category` — categoria (transporte, alimentação, etc.)
- `amount` — valor em formato numérico
- `filename` — nome do arquivo com mínimo de 20 caracteres

Na aula, o `filename` foi preenchido com um placeholder aleatório porque o upload de arquivo ainda não foi implementado. Isso é uma prática comum em desenvolvimento iterativo: primeiro garantir que a requisição autenticada funciona, depois adicionar funcionalidades complementares como upload.