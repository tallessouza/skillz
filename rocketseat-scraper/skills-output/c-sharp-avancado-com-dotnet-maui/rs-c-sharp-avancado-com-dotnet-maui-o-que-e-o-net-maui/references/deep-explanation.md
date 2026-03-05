# Deep Explanation: O que e .NET MAUI

## Origem e historia

O Xamarin.Forms foi criado pela empresa Xamarin Inc. como framework para desenvolvimento multiplataforma em C#. Em 2016, a Microsoft adquiriu a Xamarin Inc., e tudo passou a fazer parte do ecossistema Microsoft. Porem, o Xamarin.Forms apresentava problemas estruturais que levaram a criacao do .NET MAUI como substituto.

## Por que Xamarin.Forms foi substituido

### Problema 1: Multiplos projetos
No Xamarin.Forms, um app para Android + iOS + Windows gerava 4 projetos na solution: um para cada plataforma + um projeto compartilhado. O projeto compartilhado continha regras de negocio e telas, enquanto codigo especifico ficava em cada projeto de plataforma. Isso tornava a solution poluida e dificil de gerenciar.

No .NET MAUI, existe apenas UM projeto. Codigo especifico por plataforma fica organizado em pastas dentro desse projeto unico (pasta Android, pasta iOS, etc.).

### Problema 2: Custom Renderers vs Handlers
Para customizar componentes nativos (ex: mudar a cor do cursor em um campo de texto), o Xamarin.Forms usava "Custom Renderers" — uma abordagem pesada que impactava performance, especialmente no carregamento inicial de paginas.

O .NET MAUI substituiu por "Handlers" — mais leves, flexiveis, simples de implementar e sem impacto perceptivel em performance.

## O caso da Entry (campo de texto)

O instrutor usa o exemplo do componente Entry (input de texto) para ilustrar a necessidade de codigo especifico por plataforma. A cor do cursor e da linha inferior da Entry herda o default da plataforma — que varia entre versoes do Android (rosa, azul, verde, cinza, preto) e entre Android/iOS. Se o app tem um design definido, essas cores default podem quebrar a consistencia visual. Alterar essas propriedades requer codigo nativo por plataforma, que no MAUI e feito via Handlers em pastas organizadas.

## Hot Reload — o que funciona e o que nao

Hot Reload no .NET MAUI funciona para mudancas de interface grafica: cor, fonte, tamanho, texto. Permite iterar rapidamente no design visual sem reiniciar o app. Porem, mudancas em codigo C# (regras de negocio) exigem parar e recompilar a aplicacao.

## Sobre Linux

A comunidade .NET MAUI trabalha em suporte para Linux, mas ate o momento da gravacao nao existe suporte oficial da Microsoft. Importante distinguir: voce pode DESENVOLVER no Linux (com dificuldade na configuracao e limitado ao Android), mas nao pode criar apps que RODAM no Linux.

## Sobre iOS no Windows

Existem duas opcoes para testar iOS a partir do Windows:
1. **Conectar Visual Studio a um Mac** na mesma rede Wi-Fi para usar o simulador iOS remotamente. Funciona, mas o instrutor questiona a praticidade — se voce tem acesso ao Mac, use-o diretamente.
2. **Conectar iPhone fisico via USB** ao Windows. Requer instalar um programa da Apple e ter conta Apple Developer ($99/ano). O instrutor nao testou pessoalmente esta opcao.

## Quando NAO usar MAUI — raciocinio do instrutor

O instrutor faz questao de nao "defender com unhas e dentes" o .NET MAUI. Exemplos concretos:
- **Camera avancada**: MAUI oferece tirar foto, gravar video, salvar — basico. Filtros, efeitos em tempo real, AR — nao.
- **Status bar**: Alterar cor — sim. Colocar imagem, mudar tamanho, customizar — nao.
- **Animacoes**: O instrutor usa a analogia "botao que se dissolve e vira uma gota d'agua" — isso nao e possivel em MAUI. E questiona se animacoes rebuscadas sao necessarias: "imagina app de banco, voce quer pagar conta vencendo e tem que esperar animacao do botao".
- **Jogos**: MAUI nao e engine de jogos.

## Opcoes de projeto

Ao criar um projeto .NET MAUI, existem duas opcoes:
1. **.NET MAUI App** — abordagem padrao com XAML/C#
2. **.NET MAUI Blazor Hibrido** — permite usar componentes Blazor (web) dentro do app nativo

O instrutor menciona que explicara as diferencas em detalhe na parte 2 da aula.

## Aplicacoes nativas

O instrutor enfatiza que .NET MAUI gera aplicacoes NATIVAS — nao sao web apps empacotados. A parte 3 da aula (nao coberta neste transcript) detalha o processo de compilacao e como o codigo se comporta em cada plataforma.