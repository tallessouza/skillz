# Deep Explanation: CSS Media Queries

## O que sao Media Queries

Media Queries sao **condicionais CSS** — o equivalente de um `if` na programacao, mas para observar a tela do usuario. O nome vem de "media" (a tela/dispositivo) e "queries" (pesquisa/consulta). O CSS consulta as caracteristicas da midia e aplica estilos condicionalmente.

### O que Media Queries podem observar

- **Largura da tela** (`width`, `min-width`, `max-width`)
- **Altura da tela** (`height`, `min-height`, `max-height`)
- **Orientacao** (`orientation: portrait` ou `landscape`) — se a tela esta na vertical ou horizontal
- **Tipo de midia** (`screen`, `print`, `all`)

## A Meta Viewport — Historia e Funcionamento

### Por que existe

Criada pela Apple por volta de 2007 para os primeiros iPhones. Sem essa tag, os navegadores mobile assumiam uma largura fixa de **980 pixels** — o usuario precisava dar zoom e arrastar para navegar. Era uma experiencia terrivel.

### Como funciona

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- **`width=device-width`**: A largura da pagina se adapta a largura do dispositivo. Se o celular tem 375px de largura, a pagina usa 375px — nao 980px.
- **`initial-scale=1.0`**: A escala inicial e 100% da largura do dispositivo. Valores possiveis:
  - `1.0` = 100% (padrao, o mais comum)
  - `0.5` = 50% (metade — zoom out)
  - `2.0` = 200% (dobro — zoom in)

### Importante

Essa tag ja vem automaticamente quando voce usa o atalho `!` no HTML (Emmet). Ela e **obrigatoria** para qualquer trabalho responsivo.

## Tres Formas de Aplicar Media Queries

### 1. Atributo `media` na tag `<link>`

```html
<link rel="stylesheet" href="mobile.css" media="screen and (orientation: portrait)">
```

O arquivo CSS so e carregado se a condicao for verdadeira. Util quando voce tem arquivos CSS completamente separados por dispositivo.

**Quando usar:** Raramente. So faz sentido em projetos muito grandes com CSS completamente diferente por dispositivo.

### 2. `@import` com condicao (At Rule)

```css
@import url("screen.css") screen and (orientation: portrait);
```

O `@import` e uma **At Rule** — qualquer regra CSS que comeca com `@` (arroba). O import carrega um arquivo CSS externo, mas so quando a condicao e atendida.

**Quando usar:** Quase nunca em producao. O `@import` adiciona requests HTTP extras e pode impactar performance.

### 3. `@media` inline no CSS (RECOMENDADO)

```css
@media screen and (min-width: 576px) {
  /* estilos que so aplicam nessa condicao */
}
```

Este e o metodo mais usado. As regras ficam no mesmo arquivo, proximas do CSS que modificam, facilitando manutencao.

**Anatomia:**
- `@media` — At Rule que inicia a media query
- `screen` — tipo de midia (tela digital)
- `and` — operador logico para combinar condicoes
- `(min-width: 576px)` — condicao: largura minima de 576px
- `{ ... }` — bloco com as regras CSS condicionais

## At Rules (@)

O instrutor enfatiza: sempre que uma regra CSS comeca com `@`, chamamos de **At Rule**. Exemplos:

- `@media` — media queries
- `@import` — importar CSS
- `@keyframes` — animacoes
- `@font-face` — fontes customizadas

## Tipos de Midia (Media Types)

- **`screen`** — telas digitais (desktop, celular, tablet). E o mais usado.
- **`print`** — para impressao (quando o usuario da Ctrl+P)
- **`all`** — todos os dispositivos (padrao se nao especificar)

O instrutor menciona que `screen` cobre tanto desktop quanto celular — nao e exclusivo de um tipo de dispositivo.