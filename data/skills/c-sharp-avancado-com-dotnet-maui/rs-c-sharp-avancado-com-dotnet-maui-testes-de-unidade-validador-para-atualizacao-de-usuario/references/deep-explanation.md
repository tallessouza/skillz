# Deep Explanation: Testes de Unidade para Validators FluentValidation

## Por que repeticao e aceitavel em testes

O instrutor Elison aborda diretamente uma pergunta comum que recebe nas redes sociais: "nao tem como automatizar e evitar repeticao nos testes?" A resposta e enfatica: **nao**. Testes de unidade devem ser independentes. Cada funcao de teste cria suas proprias instancias, executa sua propria validacao e verifica seu proprio resultado.

A tentacao de reaproveitar instancias (criar o validator no construtor da classe, por exemplo) introduz acoplamento entre testes. Como testes executam em paralelo (cada classe em paralelo, funcoes dentro da classe em ordem indefinida), estado compartilhado pode causar falhas intermitentes — o pior tipo de bug.

## Sintaxe When com CurrentValidator vs AllValidators

O validator `UpdateUserValidator` demonstra uma sintaxe alternativa do FluentValidation para regras condicionais:

### Forma explicita (usada no RegisterUserValidator)
```csharp
RuleFor(x => x.Email).NotEmpty().WithMessage("email empty");
RuleFor(x => x.Email).Must(email => !string.IsNullOrEmpty(email))
    .When(x => !string.IsNullOrWhiteSpace(x.Email));
```

### Forma encadeada com When + CurrentValidator
```csharp
RuleFor(x => x.Email)
    .NotEmpty().WithMessage("email empty")
    .EmailAddress()
    .When(x => x.Email.NotEmpty(), ApplyConditionTo.CurrentValidator);
```

O parametro `ApplyConditionTo.CurrentValidator` significa que o `When` se aplica **apenas a regra imediatamente acima** (EmailAddress). Se fosse `AllValidators`, aplicaria a **todas** as regras acima do When (tanto NotEmpty quanto EmailAddress).

## Metodo de extensao NotEmpty

O instrutor criou um metodo de extensao `StringExtension.NotEmpty()` que retorna `true` se a string nao e nula, nao e vazia e nao e apenas espacos em branco. Combinado com o operador `!` de null-forgiving (`string!`), permite encadear validacoes sem preocupacao com null reference.

```csharp
public static bool NotEmpty(this string? value)
{
    return !string.IsNullOrWhiteSpace(value);
}
```

## Padrao Builder para Requests de teste

O `RequestUpdateUserBuilder` e uma copia adaptada do `RequestRegisterUserBuilder`. A abordagem do instrutor e pragmatica: Ctrl+C, Ctrl+V, remover campos que nao existem (como Password), ajustar tipos. O Builder gera dados validos por padrao (usando Bogus/Faker), e cada teste altera apenas o campo que quer invalidar.

## Organizacao de pastas

A estrutura segue convencao do projeto:
```
Validators.Tests/
└── User/
    ├── Register/
    │   └── RegisterUserValidatorTests.cs
    └── Update/
        └── UpdateUserValidatorTests.cs
```

## Dica sobre bugs e testes

O instrutor compartilha uma pratica profissional: quando encontrar um bug em producao, **primeiro corrija o bug, depois escreva o teste de unidade** que garante que aquele bug nunca mais volta. Isso transforma cada bug em uma protecao permanente.