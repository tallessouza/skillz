# Deep Explanation: Animacoes Lottie no .NET MAUI

## Por que feedback visual e critico

O instrutor (Ellison) destaca um problema fundamental de usabilidade: quando o usuario toca num botao e nada acontece visualmente, a reacao natural e pensar "nao funcionou" e clicar novamente. Isso pode disparar multiplas requests para a API, potencialmente criando dados duplicados no banco de dados.

O problema vai alem do registro — qualquer comunicacao com API (login, criacao de tarefas, etc.) pode ter latencia por varios fatores:
- Velocidade da conexao de internet do usuario
- Tempo de processamento da API
- Tempo de armazenamento no banco de dados
- Processamentos adicionais no app

Mesmo que normalmente seja rapido, nao ha garantia de resposta imediata.

## Estrategia do instrutor: esconder tudo

A preferencia do Ellison e **esconder todos os elementos da pagina** e mostrar apenas a animacao. A razao: impedir que o usuario altere informacoes nos campos, clique em outros elementos, ou interaja de qualquer forma durante o processamento. So apos a resposta da API e que se toma a proxima acao (navegar em caso de sucesso, mostrar erro em caso de falha, e restaurar os elementos visuais).

## O que sao Lottie Files

Lottie Files sao **animacoes vetoriais** — essencialmente SVGs animados armazenados em formato JSON. O conceito foi criado pelo **time do Airbnb**.

As animacoes sao produzidas no **Adobe After Effects** e exportadas para o formato JSON que o Lottie interpreta.

### Quatro vantagens destacadas pelo instrutor:

1. **Tamanho leve** — ocupa muito menos espaco que video ou GIF equivalente
2. **Escalavel** — por ser vetorial, pode ser redimensionado sem perda de qualidade (como SVG)
3. **Interativo** — via codigo e possivel controlar (pausar, iniciar, etc.) a animacao
4. **Multiplataforma** — funciona em iOS, Android, Web, React Native, Flutter, .NET MAUI, entre outros

## Fluxo no LottieFiles.com

1. Criar conta gratuita no site
2. Pesquisar animacoes (ex: "Ghost", "Sandy")
3. Filtrar por "Free" para ver apenas animacoes gratuitas (icone de coroa = premium)
4. Customizar cores no Lottie Editor se desejar
5. Fazer download no formato "Lottie JSON"
6. Renomear o arquivo para algo descritivo (ex: `airplane.json`)

## Configuracao no projeto MAUI

O pacote necessario e o `SkiaSharp.Extended.UI.Maui`. Pode ser instalado via:
- NuGet Package Manager no Visual Studio (botao direito no projeto → Manage NuGet Packages → Browse → pesquisar "SkiaSharp.Extended.UI.Maui")
- Ou via CLI: `dotnet add package SkiaSharp.Extended.UI.Maui --version 2.0.0`

Apos instalar, e **obrigatorio** registrar no `MauiProgram.cs` com `.UseSkiaSharp()`. Pode ser necessario adicionar o using `SkiaSharp.Views.Maui.Controls.Hosting` (o Visual Studio oferece "Show Potential Fix" para resolver).

O arquivo JSON da animacao deve ficar em `Resources/Raw/` — se a pasta Raw nao existir, deve ser criada manualmente.