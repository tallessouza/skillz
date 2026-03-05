# Deep Explanation: Pagina de Erros no .NET MAUI

## Por que ViewModel de erro nao herda de ViewModelBase?

O instrutor explica que a ViewModelBase compartilha propriedades comuns entre ViewModels do app (como estado de loading, titulo, etc). A pagina de erro e um contexto isolado — ela nao precisa dessas propriedades. Usar heranca direta de `ObservableObject` (do CommunityToolkit.Mvvm) mantem a classe limpa e especifica.

Citacao do instrutor: "Essa ViewModel aqui e para erro, ela e uma classe especifica e ai eu nao quero compartilhar essas propriedades que a gente tem na ViewModelBase com a ViewModel de erro."

## O fluxo completo de criacao de pagina no .NET MAUI

O instrutor enfatiza que sao "passos obrigatorios" e nenhum pode ser pulado:

1. **Criar o arquivo XAML** (ContentPage) dentro da estrutura de pastas correta
2. **Criar a ViewModel** como `public partial class` com heranca apropriada
3. **Registrar no servico de DI** usando `AddTransientWithShellRoute<Page, ViewModel>(rota)`
4. **Vincular ViewModel no CodeBehind** — receber via construtor (injecao de dependencia) e atribuir ao `BindingContext`
5. **Vincular ViewModel no XAML** (passo adicional recomendado) — usando `xmlns:viewModel` + `x:DataType` para autocomplete

## Por que vincular a ViewModel no XAML tambem?

O instrutor diz que e um "passo adicional que eu fortemente recomendo": ao declarar `x:DataType="viewModel:ErrorsViewModel"` no XAML, o Visual Studio/Rider consegue oferecer autocomplete para propriedades e comandos da ViewModel. Sem isso, voce escreve bindings "no escuro".

## Shell.NavBarIsVisible="False"

Ao olhar o design no Figma, o instrutor nota que a pagina de erro nao tem barra de navegacao (diferente de outras paginas que tem setinha de voltar). A propriedade `Shell.NavBarIsVisible="False"` remove a NavBar inteira para aquela pagina especifica.

## Result Pattern e navegacao para erro

O app usa um Result Pattern onde o use case retorna um objeto com:
- `IsSuccess` (bool) — indica se a operacao deu certo
- Lista de mensagens de erro

Quando `IsSuccess` e falso, a ViewModel navega para a pagina de erro. O instrutor aplica isso tanto no login quanto no registro de conta, copiando o mesmo bloco de codigo.

## Arquivos de recurso (resx) para internacionalizacao

Textos estaticos como "Tentar novamente" ficam em arquivos `.resx`. No XAML, sao acessados via `{x:Static resources:ResourcesText.TRY_AGAIN}`. O instrutor alerta para nao acessar os arquivos especificos de idioma (pt-BR, es, etc) — sempre acessar o arquivo padrao, que o sistema resolve automaticamente.

## Dark Mode

O instrutor menciona que a pagina precisa funcionar tanto em Light quanto Dark mode. Isso sera implementado nas proximas aulas, mas e uma consideracao de design desde o inicio.