# Deep Explanation: Implementando UI de Página de Erro no .NET MAUI

## Pilha de navegação e o conceito de "fechar página"

O instrutor explica que a página de erro fica empilhada sobre a página anterior. No exemplo dado:

1. MainPage (AppShell) → OnboardPage
2. Usuário clica "Login com email e senha" → LoginPage empilhada sobre OnboardPage
3. Erro na API → ErrorsPage empilhada sobre LoginPage

Quando o usuário toca "Tentar Novamente", a ErrorsPage é removida da pilha, revelando a LoginPage novamente. O `GoToAsync("..")` faz exatamente isso — navega "para trás" na pilha, equivalente a um "pop".

## Sobrescrita de estilos vs. criação de novos

O projeto tem um `ButtonStyles` global que define `HeightRequest=50` e `CornerRadius=15`. O botão da ErrorsPage precisa de valores diferentes (60 e 20). Em vez de criar um novo estilo, o instrutor sobrescreve diretamente no XAML, o que é adequado quando apenas um botão precisa de valores diferentes.

A lição aqui: estilos globais servem como baseline, e propriedades inline sobrescrevem quando necessário sem poluir o arquivo de estilos.

## TextTransform — por que não alterar o texto direto

O instrutor mostra que `TextTransform="Uppercase"` é preferível a escrever o texto em caps lock. Isso porque:
- O texto original fica legível no código
- A propriedade funciona também em Labels
- É consistente com o padrão de separação entre conteúdo e apresentação

## Convenção de naming Microsoft para campos privados

O instrutor enfatiza que a Microsoft recomenda iniciar campos privados com underscore: `_navigationService`. Isso diferencia visualmente campos de classe de parâmetros de método.

## RelayCommand e a geração automática

O `[RelayCommand]` do MVVM Community Toolkit gera automaticamente uma propriedade `ICommand` com o nome do método + "Command". Então `Close()` gera `CloseCommand`. No XAML, o binding deve usar `CloseCommand`, não `Close`.

## Margem otimizada — consolidar espaçamentos

O instrutor mostra um insight prático: quando dois elementos têm margin entre si, é melhor colocar toda a margem em um só elemento. Se o label "Oops" tem `Margin="0,0,0,25"` (25 bottom) e o label seguinte não tem margin top, o resultado é o mesmo que remover a margin do "Oops" e colocar `Margin="0,25,0,40"` no label de baixo. Isso reduz duplicação e facilita manutenção.

## Figma como fonte de verdade

O instrutor usa Alt+hover no Figma para medir distâncias entre elementos (25px, 40px) e traduz diretamente para valores de Margin no XAML. A medição do Figma determina se o espaçamento vai como margin top (relativo ao elemento acima) ou margin bottom (relativo ao elemento abaixo).

## Textos universais vs. traduzíveis

"Oops!" é considerado universal — não precisa de tradução em nenhum idioma. Vai direto no XAML. Já "Os seguintes erros foram encontrados" precisa de versões em inglês, espanhol, francês, etc., então usa o sistema de Resources (`AppResources.FollowErrorsWereFound`).

## Hot Reload

O instrutor demonstra que mudanças no XAML (como adicionar `HorizontalOptions="Center"`) refletem imediatamente no dispositivo conectado sem recompilar, graças ao Hot Reload do .NET MAUI.