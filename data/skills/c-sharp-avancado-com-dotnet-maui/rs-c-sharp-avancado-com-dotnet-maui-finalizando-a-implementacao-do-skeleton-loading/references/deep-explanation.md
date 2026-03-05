# Deep Explanation: Skeleton Loading em .NET MAUI

## Por que skeleton loading e nao spinner?

O instrutor enfatiza que o skeleton loading deve ter "o mesmo shape, a mesma forma do elemento original com as informacoes". A ideia central e que o usuario perceba uma continuidade visual — os dados "aparecem" no lugar certo, sem saltos ou mudancas drasticas de layout. Isso e superior a um spinner generico porque:

- Reduz a percepcao de tempo de espera
- Prepara o usuario para o layout que vai aparecer
- Evita "layout shift" que causa desorientacao

## A armadilha do Ctrl-C Ctrl-V de arquivos XAML

O instrutor dedica uma parte significativa da aula a explicar os problemas de copiar arquivos XAML entre pastas. Existem **4 lugares** que precisam ser atualizados:

1. **Nome do arquivo XAML** — o arquivo fisico
2. **Nome do arquivo CodeBehind** (.xaml.cs) — o Visual Studio renomeia automaticamente ao renomear o XAML, mas...
3. **Nome da classe no CodeBehind** — NAO e renomeado automaticamente pelo Visual Studio. Voce precisa alterar manualmente
4. **Atributo `x:Class` no XAML** — tambem NAO e atualizado. Referencia a classe do CodeBehind

Se qualquer um desses estiver inconsistente, o `InitializeComponent()` vai dar erro e o projeto nao compila.

### Sync Namespaces no Visual Studio

O Visual Studio tem a opcao "Sync Namespaces" (botao direito no projeto), que corrige namespaces automaticamente. Porem, **no momento da gravacao, essa funcionalidade NAO funciona para projetos .NET MAUI**. Funciona para projetos web, API, class library, etc. Em .NET MAUI, a correcao deve ser manual.

**Dica do instrutor:** Crie uma classe nova na pasta de destino, copie o namespace gerado automaticamente, e use-o para substituir o namespace errado no arquivo copiado.

## Referencia entre componentes no mesmo namespace

Mesmo que dois componentes estejam no mesmo namespace e na mesma pasta, no XAML voce **ainda precisa declarar o xmlns** para referenciar o outro componente. O instrutor tentou usar `<SkeletonView />` diretamente e nao funcionou — precisou adicionar:

```xml
xmlns:skeleton="clr-namespace:PlanShare.App.Views.Components.Skeletons"
```

E entao usar `<skeleton:SkeletonView />`.

## Decisao sobre botoes na tela de loading

O instrutor apresenta isso como uma decisao de design, nao tecnica:

- **A favor de mostrar botoes:** a tela fica mais fiel ao layout final, transicao mais suave
- **Contra:** algumas pessoas preferem mostrar apenas a parte de carregamento

A recomendacao do instrutor: **mostre os botoes, mas desabilitados** (`IsEnabled="False"`). E se estiver num projeto de empresa, alinhe com o designer.

## BoxView e largura automatica

O SkeletonView herda de BoxView. Quando nao se define `WidthRequest`, o BoxView ocupa todo o espaco horizontal disponivel — que e o comportamento desejado para skeletons de entries que tambem ocupam largura total. Portanto, nao e necessario (nem recomendado) definir largura explicita nesses casos.

## Ajuste fino de altura

O instrutor pegou 26 do Figma como valor inicial para HeightRequest, mas depois de testar no dispositivo, percebeu que 38 ficava mais natural. A licao: **valores do Figma sao ponto de partida, nao verdade absoluta**. Sempre teste no dispositivo e ajuste.

## Margem para alinhamento

Quando a transicao skeleton → dados causava um "pulo" visual (o entry aparecia ligeiramente abaixo do skeleton), o instrutor adicionou `Margin="0,5,0,0"` ao componente skeleton para compensar. O valor foi encontrado por tentativa: comecou com 3, ajustou para 5.