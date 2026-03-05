# Deep Explanation: Fontes e Estilos de Texto com CSS

## Por que Google Fonts?

O instrutor explica que na area de desenvolvimento, fontes sao geralmente obtidas do `fonts.google.com`. Isso porque:

- Fontes do sistema (Arial, Times) variam entre Windows, Mac e Linux
- Google Fonts oferece fontes gratuitas e otimizadas para web
- O Figma (ferramenta de design) referencia fontes especificas que precisam ser importadas

## O fluxo de trabalho com Figma

O instrutor usa a aba "Inspect" do Figma para extrair propriedades CSS do texto:

1. Clica no elemento de texto no Figma
2. Abre a aba Inspect
3. Le as propriedades: font-family, font-weight, font-size, line-height
4. Vai ao Google Fonts buscar a fonte exata
5. Seleciona apenas os pesos necessarios (400 e 500 neste caso)
6. Copia o codigo `<link>` gerado
7. Cola no `<head>` do HTML

Esse fluxo e fundamental: **o design dita as propriedades, o dev implementa fielmente**.

## Seletor universal `body *`

O instrutor usa `body *` (body + asterisco) para aplicar a fonte a todos os elementos. O asterisco e o **seletor universal** — seleciona todos os elementos dentro do body.

Isso e importante porque alguns elementos HTML (como `<input>`, `<button>`, `<select>`) nao herdam `font-family` do parent por padrao. O seletor universal forca a aplicacao.

## Por que nao fixar width/height em textos?

O instrutor enfatiza: "a largura do P, do texto, e a largura que a gente ta colocando o texto. Quanto mais texto eu colocar, a altura vai se adaptando. A largura vai se adaptando."

Elementos de texto sao **intrinsecamente fluidos**. Fixar dimensoes:
- Causa overflow ou truncamento
- Impede responsividade
- Adiciona complexidade desnecessaria

O Figma sugere width/height, mas o instrutor diz explicitamente: "essas outras propriedades que o Figma sugere nao importam pra gente porque sao propriedades que elas sao muito fixas."

## font-weight numerico

O instrutor menciona que 500 e "um pouquinho mais pesado do que 400" e compara com bold (700). A escala numerica:

- 100: Thin
- 200: Extra Light
- 300: Light
- 400: Regular (padrao do navegador)
- 500: Medium
- 600: Semi Bold
- 700: Bold
- 800: Extra Bold
- 900: Black

Usar numeros ao inves de nomes garante precisao — nem toda fonte tem todas as variantes nomeadas.

## font-size padrao

O instrutor observa: "por padrao, os navegadores ja tem font size de 16 pixels". Isso significa que se o design pede 16px, nao e necessario declarar font-size — e o padrao do user agent stylesheet.

## line-height como propriedade essencial

A `line-height` de 24px com `font-size` de 16px cria uma proporcao de 1.5 (24/16). Essa proporcao e considerada otima para legibilidade em textos de corpo. O instrutor destaca que "ele mantem uma altura de linha", ou seja, o espacamento vertical entre linhas do texto.

## Cor em hexadecimal vs nome

O instrutor mostra duas formas equivalentes:
- `color: white` (nome da cor)
- `color: #FFFFFF` (hexadecimal)

Ambas funcionam. Em projetos profissionais, hexadecimal e preferido porque:
- Cobre todas as cores (nomes cobrem apenas ~140)
- E o formato que o Figma exporta
- Facilita consistencia com design tokens