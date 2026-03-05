# Deep Explanation: Testes de Integracao para Get User Profile

## Por que separar testes de sucesso e erro em classes diferentes?

O instrutor Wellison separa explicitamente `GetUserProfileTest` (sucesso) e `GetUserProfileInvalidTokenTest` (erros) em classes distintas. A razao e organizacional: cada classe herda de `CustomClassFixture` com a mesma base URL, mas tem responsabilidades diferentes. A classe de sucesso precisa do `UserIdentityManager` para extrair token valido e dados do usuario para asserts. A classe de erro nao precisa disso — ela envia tokens propositalmente invalidos.

## O papel do UserIdentityManager

No `CustomWebApplicationFactory`, o metodo `StartDatabase` faz o seguinte:
1. Gera uma pessoa (ex: "Eunice") com senha criptografada
2. Salva no banco em memoria
3. Gera um access token valido para essa pessoa
4. Armazena tudo em um `UserIdentityManager` com metodos: `GetEmail()`, `GetAccessToken()`, `GetPassword()`, `GetName()`

A propriedade `User` do factory e publica justamente para que os testes de integracao possam acessar esses dados. O instrutor menciona que em testes de unidade normalmente nao se criam propriedades de classe, mas em testes de integracao e aceitavel porque o setup e compartilhado.

## Por que testar token invalido e token vazio separadamente?

Sao fluxos diferentes no `AuthenticatedUserFilter`:
- **Token invalido**: O header `Authorization` existe, contem um valor, mas o token nao e reconhecido. O filtro tenta validar, falha, e lanca excecao.
- **Token vazio**: O header `Authorization` existe, mas o valor e vazio. O filtro encontra o header mas nao tem conteudo para validar.

Ambos devem resultar em `401 Unauthorized`, mas testam caminhos de codigo diferentes no filtro de autenticacao.

## O verdadeiro valor desses testes

O instrutor enfatiza um ponto crucial: esses testes de token invalido/vazio garantem que voce **nao esqueceu de colocar o atributo `[AuthenticatedUser]`** no endpoint. Se o atributo estiver ausente, o endpoint aceitaria qualquer requisicao (com ou sem token), e o teste de unauthorized falharia, alertando o desenvolvedor.

Isso e algo que testes de unidade nao conseguem capturar, porque testes de unidade testam o use case isoladamente, sem passar pelo pipeline HTTP do ASP.NET. Apenas o teste de integracao exercita o filtro de autenticacao.

## Sobre validar a mensagem de erro

O instrutor explicitamente diz que validar apenas o status code `Unauthorized` e suficiente nos cenarios de erro. A API retorna uma lista de erros com mensagem tipo "voce nao pode acessar esse recurso", mas verificar isso e opcional. O status code ja confirma que a protecao esta funcionando.

## Cuidado com propriedades de classe em testes

O instrutor faz um alerta importante: armazenar o `UserIdentityManager` como propriedade da classe de teste e aceitavel aqui, mas em aulas futuras (testes de alteracao de senha) isso causara problemas. Quando um teste modifica estado (ex: altera a senha), essa modificacao pode afetar outros testes que compartilham a mesma propriedade. Para o cenario de GET Profile, que e somente leitura, nao ha risco.