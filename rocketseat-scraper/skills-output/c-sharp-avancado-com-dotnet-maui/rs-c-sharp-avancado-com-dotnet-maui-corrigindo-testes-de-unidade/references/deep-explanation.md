# Deep Explanation: Corrigindo e Melhorando Testes de Unidade

## Por que erros aparecem em cascata

Quando o build falha em um projeto como `CommonTestUtilities`, todos os projetos que referenciam esse projeto tambem falham. O instrutor destaca: "nem sempre voce tem que resolver a quantidade de erros que ele mostra". O primeiro erro e o problema real — os demais sao consequencia. Nao entre em panico com 4+ erros; resolva o primeiro e rebuild.

## Mock vs Implementacao Real — A decisao completa

O instrutor apresenta um raciocinio detalhado sobre por que usar mock ao inves de `new TokenService()`:

1. **Cadeia de dependencias**: `TokenService` recebe `IAccessTokenGenerator` e `IRefreshTokenGenerator` no construtor. Se voce instanciar o real, precisa instanciar os geradores reais tambem.

2. **AccessTokenGenerator precisa de configuracao**: Ele espera `expiracao` e `signingKey` no construtor — voce teria que configurar valores reais para JWT.

3. **Performance**: Tanto AccessToken quanto RefreshToken fazem criptografia. "Criptografia e uma coisa muito legal, so que tem um ponto negativo, gasta um pouquinho de tempo." Isso torna testes de unidade mais lentos.

4. **Foco do teste**: "A gente esta interessado em testar o Use Case." O teste de use case verifica se excecoes sao lancadas quando devem e nao lancadas quando nao devem. Verificar se o token e JWT valido ou se refresh token e base64 e responsabilidade de OUTRO teste.

### Se voce insiste em testar a implementacao real

O instrutor apoia a ideia, mas com a abordagem correta: "crie um teste de unidade para essa classe". Exemplos de asserts que fariam sentido em teste dedicado:
- O refresh token e base64?
- O AccessTokenIdentifier esta no payload do AccessToken?
- O token devolvido e um JWT valido?

## Limitacao do InMemory Database

O `ExecuteDelete` e `ExecuteDeleteAsync` do Entity Framework nao sao suportados pelo provider de banco em memoria. No teste de integracao, isso causa `Internal Server Error 500`.

A solucao do instrutor: condicionar o registro da dependencia por ambiente. No `DependencyInjectionExtension`, verificar `environment.IsEnvironment("Test") == false` antes de registrar o repositorio real. No `CustomWebApplicationFactory`, registrar o mock.

O instrutor chama de "solucao safadinha", mas justifica: "a gente prefere nao perder a performance la com o Ant Framework pra estar recuperando uma entidade pra depois deletar". O codigo performatico de producao (query direta de delete) e mantido; apenas o teste usa mock.

## Fluxo de debug para testes de integracao

1. Coloque breakpoint no controller
2. Botao direito no teste > Debug Tests
3. F11 para entrar nos metodos, F10 para avancar
4. Quando o fluxo "pular" de volta ao catch, a ultima linha antes do salto e a culpada
5. Leia a mensagem de erro — ela dira exatamente o que nao e suportado

## Adicionar asserts para novas funcionalidades

Apos implementar refresh token, o instrutor adiciona assert nos testes de integracao:
```csharp
// Duplicar a verificacao de access token para refresh token
Assert.False(string.IsNullOrWhiteSpace(response.RefreshToken));
```
Isso so faz sentido em testes de integracao (onde o token e gerado de verdade). Em testes de use case com mock, nao faz diferenca.