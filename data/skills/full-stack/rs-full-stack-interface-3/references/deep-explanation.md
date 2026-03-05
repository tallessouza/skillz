# Deep Explanation: Interfaces no TypeScript

## Por que interfaces existem

O instrutor apresenta o problema central: quando uma funcao precisa receber dados complexos (como um produto com codigo, nome, valor), uma `string` simples nao basta. O produto tem **muitas informacoes** e voce precisa de uma forma de descrever exatamente quais informacoes sao necessarias.

Interfaces resolvem isso criando uma **tipagem customizada** — um contrato que diz "esse objeto DEVE ter essas propriedades com esses tipos".

## A analogia do contrato

Uma interface e como um formulario: ela define quais campos existem e que tipo de dado cada campo aceita. Se voce tenta enviar o formulario sem um campo obrigatorio, o TypeScript avisa. Se voce coloca texto onde deveria ser numero, o TypeScript avisa.

## Convencao de nomenclatura

O instrutor destaca duas praticas:
1. **Primeira letra maiuscula** (PascalCase) — e a boa pratica recomendada. `Product`, nao `product`.
2. **Prefixo I** (`IProduct`) — e uma pratica comum encontrada em aplicacoes, mas o instrutor opta por NAO usar. O ecossistema moderno do TypeScript (incluindo o proprio handbook oficial) desencoraja o prefixo I.

## O poder do IntelliSense

Um dos maiores beneficios praticos demonstrados: quando voce usa uma interface como tipo de parametro, o editor (VS Code) passa a:
- Sugerir as propriedades do objeto via Ctrl+Space
- Avisar quando falta uma propriedade obrigatoria
- Avisar quando o tipo de uma propriedade esta errado (ex: string onde deveria ser number)
- Mostrar um icone especifico para interfaces na janela de autocomplete

Isso significa que **erros sao pegos antes de executar o codigo**, durante a escrita.

## Quando interface vs type alias

O instrutor nao entra nessa distincao, mas para contexto:
- **Interface**: melhor para descrever formas de objetos, pode ser estendida com `extends`, suporta declaration merging
- **Type alias**: melhor para unions, intersections, tipos primitivos mapeados

Para o caso de uso apresentado (tipar um objeto com propriedades), interface e a escolha idiomatica.

## Separadores de propriedades

O instrutor usa virgula entre propriedades e menciona que a ultima propriedade pode ficar sem virgula. No TypeScript, interfaces aceitam tanto virgula (`,`) quanto ponto-e-virgula (`;`) como separadores. A convencao mais moderna e omitir separadores ou usar ponto-e-virgula.

## Validacao em tempo de compilacao

O instrutor demonstra tres cenarios de erro:
1. **Propriedade faltando**: remover `id` do objeto causa erro — TypeScript exige todas as propriedades da interface
2. **Tipo errado**: colocar `id` como string quando a interface diz `number` causa erro
3. **Propriedade extra**: nao demonstrado, mas TypeScript tambem avisa sobre propriedades que nao existem na interface (excess property checking)