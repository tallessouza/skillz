# Deep Explanation: Criando Secoes Responsivas

## Por que separar conteudo mobile em sections proprias

O instrutor cria uma `<section class="smartphones-img">` separada da section about. A razao e pratica: no mobile, a imagem dos smartphones aparece com background decorativo (illustration.svg). No desktop, essa section inteira desaparece com `display: none`, e a mesma imagem aparece dentro do about como coluna ao lado do texto.

Essa abordagem evita hacks de posicionamento CSS — em vez de tentar reposicionar a mesma imagem com media queries complexas, voce simplesmente tem duas instancias e controla qual aparece.

## Hierarquia de headings — raciocinio do instrutor

O instrutor explica o pensamento: "um h1 por pagina, que e o mais importante, depois subhead vem h2, h2... esse aqui tem cara de h3 porque poderia ter um h2 acima dele."

A logica e: mesmo que um h2 nao exista fisicamente entre o h1 e um heading menor, a hierarquia deve fazer sentido semantico. Se "poderia ter um h2 ali", entao o proximo nivel e h3.

## Pattern do header com strong + heading

O instrutor usa um pattern consistente: `<header>` contendo `<strong>` como label/eyebrow (ex: "Conheça o app") seguido do heading real. O strong recebe estilo de texto pequeno, uppercase, cor primaria — funciona como categoria ou contexto do heading.

Isso e extraido para `sections.css` porque o mesmo pattern se repete em multiplas secoes da landing page.

## Reset de imagens — inline-block vs block

O instrutor inicialmente coloca `display: block` nas imagens globalmente, mas percebe que isso quebra outras imagens (como icones inline). Muda para `inline-block` que "mantem propriedades inline mas libera outras features" como margin-top.

Essa e uma licao pratica: resets globais agressivos causam side effects. Prefira resets moderados.

## Ancoras como navegacao

O instrutor mostra que o `id="about"` na section cria automaticamente um destino de navegacao. Um `<a href="#about">` no header faz scroll ate essa secao. "Toda vez que eu pegar uma tagzinha de link e usar a ancora hash-about, ele vai procurar um id-about e mover a pagina."

## Organizacao de arquivos CSS

O instrutor cria `sections.css` em vez de `about.css` isolado porque: "nao faz sentido um arquivo so para ele." Estilos compartilhados (header strong, h2, p) vao em sections.css. Estilos especificos (background-color do about) vao em about.css.

Essa separacao permite reusar o pattern de header em futuras secoes sem duplicacao.

## background-color com surface-color — blend visual

O instrutor aplica `background-color: var(--surface-color)` no about e comenta "ja fez o blend, ja se misturou." Isso mostra que as variaveis de design token estao bem configuradas — surface-color contrasta com o background principal criando separacao visual entre secoes.