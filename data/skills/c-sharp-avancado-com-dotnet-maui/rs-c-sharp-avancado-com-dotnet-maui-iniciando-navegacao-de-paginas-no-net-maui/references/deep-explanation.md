# Deep Explanation: Navegacao de Paginas no .NET MAUI

## Como a navegacao funciona no Shell

O .NET MAUI usa o conceito de **Shell** como orquestrador de navegacao. O Shell funciona como uma pilha (stack): quando voce navega para uma nova pagina, ela e empilhada por cima da anterior. O botao de voltar desempilha, revelando a pagina anterior.

Toda pagina precisa de uma **rota** — um string unico que identifica aquela pagina no sistema de navegacao. E analogo ao sistema de fontes: voce registra um arquivo TTF com um alias, e depois usa o alias para referenciar a fonte. Na navegacao, voce registra uma pagina com uma rota, e depois usa a rota para navegar.

## Dois tipos de registro de pagina

### 1. AppShell.xaml (ShellContent)
Paginas que podem ser a **primeira pagina** do app (onboard, dashboard) ficam no `AppShell.xaml` como `ShellContent`. Elas ja recebem uma rota automaticamente (ex: `Route="MainPage"`).

### 2. Routing.RegisterRoute (paginas de navegacao)
Paginas acessadas por navegacao (login, detalhes, etc.) sao registradas programaticamente com `Routing.RegisterRoute`. Isso e feito no `MauiProgram.cs`.

## Por que usar metodo de extensao

O instrutor cria um metodo de extensao `AddPages` no `MauiAppBuilder` por dois motivos:
1. **Encadeamento fluente** — permite chamar `.AddPages()` na mesma cadeia de `.UseMauiApp<App>().ConfigureFonts(...)`.
2. **Centralizacao** — todas as rotas ficam em um unico lugar, facil de encontrar e manter.

Para o encadeamento funcionar, o metodo precisa:
- Ser `static`
- Ter `this MauiAppBuilder appBuilder` como primeiro parametro
- Retornar `MauiAppBuilder`

## typeof vs nameof

- `typeof(DoLoginPage)` — passa o **tipo** da classe para o registro. O Shell precisa do tipo para saber qual pagina instanciar.
- `nameof(DoLoginPage)` — gera o **nome** da classe como string em compile-time. Evita hardcode e typos.

## Organizacao de pastas (opiniao do instrutor)

O instrutor organiza paginas por **dominio funcional**:
```
Views/Pages/Login/
├── DoLogin/          # Tela de fazer login (email + senha)
│   └── DoLoginPage.xaml
└── ForgotPassword/   # Esqueceu senha (pertence ao fluxo de login)
    └── ...
```

A logica: "esqueceu a senha" faz parte do fluxo de login, nao e um dominio separado. Alterar senha dentro do app logado seria outro lugar.

## NavBar e Shell.NavBarIsVisible

A barra de navegacao (NavBar) aparece por padrao em todas as paginas. Ela inclui o titulo da pagina e o botao de voltar. 

- Na pagina de **onboard**, o instrutor esconde com `Shell.NavBarIsVisible="False"` porque nao faz sentido ter botao de voltar na primeira pagina.
- Na pagina de **login**, a NavBar fica visivel porque o usuario precisa poder voltar.

O titulo da NavBar vem da propriedade `Title` do ContentPage. Se quiser esconder o titulo mas manter o botao de voltar, deixe `Title=""`.

## Observacoes sobre plataformas

- **Android**: remover o `Title` nao causa problemas.
- **iOS**: pode ser necessario manter `Title=""` (string vazia) em vez de remover completamente, pois pode lancar excecao (instrutor nao confirmou).
- **iOS**: aparece uma sombra/barra preta abaixo da NavBar que precisa ser estilizada separadamente.
- As barras de status (topo e fundo) precisam de estilizacao especifica para combinar com o design.