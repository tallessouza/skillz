# Code Examples: Integrando Dashboard com API

## Back-end: ResponseDashboardJson ajustado

```csharp
public class ResponseDashboardJson
{
    public string Username { get; set; }
    public List<ResponseAssignedJson> ConnectedUsers { get; set; }
}

public class ResponseAssignedJson
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string ProfileImageUrl { get; set; }
}
```

## Back-end: DashboardController simplificado

```csharp
[HttpGet]
[ProducesResponseType(typeof(ResponseDashboardJson), StatusCodes.Status200OK)]
public async Task<IActionResult> Get()
{
    var response = await _useCase.Execute();
    return Ok(response);
}
```

## Back-end: GetDashboardUseCase (API)

```csharp
public class GetDashboardUseCase : IGetDashboardUseCase
{
    private readonly ILoggedUser _loggedUser;
    private readonly IUserConnectionReadOnlyRepository _userConnectionRepository;

    public GetDashboardUseCase(
        ILoggedUser loggedUser,
        IUserConnectionReadOnlyRepository userConnectionRepository)
    {
        _loggedUser = loggedUser;
        _userConnectionRepository = userConnectionRepository;
    }

    public async Task<ResponseDashboardJson> Execute()
    {
        var loggedUser = await _loggedUser.User();
        var connections = await _userConnectionRepository.GetConnectionsForUser(loggedUser.Id);

        return new ResponseDashboardJson
        {
            Username = loggedUser.Name,
            ConnectedUsers = connections.Select(u => new ResponseAssignedJson
            {
                Id = u.Id,
                Name = u.Name,
                ProfileImageUrl = u.ProfileImageUrl
            }).ToList()
        };
    }
}
```

## Mobile: IDashboardApi (Refit)

```csharp
public interface IDashboardApi
{
    [Get("/dashboard")]
    Task<IApiResponse<ResponseDashboardJson>> GetDashboard();
}
```

## Mobile: Registro no MauiProgram

```csharp
// Junto com os outros AddHttpClient
builder.Services
    .AddHttpClient<IDashboardApi>()
    .ConfigureHttpClient(client => client.BaseAddress = new Uri(baseUrl))
    .AddHttpMessageHandler<PlanShareHandler>();

// Registro do UseCase
builder.Services.AddScoped<IGetDashboardUseCase, GetDashboardUseCase>();
```

## Mobile: GetDashboardUseCase completo

```csharp
public class GetDashboardUseCase : IGetDashboardUseCase
{
    private readonly IDashboardApi _api;
    private readonly IUserStorage _userStorage;

    public GetDashboardUseCase(
        IDashboardApi api,
        IUserStorage userStorage)
    {
        _api = api;
        _userStorage = userStorage;
    }

    public async Task<Result<Dashboard>> Execute()
    {
        var response = await _api.GetDashboard();

        if (response.IsSuccessStatusCode)
        {
            var content = response.Content;

            var dashboard = new Dashboard
            {
                Username = content.Username,
                ConnectedUsers = new ObservableCollection<ConnectedUser>(
                    content.ConnectedUsers.Select(user => new ConnectedUser
                    {
                        Id = user.Id,
                        Name = user.Name,
                        ProfileImageUrl = user.ProfileImageUrl
                    }))
            };

            // Atualizar storage local
            var user = await _userStorage.Get();
            user = user with { Name = content.Username };
            await _userStorage.Save(user);

            return Result<Dashboard>.Success(dashboard);
        }

        return Result<Dashboard>.Failure();
    }
}
```

## Mobile: DashboardViewModel (Initialize)

```csharp
public partial class DashboardViewModel : ObservableObject
{
    private readonly IGetDashboardUseCase _dashboardUseCase;

    [ObservableProperty]
    private Dashboard _dashboard;

    [ObservableProperty]
    private StatusPage _statusPage = StatusPage.Loading;

    public DashboardViewModel(IGetDashboardUseCase dashboardUseCase)
    {
        _dashboardUseCase = dashboardUseCase;
    }

    [RelayCommand]
    public async Task Initialize()
    {
        var result = await _dashboardUseCase.Execute();

        if (result.IsSuccess)
            Dashboard = result.Response;
        else
            await Shell.Current.GoToAsync("//error");

        StatusPage = StatusPage.Default;
    }
}
```

## Mobile: DashboardPage XAML (Behaviors)

```xml
<ContentPage.Behaviors>
    <toolkit:StatusBarBehavior StatusBarColor="{StaticResource DashboardStatusBarColor}" />
    <toolkit:EventToCommandBehavior
        EventName="Appearing"
        Command="{Binding InitializeCommand}" />
</ContentPage.Behaviors>
```

## Padrao record com `with` (detalhe)

```csharp
// Definicao do record
public record UserStorage(string Id, string Name);

// Uso com with — cria copia imutavel
var original = new UserStorage("123", "Ellison");
var updated = original with { Name = "Ellison Updated" };
// original.Name ainda e "Ellison"
// updated.Name e "Ellison Updated"
```