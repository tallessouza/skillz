# Deep Explanation: Toast no .NET MAUI

## O que e um alerta?

O instrutor (Wellison) define alerta como uma forma de passar feedback de uma operacao para o usuario no aplicativo. No contexto do curso, existem dois pontos no codigo onde `if` statements verificam sucesso de operacoes (atualizar perfil e alterar senha) mas nao fazem nada — e ali que os alertas entram.

## Por que o instrutor NAO usa Toast no projeto final

O instrutor explica que mostra o Toast apenas por conhecimento, mas nao vai usa-lo no projeto. As razoes:

1. **Icone do app aparece no Toast** — nao ha opcao para remover, e nem sempre e desejado
2. **Sem controle de cor do texto** — impossivel adaptar ao design system do app
3. **Sem controle de cor de fundo** — o Toast usa o estilo padrao do sistema operacional
4. **Muito simples** — basicamente so aceita mensagem, duracao e tamanho de fonte

Na proxima aula ele apresenta um alerta mais customizavel (provavelmente Snackbar ou popup do CommunityToolkit).

## ToastDuration enum

O enum `ToastDuration` tem apenas dois valores:
- `Short` — 2 segundos
- `Long` — 3.5 segundos

Nao ha opcao de duracao customizada alem desses dois valores.

## Cuidado com o using

Ao digitar `Toast` no Visual Studio, o IntelliSense pode sugerir duas opcoes:
- `Android.Widgets.Toast` — classe nativa do Android, NAO e o que queremos
- `CommunityToolkit.Maui.Alerts.Toast` — a correta para .NET MAUI

O instrutor enfatiza: escolha sempre `CommunityToolkit.Maui.Alerts`.

## Configuracao por plataforma

- **Android**: nenhuma configuracao adicional necessaria
- **iOS**: nenhuma configuracao adicional necessaria
- **Windows**: requer configuracoes extras (consultar documentacao oficial)

## Documentacao oficial

[Toast - .NET MAUI Community Toolkit](https://learn.microsoft.com/en-us/dotnet/communitytoolkit/maui/alerts/toast?tabs=windows%2Candroid)