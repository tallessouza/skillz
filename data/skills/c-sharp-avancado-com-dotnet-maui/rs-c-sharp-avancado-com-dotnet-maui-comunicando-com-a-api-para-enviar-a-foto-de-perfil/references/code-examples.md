# Code Examples: Envio de Arquivos via Refit com Multipart

## Exemplo completo: Interface IUserApi

```csharp
public interface IUserApi
{
    // Outros metodos existentes...
    [Put("/users/change-password")]
    Task<IApiResponse> ChangePassword([Body] ChangePasswordRequest request);

    // Novo metodo para envio de foto
    [Multipart]
    [Put("/users/change-photo")]
    Task<IApiResponse> ChangeProfilePhoto(StreamPart file);
}
```

## Exemplo completo: UseCase

```csharp
// Interface
public interface IChangeUserPhotoUseCase
{
    Task<Result> Execute(FileResult file);
}

// Implementacao
public class ChangeUserPhotoUseCase : IChangeUserPhotoUseCase
{
    private readonly IUserApi _userApi;

    public ChangeUserPhotoUseCase(IUserApi userApi)
    {
        _userApi = userApi;
    }

    public async Task<Result> Execute(FileResult file)
    {
        // 1. Ler o conteudo do arquivo como stream
        var photo = await file.OpenReadAsync();

        // 2. Criar a request do Refit com StreamPart
        var request = new StreamPart(photo, file.FileName, file.ContentType);

        // 3. Chamar a API
        var response = await _userApi.ChangeProfilePhoto(request);

        // 4. Interpretar resposta
        if (response.IsSuccessStatusCode)
            return Result.Success();

        return Result.Failure(response.Error.GetErrorMessages());
    }
}
```

## Exemplo completo: Registro no MauiProgram.cs

```csharp
private static void AddUseCases(IServiceCollection services)
{
    // UseCases existentes...
    services.AddScoped<IChangeUserPhotoUseCase, ChangeUserPhotoUseCase>();
}
```

## Exemplo completo: ViewModel

```csharp
public class ProfileViewModel : BaseViewModel
{
    private readonly IChangeUserPhotoUseCase _changeUserPhotoUseCase;

    public ProfileViewModel(IChangeUserPhotoUseCase changeUserPhotoUseCase)
    {
        _changeUserPhotoUseCase = changeUserPhotoUseCase;
    }

    // Funcao chamada tanto pela galeria quanto pela camera
    private async Task UpdateProfile(FileResult? file)
    {
        if (file is null)
            return;

        StatusPage = StatusPage.Sending;

        var result = await _changeUserPhotoUseCase.Execute(file);

        if (result.IsSuccess)
        {
            ShowSuccessFeedback("Sua foto de perfil foi atualizada com sucesso.");
        }
        else
        {
            ShowErrors(result.Errors);
        }

        StatusPage = StatusPage.Default;
    }
}
```

## Exemplo: Quando o nome do parametro difere da API

```csharp
// Se a API espera "file" mas voce quer chamar "photo" no codigo:
[Multipart]
[Put("/users/change-photo")]
Task<IApiResponse> ChangeProfilePhoto([AliasAs("file")] StreamPart photo);

// Se os nomes sao iguais, nao precisa de AliasAs:
[Multipart]
[Put("/users/change-photo")]
Task<IApiResponse> ChangeProfilePhoto(StreamPart file);
```

## Estrutura de pastas do UseCase

```
PlainShare.App/
├── UseCases/
│   └── User/
│       └── Photo/
│           ├── ChangeUserPhotoUseCase.cs
│           └── IChangeUserPhotoUseCase.cs
```

## Controller correspondente na API (referencia)

```csharp
[ApiController]
[Route("users")]
public class UsersController : ControllerBase
{
    [HttpPut("change-photo")]
    public async Task<IActionResult> ChangePhoto(IFormFile file)
    {
        // file.FileName — nome do arquivo recebido
        // file.Length — tamanho em bytes
        // Validacao e processamento...
        return Ok();
    }
}
```