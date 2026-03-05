# Deep Explanation: SnackBar em .NET MAUI

## Por que SnackBar ao inves de Toast

O instrutor (Edson) explica que prefere SnackBar em todos os projetos .NET MAUI que participa. A razao principal eh a diferenca de customizacao: Toast eh "bem basiquinho" — voce nao configura praticamente nada. SnackBar permite configurar cores, fontes, duracao, e o mais importante: adicionar um botao de acao.

## Layout visual do SnackBar

O SnackBar eh visualmente dividido em duas colunas:
- **Coluna 1:** Mensagem (obrigatoria)
- **Coluna 2:** Botao de acao (opcional)

Quando o usuario toca no botao, a funcao passada via parametro `action` eh executada. Se nenhuma action for passada mas o texto do botao existir, tocar no botao simplesmente fecha o SnackBar.

## O parametro Action em detalhes

O tipo do parametro action eh `Action` (sem generics):
- Nao recebe parametros
- Nao devolve valor (void)

Se fosse `Action<string>`, significaria que a funcao recebe um parametro string. Mas nesse caso eh apenas `Action` — uma funcao simples sem entrada e sem saida.

O action eh opcional (default null). Tres cenarios:
1. **Action com funcao:** botao aparece, ao tocar executa a funcao
2. **Action null com texto no botao:** botao aparece, ao tocar apenas fecha o SnackBar
3. **ActionButtonText como string.Empty:** botao nao aparece, usuario espera o timeout

## O parametro Anchor

O parametro `anchor` aceita um `IView` (qualquer componente visual). Se passado, o SnackBar aparece proximo daquele componente ao inves de no rodape da tela. O instrutor menciona que nunca utilizou pessoalmente e que eh "um pouquinho mais complicado" quando se trabalha com ViewModel (vs code-behind), pois a ViewModel nao tem referencia direta aos componentes visuais.

## SnackBarOptions — todas as propriedades

- `BackgroundColor` — cor de fundo do alerta
- `TextColor` — cor do texto da mensagem
- `ActionButtonTextColor` — cor do texto do botao
- `CornerRadius` — arredondamento das bordas
- `Font` — fonte da mensagem
- `ActionButtonFont` — fonte do texto do botao
- `CharacterSpacing` — espacamento entre caracteres da mensagem

## Criacao de Font no .NET MAUI

```csharp
var fonte = Microsoft.Maui.Font.OfSize("MainFontBlack", 14);
```

`Font.OfSize` recebe dois parametros: o tamanho e o font family. O font family vem de constantes definidas no projeto (ex: `MainFontLight`, `MainFontRegular`, `MainFontBlack`).

## Metodos de extensao para cores

O projeto usa um `ApplicationExtensions` com metodos como `GetHighlightColor()` e `GetSecondaryColor()` que buscam cores de um resource dictionary. Essas cores variam conforme light/dark mode, garantindo consistencia visual automatica.

## Hot Reload durante desenvolvimento

O instrutor demonstra que com o app rodando, eh possivel clicar no icone de "foguinho" (Hot Reload) para atualizar o codigo sem reiniciar. Isso acelera o ciclo de teste dos SnackBars.

## Proximos passos mencionados

O instrutor indica que na proxima aula fara uma refatoracao movendo o codigo do SnackBar para o NavigationService, evitando repeticao de codigo entre ViewModels. Isso sugere que o padrao correto eh centralizar a criacao de SnackBars num servico compartilhado.