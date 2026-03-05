# Deep Explanation: Estrutura de Projeto .NET MAUI

## MauiProgram.cs — O Program.cs do mundo mobile

O instrutor faz uma analogia direta: assim como uma API .NET tem um `Program.cs` que e a primeira classe executada e onde configuramos DI, middlewares e migrations, o `MauiProgram.cs` cumpre o mesmo papel no MAUI. E o ponto de entrada do app — configura fontes, injecao de dependencia e tudo que precisa estar pronto antes do app renderizar.

## A relacao App → AppShell → Pages

O fluxo de inicializacao e:

1. **MauiProgram.cs** executa primeiro (configuracao)
2. **App.xaml.cs** e instanciado (recursos globais + criacao de janela)
3. **AppShell** e criado dentro da janela (navegacao)
4. **Pagina inicial** e renderizada conforme definida no AppShell

### Por que AppShell e nao MainPage direto?

O instrutor enfatiza: voce *pode* fazer `MainPage = new MinhaPage()` e vai funcionar. Mas a navegacao entre paginas fica "feia" — codigo mais verboso e menos performatico. O AppShell oferece um sistema de rotas limpo, onde voce declara as paginas no XAML e navega com `Shell.Current.GoToAsync("rota")`.

Alem disso, o AppShell permite cenarios como:
- Se e a primeira vez do usuario → mostrar onboarding
- Se ja tem token valido → ir direto para dashboard
- Controlar tudo isso no code behind do AppShell

## Code Behind — o .xaml.cs

Toda pagina XAML tem um arquivo `.xaml.cs` associado (code behind). A conexao e feita pelo atributo `x:Class` no XAML. Se voce renomear a classe C# e nao atualizar o `x:Class`, o projeto nao compila.

O instrutor nota que no template do Visual Studio, o botao de "click me" usa code behind diretamente com `Clicked="OnCounterClicked"`. Ele menciona que vai ensinar uma abordagem melhor (provavelmente MVVM), mas que para o Hello World simples, code behind e suficiente.

## SemanticProperties — Acessibilidade

O instrutor destaca uma feature que "poucas pessoas utilizam": as `SemanticProperties` do .NET MAUI. Sao atributos que permitem leitores de tela descreverem elementos visuais para usuarios com deficiencia visual. Exemplo:
- `SemanticProperties.Description` em imagens descreve o que a imagem mostra
- `SemanticProperties.Hint` em botoes descreve o resultado da acao
- `SemanticScreenReader.Announce()` anuncia mudancas dinamicas

O instrutor recomenda fortemente o uso para inclusao.

## Diferenca entre templates Visual Studio vs Rider

O template do Visual Studio e mais simples e basico. O Rider gera um Hello World com mais arquivos e complexidade. O instrutor — que confessa nunca ter criado um projeto MAUI pelo Rider — dedica a aula seguinte a alinhar o template do Rider com o do Visual Studio, para que todos partam da mesma base.

## Resources/ — Organizacao por tipo

| Pasta | Conteudo | Observacao |
|-------|----------|------------|
| `AppIcon/` | Icone do app | Substituir com icone customizado |
| `Fonts/` | Arquivos .ttf | Registrar no MauiProgram.cs |
| `Images/` | PNG, SVG | Referenciadas no XAML |
| `Raw/` | Videos, animacoes, outros | Tudo que nao e imagem nem fonte |
| `Splash/` | Tela de loading | Customizavel |
| `Styles/` | Colors.xaml, Styles.xaml | Importados no App.xaml |

## Platforms/ — Codigo nativo

Cada plataforma tem sua pasta com classes como `MainActivity.cs` (Android) e `AppDelegate.cs` (iOS). Essas sao as primeiras classes executadas *na plataforma especifica*. O instrutor recomenda deletar `Tizen/` (sistema da Samsung) pois nao sera utilizado.

## XAML Styler

O instrutor usa a extensao **XAML Styler for Visual Studio 2022** que formata automaticamente o XAML ao salvar (Ctrl+S) — ordem alfabetica de atributos, indentacao consistente. Nao ha equivalente para o Rider.

## ScrollView — Cuidado com conteudo cortado

Sem `ScrollView`, se o conteudo for maior que a tela (especialmente em telefones pequenos), ele sera cortado. Envolver o conteudo em `ScrollView` permite scroll vertical e evita perda de conteudo.

## .csproj — Configuracao do projeto

O arquivo `.csproj` contem configuracoes como target frameworks. Se quiser suportar Tizen, basta descomentar as linhas correspondentes. O instrutor deleta essas linhas comentadas por nao usar.