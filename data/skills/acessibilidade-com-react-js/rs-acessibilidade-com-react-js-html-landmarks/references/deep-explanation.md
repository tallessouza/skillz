# Deep Explanation: HTML Landmarks

## O que sao landmarks

Landmarks sao subsecoes do site com significado semantico. Leitores de tela e tecnologias assistivas usam landmarks para navegacao rapida — o usuario pode "pular" entre landmarks sem precisar navegar elemento por elemento.

## A diferenca critica entre roles e elementos semanticos

O instrutor demonstra com um exemplo pratico e revelador: ao colocar `role="form"` numa `<div>`, o elemento recebe significado semantico de formulario, mas **nao ganha o comportamento de form**. Um botao `type="submit"` dentro dessa div nao dispara `onSubmit`. Ao trocar para `<form>`, o comportamento funciona.

Isso significa que:
- **Roles** = significado semantico apenas (para tecnologias assistivas)
- **Elementos HTML** = significado semantico + comportamento nativo

Por isso a regra e: sempre que existir um elemento HTML que expresse o que voce precisa, use o elemento, nao a role.

## Header muda de significado conforme contexto

Um dos insights mais importantes da aula: o elemento `<header>` tem comportamento diferente dependendo de onde esta:

- **`<header>` no root da pagina** → age como landmark `banner`
- **`<header>` dentro de `<article>`** → NAO e landmark, e apenas cabecalho semantico do artigo

O instrutor alerta: se voce nao entender isso, vai acabar colocando `role="banner"` no header de um artigo, o que e incorreto. Aquele header nao e um banner — e apenas o cabecalho daquele conteudo especifico.

## Por que landmarks duplicadas sao problematicas

O instrutor demonstra que ao ter duas `<nav>` sem diferenciacao, o axe-core (ferramenta de auditoria) reporta erro: "Ensure landmarks are unique." Isso porque para um usuario de tecnologia assistiva, duas navegacoes identicas sao confusas e potencialmente inutilizaveis.

A solucao e usar `aria-label` para diferenciar:
- `<nav>` (navegacao principal — sem label necessaria se unica)
- `<nav aria-label="rodapé">` (navegacao secundaria)

## Referencia do GitHub como exemplo real

O instrutor usa o GitHub como exemplo de implementacao correta:
- Banner (header do topo)
- Navigation global
- Navigation complementar (com aria-label "repositories")
- Main (conteudo principal)

Usando a extensao "Landmark Navigation" do Chrome, e possivel visualizar todas as landmarks de qualquer site.

## Ferramenta de visualizacao

A extensao **Landmark Navigation via Keyboard or Popup** permite:
- Ver todas as landmarks de uma pagina
- Entender como outros sites implementam landmarks
- Validar sua implementacao rapidamente

Limitacao: a extensao recupera dados da DOM, entao nao identifica mudancas do Fast Refresh do React — e necessario atualizar a pagina para ver landmarks atualizadas.

## Elementos HTML e suas roles implicitas

| Elemento | Role implicita |
|----------|---------------|
| `<header>` (no root) | banner |
| `<header>` (dentro de article/section) | nenhuma role de landmark |
| `<main>` | main |
| `<footer>` | contentinfo |
| `<nav>` | navigation |
| `<aside>` | complementary |
| `<form>` | form |
| `<section>` | region (se tiver aria-label) |

Referencia: documentacao MDN sobre Landmark Roles.