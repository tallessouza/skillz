# Deep Explanation: Valores Arbitrários no Tailwind

## O que são valores arbitrários

Valores arbitrários são valores entre colchetes `[]` que permitem usar qualquer valor CSS diretamente nas classes do Tailwind, fugindo do tema padrão. Toda propriedade do Tailwind aceita essa sintaxe.

Exemplos: `bg-[blue]`, `bg-[#825760]`, `max-w-[700px]`, `text-[14px]`.

## Por que evitar — o raciocínio do instrutor

O instrutor destaca dois problemas fundamentais:

1. **Fica "feio pra caramba"** — classes com colchetes e valores hexadecimais poluem o HTML, tornando o código difícil de ler e escanear visualmente. Compare `bg-sky-500` com `bg-[#825760]`.

2. **Foge dos padrões do projeto** — uma das coisas mais importantes de um projeto front-end é **definir padrões e seguir padrões**. Valores arbitrários são, por definição, escapes do sistema de design. Cada valor arbitrário é um padrão não documentado que outro desenvolvedor vai ter que decifrar.

## A alternativa correta: estender o tema

Em vez de usar `max-w-[700px]`, o instrutor mostra o caminho correto:

1. Abrir o `tailwind.config`
2. Em `theme.extend`, adicionar a propriedade customizada
3. Dar um nome semântico (ex: `app` para o maxWidth do container principal)
4. Usar o nome no HTML: `max-w-app`

Isso transforma um "número mágico" em um **token de design** com nome e significado.

## Quando valores arbitrários são aceitáveis

O instrutor não diz que é proibido — diz que deve ser evitado "ao máximo". Situações onde pode fazer sentido:

- Valor verdadeiramente único, usado uma única vez em todo o projeto
- Prototipagem rápida (mas deve ser convertido para tema antes do merge)
- Valores que vêm de APIs ou dados dinâmicos (nesse caso, inline styles podem ser mais apropriados)

## Conexão com design systems

Valores arbitrários são o anti-pattern de design systems. Um design system funciona quando há um vocabulário finito e compartilhado. Cada `bg-[#algo]` é uma cor fora do vocabulário, o que significa:

- Não aparece no autocomplete do editor
- Não muda quando o tema muda (dark mode, por exemplo)
- Não é auditável (quantas cores distintas o projeto usa?)
- Outro dev não sabe se é intencional ou erro