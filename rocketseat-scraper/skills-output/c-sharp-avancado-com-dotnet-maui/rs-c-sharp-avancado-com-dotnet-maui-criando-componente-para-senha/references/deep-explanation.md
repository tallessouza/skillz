# Deep Explanation: Componente de Senha no .NET MAUI

## Por que separar o componente de senha?

O instrutor enfatiza que prefere manter o componente de senha separado do componente de Entry+Label generico. A razao nao e apenas organizacional — o componente de senha tem:

1. **Logica de toggle** (mostrar/esconder) que nao existe em outros inputs
2. **Layout diferente** — precisa de Grid em vez de VerticalStackLayout simples
3. **Duas imagens** que alternam conforme o estado
4. **Reutilizacao em contextos diferentes** — tela de registro ("Senha"), tela de alteracao ("Senha atual", "Nova senha")

## Por que HorizontalStackLayout nao funciona

O instrutor demonstra ao vivo o problema: HorizontalStackLayout tenta ocupar o **menor espaco possivel**. A Entry fica comprimida para o tamanho do placeholder text. Ao digitar, ela vai crescendo caractere por caractere — comportamento completamente errado.

O instrutor questiona se isso e um bug do .NET MAUI ou comportamento proposital, mas a solucao e clara: usar Grid.

## A analogia da tabela

O instrutor explica Grid como "nada mais nada menos que uma tabela". Para o componente de senha:
- **1 linha** (nao precisa declarar RowDefinitions se e apenas 1)
- **2 colunas**: `*` (expansivel) e `40` (fixa)

O asterisco (`*`) significa "ocupe o maior espaco possivel". O valor `40` e fixo em pixels. Isso garante que a Entry sempre expanda e o icone mantenha tamanho consistente.

## O erro classico do Ctrl+C, Ctrl+V

O instrutor compartilha uma experiencia pessoal valiosa: ao copiar BindableProperty de outro componente, o **terceiro parametro** do `BindableProperty.Create` deve ser a classe atual, nao a classe de origem da copia.

```csharp
// ERRADO — copiou de EntryAndLabelComponents
BindableProperty.Create(nameof(Title), typeof(string),
    typeof(EntryAndLabelComponents), ...);  // classe errada!

// CORRETO
BindableProperty.Create(nameof(Title), typeof(string),
    typeof(EntryAndLabelPasswordComponents), ...);  // classe atual
```

O instrutor relata que ja perdeu ~10 minutos debugando esse problema. A propriedade simplesmente nao funciona e nao da erro obvio.

## Area de toque e UX

A imagem do olho tem apenas 21px de largura. O instrutor usa a mesma tecnica ensinada em aulas anteriores: envolve a imagem em um VerticalStackLayout e adiciona Padding para criar area de toque confortavel para o dedo.

O valor `Padding="0,12,0,12"` (12px acima e abaixo) foi encontrado por tentativa e erro, segundo o instrutor. A coluna do Grid tem 40px de largura (quase o dobro dos 21px da imagem) pelo mesmo motivo.

## Logica de toggle simplificada

A logica e um simples if/else baseado no estado atual de `IsPassword`:
- Se `IsPassword == true` → mude para `false` e troque imagem para olho aberto
- Se `IsPassword == false` → mude para `true` e troque imagem para olho fechado

O instrutor comete um erro ao vivo (troca as imagens nos blocos if/else) e corrige. Hot reload nao funcionou para essa correcao, precisando reiniciar o app.

## Imagens SVG exportadas do Figma

As imagens foram preparadas com antecedencia no Figma, exportadas como SVG, e colocadas na pasta `Resources/Images`. Ambas tem o mesmo tamanho (21px) para evitar redimensionamento ao alternar entre elas.