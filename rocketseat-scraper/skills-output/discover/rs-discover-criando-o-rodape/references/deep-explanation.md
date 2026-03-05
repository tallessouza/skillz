# Deep Explanation: Criando o Rodapé

## Por que `<footer>` e não `<div>`?

A tag `<footer>` é uma das tags semânticas do HTML5 que indica ao navegador e a leitores de tela que aquele conteúdo é o rodapé da página (ou de uma seção). Isso melhora acessibilidade e SEO sem esforço adicional.

O instrutor usa diretamente: "footer é uma tag que, geralmente, quando a gente vai fazer o rodapé do nosso site, a gente adiciona ela". É a convenção padrão — não existe razão para usar `<div>` quando `<footer>` existe.

## Posicionamento do footer no HTML

O `<footer>` é colocado após a última seção de conteúdo da página. No exemplo da aula, ele vem "depois do social links" — ou seja, é o último elemento semântico antes do fechamento do `<body>`.

## Padding vertical sem lateral

O padrão `padding: 24px 0` é intencional:
- **24px em cima e embaixo** — cria respiro visual consistente
- **0 nas laterais** — o container pai já controla as margens horizontais

O instrutor verificou isso cuidadosamente com DevTools: "24 em cima e embaixo, 24, 24" — conferindo cada seção para garantir consistência de espaçamento em toda a página.

## Verificação com DevTools

Um ponto importante da aula é o hábito de **verificar espaçamentos com a ferramenta do desenvolvedor**. O instrutor não confia apenas no código — ele clica em cada elemento e confirma que os valores reais correspondem aos esperados. Isso é especialmente importante quando:
- Vários elementos têm o mesmo padding
- Margens podem estar colapsando
- Herança de CSS pode alterar valores

## Font-size hierárquico

O footer usa `14px` enquanto o corpo usa `16px`. Essa diferença de 2px cria hierarquia visual sutil — o conteúdo secundário (créditos, atribuições) não compete com o conteúdo principal.

## Sobre hover no link

O instrutor observa que o layout/design não fornece instrução sobre efeito de hover no link do footer. Quando o design não especifica, a decisão correta é **não inventar** — manter o comportamento padrão do link ou simplesmente não adicionar efeito hover customizado. Isso demonstra o princípio de seguir fielmente o que o design especifica.

## Cor do texto

O footer usa `color: #fff` (branco puro). O instrutor nota que "não parece que é um branco super branco" mas confirma que não há opacidade definida no layout. Quando o design não especifica opacidade, use a cor sólida conforme definida.