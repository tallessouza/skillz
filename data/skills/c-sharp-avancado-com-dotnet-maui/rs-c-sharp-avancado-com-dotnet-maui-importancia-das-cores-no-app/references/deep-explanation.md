# Deep Explanation: Importancia das Cores no App

## Por que categorias semanticas e nao nomes de cores

O instrutor explica com um cenario pratico: imagine que voce nomeou uma variavel `azulTurquesa` com o hexadecimal do azul. Um dia voce decide que o destaque agora sera laranja. Voce tera que sair catando no codigo todas as referencias a `azulTurquesa` para trocar. Se tivesse nomeado como `highlightColor`, bastaria trocar o hexadecimal em um unico lugar.

Essa logica e identica ao principio de variaveis no Figma: voce cria uma variavel `PageBackgroundColor`, referencia em todos os componentes, e ao mudar o valor da variavel, tudo atualiza automaticamente.

## Equilibrio na quantidade de cores

O instrutor usa uma analogia clara:
- **Cores demais**: numa pagina onde cada elemento tem cor diferente, tudo chama atencao ao mesmo tempo. O usuario fica "perdidinho" — nada se destaca porque tudo se destaca.
- **Poucas cores**: o app fica monotono, "chatao de utilizar".
- **Paleta inconsistente**: mesmo tendo muitas cores mas usando poucas por pagina, se cada pagina usa cores diferentes para o mesmo tipo de acao (ex: botao), voce nao cria um modelo mental. O usuario nao aprende que "azul = acao principal".

## WCAG — Web Content Accessibility Guidelines

### O que e
Conjunto de diretrizes para tornar sites e apps acessiveis para pessoas com deficiencia (visual, auditiva, motora, cognitiva).

### Quatro pilares
1. **Perceptivel** — conteudo pode ser percebido
2. **Operavel** — interface pode ser operada
3. **Compreensivel** — informacao e compreensivel
4. **Robusto** — conteudo funciona com tecnologias assistivas

### Tres niveis
- **A** — nivel basico
- **AA** — nivel intermediario
- **AAA** — nivel mais rigoroso (o ideal)

### Contraste explicado
Contraste e a diferenca numerica entre duas cores. Fundo branco + texto preto = contraste alto (bom). Fundo branco + texto cinza claro = contraste baixo (ruim — pessoas podem nao conseguir ler).

O instrutor enfatiza: "Eu ja vi casos onde a pessoa bateu o pe, falou 'eu quero essa cor porque e bonita', so que algumas pessoas vao ter dificuldade de ler aquele texto por causa do contraste."

## Por que nao usar preto puro no dark mode

Argumento baseado em artigos de designers profissionais que o instrutor leu:
- O preto puro (#000000) no computador nao existe na natureza
- Nossos olhos nao estao acostumados a ver preto puro
- Um cinza escuro tendendo ao preto (#3D3C40) e "mais suave", "mais bonitinho", "mais agradavel aos olhos"
- O instrutor demonstra no Figma: ao trocar o background para preto puro, o app fica "bem estranho"

Para o branco no light mode, o instrutor considera que nao e tao problematico, mas menciona que alguns designers recomendam um cinza bem clarinho tambem.

## Ferramentas recomendadas

### Plugin Contrast no Figma
- Selecione um elemento de texto
- O plugin mostra a nota WCAG (A, AA, AAA) para texto normal e large text
- Large text = 24px ou bold/extra-bold

### Color Safe (colorsafe.co)
- Insira a cor de fundo do seu app
- Selecione o padrao WCAG desejado (AAA recomendado)
- O site gera todas as cores que voce pode usar com aquele fundo mantendo o contraste

## Categorias de cores do projeto

| Categoria | Proposito | Exemplo Light | Exemplo Dark |
|-----------|-----------|---------------|--------------|
| `HighlightColor` | Destaque, CTA, chamar atencao | Azul | Azul (tom diferente) |
| `DangerActionColor` | Acoes perigosas (deletar) | Vermelho | Vermelho (tom diferente) |
| `PageBackgroundColor` | Fundo da pagina | Branco | Cinza escuro (#3D3C40) |
| `PrimaryColor` | Textos, fundo de botoes | Preto | Claro |
| `SecondaryColor` | Cor secundaria | Branco | Escuro |
| `LineColor` | Linhas divisorias | Primary 20% opacidade | Primary 20% opacidade |
| `PlaceholderColor` | Placeholder de inputs | Primary 50% opacidade | Primary 50% opacidade |
| `AvatarColor` | Cor fixa do avatar | Fixa | Fixa |
| `SkeletonLoadColor` | Skeleton loading | Especifica | Especifica |
| `KeyboardColor` | Cor do teclado | Especifica | Especifica |