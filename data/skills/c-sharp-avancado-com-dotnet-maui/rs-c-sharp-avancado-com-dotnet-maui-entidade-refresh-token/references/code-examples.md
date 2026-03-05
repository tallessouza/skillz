# Code Examples: Entidade Refresh Token

## Estrutura do projeto

O codigo fica em:
```
PlainShare.Domain/
  └── Entities/
      ├── EntBase.cs
      ├── User.cs
      └── RefreshToken.cs
```

## EntBase completa

```csharp
public class EntBase
{
    // ID unico por entidade — Guid v7 (versao mais recente)
    public Guid Id { get; set; } = Guid.CreateVersion7();

    // Soft delete — true = ativo, false = "deletado" (recuperavel)
    public bool Active { get; set; } = true;

    // Data de criacao — usado para calcular expiracao do Refresh Token
    // NOTA: era "CreatedOn" (errado), corrigido para "CreatedAt"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

## RefreshToken completa

```csharp
public class RefreshToken : EntBase
{
    // Valor do token gerado (armazenado no banco)
    public string Token { get; set; } = string.Empty;

    // ID do Access Token (JWT) associado — camada extra de validacao
    public Guid AccessTokenId { get; set; }

    // FK para o usuario dono deste Refresh Token
    public Guid UserId { get; set; }

    // Propriedade de navegacao — EF faz join via .Include()
    public User User { get; set; } = default!;
}
```

## User (referencia — herda de EntBase)

```csharp
public class User : EntBase
{
    // ... propriedades especificas do User
    // Tambem herda Id, Active e CreatedAt de EntBase
}
```

## Passo a passo da criacao no Visual Studio

1. Expandir `PlainShare.Domain > Entities`
2. Botao direito > Adicionar > Classe
3. Nome: `RefreshToken`
4. Trocar `internal` para `public`
5. `Ctrl+R, G` para remover usings inuteis
6. Adicionar heranca: `public class RefreshToken : EntBase`
7. Adicionar as tres propriedades (Token, AccessTokenId, UserId)
8. Adicionar propriedade de navegacao (User)

## Padrao de inicializacao para suprimir warnings

```csharp
// String — inicializar com string.Empty
public string Token { get; set; } = string.Empty;

// Referencia nao-nula — inicializar com default!
public User User { get; set; } = default!;
```

O `string.Empty` comunica que a propriedade nunca sera nula (o valor real vem do banco).
O `default!` comunica que o EF vai preencher via Include (nao sera nulo em runtime).