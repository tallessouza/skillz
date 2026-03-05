# Deep Explanation: Estrutura HTML para Acessibilidade

## Por que o titulo da pagina importa

O titulo da pagina (`<title>`) e a primeira coisa que um leitor de tela anuncia quando o usuario abre ou navega entre abas. Sem titulo, o usuario de tecnologia assistiva nao sabe onde esta. No Next.js, o componente `Head` de `next/head` permite injetar tags no `<head>` do HTML de qualquer pagina — importante nao confundir com o `Head` de `next/document`, que so funciona no arquivo `_document.tsx`.

## Por que o atributo lang importa

O atributo `lang` no elemento `<html>` serve para dois propositos:
1. **Tecnologias assistivas** usam para definir a pronuncia correta — um leitor de tela em ingles tentaria pronunciar portugues com fonetica inglesa sem esse atributo
2. **Navegadores** usam para oferecer traducao automatica quando o idioma da pagina nao corresponde ao idioma configurado pelo usuario

Para portugues brasileiro: `lang="pt-br"`. Para frances: `lang="fr"`. A lista completa segue o padrao BCP 47.

## A logica da hierarquia de headings

O instrutor usa uma analogia implicita de "indice de livro": H1 e o titulo do capitulo, H2 sao secoes, H3 sao subsecoes. Leitores de tela permitem que usuarios naveguem diretamente entre headings — se a hierarquia pula niveis (H1 → H4), o usuario pensa que perdeu conteudo intermediario.

### Regra de ouro: incrementar por um, voltar livremente

```
H1 — Titulo principal
  H2 — Secao A
    H3 — Subsecao A.1
  H2 — Secao B        ← voltou para H2, valido
    H3 — Subsecao B.1
      H4 — Detalhe B.1.1
  H2 — Secao C        ← voltou para H2 novamente, valido
```

O que e **invalido**: pular de H2 para H4 sem passar por H3.

### "Mas o H2 fica grande demais visualmente"

O instrutor enfatiza fortemente: **HTML define semantica, CSS define aparencia**. Se o H2 padrao e visualmente grande demais para o design, a solucao e aplicar `font-size` via CSS — nunca usar um H4 so porque "e menor". Isso quebra a semantica para usuarios de tecnologias assistivas.

## Multiplos H1 por pagina

A especificacao permite multiplos H1, mas o instrutor recomenda cautela: o ideal e um H1 por pagina representando o conteudo principal. Ter varios H1 sem justificativa semantica "fluda" a pagina e confunde a navegacao por headings. A regra do axe/lighthouse e "page should contain a level 1 heading" — exige pelo menos um, nao limita a um.

## Contexto Next.js especifico

- `Head` de `next/head`: pode ser usado em qualquer pagina/componente para injetar tags no `<head>`
- `Html`, `Head` de `next/document`: so funcionam no `_document.tsx`, que define a estrutura base do HTML
- O `lang` vai no `<Html>` dentro de `_document.tsx` porque e um atributo do elemento raiz