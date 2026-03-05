# Deep Explanation: Estruturando a Navegação

## Filosofia: Planejamento mental antes do código

O instrutor enfatiza um hábito fundamental: antes de tocar no código, visualize mentalmente a estrutura. Pergunte-se:
- Quais são os blocos visuais? (logo, menu, links)
- Como eles se aninham? (header contém nav? ou nav contém header?)
- Quais elementos serão clicáveis?

Esse exercício mental evita o padrão destrutivo de "ir codando e ver no que dá", que resulta em HTML desorganizado e difícil de estilizar com CSS depois.

## Header vs Nav: duas abordagens válidas

O instrutor mostra explicitamente que existem múltiplas formas de resolver o mesmo problema:

**Abordagem 1:** `header > nav` — o header é o container principal, o nav fica dentro
**Abordagem 2:** `nav > header` — o nav é o container principal, o header fica dentro

Ambas são válidas. A escolha depende do contexto do layout. O ponto importante é que o HTML semântico oferece flexibilidade — não existe uma única resposta correta.

## Por que envolver a logo em `<a>`?

O instrutor explica de forma prática: "em algum momento você vai precisar fazer os cliques pra essas coisas". Mesmo que no início do projeto a logo não tenha link funcional, colocar a tag `<a>` desde o começo:
- Mantém a estrutura pronta para navegação real
- Evita refatoração posterior
- É o padrão universal em sites (logo = link para home)

## Organização de assets: por que importa

O instrutor mostra o problema real: assets "soltos" na pasta, tudo misturado. A solução é criar subpastas:
- `assets/images/` — fotos, banners, imagens grandes
- `assets/icons/` — ícones pequenos (lupa, avião, map pin)
- `assets/` (raiz) — arquivos que não cabem em categoria (logo, profile pic)

**Cuidado com subpastas:** o instrutor alerta que ao criar uma pasta dentro de assets, é preciso verificar que ela realmente ficou DENTRO de assets. "Porque algumas vezes a gente pode deixar pra fora e não vai funcionar do jeito que a gente quer."

## Dica sobre mover arquivos no VS Code

O VS Code pergunta se você quer mover ou copiar ao arrastar arquivos. O instrutor recomenda manter o aviso ativo (não desmarcar o checkbox) porque "às vezes a gente vai mover sem querer". É uma proteção contra erros acidentais.

## IDs para menus: pensando em escala

Ao nomear o `<ul>` do menu, o instrutor usa `id="primary-menu"` e explica: "se tivesse mais menus, você poderia colocar secondary, etc." Isso demonstra o princípio de nomear pensando em expansão, mesmo que no momento só exista um menu.

## Hash como placeholder de link

`href="#"` é o padrão para links que ainda não têm destino. O instrutor reforça: "o hashtag aqui é pra ligar em lugar nenhum", mas a estrutura já está pronta para quando os links reais forem implementados.

## Imagens que não são ícones nem fotos de conteúdo

A foto de perfil (profile pic) é um caso especial: não é um ícone (não vai em icons/) nem uma imagem de conteúdo (não vai em images/). O instrutor a exporta diretamente do Figma como PNG e coloca na raiz de assets. Esse tipo de asset "inclassificável" fica na raiz.

## Exportando do Figma

Quando um asset não veio pelo Style Guide, é necessário exportá-lo manualmente:
1. Clicar no elemento no Figma
2. Ir em Export
3. Escolher formato (PNG para fotos, SVG para ícones)
4. Exportar para a pasta correta