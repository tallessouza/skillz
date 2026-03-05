# Deep Explanation: Testes de Unidade para UseCase Get User Profile

## Por que apenas um cenario de teste?

O instrutor Wellerson enfatiza um principio importante: **cada use case tem responsabilidade limitada**. O `GetUserProfileUseCase` nao valida se o usuario existe ou se o token e valido — essas validacoes acontecem em camadas anteriores (middleware de autenticacao, validacao de JWT).

A pergunta que ele antecipa: "Nao esta errado nao verificar se o user e nulo?" A resposta: **nao e responsabilidade desse use case**. Se o fluxo chegou ate aqui, significa que:
- O token JWT foi validado
- O usuario com aquele ID existe no banco
- Todas as pre-condicoes foram satisfeitas

Isso reflete o principio de **separacao de responsabilidades** — cada camada confia que as camadas anteriores fizeram seu trabalho.

## Builder Pattern para Mocks — Por que receber a entidade?

O instrutor explica uma decisao de design sutil: o Builder do mock recebe a entidade User como parametro em vez de criar uma internamente. A razao:

> "Se eu tenho aqui no meu teste a entidade que eu passei para ser devolvida, eu posso conferir se o Use Case devolveu as propriedades igual eu passei pra ele."

Isso permite **asserts completos**: se voce passa um User com nome "Francis" e email "francis@email.com", e o use case retorna um response com nome "Edline", voce sabe que algo esta errado no mapeamento.

Se o Builder criasse a entidade internamente, o teste nao teria acesso aos valores esperados para comparacao.

## Referencias Transitivas em C#

O projeto de testes (`UseCase.Tests`) referencia apenas `Application` e `CommonTestUtilities`. Mas consegue usar classes de `Domain` porque `Application` referencia `Domain`. Em C#:

> "Se A referencia B e B referencia C, entao A pode acessar C."

Nao e necessario adicionar uma referencia direta — a referencia transitiva ja resolve. Isso mantem o grafo de dependencias limpo.

## Senha plaintext no Builder — decisao consciente

O instrutor reconhece que usar `f.Internet.Password()` gera uma senha em plaintext, enquanto a entidade real deveria ter senha criptografada. Ele aceita isso conscientemente porque:

1. O teste atual nao valida senha
2. O mock do servico de criptografia ja cuida disso em outros contextos
3. Quando forem feitos testes de integracao, esse ponto sera revisitado

Isso exemplifica **pragmatismo em testes**: nao resolva problemas que nao existem no escopo atual.

## Organizacao de pastas — espelhar o projeto principal

A estrutura de testes replica exatamente a estrutura do projeto:
- Projeto: `UseCase/User/Profile/GetUserProfileUseCase`
- Testes: `Tests/UseCase/User/Profile/GetUserProfileUseCaseTest`
- Builders: `CommonTestUtilities/Services/LoggedUser/LoggedUserBuilder`
- Entity Builders: `CommonTestUtilities/Entities/UserBuilder`

Isso facilita navegacao e mantem consistencia conforme o projeto cresce.