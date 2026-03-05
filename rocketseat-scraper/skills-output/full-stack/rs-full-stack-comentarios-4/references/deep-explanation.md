# Deep Explanation: Comentários em CSS

## Por que comentários existem em CSS

CSS não tem sistema de tipos, não tem nomes de variáveis descritivos (propriedades são fixas), e arquivos podem crescer rapidamente. Comentários são a única forma nativa de adicionar contexto humano ao código.

## Sintaxe: por que `/* */` e não `//`

CSS usa exclusivamente a sintaxe de comentário de bloco herdada do C: `/* conteúdo */`. Diferente de JavaScript, SCSS ou Less, CSS puro **não suporta** comentários de linha com `//`. Usar `//` em CSS não gera erro de sintaxe explícito — o navegador simplesmente ignora a linha de forma imprevisível, o que pode causar bugs silenciosos.

## Dois usos principais (conforme o instrutor)

### 1. Anotações
Adicionar notas explicativas sobre decisões de estilo, organizar seções do arquivo, ou deixar lembretes para o futuro.

### 2. Desativar código
O instrutor enfatiza que comentários servem para "desconsiderar" trechos de CSS — tanto uma única linha quanto um bloco inteiro. Isso é extremamente útil durante debugging: em vez de deletar código, você comenta para testar o efeito da remoção e pode restaurar facilmente.

## Como o navegador processa

Tudo entre `/*` e `*/` é completamente ignorado pelo parser CSS. O navegador nem sequer tenta interpretar o conteúdo. Isso significa que você pode comentar qualquer coisa: propriedades individuais, seletores completos, ou múltiplos blocos de regras.

## Edge case: comentários aninhados

CSS **não suporta** comentários aninhados. Se você escrever:

```css
/* bloco externo /* bloco interno */ ainda comentado? */
```

O primeiro `*/` encontrado fecha o comentário. O texto "ainda comentado? */" será interpretado como CSS inválido.

## Boas práticas de organização

Em projetos maiores, comentários de seção ajudam a navegar arquivos longos:

```css
/* ========== RESET ========== */
/* ========== LAYOUT ========== */
/* ========== COMPONENTES ========== */
/* ========== RESPONSIVO ========== */
```

Isso é especialmente útil quando o projeto não usa preprocessadores (SCSS/Less) que permitem separar em arquivos.