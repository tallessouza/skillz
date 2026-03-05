# Code Examples: Testing ViewModels com Mock Builders Avançados

## 1. Interface INavigationService (contexto)

```csharp
public interface INavigationService
{
    // Métodos sem retorno (já existiam)
    Task NavigateToAsync(string route);
    Task ShowSuccessFeedback(string message);
    Task ShowErrorPage(string message);

    // Método com retorno genérico (foco desta aula)
    Task<TResult> ShowPopup<TViewModel, TResult>()
        where TViewModel : class
        where TResult : struct;
}
```

## 2. NavigationServiceBuilder completo

```csharp
public class NavigationServiceBuilder
{
    // Build padrão — para testes que não usam ShowPopup
    public static INavigationService Build()
    {
        var mock = new Mock<INavigationService>();
        return mock.Object;
    }

    // Build genérico — para testes que precisam de retorno do ShowPopup
    public static INavigationService Build<TViewModel, TResult>(TResult result)
        where TViewModel : class
        where TResult : struct // not null
    {
        var mock = new Mock<INavigationService>();

        mock.Setup(navigationService =>
            navigationService.ShowPopup<TViewModel, TResult>())
            .ReturnsAsync(result);

        return mock.Object;
    }
}
```

## 3. MediaPickerBuilder completo

```csharp
// Pasta: Common/TestUtilities/Maui/MediaPickerBuilder.cs
public class MediaPickerBuilder
{
    public static IMediaPicker Build()
    {
        var faker = new Faker();
        var imgUrl = faker.Image.LoremFlickerUrl();

        var mock = new Mock<IMediaPicker>();

        // Parâmetro null explícito — Moq exige clareza
        mock.Setup(mediaPicker => mediaPicker.PickPhotoAsync(null))
            .ReturnsAsync(new FileResult(imgUrl));

        mock.Setup(mediaPicker => mediaPicker.CapturePhotoAsync(null))
            .ReturnsAsync(new FileResult(imgUrl));

        return mock.Object;
    }
}
```

## 4. ChangeUserPhotoUseCaseBuilder

```csharp
public class ChangeUserPhotoUseCaseBuilder
{
    public static IChangeUserPhotoUseCase Build(Result result)
    {
        var mock = new Mock<IChangeUserPhotoUseCase>();

        mock.Setup(useCase => useCase.Execute(It.IsAny<FileResult>()))
            .ReturnsAsync(result);

        return mock.Object;
    }
}
```

## 5. CreateViewModel com parâmetro opcional

```csharp
private (UserProfileViewModel vm, Mock<INavigationService> nav) CreateViewModel(
    Result result,
    ChooseFileOption? fileOption = null)
{
    // Roteamento: escolhe o builder correto
    var navigationService = fileOption is null
        ? NavigationServiceBuilder.Build()
        : NavigationServiceBuilder
            .Build<OptionsForProfileViewModel, ChooseFileOption>(fileOption.Value);

    var mediaPicker = MediaPickerBuilder.Build();
    var changeUserPhotoUseCase = ChangeUserPhotoUseCaseBuilder.Build(result);

    var vm = new UserProfileViewModel(
        navigationService,
        mediaPicker,
        changeUserPhotoUseCase
    );

    return (vm, navigationService);
}
```

## 6. Testes de sucesso com Theory + InlineData

```csharp
[Theory]
[InlineData(ChooseFileOption.TakePicture)]
[InlineData(ChooseFileOption.UploadFromGallery)]
public async Task ChangeProfilePhoto_Execute_WithValidResult_Success(
    ChooseFileOption fileOption)
{
    // Arrange
    var (vm, nav) = CreateViewModel(successResult, fileOption);

    // Act
    await vm.ChangeProfilePhotoCommand.ExecuteAsync(null);

    // Assert
    Assert.Equal(StatusPage.Default, vm.StatusPage);

    nav.Verify(
        n => n.ShowSuccessFeedback("Foto de perfil alterada com sucesso"),
        Times.Once());
}
```

## 7. Testes de erro

```csharp
[Theory]
[InlineData(ChooseFileOption.TakePicture)]
[InlineData(ChooseFileOption.UploadFromGallery)]
public async Task ChangeProfilePhoto_Execute_WithError_ShowsErrorPage(
    ChooseFileOption fileOption)
{
    // Arrange
    var (vm, nav) = CreateViewModel(failureResult, fileOption);

    // Act
    await vm.ChangeProfilePhotoCommand.ExecuteAsync(null);

    // Assert
    Assert.Equal(StatusPage.Default, vm.StatusPage);

    nav.Verify(
        n => n.ShowErrorPage("Erro ao alterar foto de perfil"),
        Times.Once());
}
```

## 8. ViewModel sob teste (trecho relevante)

```csharp
public class UserProfileViewModel
{
    private readonly INavigationService _navigationService;
    private readonly IMediaPicker _mediaPicker;
    private readonly IChangeUserPhotoUseCase _changeUserPhotoUseCase;

    public IAsyncRelayCommand ChangeProfilePhotoCommand { get; }

    private async Task ChangeProfilePhoto()
    {
        var option = await _navigationService
            .ShowPopup<OptionsForProfileViewModel, ChooseFileOption>();

        FileResult? fileResult = option switch
        {
            ChooseFileOption.TakePicture => await _mediaPicker.CapturePhotoAsync(),
            ChooseFileOption.UploadFromGallery => await _mediaPicker.PickPhotoAsync(),
            _ => null
        };

        if (fileResult is not null)
            await UpdateProfilePhoto(fileResult);
    }

    private async Task UpdateProfilePhoto(FileResult fileResult)
    {
        StatusPage = StatusPage.Loading;

        var result = await _changeUserPhotoUseCase.Execute(fileResult);

        if (result.IsSuccess)
        {
            await _navigationService.ShowSuccessFeedback(
                "Foto de perfil alterada com sucesso");
        }
        else
        {
            await _navigationService.ShowErrorPage(
                "Erro ao alterar foto de perfil");
        }

        StatusPage = StatusPage.Default;
    }
}
```

## 9. Fluxo de debug demonstrado na aula

O instrutor fez debug passo-a-passo (F10/F11) mostrando:

1. `CreateViewModel` recebe `UploadFromGallery` → entra no `Build<TVM, TResult>` genérico
2. `MediaPickerBuilder.Build()` → Faker gera URL tipo `https://loremflickr.com/320/240`
3. `FileResult(imgUrl)` aceita a URL como path válido
4. `ShowPopup` retorna `UploadFromGallery` → cai no case correto do switch
5. `MediaPicker.PickPhotoAsync(null)` retorna o `FileResult` mockado
6. `UseCase.Execute()` retorna sucesso → feedback de sucesso exibido
7. `Times.Once()` confirma que feedback foi chamado exatamente uma vez

Segundo teste com `TakePicture` seguiu o mesmo fluxo, validando o outro branch do switch.

Testes de erro: `UseCase.Execute()` retorna falha → `ShowErrorPage` chamado em vez de `ShowSuccessFeedback`.