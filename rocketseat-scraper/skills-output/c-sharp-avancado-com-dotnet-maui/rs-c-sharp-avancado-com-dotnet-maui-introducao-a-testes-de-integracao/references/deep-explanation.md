# Deep Explanation: Testes de Integracao com WebApplicationFactory

## O que e um teste de integracao vs teste de unidade

O instrutor enfatiza repetidamente: no teste de integracao, a API **de fato esta executando**. Voce pode colocar um breakpoint no controller e ve-lo ser atingido. A injecao de dependencia funciona, a comunicacao com banco de dados funciona — e um fluxo completo, do controller ao repositorio.

Diferente do teste de unidade onde voce instancia classes isoladamente com mocks, aqui o teste age **como se fosse um aplicativo ou site** fazendo requisicoes HTTP reais na API.

## Por que mocks ainda existem em testes de integracao

O instrutor esclarece um ponto importante: "testes de integracao nao aceitam mocks — mais ou menos". A resposta e **depende do cenario**:

- **Servicos externos (Azure, AWS, pagamentos):** devem ser mockados. Exemplo: upload de foto de perfil para Azure Storage — sem mock, voce poluiria o storage com imagens de teste e potencialmente pagaria por isso.
- **Todo o resto:** fluxo real, sem mocks. Controller → UseCase → Repository → Banco de dados.

A regra e: se o servico e externo, cobra dinheiro, ou polui recursos compartilhados → mock. Se e interno → real.

## Como o WebApplicationFactory funciona

O `WebApplicationFactory<Program>` e um servidor fornecido pelo .NET que:
1. Inicia a API em um servidor em memoria
2. Configura toda a injecao de dependencia
3. Fornece um `HttpClient` ja configurado com a URL base correta

Quando voce faz `factory.CreateClient()`, recebe um `HttpClient` que ja sabe o endereco do servidor. Basta concatenar o path (ex: `/users`) — similar ao que o Refit faz no app MAUI com a URL base configurada.

## O problema do banco de dados real

O instrutor demonstrou ao vivo: apos rodar o teste, abriu o MySQL e encontrou o registro "Rafael" salvo no banco de dados de desenvolvimento. Isso e um problema grave:

- Polui a base de dados com dados de teste
- Pode quebrar outros testes que dependem de estado limpo
- Mistura dados reais com dados de teste

**Solucao (proxima aula):** usar banco de dados em memoria. Quando o teste finaliza, a memoria do servidor e liberada e os dados desaparecem. Banco real, porem temporario.

## Por que reutilizar HttpClient e aceitavel aqui

O instrutor nota que em aulas anteriores ele ensinou a nao reutilizar instancias. Porem, em testes de integracao, armazenar o `HttpClient` como campo `readonly` da classe e uma **excecao aceitavel**, porque o ciclo de vida e controlado pelo framework de testes.

## O passo do public partial class Program

Por padrao, o arquivo `Program.cs` do .NET 6+ usa top-level statements e nao tem uma classe publica. O `WebApplicationFactory<Program>` precisa de uma referencia tipada ao entry point. A solucao e simples: adicionar `public partial class Program { }` no final do arquivo. O `partial` e obrigatorio porque o compilador ja gera uma classe Program implicitamente.

## Estrutura do projeto de teste

O instrutor seguiu esta estrutura:
```
BackEnd/
  Tests/
    WebAPI/
      User/
        Register/
          RegisterUserTests.cs
```

Dependencias do projeto:
1. **CommonTestUtilities** — builders de request compartilhados
2. **PlanShare.API** — referencia a API para acessar `Program`

Pacotes NuGet:
- **Microsoft.AspNetCore.Mvc.Testing** — fornece `WebApplicationFactory`
- **Shouldly** — assertions fluentes