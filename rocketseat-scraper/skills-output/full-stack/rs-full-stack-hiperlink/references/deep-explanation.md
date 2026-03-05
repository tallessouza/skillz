# Deep Explanation: Hiperlink HTML

## Por que o HTML se chama HyperText?

O "hyper" do HTML vem exatamente do conceito de hyperlink. A ideia revolucionaria e: voce esta lendo um texto, clica em algo, e e levado para outro lugar. Isso e o que diferencia hipertexto de texto comum. A tag `<a>` (anchor) e a materializacao desse conceito.

## O atributo `href` — por que e obrigatorio

`href` significa Hypertext REFerence. Sem ele, o `<a>` e apenas um elemento inline sem funcao de navegacao. O navegador nao renderiza como link, nao recebe foco via teclado, e nao tem comportamento de clique. E como um carro sem motor — tem a forma, mas nao funciona.

O valor do `href` aceita dois tipos:
1. **URL (Universal Resource Locator)** — um endereco completo para qualquer recurso na web (HTML, CSS, imagem, arquivo)
2. **Fragmento** — uma referencia a um pedaco da propria pagina, usando `#` + `id`

## Fragmentos em profundidade

O fragmento usa a sintaxe `#nome-do-id`. Quando o usuario clica:
1. O navegador procura um elemento com `id="nome-do-id"` na pagina
2. Faz scroll automatico ate esse elemento
3. A URL no navegador atualiza para incluir o fragmento (ex: `pagina.html#trabalhos`)

Isso so funciona se:
- O elemento alvo tem um atributo `id` correspondente
- Ha conteudo suficiente na pagina para que o scroll seja visivel (se o elemento ja esta visivel, nada acontece visualmente)

Caso de uso classico: sumarios, menus de navegacao em paginas longas, FAQs com ancora por pergunta.

## `target="_blank"` — quando e por que usar

Sem `target`, o comportamento padrao (`_self`) e: o link substitui a pagina atual. O usuario sai do seu site.

Com `target="_blank"`, o navegador abre uma nova aba (ou janela, dependendo da configuracao do navegador). Isso e util quando:
- Voce linka para um site externo e nao quer que o usuario perca seu site
- Voce abre um documento/recurso complementar

O instrutor enfatiza: "a gente acaba usando bastante pra que a pessoa nao saia do nosso site quando a gente colocar um link ali pra ela ler."

## Conteudo dentro do `<a>`

A tag `<a>` aceita qualquer conteudo inline ou block dentro dela. Voce pode colocar:
- Texto simples
- `<img>` (imagem clicavel)
- `<span>`, `<strong>`, `<em>`
- Ate `<div>` ou `<section>` (em HTML5)

Todo o conteudo dentro do `<a>` se torna clicavel e leva ao destino do `href`.

## Resumo dos tres padroes

| Padrao | href | Comportamento |
|--------|------|---------------|
| URL externa | `https://site.com` | Navega para outro site |
| Fragmento | `#id-do-elemento` | Scroll para elemento na mesma pagina |
| URL + target | `href="..." target="_blank"` | Abre em nova aba |