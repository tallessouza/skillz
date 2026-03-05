# Code Examples: Approve/Cancel Connection Commands

## ViewModel completa com os dois comandos

```csharp
// UserConnectionGeneratorViewModel.cs

[RelayCommand]
public async Task Cancel()
{
    await _connection.InvokeAsync(
        "Cancel",
        ConnectionCode.Replace(" ", string.Empty)
    );
    await _connection.StopAsync();
    await _navigationService.ClosePage();
}

[RelayCommand]
public async Task Approve()
{
    await _connection.InvokeAsync(
        "ConfirmCodeJoin",
        ConnectionCode.Replace(" ", string.Empty)
    );
    await _connection.StopAsync();
    await _navigationService.ClosePage();
}
```

## XAML — Botoes com Commands

### Tela de informacoes da pessoa (dois botoes: cancelar e aprovar)

```xml
<VerticalStackLayout>
    <!-- Informacoes da pessoa conectada -->
    
    <Button Text="Cancelar"
            Command="{Binding CancelCommand}" />
    
    <Button Text="Aceitar"
            Command="{Binding ApproveCommand}" />
</VerticalStackLayout>
```

### Tela de codigo gerado (botao cancelar com DataTrigger)

```xml
<VerticalStackLayout>
    <!-- Codigo de conexao exibido -->
    
    <Button Text="Cancelar Operação"
            Command="{Binding CancelCommand}"
            IsVisible="False">
        <Button.Triggers>
            <DataTrigger TargetType="Button"
                         Binding="{Binding StatusPage}"
                         Value="Waiting for joiner">
                <Setter Property="IsVisible" Value="True" />
            </DataTrigger>
        </Button.Triggers>
    </Button>
</VerticalStackLayout>
```

## Hub server-side (referencia)

```csharp
// UserConnectionsHub.cs

// Funcao chamada pelo Cancel command
public async Task Cancel(string code)
{
    // Encontra o codigo, remove, avisa pessoa conectada
}

// Funcao chamada pelo Approve command
public async Task ConfirmCodeJoin(string code)
{
    // Confirma conexao, cria registro no banco, avisa pessoa conectada
}
```

## Contexto: por que o ConnectionCode tem espacos

```csharp
// No Initialize, ao receber o codigo da API:
ConnectionCode = FormatWithSpaces(result.Code);
// result.Code = "161062"
// ConnectionCode = "1 6 1 0 6 2" (para exibicao visual)
```

## Padrao Replace para sanitizacao

```csharp
// Uso basico
string limpo = "1 6 1 0 6 2".Replace(" ", string.Empty);
// Resultado: "161062"

// Outros cenarios similares
string semHifen = "161-062".Replace("-", string.Empty);
string semPonto = "161.062".Replace(".", string.Empty);
```

## Resultado no banco de dados

Apos approve bem-sucedido, a tabela `UserConnections` recebe:

| Column | Value |
|--------|-------|
| UserId | ID do usuario que gerou o codigo |
| ConnectedUserId | ID da pessoa que enviou o codigo (joiner) |