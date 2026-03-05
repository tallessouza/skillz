# Deep Explanation: Handlers no .NET MAUI

## O que sao handlers — a analogia do mapeamento

O instrutor explica handlers como **mapeadores/transformadores**. Quando voce escreve `<Entry>` no XAML, isso e um **elemento virtual** — algo que so existe no mundo .NET MAUI. Quando o app compila para Android, iOS, Windows ou Mac, o handler faz a ponte:

- **Entry** → `AppCompatEditText` (Android)
- **Entry** → `UITextField` (iOS/Mac)
- **Entry** → `TextBox` (Windows)

Essa arquitetura de 3 camadas (Virtual View → Handler → Native View) e fundamental para entender por que customizacoes de aparencia nativa exigem handlers.

## Por que AppendToMapping e nao substituicao

O .NET MAUI ja tem handlers default para todos os controles. O instrutor enfatiza: **nao estamos substituindo, estamos adicionando**. O metodo `AppendToMapping` adiciona uma funcionalidade nova ao handler existente sem perder o comportamento original.

Isso e importante porque se voce substituisse o handler inteiro, perderia todo o mapeamento default e teria que reimplementar tudo.

## A diferenca entre Action e Func

O instrutor aproveita para ensinar um conceito importante de C#:

- **`Action<int, string>`** — funcao que recebe `int` e `string` como parametros, **sem retorno** (void)
- **`Func<int, string>`** — funcao que recebe `int` como parametro e **retorna** `string` (ultimo tipo = retorno)

No contexto do handler, `AppendToMapping` recebe um `Action<EntryHandler, IEntry>` — uma funcao void que recebe o handler e a view.

## Por que usar underline `_` para parametros ignorados

No `ConfigureMauiHandlers`, o delegate recebe um `IMauiHandlersCollection` que nao e necessario. A convencao C# para ignorar parametros e usar `_`:

```csharp
.ConfigureMauiHandlers(_ =>
{
    CustomEntryHandler.Customize();
});
```

## Organizacao de projeto

O instrutor cria a pasta `Resources/Styles/Handler/` porque antecipa que havera multiplos arquivos de customizacao. A separacao entre XAML styles e handler C# code ajuda na manutencao.

## Handlers disponiveis no .NET MAUI

O instrutor mostra que ao acessar `Microsoft.Maui.Handlers`, existe um handler para cada controle: `ButtonHandler`, `BorderHandler`, `CheckBoxHandler`, `EntryHandler`, etc. Todos seguem o mesmo padrao de `Mapper.AppendToMapping`.