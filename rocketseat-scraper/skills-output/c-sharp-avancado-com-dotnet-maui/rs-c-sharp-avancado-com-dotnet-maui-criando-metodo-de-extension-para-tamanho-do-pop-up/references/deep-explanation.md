# Deep Explanation: Extension Methods e DI para PopUps no .NET MAUI

## Por que não usar classes estáticas diretamente?

O instrutor explica que classes como `DeviceDisplay` no .NET MAUI possuem uma propriedade estática `Current` que é a instância real do objeto. Quando você faz `DeviceDisplay.MainDisplayInfo`, internamente ele acessa `Current.MainDisplayInfo`. Esse `Current` só tem valor quando o aplicativo está executando — em testes de unidade, ele será nulo e causará erro.

A solução é usar a interface `IDeviceDisplay` via injeção de dependência. Assim, em testes você pode fazer mock dessa interface facilmente.

## A sintaxe do AddSingleton com instância

O instrutor destaca uma distinção importante:

```csharp
// ERRADO — esta sintaxe é para TIPOS, não instâncias
builder.Services.AddSingleton<IDeviceDisplay, DeviceDisplay.Current>();

// CORRETO — quando já temos a instância, passamos como parâmetro
builder.Services.AddSingleton(DeviceDisplay.Current);
```

A sintaxe com generics `<TInterface, TImplementation>` espera dois tipos. `DeviceDisplay.Current` não é um tipo, é uma instância já pronta. Por isso usa-se a sobrecarga que recebe o objeto diretamente como parâmetro.

O compilador C# é inteligente o suficiente para inferir que `DeviceDisplay.Current` implementa `IDeviceDisplay`, então não é necessário especificar o tipo explicitamente.

## Organização do MauiProgram

O instrutor cria métodos de extensão separados no `MauiProgram` para agrupar registros de DI por domínio:

- `AddDeviceInfo()` — registros relacionados ao dispositivo
- `AddStorage()` — registros de armazenamento

Isso mantém o `CreateMauiApp` limpo e organizado, e facilita adicionar novos registros de dispositivo no futuro sem poluir o método principal.

## Números mágicos e clareza de código

O instrutor enfatiza: "Código precisa ser claro. Você não está programando para a máquina. Estamos programando para nós mesmos, o Ellison do futuro, você do futuro, e outros devs que vão dar manutenção."

O valor `0.8` é um número mágico — alguém novo no projeto não sabe o que significa. A constante `PercentageWidthOfPopupOnScreen` é longa, mas comunica perfeitamente que são 80% da largura da tela. O instrutor prefere nomes longos e claros a nomes curtos e ambíguos.

## Extension methods em C#

Para criar um extension method:
1. A classe deve ser `static`
2. O método deve ser `public static`
3. O primeiro parâmetro deve ter `this` antes do tipo: `this IDeviceDisplay deviceDisplay`

Isso permite chamar `deviceDisplay.GetWidthForPopup()` como se fosse um método nativo da interface.

## Padrão de organização: pasta Extensions

O instrutor coloca extension methods em uma pasta `Extensions/` no projeto, seguindo o mesmo padrão usado para extensões de cores (ex: `cor de linha`, `cor de highlight`). Isso cria um local previsível para encontrar métodos utilitários.