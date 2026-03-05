# Deep Explanation: Teste de Unidade para UseCase Login

## Por que mapear cenarios a partir do codigo-fonte

O instrutor enfatiza que antes de escrever qualquer teste, voce deve abrir o UseCase e identificar cada caminho possivel. No caso do `DoLoginUseCase`, o construtor recebe 3 dependencias:
- `IUserReadOnlyRepository` (busca usuario por email)
- `IPasswordEncrypter` (compara senha)
- `ITokenService` (gera tokens)

Cada `if` no codigo representa um cenario de teste. O instrutor identificou 3:
1. **Sucesso**: usuario encontrado + senha correta → retorna response com id, nome e tokens
2. **Usuario nao encontrado**: `GetUserByEmail` retorna null → lanca `InvalidLoginException`
3. **Senha invalida**: usuario encontrado mas `PasswordMatch` retorna false → lanca `InvalidLoginException`

## A tecnica do "mock nao configurado"

Uma insight importante do instrutor: quando voce nao configura um mock com `.Setup()`, o Moq retorna o valor default do tipo. Para objetos (como `User`), o default e `null`. Isso significa que para testar o cenario "usuario nao encontrado", basta NAO passar a entidade ao builder. O mock automaticamente retorna null, e o UseCase cai no `if (user is null)`.

Isso elimina a necessidade de configurar explicitamente `mock.Setup(...).ReturnsAsync((User?)null)`.

## Por que mensagens de erro de autenticacao devem ser genericas

O instrutor explica uma pratica de seguranca fundamental: nunca revele ao usuario se o problema foi o email ou a senha. Se voce retornar "Email nao encontrado", um atacante sabe que aquele email nao existe. Se retornar "Senha incorreta", o atacante sabe que o email existe e pode focar em brute-force da senha.

Por isso, ambos os cenarios de erro lancam a mesma `InvalidLoginException` com a mesma mensagem: "E-mail e/ou senha invalidos". O status HTTP e `401 Unauthorized` (nao `400 BadRequest` — o instrutor corrigiu esse erro durante a aula).

## O padrao Builder para mocks

O instrutor usa um padrao consistente: cada dependencia mockada tem seu proprio builder. O builder encapsula a configuracao do mock com metodos nomeados identicos as funcoes do mock. Exemplo:

```csharp
// O metodo do builder tem o mesmo nome da funcao mockada
public UserReadOnlyRepositoryBuilder GetUserByEmail(User user)
{
    _mock.Setup(r => r.GetUserByEmail(user.Email)).ReturnsAsync(user);
    return this;
}
```

Isso padroniza a configuracao e permite reutilizacao entre testes de diferentes UseCases que usam o mesmo repositorio.

## Por que o UserBuilder retorna (User, string password)

A entidade `User` armazena a senha criptografada (hash). Para o teste de sucesso, voce precisa da senha em texto plano para enviar na request. Por isso o builder retorna uma tupla com a entidade e a senha original. No cenario de "senha invalida", voce descarta a senha (`_`) e usa a senha gerada pelo `RequestLoginJsonBuilder`, que sera diferente.

## Extensao para legibilidade de booleanos

O instrutor mencionou uma pratica pessoal: em vez de usar `!passwordMatch` (com ponto de exclamacao), ele prefere uma extension method como `.IsFalse()`. A justificativa e que em code reviews (pull requests), o `!` e facil de passar despercebido, enquanto `.IsFalse()` e explicito e legivel.

## Organizacao de pastas de teste

O instrutor segue uma estrutura espelhada:
```
Tests/
  UseCases/
    Login/
      DoLogin/
        DoLoginUseCaseTests.cs
```

Isso espelha a estrutura do codigo de producao e facilita encontrar os testes correspondentes.