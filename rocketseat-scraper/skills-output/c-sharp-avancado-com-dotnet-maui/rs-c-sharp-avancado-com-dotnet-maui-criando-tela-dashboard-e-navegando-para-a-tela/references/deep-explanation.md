# Deep Explanation: Dashboard Page e Navegacao Root

## Por que paginas root ficam no AppShell e nao no MauiProgram?

O AppShell gerencia o ciclo de vida das paginas principais do app. Quando voce declara um `ShellContent`, o Shell sabe que aquela pagina pode ser a main page e gerencia sua criacao/destruicao adequadamente. Se voce registrasse no MauiProgram como `AddTransient<DashboardPage>()`, precisaria de logica manual para gerenciar quando a pagina aparece.

A ViewModel continua sendo registrada no MauiProgram porque ela e injetada via construtor (DI), independente de como a pagina e criada.

## A ordem dos ShellContent

O instrutor enfatiza: **a ordem faz muita diferenca**. O .NET MAUI inicializa o app com o primeiro ShellContent como pagina principal. Se voce acidentalmente colocar o Dashboard antes do Onboarding, o app abre direto no Dashboard — mesmo sem o usuario estar logado.

## Navegacao com `//` (double slash) — o conceito chave

Quando voce faz `GoToAsync("DashboardPage")` (sem barras), o .NET MAUI **empilha** a pagina sobre a atual. Isso significa que o login ficaria "por baixo" do dashboard — comportamento indesejado.

Ao usar `GoToAsync($"//{DashboardPage}")`, voce instrui o Shell a:
1. Fechar todas as paginas abertas na pilha
2. Definir a pagina indicada como a nova main page (pagina raiz)
3. O usuario nao consegue "voltar" para o login (comportamento correto)

O instrutor demonstra isso no dispositivo fisico: ao passar o dedo para voltar, o app fecha completamente — porque nao ha pagina anterior na pilha. Isso confirma que o dashboard e realmente a pagina raiz.

## Padrao de CodeBehind com DI

O padrao e consistente em todo o projeto:
1. ViewModel recebida no construtor via injecao de dependencia
2. `BindingContext = viewModel` conecta a View com a ViewModel
3. No XAML, `x:DataType` habilita IntelliSense para propriedades/comandos da ViewModel

## Proximos passos mencionados pelo instrutor

O instrutor menciona que na proxima aula:
- A sintaxe do AppShell vai mudar um pouco para suportar abrir direto no Dashboard quando o usuario ja esta logado (sem passar pelo Onboarding novamente)
- Isso envolve verificar se ha sessao ativa antes de decidir qual pagina exibir