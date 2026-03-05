# Code Examples: SnackBar e Centralização no Navigation Service

## 1. Interface INavigationService (assinaturas adicionadas)

```csharp
public interface INavigationService
{
    // Métodos existentes...
    Task GoToAsync(string route);

    // Novos métodos desta aula
    Task ShowSuccessFeedback(string message);
    Task ClosePage();
    Task GoToDashboardPage();
}
```

## 2. NavigationService completo (implementação)

```csharp
public class NavigationService : INavigationService
{
    public async Task GoToAsync(string route)
    {
        await Shell.Current.GoToAsync(route);
    }

    public async Task ShowSuccessFeedback(string message)
    {
        var snackbarOptions = new SnackbarOptions
        {
            BackgroundColor = AppColors.SecondaryColor,
            TextColor = Colors.White,
            CornerRadius = 10,
            ActionButtonTextColor = AppColors.SecondaryColor,
            Font = FontConstants.MainFontBlack,
            ActionButtonFont = FontConstants.SecondaryFontRegular,
            CharacterSpacing = 0.1
        };

        var snackbar = Snackbar.Make(
            message,
            action: null,
            actionButtonText: ResourceText.TitleClose,
            duration: TimeSpan.FromSeconds(3),
            snackbarOptions);

        await snackbar.Show();
    }

    public async Task ClosePage()
    {
        await GoToAsync("..");
    }

    public async Task GoToDashboardPage()
    {
        await GoToAsync("//DashboardPage");
    }
}
```

## 3. UserProfileViewModel (após refatoração)

```csharp
public class UserProfileViewModel : ViewModelBase
{
    private async Task UpdateProfile()
    {
        var success = await _userService.UpdateProfile(Name, Email);

        if (success)
            await _navigationService.ShowSuccessFeedback(
                ResourceText.ProfileUpdatedSuccess);
    }
}
```

## 4. ChangeUserPasswordViewModel (após refatoração)

```csharp
public class ChangeUserPasswordViewModel : ViewModelBase
{
    private async Task ChangePassword()
    {
        var success = await _userService.ChangePassword(
            CurrentPassword, NewPassword);

        if (success)
        {
            await _navigationService.ShowSuccessFeedback(
                ResourceText.PasswordChangedSuccess);
            await _navigationService.ClosePage();
        }
        else
        {
            // Mantém a página aberta para o usuário corrigir
            await _navigationService.ShowErrorFeedback(
                ResourceText.PasswordChangeError);
        }
    }
}
```

## 5. Exemplo de LoginViewModel / SignUpViewModel usando GoToDashboardPage

```csharp
// Antes (sintaxe críptica)
await Shell.Current.GoToAsync("//DashboardPage");

// Depois (método nomeado)
await _navigationService.GoToDashboardPage();
```

## 6. ResourceText (.resx) — entradas utilizadas

```xml
<!-- ResourceText.resx (neutro/inglês) -->
<data name="TitleClose" xml:space="preserve">
    <value>Close</value>
</data>
<data name="ProfileUpdatedSuccess" xml:space="preserve">
    <value>Your profile information has been updated successfully.</value>
</data>
<data name="PasswordChangedSuccess" xml:space="preserve">
    <value>Your password has been changed successfully.</value>
</data>

<!-- ResourceText.pt-BR.resx -->
<data name="TitleClose" xml:space="preserve">
    <value>Fechar</value>
</data>
<data name="ProfileUpdatedSuccess" xml:space="preserve">
    <value>As informações do seu perfil foram atualizadas com sucesso.</value>
</data>
<data name="PasswordChangedSuccess" xml:space="preserve">
    <value>Sua senha foi alterada com sucesso.</value>
</data>
```

## 7. Padrão para criar novos tipos de feedback (extensão futura)

```csharp
public async Task ShowErrorFeedback(string message)
{
    var snackbarOptions = new SnackbarOptions
    {
        BackgroundColor = AppColors.ErrorColor,  // Cor diferente
        TextColor = Colors.White,
        CornerRadius = 10,
        ActionButtonTextColor = AppColors.ErrorColor,
        Font = FontConstants.MainFontBlack,
        ActionButtonFont = FontConstants.SecondaryFontRegular,
        CharacterSpacing = 0.1
    };

    var snackbar = Snackbar.Make(
        message,
        action: null,
        actionButtonText: ResourceText.TitleClose,
        duration: TimeSpan.FromSeconds(5),  // Mais tempo para erros
        snackbarOptions);

    await snackbar.Show();
}
```