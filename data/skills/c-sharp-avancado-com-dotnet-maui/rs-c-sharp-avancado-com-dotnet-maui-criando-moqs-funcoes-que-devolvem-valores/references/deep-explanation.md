# Deep Explanation: Mocks para Funções que Devolvem Valores

## Por que existem dois tipos de mock setup?

O instrutor divide mocks em duas categorias fundamentais:

1. **Funções que nao devolvem valores (void):** O mock simplesmente "finge" que executou. O use case continua o fluxo sem saber que nada aconteceu de verdade. Nenhum erro, nenhuma exceção.

2. **Funções que devolvem valores:** O mock tambem nao lança erro, mas precisa devolver algo. O que ele devolve? O **valor default do tipo**.

## Como descobrir o valor default de qualquer tipo

O instrutor ensina um truque simples: declare uma variavel do tipo desejado sem atribuir valor. O C#/.NET inicializa automaticamente:

```csharp
bool minhaVariavel;    // false
int minhaVariavel;     // 0
User minhaVariavel;    // null
string minhaVariavel;  // null
```

Esse e exatamente o comportamento do mock quando voce NAO configura o retorno.

## A logica por tras do Builder com instancia vs estatico

O instrutor explica a diferença entre dois patterns:

**Builder estatico (aula anterior — WriteOnlyRepository):**
- Funcoes void — nao precisa configurar nada
- `Build()` estatico: `Builder.Build()` direto, sem instanciar

**Builder com instancia (esta aula — ReadOnlyRepository):**
- Funcoes com retorno — precisa configurar QUANDO o teste exige valor diferente do default
- Precisa de construtor para criar o mock como propriedade
- Metodos de configuracao acessam a propriedade
- `Build()` de instancia: precisa `new Builder()` primeiro

A razão: se voce precisa chamar metodos de configuracao ANTES do build, precisa de uma instancia. Se so precisa do mock "cru", basta um metodo estatico.

## Especificidade de parametros — a sacada do mock

O ponto mais importante da aula: quando uma funcao recebe parametros, o mock pode ser **especifico**. Se voce configura:

```csharp
mock.Setup(r => r.ExistActiveUserWithEmail("wellison@gmail.com")).ReturnsAsync(true);
```

Entao:
- Chamar com `"wellison@gmail.com"` → retorna `true`
- Chamar com `"headline@gmail.com"` → retorna `false` (default do bool)
- Chamar com qualquer outro email → retorna `false`

O instrutor menciona que e possivel fazer o mock ignorar o parametro e retornar o valor para QUALQUER input, mas isso sera abordado em aulas futuras.

## Reutilizar codigo vs reutilizar instancias

O instrutor faz uma distincao crucial:

- **Reutilizar instancias:** ERRADO — cada teste precisa de estado limpo
- **Reutilizar codigo:** CORRETO — factory method `CreateUseCase()` sempre retorna `new`

A funcao `CreateUseCase` com parametro opcional e o pattern recomendado:
- Sem parametro: mock retorna defaults (cenario de sucesso)
- Com email: configura mock para retornar `true` (cenario de erro — email ja existe)

## Por que parametro opcional com `?` e `= null`

O instrutor usa `string? emailAlreadyExists = null` para tornar o parametro opcional. Isso permite que:
- Testes de sucesso chamem `CreateUseCase()` sem argumento
- Testes de erro chamem `CreateUseCase("email@test.com")` passando o email que deve "ja existir"

O `NotEmpty()` (metodo de extensao do dominio) verifica se o email foi passado antes de configurar o mock.