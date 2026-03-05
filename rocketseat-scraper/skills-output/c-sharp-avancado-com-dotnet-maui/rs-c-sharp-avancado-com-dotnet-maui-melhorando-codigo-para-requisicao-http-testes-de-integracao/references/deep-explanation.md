# Deep Explanation: Base Class para Requisicoes HTTP em Testes de Integracao

## Problema original

Nos testes de integracao, cada classe de teste precisa fazer chamadas HTTP para a API. No cenario de sucesso, a chamada e simples: `httpClient.PostAsJsonAsync(url, request)`. Porem, no cenario de erro, sao necessarias 3+ linhas extras para configurar o idioma (culture) no header `AcceptLanguage`, porque a API retorna mensagens de erro no idioma solicitado.

O instrutor identifica que esse problema vai escalar: alem de POST, havera cenarios de PUT (atualizar perfil), DELETE, e esses endpoints exigem autenticacao via token no header. Sem refatoracao, cada teste repetiria:
- Configuracao de cultura (3 linhas)
- Configuracao de token de autenticacao (2+ linhas)
- A chamada HTTP em si

## Por que classe abstrata e nao interface ou static helper

O instrutor escolhe heranca com classe abstrata por razoes especificas:
1. **Abstract impede instanciacao direta** — a classe so existe para ser herdada
2. **Protected garante encapsulamento** — os metodos `DoPost`, `DoGet` etc. so sao visiveis para classes filhas
3. **Construtor com repasse via `base()`** — o pattern de `IClassFixture` do xUnit exige que o factory seja passado no construtor, e a heranca permite centralizar essa logica

## Detalhe do C# sobre default parameters

O instrutor destaca que `string.Empty` **nao funciona** como valor default de parametro em C#. E necessario usar `""` (string literal vazia). Isso e uma restricao do compilador C# — default parameters devem ser constantes em tempo de compilacao, e `string.Empty` e um campo readonly, nao uma constante.

## Decisao de design: token opcional vs obrigatorio

- **POST e GET**: token e opcional (`string token = ""`) porque existem endpoints publicos (registro de usuario, solicitar codigo de acesso por email)
- **PUT**: token e obrigatorio (sem valor default) porque nao existe cenario de atualizacao sem autenticacao. O instrutor nota que se surgir um cenario futuro, basta tornar opcional
- **DELETE**: token e obrigatorio pela mesma logica do PUT

## Diferenca entre metodos HTTP no HttpClient

- `PostAsJsonAsync` e `PutAsJsonAsync` — aceitam um objeto no corpo da requisicao
- `GetAsync` e `DeleteAsync` — **nao** aceitam corpo. O C# HttpClient impede enviar body em GET e DELETE. Por isso `DoGet` e `DoDelete` nao recebem parametro `object request`

## Funcoes privadas auxiliares

- `ChangeRequestCulture`: limpa os headers de `AcceptLanguage` e adiciona o novo idioma. Limpar antes e importante para nao acumular idiomas de chamadas anteriores
- `AuthorizeRequest`: so adiciona o header `Authorization: Bearer {token}` se o token nao for vazio/nulo/espacos. O `string.IsNullOrWhiteSpace` protege contra todos esses casos

## Fluxo do construtor com heranca

```
xUnit cria RegisterUserTest
  → construtor recebe CustomWebApplicationFactory (injecao do xUnit)
  → `: base(factory)` repassa para CustomClassFixture
  → CustomClassFixture cria HttpClient via factory.CreateClient()
  → HttpClient fica disponivel via metodos protected
```