# Deep Explanation: Use Case Layer em .NET MAUI

## Por que nao injetar o API client direto na ViewModel?

O instrutor (Ellison) faz uma analogia direta: **a ViewModel funciona como um Controller na API**. Quando uma request chega no controller, ele nao faz logica de negocio — ele delega para um use case/service e devolve a resposta. O mesmo principio se aplica:

1. **A ViewModel recebe um evento** (toque no botao → RelayCommand dispara)
2. **Delega para o Use Case** passando o Model
3. **Reage ao resultado** — navega para dashboard (sucesso) ou mostra erro

### Responsabilidades que NAO sao da ViewModel:
- **Tratamento de erros de rede** — timeout, 500, 401
- **Armazenamento de tokens** — os endpoints de login/registro devolvem tokens de acesso que precisam ser armazenados em locais seguros (SecureStorage). Isso nao e responsabilidade da ViewModel
- **Mapeamento de dados** — converter Model para Request JSON
- **Validacoes de negocio** — verificar campos antes de enviar

## Por que mapeamento manual em apps mobile?

O instrutor e enfatico: **performance**. A justificativa:

- Bibliotecas como AutoMapper e Mapster reduzem linhas de codigo, mas consomem mais recursos
- O mapeamento manual e mais rapido e consome menos memoria
- **No servidor voce controla os recursos** — pode adicionar mais memoria se precisar
- **No dispositivo mobile voce NAO controla** — precisa funcionar em telefones baratos e antigos
- Objetivo: abranger o maximo de dispositivos possivel

No backend (API), o instrutor diz que usa AutoMapper normalmente, porque la ele controla a infraestrutura.

## Padrao de organizacao

O instrutor mantem consistencia entre API e App:

```
// Na API (backend)
UseCases/
└── Users/
    └── Register/
        ├── IRegisterUserUseCase.cs
        └── RegisterUserUseCase.cs

// No App (mobile) — mesma estrutura!
UseCases/
└── User/          # singular no app (trabalha com 1 pessoa)
    └── Register/
        ├── IRegisterUserUseCase.cs
        └── RegisterUserUseCase.cs
```

Ele escolheu `User` (singular) no app porque "o app trabalha com apenas uma pessoa".

## Sobre o Refit e a interface renomeada

O instrutor renomeou `IUserApiClient` para `IUserApi` porque:
- Nao gostou do sufixo "Client"
- Preferiu seguir o padrao da documentacao do Refit (`IGitHubApi`)
- Usou o recurso de Rename do Visual Studio (botao direito → Rename) que atualiza todas as referencias automaticamente

## Detalhe do ObservableProperty

Quando voce declara:
```csharp
[ObservableProperty]
private UserRegisterAccount model;
```

O Community Toolkit MVVM gera automaticamente uma propriedade `Model` (M maiusculo). No RelayCommand, voce DEVE passar `Model` (propriedade publica gerada), nunca `model` (campo privado). Isso e um erro comum que causa bugs silenciosos.

## Ciclo de vida: por que Transient?

O Use Case e registrado como `AddTransient` para manter o mesmo padrao das ViewModels. A ideia: nenhuma instancia fica permanente em memoria. Cada vez que e solicitado, uma nova instancia e criada. Isso e importante em mobile para nao consumir memoria desnecessariamente.