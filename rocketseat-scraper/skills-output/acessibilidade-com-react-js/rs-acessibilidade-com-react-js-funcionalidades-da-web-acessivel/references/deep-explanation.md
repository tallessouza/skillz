# Deep Explanation: Funcionalidades da Web Acessivel

## Por que `lang` no HTML e critico

O atributo `lang` no elemento `<html>` e um dos criterios do WCAG. Leitores de tela como NVDA e VoiceOver usam esse atributo para selecionar o motor de voz correto. Sem ele, um texto em portugues pode ser lido com pronuncia inglesa, tornando-o incompreensivel.

## A filosofia do alt text: conteudo, nao formato

O instrutor enfatiza um principio fundamental: **o alt descreve O QUE a imagem representa, nao O QUE ela e**. O leitor de tela ja anuncia "imagem" antes de ler o alt. Entao:

- `alt="logo W3C"` → leitor anuncia "imagem, logo W3C" (redundante)
- `alt="W3C"` → leitor anuncia "imagem, W3C" (correto)

### Analogia do instrutor sobre a logo da Rocketseat
"Voce colocaria 'foguete Rocketseat'? Nao, voce coloca so 'Rocketseat', porque e o que tem mais semantica para o que essa logo esta significando."

## O problema das imagens de conteudo desconhecido

O instrutor usa o Facebook/Meta como caso real. Quando o usuario faz upload de uma foto de perfil, a plataforma nao pode simplesmente usar o nome da pessoa como alt text. Exemplo: se Mark Zuckerberg colocasse uma foto de cachorro, o alt "Mark Zuckerberg" seria semanticamente incorreto.

### Solucoes observadas no Facebook:
1. **aria-label no container** — "Mark Zuckerberg" no wrapper (identifica quem postou)
2. **alt gerado por IA na imagem** — "pode ser uma imagem de uma pessoa" ou "pode ser uma imagem de uma ou mais pessoas e texto que diz STU"

O instrutor menciona que Google e Amazon possuem tecnologias de IA que interpretam imagens e geram descricoes automaticas. Isso e particularmente util para redes sociais e plataformas com conteudo gerado pelo usuario.

## aria-hidden para elementos decorativos

Icones puramente ilustrativos (que nao adicionam informacao alem do texto visivel) devem receber `aria-hidden="true"`. Isso impede que leitores de tela anunciem conteudo sem significado. O instrutor tambem observa que esses elementos nao devem ser focaveis (`focusable="false"`).

## Contraste e verificacao pratica

O instrutor demonstra como verificar contraste diretamente no Chrome DevTools:
1. Inspecionar o elemento de texto
2. No painel que abre, verificar a secao de acessibilidade
3. O Chrome mostra o ratio de contraste e se atinge nivel AA

O site da WAI atinge 7.13 de contraste em varios elementos — bem acima do minimo AA (4.5:1).

**Limitacao observada:** O Chrome DevTools nao consegue testar contraste de elementos com multiplas cores simultaneamente (como gradientes ou imagens de fundo complexas).

## Dica do instrutor sobre aprendizado

"Quando voce estiver estudando sobre acessibilidade, muitas vezes voce vai se pegar indo ver como outros sites implementaram isso para voce implementar tambem." — Inspecionar sites de referencia (WAI, Meta) e uma tecnica pratica de aprendizado.