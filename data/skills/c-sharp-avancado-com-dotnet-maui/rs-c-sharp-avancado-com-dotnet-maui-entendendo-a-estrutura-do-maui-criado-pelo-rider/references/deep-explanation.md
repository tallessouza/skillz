# Deep Explanation: Estrutura do Projeto .NET MAUI — Rider vs Visual Studio

## Por que o Rider cria um template diferente?

O instrutor (Ellson) explica que tanto Rider quanto Visual Studio criam o mesmo projeto .NET MAUI — nao ha diferenca tecnica. A diferenca esta apenas no "Hello World" inicial que cada IDE gera como template. O Rider oferece templates mais ricos com graficos, multiplas paginas, servicos de erro, injecao de dependencia pre-configurada, e ate integracoes com bibliotecas como SyncFusion e SQLite.

O problema pedagogico: quando alunos usam IDEs diferentes, cada um parte de uma base diferente, gerando confusao. A solucao e normalizar todos para o template mais simples (Visual Studio).

## GlobalUsings — A opiniao do instrutor

O instrutor deixa claro que **nao gosta** da abordagem de `GlobalUsings.cs`. Seu raciocinio:

> "Eu prefiro ver na classe, olha, eu quero saber de onde vem esse tipo. Pelo using eu vejo o namespace concatenado com a pagina, entao consigo me localizar. Se esta no GlobalUsings, eu nao sei, tenho que procurar num arquivo separado."

A vantagem do GlobalUsings e que reduz repeticao de `using` em cada arquivo. Mas o trade-off e perder a rastreabilidade local — ao abrir uma classe, voce nao sabe imediatamente de onde vem cada tipo.

**Decisao pragmatica:** para aprendizado, `using` explicito em cada classe e melhor porque ensina o aluno a entender namespaces e dependencias.

## xmlms:local no XAML — O equivalente do using

No XAML, nao existe `using` como em C#. O equivalente e declarar um namespace XML:

```xml
xmlns:local="clr-namespace:PlanShare.App"
```

Isso cria um "alias" chamado `local` que aponta para o namespace `PlanShare.App`. Depois, ao referenciar `local:MainPage`, o XAML sabe que `MainPage` esta naquele namespace.

Os dois namespaces obrigatorios em todo XAML MAUI:
- `xmlns="http://schemas.microsoft.com/dotnet/2021/maui"` — componentes MAUI
- `xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"` — funcionalidades XAML

## AppShell — O menu hamburguer

O `FlyoutBehavior` no AppShell controla o menu lateral (hamburguer). Quando habilitado, aparece um icone de tres linhas no topo que abre um menu deslizante. O template do Rider vem com multiplos ShellContent (tabs, flyout items). O template do Visual Studio vem com apenas um ShellContent apontando para MainPage.

## SyncFusion — Alerta de custo

O instrutor alerta especificamente sobre o SyncFusion: e uma biblioteca de componentes UI (dropdowns, tree views, graficos) que **e paga**. O template do Rider inclui como dependencia, mas deve ser removida para evitar problemas de licenciamento.

## Workflow pessoal do instrutor

O Ellson compartilha seu workflow real:
1. Cria o projeto no **Visual Studio** (Windows)
2. Faz push para GitHub
3. No **Mac**, faz clone do repositorio
4. Usa o Mac apenas para ajustes iOS (simulador iPhone)
5. Faz push/pull entre as duas maquinas

Ele nunca criou um projeto MAUI pelo Rider, mas reconhece que alunos podem preferir essa IDE.

## Pastas do Resources explicadas

| Pasta | Funcao |
|-------|--------|
| `Resources/AppIcon/` | Icone do aplicativo nos dispositivos |
| `Resources/Fonts/` | Fontes customizadas (OpenSans por padrao) |
| `Resources/Images/` | Imagens do app (pode ficar vazia inicialmente) |
| `Resources/Splash/` | Tela exibida enquanto o app carrega (splash screen) |
| `Resources/Styles/Colors.xaml` | Definicao de cores do tema |
| `Resources/Styles/Styles.xaml` | Estilos globais de componentes |

## MauiProgram.cs — O ponto de entrada

O `MauiProgram.cs` e a primeira classe executada. Ele:
1. Cria um builder (`MauiApp.CreateBuilder()`)
2. Configura o app (`.UseMauiApp<App>()`)
3. Registra fontes (`.ConfigureFonts()`)
4. Pode registrar injecao de dependencia (mas nao agora)
5. Retorna o app construido (`builder.Build()`)

O template do Rider ja vem com `AddSingleton`, `AddTransient` configurados — tudo isso sera ensinado no momento adequado.