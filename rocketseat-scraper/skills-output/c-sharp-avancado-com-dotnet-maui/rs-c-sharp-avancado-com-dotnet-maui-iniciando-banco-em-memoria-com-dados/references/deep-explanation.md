# Deep Explanation: Inicializando Banco em Memória com Dados

## Por que cada classe tem seu próprio banco?

O instrutor (Wellison) enfatiza um "segredinho dos testes de integração": cada classe de teste de integração é executada usando seu próprio servidor. Isso significa que cada classe tem seu próprio banco de dados em memória — completamente isolado. As informações entre classes são "completamente diferentes" e "não se comunicam entre si".

Porém, **dentro** de uma mesma classe, todas as funções (testes) compartilham o mesmo banco de dados. Combinado com o fato de que não controlamos a ordem de execução dos testes, isso cria a necessidade de pré-popular o banco com dados conhecidos.

## O problema do endpoint autenticado

O instrutor destaca que o endpoint `GetProfile` possui o atributo `[AuthenticatedUser]`, o que obriga qualquer chamada — seja de um aplicativo, site ou teste de integração — a fornecer um token de acesso válido. Isso significa que não basta ter um usuário no banco; é preciso ter também um token válido associado a ele.

Além disso, testes futuros de login precisarão do email e da senha em plaintext. Por isso, todos esses dados precisam ser acessíveis ao teste.

## A decisão de usar `EnsureDeleted`

O `dbContext.Database.EnsureDeleted()` é chamado como garantia de que o banco inicia vazio. O instrutor menciona que é "só uma forma de garantir" — uma medida defensiva contra estados residuais inesperados.

## Por que métodos síncronos?

O instrutor explica explicitamente: "A gente não tem funções assíncronas nesse cenário aqui do nosso CustomWebApplicationFactory". Por isso usa `Add` e `SaveChanges` em vez das variantes async. Isso é uma limitação do contexto de configuração do factory.

## O padrão UserIdentityManager

O instrutor deliberadamente mantém as propriedades como `private readonly` e expõe apenas métodos públicos (`GetPassword`, `GetEmail`, `GetAccessToken`). A justificativa: "Eu não quero que nenhum teste de integração tenha acesso direto ao TokensDTO, tenha acesso direto à entidade user." Isso é encapsulamento intencional para controlar o que os testes podem acessar.

## Resolução via DI para gerar tokens

Em vez de criar tokens manualmente, o instrutor resolve `IAccessTokenGenerator` do service provider — a mesma implementação usada em produção. Isso garante que o token gerado para testes é idêntico ao que a API produziria, evitando divergências entre teste e produção.

O instrutor faz questão de mostrar que foi "espiar" o use case de registro para entender como o token é gerado internamente (`TokenService.GenerateTokens`), e então replica apenas a parte necessária (access token) usando a interface de mais baixo nível.

## Sobre o RefreshToken vazio

O instrutor menciona que o RefreshToken ficará vazio por enquanto e será tratado em aulas futuras. O `AccessTokenIdentifier` retornado pelo `Generate` também é descartado usando destructuring (`.Token`), pois só o token em si é necessário neste momento.