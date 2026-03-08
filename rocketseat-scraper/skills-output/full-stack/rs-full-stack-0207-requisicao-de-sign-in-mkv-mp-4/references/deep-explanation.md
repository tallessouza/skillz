# Deep Explanation: Requisição de SignIn

## Fluxo completo de autenticação no frontend

O instrutor demonstra o ciclo completo: formulário → validação → requisição → resposta/erro. O ponto chave é que a requisição é o ÚLTIMO passo — nunca o primeiro. Os dados já chegam validados pelo schema (aula anterior), então a API recebe exatamente o que espera.

### Por que POST em /sessions?

O instrutor navega pelo backend para mostrar a cadeia: `index → /sessions → SessionsHaut → SessionsController.create`. Sessão é um recurso REST. Criar uma sessão = autenticar. Isso é importante porque:

- GET /sessions seria "ver sessões ativas" (diferente)
- POST /sessions = "criar nova sessão" = login
- DELETE /sessions = "destruir sessão" = logout

### O que o backend retorna

O instrutor abre o `SessionsController` e mostra que após todas as validações (email existe? senha bate?), o retorno é:
- **token**: JWT para autenticação futura
- **user**: dados do usuário SEM a senha

A senha nunca volta na resposta — o backend explicitamente a remove antes de retornar. Isso é uma decisão de segurança do backend que o frontend pode confiar.

### Por que response.data e não response direto?

O Axios encapsula a resposta HTTP em um objeto com metadados:
```
response = {
  status: 200,
  headers: {...},
  config: {...},
  data: { token, user }  // ← conteúdo real aqui
}
```

O conteúdo útil (body da resposta) sempre está em `.data`. Isso é específico do Axios — fetch nativo usa `response.json()`.

### Tratamento de erros com AxiosError

O instrutor importa `AxiosError` do Axios para tipagem. A razão:

1. **Nem todo erro é da API** — pode ser erro de rede, timeout, etc.
2. **`instanceof AxiosError`** garante que o erro tem a estrutura `.response.data.message`
3. **Optional chaining** (`?.`) protege contra erros sem response (ex: servidor offline)

Quando o instrutor testa com credenciais inválidas ("Rodrigo X"), a API retorna status 401 com `{ message: "E-mail ou senha inválida" }`. O Axios transforma isso em um erro, e o catch captura. Sem o `instanceof`, tentar acessar `.response.data.message` em um erro de rede causaria crash.

### Teste prático mostrado

O instrutor demonstra dois cenários:
1. **Usuário inválido**: alert mostra "E-mail ou senha inválida" (vem da API)
2. **Usuário válido**: console.log mostra `{ token, user: { id, name, email, role, created_at } }`

O usuário cadastrado tem role "employee" por padrão. Pode ser alterado para "manager" posteriormente. Essas roles são definidas no backend.

### Anatomia do erro Axios

```
error = {
  message: "Request failed with status code 401",
  response: {
    status: 401,
    data: {
      message: "E-mail ou senha inválida"  // ← mensagem da API
    }
  }
}
```

O `error.response?.data?.message` navega com segurança até a mensagem da API. Se qualquer nível for undefined (ex: erro de rede sem response), o optional chaining retorna undefined em vez de crashar.