# Deep Explanation: Header com Animações CSS

## Por que `nav` e não `header`?

O instrutor começa usando `<header>` mas depois reconsidera: "ao invés do header aqui, ele seja um nav para avisar que é uma navegação aquilo ali que as pessoas podem clicar." A distinção é importante:

- `<header>` = região introdutória (logo, título, descrição)
- `<nav>` = região de navegação (links clicáveis)

Se o conteúdo é **clicável e leva a algum lugar**, `<nav>` é semanticamente correto. Leitores de tela anunciam "região de navegação", permitindo que usuários pulem direto para os links.

O instrutor optou por manter `<header>` no projeto por simplicidade didática, mas deixou claro que em produção, `<nav>` seria mais apropriado.

## Atributo `title` para SEO e acessibilidade

O instrutor destaca: "se é só uma imagem, ela não está muito descritiva do que, quais são as ações para o usuário depois." O atributo `title` no `<a>`:

1. Aparece como tooltip no hover (UX)
2. É lido por screen readers como descrição do link
3. Ajuda crawlers de SEO a entender a função do link

Isso é especialmente crítico quando o link contém **apenas uma imagem** sem texto visível.

## Seletor de atributo `[src*="keyword"]`

O instrutor explica o seletor CSS `img[src*="logo"]`: "esse seletor é o search, então a imagem que tem o search, asterisco igual, ou seja, ele vai pesquisar aqui dentro dessas aspas, qualquer coisa que tenha, por exemplo, lá dentro, como logo, uma sequência de caracteres logo."

- `*=` busca substring em qualquer posição do atributo
- Evita criar classes CSS extras apenas para selecionar elementos
- É auto-descritivo: lendo o CSS você sabe qual imagem é afetada

### Variantes do seletor de atributo:
- `[src^="logo"]` — começa com "logo"
- `[src$=".svg"]` — termina com ".svg"
- `[src*="logo"]` — contém "logo" em qualquer posição

## Por que `transition` vai no estado base

O instrutor inicialmente não vê a animação funcionar. Depois adiciona `transition: transform 500ms` **no elemento base** (não no `:hover`). A razão:

1. A `transition` define "como animar mudanças de propriedade"
2. Se está só no `:hover`, quando o mouse sai, não há transição definida no estado base → volta instantaneamente
3. Colocando no estado base, a transição funciona tanto na entrada quanto na saída do hover

## Cálculo de valores rem

O instrutor converte pixels para rem dividindo por 16 (tamanho base do navegador):

- `20px / 16 = 1.25rem`
- `12px / 16 = 0.75rem`
- `32px / 16 = 2rem`

Isso é padrão: 1rem = 16px no browser default.

## Badge com position absolute

A técnica para posicionar o badge (número do carrinho):

1. O `<a>` pai recebe `position: relative` — cria contexto de posicionamento
2. O `<span>` filho recebe `position: absolute` — sai do fluxo normal
3. `top: -0.5rem` e `right: -0.5rem` — deslocam o badge para cima e à direita do ícone
4. `border-radius: 50%` — torna circular
5. Flexbox interno centraliza o número

## Valores de rotação escolhidos

- **Logo: `rotate(90deg)`** — rotação de um quarto de volta, efeito visual de "virar" o ícone
- **Shopping bag: `rotate(-30deg)`** — rotação leve negativa (anti-horário), simula "balanço" do carrinho

O instrutor chegou a esses valores observando o design: "90 graus para frente" e "uns 30 graus" para o lado.

## Reset global de links

O instrutor aplica no CSS global:
```css
a {
  color: inherit;
  text-decoration: none;
}
```

`color: inherit` faz o link herdar a cor do pai (remove o azul padrão). `text-decoration: none` remove o sublinhado. Essencial para links que contêm ícones/imagens em vez de texto.