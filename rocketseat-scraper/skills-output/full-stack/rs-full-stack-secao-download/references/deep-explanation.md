# Deep Explanation: Seção Download

## Por que position absolute + padding compensatório?

O instrutor explica um padrão fundamental: quando uma imagem decorativa precisa ficar posicionada no canto de um card (por exemplo, no bottom-right), usar `position: absolute` é a abordagem correta. Porém, isso remove a imagem do fluxo do documento — ela não empurra mais o conteúdo ao redor.

O problema: sem a imagem ocupando espaço, o card colapsa e fica menor do que deveria. A solução é compensar manualmente com `padding-bottom` no card. No caso da aula, o instrutor usa `15rem` de padding-bottom no mobile para criar espaço suficiente para a imagem de 14.5rem de largura.

**Analogia:** É como reservar um lugar na mesa para alguém que vai chegar atrasado. A pessoa (imagem) está "fora do fluxo normal" (absolute), mas você precisa manter o espaço reservado (padding).

## O bug do overflow horizontal

Quando a imagem tem `right: -3.5rem`, ela extrapola o container para a direita. Isso cria uma barra de scroll horizontal indesejada em toda a página.

A correção é simples mas essencial: `overflow-x: hidden` no elemento `html`. O instrutor enfatiza que é `overflow-x` (eixo horizontal) e não `overflow` (que esconderia também o scroll vertical).

**Cuidado:** Essa é uma correção global. Funciona bem para landing pages onde o overflow lateral nunca é desejado, mas em aplicações complexas pode esconder conteúdo importante.

## Alt text em imagens de ação

O instrutor destaca um ponto importante de acessibilidade: quando uma imagem é um botão de ação (como os botões de App Store/Play Store dentro de links), o `alt` precisa descrever **a ação**, não a aparência. Um leitor de tela não vê o ícone — precisa saber que aquele link é para "Baixar da Apple Store".

Para imagens puramente decorativas (como a pessoa cantando), o alt pode ser vazio porque não há informação funcional a transmitir.

## Estratégia mobile-first dos breakpoints

O CSS base é para mobile: card com padding compacto, imagem menor (14.5rem), sem max-width na div de texto. No breakpoint de 80em (desktop), o card ganha:
- Padding maior (8.75rem vertical, 5rem lateral)
- A div de texto ganha `max-width: 40rem` para não esticar infinitamente
- A imagem cresce para 29.125rem

Isso segue o padrão da landing page toda: construir o mobile primeiro e expandir no desktop.

## Padrão do card reutilizado

O instrutor mostra que a seção de download reutiliza o padrão de card já existente na landing page (com header contendo strong + h2, seguido de parágrafo). Isso mantém consistência visual e reduz CSS duplicado. A classe `even-columns` divide o card em duas colunas iguais, e `items-center` alinha verticalmente.

## Criação do arquivo CSS separado

Seguindo o padrão do projeto, o CSS da seção download fica em seu próprio arquivo (`download.css`), importado no `index.css`. Cada seção tem seu arquivo, mantendo organização modular.