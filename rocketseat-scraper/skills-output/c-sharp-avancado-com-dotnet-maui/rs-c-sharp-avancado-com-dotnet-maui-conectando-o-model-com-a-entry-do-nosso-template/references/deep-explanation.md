# Deep Explanation: Data Binding Two-Way em Componentes .NET MAUI

## A analogia da rua (do instrutor)

O instrutor usa uma analogia muito clara: **binding e como uma rua**.

- **OneWay (default):** A rua so tem uma mao. O valor vai da ViewModel para o componente, mas nunca volta. Quando a ViewModel inicializa com `Email = ""`, esse valor vazio e enviado para a Entry. Mas quando o usuario digita, o valor NAO retorna para a ViewModel.

- **TwoWay:** A rua tem mao dupla. O valor vai E volta. Se a ViewModel muda, o componente reflete. Se o usuario digita no componente, a ViewModel captura.

## O "passa-repassa" de bindings

Quando se usa componentes customizados, existe uma cadeia de binding que o instrutor chama de "passa-repassa":

```
Page (LoginPage.xaml)
  └── EntryAndLabelComponent TextValue="{Binding Model.Email}"
        └── Code-behind: BindableProperty TextValueProperty (TwoWay)
              └── Entry Text="{Binding TextValue}"
```

1. A **pagina** passa `Model.Email` para a propriedade `TextValue` do componente
2. O **code-behind** do componente armazena em `TextValueProperty` (BindableProperty)
3. A **Entry interna** do componente vincula seu `Text` ao `TextValue`

Se qualquer elo dessa cadeia estiver quebrado (faltou binding na Entry, faltou TwoWay, faltou BindableProperty), o valor nao chega.

## Por que o default e OneWay?

O .NET MAUI usa OneWay como default porque a maioria dos bindings sao de exibicao (Labels, Images), onde o dado so precisa ir da ViewModel para a View. Inputs sao a excecao — e por isso e facil esquecer de configurar TwoWay.

## Erros comuns que o instrutor demonstrou ao vivo

1. **Esqueceu BindingMode.TwoWay** — Digitou no campo, clicou login, e o Model.Email estava vazio. O breakpoint mostrou que o valor nao chegou.

2. **Esqueceu o binding na Entry do componente de senha** — Copiou o componente mas nao adicionou `Text="{Binding TextValue}"` na Entry do XAML. Resultado: email funcionou mas senha veio vazia.

3. **Copy-paste sem trocar referencias** — Ao copiar BindableProperty de outro componente (como KeyboardProperty), e preciso trocar TODAS as referencias: nome, tipo, GetValue/SetValue. Deixar `GetValue(KeyboardProperty)` em vez de `GetValue(TextValueProperty)` quebra silenciosamente.

## A licao principal

O instrutor enfatiza: "O codigo e simples, so tenha atencao aos detalhes." E verdade — cada peca individual e trivial, mas a cadeia completa de binding tem varios pontos de falha. O debug desse tipo de problema e frustrante porque nao gera erro — simplesmente nao funciona (valor fica vazio).

## Parametros do BindableProperty.Create

```csharp
BindableProperty.Create(
    propertyName,    // nameof(TextValue) — nome da propriedade CLR
    returnType,      // typeof(string) — tipo do valor
    declaringType,   // typeof(EntryAndLabelComponent) — tipo do componente
    defaultValue,    // string.Empty — valor inicial
    defaultBindingMode // BindingMode.TwoWay — CRITICO para inputs
);
```

Cada parametro tem que estar correto. O instrutor revisou um por um: "Create, name-of e keyboard? Nao, e text-value. O tipo e keyboard? Nao, e string..."