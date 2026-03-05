# Deep Explanation: Botões de Formulário

## Por que `type="button"` é essencial

O comportamento padrão de um `<button>` dentro de um `<form>` é `type="submit"`. Isso significa que qualquer botão sem tipo explícito vai tentar enviar o formulário ao ser clicado. Em formulários com múltiplos botões (salvar rascunho, limpar, enviar), isso causa envios acidentais.

O instrutor demonstra isso na prática: ao ter dois botões, o secundário (salvar respostas) recebe `type="button"` para não disparar o submit. O primário pode omitir o type (já é submit por padrão), mas o instrutor recomenda colocar `type="submit"` explicitamente para tornar o código mais intuitivo e legível para outros desenvolvedores.

## A estratégia `all: unset`

O `all: unset` é uma propriedade CSS que remove TODOS os estilos aplicados ao elemento — tanto os do user-agent stylesheet (estilos padrão do browser) quanto herança. O instrutor descreve o resultado como o botão ficando "puro, sem informações extras".

Essa abordagem é superior a resetar propriedades individualmente porque:
1. Garante que nenhum estilo inesperado do browser vaze para o design
2. Reduz código (uma linha vs muitas)
3. Cria uma base consistente cross-browser

Depois do `all: unset`, o botão perde tudo: padding, border, background, font, cursor. Por isso é necessário reconstruir cada propriedade visual desejada.

## Focus e acessibilidade via teclado

O instrutor explica que `:focus` é "sempre que eu usar o teclado" — quando o usuário navega com Tab, o elemento recebe focus. Definir estilos de `:focus` garante que usuários que não usam mouse tenham feedback visual equivalente ao hover.

A combinação `:hover, :focus` no mesmo seletor é um padrão de acessibilidade básico: mesma resposta visual independente do dispositivo de entrada.

## `margin-left: auto` em flexbox

Dentro de um container flex, `margin-left: auto` no elemento secundário "empurra" todo o espaço disponível para a esquerda daquele elemento, efetivamente alinhando-o à direita. O instrutor demonstra: "para ele empurrar o espaço de lá para cá e ficar aqui".

Isso é mais semântico e flexível que `float: right` ou `justify-content: space-between`, porque permite controle individual de posicionamento dentro do flex container.

## Quando criar variáveis CSS

O instrutor toma uma decisão pragmática: cores usadas apenas uma vez (`brand-dark`, `brand-mid`) ficam hardcoded diretamente no CSS. Cores reutilizadas múltiplas vezes (`text-highlight`, `surface-secondary`) são variáveis. Ele reconhece que se a cor `brand-dark` começar a ser usada em mais lugares, faria sentido criar uma variável, mas para uso único, a complexidade não se justifica.

## Campos `required` e validação nativa

O instrutor observa que ao clicar no botão submit, o browser automaticamente valida campos `required` e impede o envio se houver campos vazios. Essa validação nativa é uma primeira camada de proteção que não exige JavaScript. O instrutor usa isso como motivo para "não ficar apertando errado toda hora".

## Organização de arquivos CSS

O instrutor cria um arquivo separado `buttons.css` para os estilos de botão, seguindo o padrão de separação por componente/responsabilidade. O wrapper `.actions-wrapper` fica em `forms.css` porque é uma preocupação de layout do formulário, não do botão em si.