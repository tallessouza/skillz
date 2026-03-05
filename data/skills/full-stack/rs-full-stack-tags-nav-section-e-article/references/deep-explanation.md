# Deep Explanation: Tags nav, section e article

## Filosofia das tags estruturais

O HTML semantico existe para comunicar **significado**, nao aparencia. As tags `<nav>`, `<section>` e `<article>` sao todas **tags estruturais** — assim como `<header>`, `<main>`, `<aside>` e `<footer>`. Elas formam o esqueleto semantico da pagina.

O instrutor enfatiza um ponto crucial: **entender o significado da tag e coloca-la no local correto desse significado**. Nao se trata de visual (isso e CSS), mas de estrutura e intencao.

## nav — Navegacao

### O que e
Um container para links de navegacao do site. Pode conter:
- Links diretos (`<a>`)
- Logomarca
- Listas de links (`<ul>` com `<li>` e `<a>`)

### Onde posicionar
O instrutor deixa claro: **nav pode ou nao estar dentro de header**. Nao existe regra obrigatoria. Ambos sao validos:

```html
<!-- Valido: nav dentro de header -->
<header>
  <nav>...</nav>
</header>

<!-- Igualmente valido: nav fora de header -->
<nav>...</nav>
<header>...</header>
```

A decisao depende do layout: se a navegacao faz parte das "informacoes iniciais do site" (header), coloque dentro. Se e independente, pode ficar fora.

### Nuance
Uma pagina pode ter multiplos `<nav>`. Um para navegacao principal, outro para breadcrumbs, outro para navegacao de rodape. Cada um comunica "aqui tem links de navegacao".

## section — Secoes tematicas

### O que e
Define secoes da pagina. O instrutor destaca que **section nao tem significado alem de "secao"**, entao e essencial:
1. Dar um `id` descritivo
2. Colocar um `<h2>` dentro para definir o que e a secao

### Sem nome = sem valor
Uma `<section>` sem identificacao e praticamente uma `<div>`. A semantica so existe quando voce nomeia.

### Dentro de aside
O instrutor menciona que sections podem ficar dentro de `<aside>`, para conteudo lateral complementar ao conteudo principal.

## article — Conteudo autocontido

### O que e
A tag `<article>` nasceu para **artigos**. O conteudo dentro dela deve fazer sentido isoladamente — se voce extrair o article da pagina, ele ainda e compreensivel.

### Estrutura tipica
- `<h1>` com o titulo do artigo
- Opcionalmente `<section>` internas com `<h2>` para subtitulos
- Paragrafos, imagens, codigo etc.

### Dentro de main
Geralmente article fica dentro de `<main>`, mas o instrutor nota que algumas pessoas usam apenas `<article>` sem `<main>`, colocando todo o conteudo principal direto no article. Funciona, mas a combinacao `<main><article>` e mais semanticamente completa.

## Hierarquia completa das tags estruturais

O instrutor posiciona nav/section/article como parte do mesmo grupo que header/main/aside/footer:

```
Tags estruturais HTML:
├── header    — informacoes iniciais
├── nav       — navegacao (dentro ou fora de header)
├── main      — conteudo principal
│   └── article  — conteudo autocontido
│       └── section  — subtopicos do artigo
├── section   — secoes tematicas da pagina
├── aside     — conteudo lateral/complementar
│   └── section  — secoes dentro do aside
└── footer    — informacoes finais
```

## Erro conceitual comum

Tratar tags estruturais como `<div>` com nomes bonitos. A diferenca e que:
- Leitores de tela usam essas tags para navegacao
- Motores de busca entendem a hierarquia do conteudo
- Desenvolvedores entendem a intencao ao ler o codigo

Se voce nao precisa de significado semantico, use `<div>`. Se precisa, use a tag estrutural correta.