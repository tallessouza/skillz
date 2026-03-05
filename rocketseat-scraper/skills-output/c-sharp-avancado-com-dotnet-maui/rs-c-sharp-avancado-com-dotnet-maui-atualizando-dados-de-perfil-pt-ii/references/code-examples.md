# Code Examples: Atualizando Dados de Perfil no .NET MAUI

## Use Case completo — UpdateUserUseCase

```csharp
public class UpdateUserUseCase
{
    private readonly IUserApi _userApi;
    private readonly IUserStorage _userStorage;

    public UpdateUserUseCase(IUserApi userApi, IUserStorage userStorage)
    {
        _userApi = userApi;
        _userStorage = userStorage;
    }

    public async Task<ResultT<string>> Execute(Model model)
    {
        var request = new RequestUpdateUserJson
        {
            Name = model.Name,
            Email = model.Email
            // Senha NAO e enviada — fluxo separado
        };

        var response = await _userApi.UpdateProfile(request);

        if (response.IsSuccessStatusCode)
        {
            // Recupera user atual do storage (tem Id + Name)
            // Cria novo record com nome atualizado via 'with'
            var user = _userStorage.Get() with { Name = model.Name };
            _userStorage.Save(user);

            return ResultT<string>.Success("Perfil atualizado com sucesso");
        }

        return response.GetResponseError();
    }
}
```

## Comparacao: RegisterUserUseCase vs UpdateUserUseCase

```csharp
// REGISTRO — salva token E user
if (response.IsSuccessStatusCode)
{
    await _tokenStorage.Save(response.Content.Token);

    var user = new User(response.Content.Id, response.Content.Name);
    _userStorage.Save(user);

    return ResultT<string>.Success("Conta criada");
}

// UPDATE — salva apenas user (sem token)
if (response.IsSuccessStatusCode)
{
    var user = _userStorage.Get() with { Name = model.Name };
    _userStorage.Save(user);

    return ResultT<string>.Success("Perfil atualizado");
}
```

## ViewModel — UserProfileViewModel com comando UpdateProfile

```csharp
public class UserProfileViewModel : BaseViewModel
{
    private readonly UpdateUserUseCase _updateUserUseCase;
    // ... outros use cases

    public UserProfileViewModel(UpdateUserUseCase updateUserUseCase /* ... */)
    {
        _updateUserUseCase = updateUserUseCase;
    }

    public async Task UpdateProfile()
    {
        StatusPage = StatusPageEnum.Sending; // Aviãozinho

        var result = await _updateUserUseCase.Execute(Model);

        if (result.IsSuccess)
        {
            // TODO: implementar alerta de sucesso do .NET MAUI
        }
        else
        {
            await GoToPageWithErrors(result.Errors);
        }

        StatusPage = StatusPageEnum.Default; // Volta componentes normais
    }
}
```

## XAML — UserProfilePage com animacao e binding

```xml
<!-- Namespace necessario -->
xmlns:components="clr-namespace:AppName.Views.Components.AnimationComponents"

<!-- Dentro do VerticalStackLayout -->
<components:SendingAnimation
    IsVisible="False"
    Trigger="{Binding StatusPage, Converter={StaticResource StatusToSending}}" />

<!-- Botao com command binding -->
<Border>
    <Grid>
        <Button
            Text="Atualizar Perfil"
            Command="{Binding UpdateProfileCommand}" />
    </Grid>
</Border>
```

## UserStorage — Interface e Save interno

```csharp
public interface IUserStorage
{
    void Save(User user);
    User Get();
    bool HasUser();
    void Clear();
}

// Implementacao interna do Save
public void Save(User user)
{
    // Cada propriedade armazenada com key separada
    Preferences.Set(IdKey, user.Id.ToString());
    Preferences.Set(NameKey, user.Name);
    // Substituicao segura — nao lanca excecao se valor e igual
}
```

## Sintaxe `with` em records — variações

```csharp
// Record definition
public record User(Guid Id, string Name);

// Criar novo record alterando uma propriedade
var original = new User(Guid.NewGuid(), "Bruce Wayne");
var atualizado = original with { Name = "Ellison Arley" };
// atualizado.Id == original.Id (preservado)
// atualizado.Name == "Ellison Arley" (alterado)

// Alterar multiplas propriedades
public record UserFull(Guid Id, string Name, string Email);
var novo = original with { Name = "Ellison", Email = "ellison@gmail.com" };

// ERRO — nao compila
original.Name = "Outro Nome"; // CS8852: Init-only property
```