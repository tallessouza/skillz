# Deep Explanation: Estilos para Entry no .NET MAUI

## Por que dividir em duas partes

O instrutor divide a estilização de Entry em duas aulas porque propriedades como cor do texto, placeholder e fonte são resolvidas puramente em XAML, mas customizações como cor da linha (underline) e cor do cursor exigem código C# platform-specific (handlers para Android e iOS). Essa separação reflete uma decisão arquitetural real: o que é cross-platform fica em XAML, o que é platform-specific fica em handlers.

## Estilos implícitos vs explícitos

Ao não definir `x:Key` no `<Style TargetType="Entry">`, o estilo se torna **implícito** — todas as Entry do aplicativo herdam automaticamente. Isso é intencional para garantir consistência visual sem precisar aplicar manualmente em cada Entry.

Se uma Entry específica precisar de estilo diferente, crie um segundo estilo COM `x:Key` e aplique explicitamente.

## O padrão ResourceDictionary sem code-behind

O instrutor enfatiza: ao criar um ResourceDictionary de estilo, delete o arquivo `.xaml.cs` (code-behind) E remova a referência `x:Class` do XAML. Se esquecer de remover o `x:Class`, o arquivo vai referenciar uma classe que não existe mais, causando erro de compilação.

## AppThemeBinding para suporte a temas

O padrão `AppThemeBinding` permite definir valores diferentes para Light e Dark mode numa única propriedade. O MAUI automaticamente alterna entre os valores quando o usuário muda o tema do sistema.

Estrutura: as cores (`PlaceholderColorLight`, `PlaceholderColorDark`, `PrimaryColorLight`, `PrimaryColorDark`) devem estar definidas no arquivo de cores do projeto (`Colors.xaml`).

## Dica do instrutor sobre Figma

O instrutor compartilha uma experiência de mercado: o Figma deve ser fonte de verdade para valores visuais (cores, tamanhos de fonte, fontes). Se os valores do Figma não correspondem ao esperado, é responsabilidade do designer corrigi-los — o desenvolvedor deve poder confiar nos valores do protótipo. Se ao implementar algo não fica bom no dispositivo, mostre para o designer e discuta, mas o protótipo não deveria ter valores errados.

## Limitação do MAUI

O instrutor menciona que não é possível definir fontes diferentes para o placeholder e para o texto digitado numa Entry. A `FontFamily` é compartilhada entre ambos. Porém, `PlaceholderColor` e `TextColor` podem ser diferentes, o que já ajuda na diferenciação visual.

## Checklist de implementação

1. Criar arquivo `EntryStyle.xaml` em `Resources/Styles/`
2. Deletar o code-behind `.xaml.cs`
3. Remover `x:Class` do XAML
4. Adicionar `using` para a classe de constantes de fontes
5. Definir estilo implícito com `FontFamily`, `FontSize`, `PlaceholderColor`, `TextColor`
6. Usar `AppThemeBinding` para cores que variam com o tema
7. Remover propriedades de estilo inline dos componentes que usam Entry
8. Importar o ResourceDictionary no `App.xaml`
9. Testar em Light mode E Dark mode