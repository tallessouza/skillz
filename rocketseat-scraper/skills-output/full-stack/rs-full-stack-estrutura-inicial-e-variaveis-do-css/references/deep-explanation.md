# Deep Explanation: Estrutura Inicial e Variáveis do CSS

## Por que REM e não pixels?

O instrutor (Mike) explica com uma analogia prática: nos navegadores, existe uma configuração de acessibilidade onde o usuário pode alterar o tamanho padrão da fonte. No Chrome/Edge, fica em Settings → Fonts → Customize Fonts.

Por padrão, o navegador define `font-size: 16px` no root element. Se uma pessoa com dificuldade visual muda esse valor para 24px:
- **100% no root** → agora significa 24px (acompanha a preferência)
- **16px fixo no root** → ignora a preferência, sempre 16px — "e isso é horrível", nas palavras do instrutor

O REM (Root EM) sempre busca o valor no root element do navegador, respeitando a acessibilidade. Pixels são valores absolutos que ignoram isso.

## A história do EM e REM

O instrutor traz contexto histórico: o nome "EM" vem das prensas tipográficas antigas, onde o "M" era uma unidade de medida para os caracteres. No CSS:

- **EM** → relativo ao pai direto. Se um `<p>` está dentro de uma `<div>` com `font-size: 32px`, então `1em = 32px` naquele contexto
- **REM** → "Root EM" — pula todos os pais e busca direto no root element (o que o navegador define)

O REM é preferível porque é previsível: não importa onde o elemento está na árvore DOM, 1rem sempre significa a mesma coisa.

## Fórmula de conversão

```
valor_em_rem = valor_em_pixels / 16
```

Exemplos do instrutor:
- 14px → 14/16 = 0.875rem
- 8px → 8/16 = 0.5rem
- 4px → 4/16 = 0.25rem
- 16px → 16/16 = 1rem

"Daqui pra frente a gente só vai falar um REM" — não se usa mais unidade fixa.

## Por que variáveis CSS no :root?

O instrutor organiza tudo como custom properties porque:
1. **Centralização** — todas as cores e fontes num único lugar
2. **Consistência** — evita digitar hex codes errados espalhados pelo projeto
3. **Manutenção** — mudar uma cor? Muda num lugar só
4. **Design system** — reflete exatamente o que o designer entregou no style guide

## Organização de fontes no HTML

O instrutor faz questão de organizar a ordem dos elementos no `<head>`:
1. Primeiro: `<link rel="preconnect">` para o Google Fonts
2. Depois: o link da fonte em si
3. Por último: o link do CSS

Ele destaca que gosta de mover o preconnect para cima, logo após as metas, para que a conexão comece o mais cedo possível.

## Caminhos relativos sem barra

O instrutor inicialmente coloca `./styles/index.css` mas depois corrige para `styles/index.css` sem a barra:
> "Vamos tirar a barra, vamos deixar assim, sem a barra mesmo. Essa referência sem a barra ela acaba sendo um pouquinho melhor depois pra gente não ter nenhum tipo de probleminha."

## Organização dos commits

O instrutor demonstra uma prática de commits organizados:
1. Primeiro commit: apenas assets/imagens → "initial commit assets"
2. Segundo commit: HTML + CSS → "estrutura inicial do projeto e variáveis do projeto"

Ele usa staging seletivo, adicionando tudo e depois removendo do stage o que não pertence àquele commit específico.

## Cores do style guide

O design entregou várias cores, mas o instrutor seleciona apenas as necessárias:
- Cores de texto (primary, secondary, tertiary, highlight)
- Cores de superfície (primary = branco, secondary = tom alaranjado claro)
- Cores de stroke/borda (default, highlight)
- Cor semântica (error)

Ele explica que cores como "support" não foram incluídas porque eram para ícones já exportados como SVG, e cores como "brand-light" seriam adicionadas se necessário depois.

## Shorthand font

O instrutor usa a propriedade shorthand `font` nas variáveis:
```css
--text: 400 1rem/1.5 var(--font-family);
```
Isso é: `weight size/line-height family` — compacto e aplicável com `font: var(--text)`.