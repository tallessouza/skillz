# Deep Explanation: Reset CSS e Variáveis CSS com Responsividade

## Por que o reset inclui `*::before` e `*::after`

O instrutor destaca explicitamente: "Provavelmente nesse aplicativo a gente vai usar essas pseudo-classes. E o box-sizing e o border-box pra serem aplicados neles também, eu preciso fazer dessa forma."

Pseudo-elementos não herdam `box-sizing` automaticamente. Se você aplica apenas em `*`, qualquer `::before` ou `::after` com padding ou border vai quebrar o layout de formas sutis e difíceis de debugar.

## O reset de `font: inherit` — tirando poder do navegador

A declaração `font: inherit` no seletor universal é o que remove os estilos nativos de tags como `<h1>`, `<strong>`, etc. O instrutor demonstra na prática: "O H1 já não tá grande, já não tá com negrito. A gente tirou tudo."

Isso é proposital. A ideia é que **todo o controle tipográfico venha das variáveis CSS**, não dos defaults do user-agent stylesheet. Você reconstrói a tipografia do zero, com controle total.

## Vendor prefixes e font smoothing

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

O instrutor explica: "Tudo que tem um tracinho e um nome, isso aqui é o vendor prefix — é o prefixo de um motor de navegador. O webkit é um motor que funciona no Safari, funciona no Chrome."

O efeito é sutil: "A fonte fica um pouquinho mais suave, um pouquinho mais fina. Sem ele, a fonte fica um pouquinho grosseira." Não é perceptível por todos, mas é uma prática consolidada em projetos profissionais, especialmente em macOS onde a diferença é mais visível.

## Estratégia mobile-first com variáveis CSS

A sacada central da aula é definir variáveis com valores mobile no `:root` e sobrescrever apenas dentro do `@media`:

```css
:root {
  --fs-2xl: 2.5rem;  /* 40px — mobile */
}

@media (min-width: 80em) {
  :root {
    --fs-2xl: 4rem;  /* 64px — desktop */
  }
}
```

O instrutor explica: "Primeiro pra Mobile. E daqui a pouquinho a gente aplica a estratégia do Media Query. Se a largura for maior do que 1280 pixels, então você vai mudar o tamanho das fontes."

A beleza dessa abordagem: você **nunca muda o seletor dos elementos**. O `h1` sempre usa `var(--fs-2xl)`. Quem muda é a variável, no `:root`. Isso reduz drasticamente a quantidade de código responsivo.

## Por que EM no @media e não PX

O instrutor é específico: "O em, ele sempre vai estar buscando a fonte-size do root. O media query sempre referencia o root. Mesmo que a pessoa mude no navegador, 80em ele sempre vai ser 80em."

O cálculo: `80em × 16px = 1280px`. Mas usar em garante que, se o usuário aumentar o font-size base do navegador, os breakpoints se ajustam proporcionalmente — melhor acessibilidade.

## Conversão PX → REM

A regra é simples: divida por 16.

O instrutor: "O REM ele vai olhar sempre pra base de font-size do navegador, que é 16 pixels. E tudo que eu pegar eu vou sempre dividir por 16 pixels."

| Pixels | Cálculo | REM |
|--------|---------|-----|
| 14px | 14 / 16 | 0.875rem |
| 16px | 16 / 16 | 1rem |
| 20px | 20 / 16 | 1.25rem |
| 24px | 24 / 16 | 1.5rem |
| 32px | 32 / 16 | 2rem |
| 40px | 40 / 16 | 2.5rem |
| 48px | 48 / 16 | 3rem |
| 64px | 64 / 16 | 4rem |

## A questão do `role="list"` e acessibilidade

Esta é uma das partes mais ricas da aula. O instrutor explica um problema real:

"Quando a gente tira o list-style do role, aquelas bolinhas que ficam na lista... ele perde o sentido de ser uma lista para alguns navegadores."

A solução é usar o seletor `ul[role="list"]` em vez de `ul` diretamente. Isso cria uma **obrigação no HTML**: para remover as bolinhas, o dev precisa adicionar `role="list"`, que:

1. Mantém a semântica para leitores de tela
2. É um lembrete explícito de que a acessibilidade foi considerada
3. Funciona como um "opt-in" — listas sem o role mantêm as bolinhas

O instrutor: "Toda vez que eu precisar usar uma lista que eu não quero a bolinha, eu só volto e lembro de colocar esse role list. É pra eu manter um padrão de acessibilidade."

## Nomenclatura de variáveis CSS

O instrutor usa um padrão consistente:

- **Cores:** `--bg-color`, `--surface-color`, `--stroke-color`, `--text-color-primary`, `--brand-color-primary`
- **Fontes:** `--ff-sans` (font-family), `--fw-base` (font-weight), `--fs-sm` (font-size)
- **Sufixos de escala:** `sm`, `base`, `lg`, `xl`, `2xl`
- **Sufixos semânticos:** `primary`, `secondary`

Essa nomenclatura permite extensibilidade futura. O instrutor menciona: "No futuro a gente poderia ter serifada se a gente quisesse. E no futuro a gente vai trocar só isso daqui se a gente quiser trocar toda a fonte do projeto."

## Letter-spacing: convertendo % do Figma para CSS

O Figma mostra `-4%` para letter-spacing. O instrutor sugere usar ferramentas de conversão (ele menciona "COPSS Code") para descobrir que `-4%` equivale a `-0.04em` em CSS. Nem sempre os valores do Figma têm correspondência direta em CSS, então é importante converter corretamente.

## Font fallback chain

```css
--ff-sans: "Inter", system-ui, sans-serif;
```

A estratégia de fallback é: fonte desejada → fonte do sistema operacional → genérica. O instrutor: "É o Inter que nós queremos. Se não tiver, procura qual que é o padrão do sistema. Se não, é uma sans-serif normal."