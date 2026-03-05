# Deep Explanation: Identidade Visual do App .NET MAUI

## Por que dois SVGs para o icone?

O instrutor explica que diferentes dispositivos exibem icones de formas distintas. Motorola usa bordas arredondadas, Samsung prefere circulos, outros usam quadrados sem bordas. O .NET MAUI resolve isso separando o icone em duas camadas:

- **Background (`appicon.svg`)**: a base colorida que sera recortada conforme o formato do dispositivo
- **Foreground (`appiconfg.svg`)**: o simbolo/logo que fica por cima, com fundo transparente

Essa abordagem permite que o sistema adapte automaticamente o icone para qualquer formato sem distorcer o logo.

## O que e Splash Screen?

A splash screen e a tela exibida enquanto o aplicativo esta carregando por baixo dos panos. E a primeira impressao visual que o usuario tem ao abrir o app. No .NET MAUI, ela e configurada com um SVG e parametros de cor e tamanho no `.csproj`.

## Limitacao do iOS com Splash Screen

A documentacao oficial da Microsoft avisa que no iOS 16.4 ou superior, simuladores nao carregam a splash screen a menos que o aplicativo esteja assinado. Para assinar, e necessario uma conta Apple Developer paga e registrar o dispositivo. No dispositivo fisico funciona normalmente.

## Limitacao do iOS com Background Transparente

A Apple nao permite backgrounds transparentes nos icones de aplicativos. Voce precisa definir uma cor solida para o background. Isso e diferente do Android, que aceita transparencia.

## Fluxo de trabalho recomendado pelo instrutor

1. Criar/editar os SVGs no Figma (ou ferramenta similar)
2. Manter dimensoes 456x456 para ambos os SVGs do icone
3. Exportar como SVG
4. Substituir os arquivos na pasta `Resources/AppIcon/` ou `Resources/Splash/`
5. Fazer **Clean** no projeto (botao direito > Clean) para evitar problemas de cache
6. Fazer Build/Run para verificar

## Espelhamento de dispositivo fisico

O instrutor usa o programa **scrcpy** (pronuncia: "screen copy") para espelhar o dispositivo Android no computador. E open source, disponivel no GitHub (Genymobile/scrcpy). Basta baixar, extrair, e executar `scrcpy.exe` no terminal com o dispositivo conectado via USB. Requer as mesmas configuracoes de modo desenvolvedor que o Visual Studio usa.

## Codigo unico, multiplataforma

O ponto central da aula e que todas essas configuracoes (nome, icone, splash) sao feitas uma unica vez no `.csproj` e funcionam tanto para Android quanto para iOS. O instrutor demonstra no Windows com Android e depois no Mac com simulador iOS, confirmando que o mesmo codigo funciona em ambas as plataformas.

## Editando o .csproj no Rider

No Rider, o acesso ao `.csproj` e diferente do Visual Studio:
- Botao direito no projeto > Edit > Edit PlanShare.App.csproj
- Tambem pode abrir com qualquer editor de texto