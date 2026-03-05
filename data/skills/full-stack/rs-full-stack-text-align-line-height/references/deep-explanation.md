# Deep Explanation: Text Align e Line Height

## Por que multiplicador sem unidade e superior

O ponto central da aula e a vantagem do multiplicador no `line-height`. O instrutor explica com um raciocinio pratico:

Quando voce usa `line-height: 24px` e depois muda o `font-size` de `16px` para `24px`, o espacamento entre linhas fica desproporcional — voce precisa voltar e recalcular manualmente. Com o multiplicador (`line-height: 1.5`), a proporcao se mantem automaticamente.

### Como funciona o calculo

O multiplicador pega o `font-size` atual e multiplica:

- `font-size: 16px` + `line-height: 1.5` = 24px de altura de linha
- `font-size: 24px` + `line-height: 1.5` = 36px de altura de linha
- `font-size: 32px` + `line-height: 1.5` = 48px de altura de linha

### Equivalencias

O instrutor destaca que `1rem = 16px` (root em), entao:

- `line-height: 1` = `line-height: 16px` = `line-height: 1rem` (quando font-size e 16px)
- Mas o multiplicador sem unidade e o unico que se adapta automaticamente

### Analogia com editores de texto

O instrutor compara com editores de texto como Word/Google Docs, onde voce ve opcoes como "espaçamento 1.0", "1.5", "2.0" — esses sao exatamente os multiplicadores CSS. Qualquer pessoa que ja usou um editor de texto entende o conceito intuitivamente.

## Text Align — Modelo mental

O instrutor descreve o text-align usando uma "linha virtual" imaginaria:

- Por padrao, o texto esta alinhado a esquerda (como se houvesse uma linha virtual na borda esquerda)
- `center` move o texto para o centro dessa area
- `right` alinha com uma linha virtual na borda direita
- `justify` forca o texto a comecar na borda esquerda E terminar na borda direita, adicionando espaco entre palavras

## Quando o designer define em pixels

O instrutor reconhece que designers frequentemente especificam `line-height` em pixels no Figma/Sketch. A recomendacao e: mesmo recebendo o valor em pixels, converta para multiplicador dividindo pelo font-size. Isso torna o CSS mais resiliente a mudancas futuras.

## Valores comuns de multiplicador

| Contexto | Multiplicador tipico |
|----------|---------------------|
| Texto corrido (paragrafos) | 1.5 — 1.8 |
| Titulos | 1.1 — 1.3 |
| UI (botoes, labels) | 1 — 1.2 |
| Texto denso (tabelas) | 1.2 — 1.4 |