# Deep Explanation: Ajustes na Tela de Registro de Conta

## Por que modelos separados?

O instrutor (Ellison) enfatiza que um `User` genérico causa confusão. A tela de registro tem nome, email e senha. A tela de perfil tem imagem, nome e email (sem senha — não faz sentido mostrar a senha na edição de perfil). Se você usa o mesmo model, vai ter propriedades sobrando em cada contexto.

A analogia é direta: cada tela tem um contrato diferente com o usuário. O model representa esse contrato.

## Padrão de navegação com ".."

A sintaxe `$"../{RoutePages.LoginPage}"` usa o conceito de navegação relativa do Shell no .NET MAUI:
- `..` = fecha/remove a página atual do stack
- `/{rota}` = navega para a rota especificada

Sem o `..`, a página de registro ficaria empilhada. O usuário ao clicar "voltar" no login voltaria para o registro em vez do onboarding.

O instrutor demonstra isso: ao clicar "Já possui uma conta? Faça login", a tela fecha e abre o login. Ao clicar na seta de voltar no login, volta para o onboarding (não para o registro). Esse é o comportamento correto.

## Convenção de underscore para propriedades privadas

O instrutor explica: `_navigationService` com underscore é recomendação da Microsoft para propriedades privadas de classe. O padrão é:
1. Construtor recebe `INavigationService navigationService` (camelCase)
2. Propriedade privada é `private readonly INavigationService _navigationService` (underscore prefix)
3. Atribuição: `_navigationService = navigationService`

O `readonly` garante que o valor só pode ser atribuído no construtor.

## VerticalStackLayout como área tocável

O instrutor usa `VerticalStackLayout` com `TapGestureRecognizer` em vez de um simples `Label` com gesture. A razão: o VerticalStackLayout aumenta a área clicável/tocável para o usuário. É uma técnica de UX — alvos de toque maiores são mais fáceis de acertar.

## Problema dos espaços em branco

O instrutor identifica um bug importante: quando o usuário seleciona uma sugestão do teclado (dicionário/autocomplete do celular), o sistema automaticamente adiciona um espaço após a palavra. Isso significa que o nome "Ellison" vira "Ellison " (com espaço). Pior: o usuário pode intencionalmente adicionar múltiplos espaços.

A correção será feita no backend (próxima aula), não no app. O instrutor promete explicar o porquê dessa decisão.

## Hot Reload em ação

O instrutor demonstra que é possível adicionar bindings de Command no XAML sem parar a execução do app. O Hot Reload do .NET MAUI recarrega automaticamente. Isso é útil durante desenvolvimento iterativo — você não precisa recompilar para testar mudanças em XAML.

## Breakpoint como ferramenta de debug

Para verificar que os bindings estão funcionando, o instrutor cria uma variável temporária `var x = model` dentro do comando `RegisterAccount`, coloca um breakpoint, e passa o mouse em cima para inspecionar os valores. Ele explica que isso é temporário — só para demonstrar que o binding funciona. Sem a referência local, não seria possível inspecionar o model no breakpoint.