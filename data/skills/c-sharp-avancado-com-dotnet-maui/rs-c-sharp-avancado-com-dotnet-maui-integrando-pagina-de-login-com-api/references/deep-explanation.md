# Deep Explanation: Integrando Paginas .NET MAUI com API

## Por que tres passos separados?

O instrutor Welson enfatiza que a integracao segue sempre o mesmo padrao em tres camadas:

1. **Interface Refit** — define O QUE a API aceita/retorna
2. **UseCase** — faz o mapeamento entre o Model do app e o Request da API
3. **ViewModel** — orquestra o fluxo visual (status) e chama o UseCase

Essa separacao permite que, ao adicionar novos endpoints, o processo seja "muito mais rapido" porque voce "so reutiliza as propriedades que ja tem".

## Separacao de interfaces Refit por dominio

O instrutor e explicito: "Eu nao vou fazer aqui apenas uma interface. A gente vai separar uma interface para o user, uma interface para as tarefas, uma interface so com coisa de login."

Isso segue o Interface Segregation Principle (ISP) — cada consumidor depende apenas dos metodos que realmente usa.

## Mapeamento manual vs AutoMapper

O instrutor escolhe mapeamento manual deliberadamente: "por questoes de performance, fazer dessa forma que e mais rapido, consome menos recursos do telefone da pessoa que esta utilizando."

Em apps mobile, cada milissegundo e cada alocacao de memoria importam. AutoMapper usa reflection, que e mais lento. O mapeamento manual e direto e previsivel.

## StatusPage como enum

O enum `StatusPage` com valores `Default` e `Sending` controla a visibilidade dos componentes via DataTriggers no XAML. Isso e uma maquina de estados simples:

- `Default` → formulario visivel, animacao escondida
- `Sending` → formulario escondido, animacao visivel

O fluxo: `Default → Sending → (await API) → Default`

## Propriedades privadas com underline

O instrutor segue a convencao da Microsoft: "a documentacao da Microsoft diz que e uma boa pratica voce comecar essas propriedades com underline" para campos privados readonly.

```csharp
private readonly ILoginAPI _loginAPI;
```

## DevTunnel — armadilha comum

O instrutor mesmo esquece de iniciar o DevTunnel: "e ate eu mesmo esqueco de alguns passos aqui". O DevTunnel precisa ser "plantado" (Start Tunnel) no Visual Studio para que o app consiga se comunicar com a API local durante desenvolvimento.

## Atalhos do Visual Studio mencionados

- **Ctrl+RG** — remove usings inuteis
- **ctor + Tab** — gera construtor automaticamente
- **Ctrl+D** — duplica linha (util para registrar servicos similares no DI)
- **Alt+Seta** — move linha para cima/baixo
- **F5** — executar/continuar debug
- **F10** — step over no debug

## Reutilizacao de Response entre endpoints

Login e Register retornam o mesmo `ResponseRegisterUserJSON`. O instrutor explica: "a resposta desses dois endpoints e a mesma, sao os mesmos dados." Isso e comum em APIs onde ambos os fluxos autenticam o usuario e retornam token + dados do usuario.