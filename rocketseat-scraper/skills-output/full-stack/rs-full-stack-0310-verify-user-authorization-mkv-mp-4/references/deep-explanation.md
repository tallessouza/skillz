# Deep Explanation: Middleware de Autorização por Perfil

## Por que array e não string?

O instrutor enfatiza fortemente esse ponto: usar um array de perfis ao invés de uma string única é uma decisão de design que antecipa a evolução natural da aplicação.

**Raciocínio do instrutor:**
> "É normal que durante a vida de uma aplicação vai surgindo outros possíveis perfis também. Então a gente já deixa isso flexível."

Com string única, cada rota fica restrita a exatamente um perfil. Isso parece suficiente no início (quando só existem "employee" e "manager"), mas quando surge um terceiro perfil (líder, auditor, etc.), seria necessário refatorar o middleware inteiro.

Com array, a mudança é apenas adicional — basta incluir o novo perfil no array da rota. O middleware permanece inalterado.

**Comparação:**
```javascript
// String: rota só aceita UM perfil
verifyRole("employee") // E se manager também precisar? Refatorar tudo.

// Array: rota aceita N perfis
verifyUserAuthorization(["employee"]) // Adicionar manager? Só incluir no array.
verifyUserAuthorization(["employee", "manager"]) // Pronto.
```

## Higher-order function: por que retornar uma função?

O middleware de autorização precisa receber configuração (quais perfis são permitidos) E precisa ser uma função Express `(req, res, next)`. A solução é uma higher-order function:

```javascript
function verifyUserAuthorization(role) {  // recebe configuração
  return (request, response, next) => {    // retorna middleware Express
    // usa `role` via closure
  }
}
```

Isso permite que cada rota configure seus próprios perfis permitidos sem duplicar código.

## Fluxo completo: como os middlewares se encadeiam

O instrutor explica o fluxo passo a passo:

```
Request chega
  → ensureAuthenticated (verifica JWT, popula request.user)
  → verifyUserAuthorization (verifica se request.user.role está no array)
    → Se NÃO está logado OU perfil não permitido:
        throw AppError("unauthorized", 401)
        → middleware de tratamento de exceção captura
        → resposta de erro é enviada ao cliente
    → Se ESTÁ logado E perfil permitido:
        next()
        → controller executa normalmente
```

**Por que usar `throw` e não `res.status().json()`?**

Porque a aplicação já tem um middleware centralizado de tratamento de exceções (error handler). Ao lançar `AppError`, o fluxo é consistente com todos os outros erros da aplicação — o error handler identifica que é uma exceção gerada pelo código (não um erro inesperado) e formata a resposta adequadamente.

## Verificação dupla: autenticação E autorização

O middleware verifica duas coisas com um `||`:

```javascript
if (!request.user || !role.includes(request.user.role)) {
```

1. `!request.user` — usuário não está logado (não passou pelo middleware de autenticação ou token inválido)
2. `!role.includes(request.user.role)` — usuário está logado mas não tem o perfil necessário

Ambos resultam em 401, mas são situações diferentes. O instrutor opta por tratar ambos como "unauthorized" para simplificar, mas em APIs mais complexas poderia-se diferenciar (401 vs 403).

## Exemplo do teste realizado na aula

O instrutor testa com um usuário de perfil "employee":

1. Rota configurada com `["employee"]` → request funciona (200 OK)
2. Altera para `["manager"]` → request é barrada (401 Unauthorized)
3. Volta para `["employee"]` → funciona novamente

Isso demonstra que o middleware está de fato verificando o perfil do usuário logado contra o array de perfis permitidos da rota.

## `includes()` como verificação de pertencimento

O método `Array.includes()` é a escolha natural para verificar se um valor existe dentro de um array:

```javascript
["manager", "employee"].includes("employee") // true
["manager", "employee"].includes("admin")    // false
```

É mais legível que alternativas como `indexOf() !== -1` ou `some()`, e expressa exatamente a intenção: "este perfil está incluído nos perfis permitidos?"