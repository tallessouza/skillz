# Deep Explanation: Ajustando Fontes dos Links

## Por que ser especifico no font-weight?

O instrutor enfatiza que `font-weight: bold` funciona, mas `font-weight: 500` e melhor. A razao e direta: quando voce importa fontes do Google Fonts, voce escolhe pesos especificos (ex: Inter 400 e 500). O valor `bold` e um alias que o browser resolve — geralmente para 700. Se voce so importou 400 e 500, usar `bold` pode resultar em:

1. O browser simula o peso 700 artificialmente (faux bold), que fica visualmente diferente do peso real
2. Voce perde controle sobre qual peso esta sendo aplicado

Usando o valor numerico, voce garante que o peso renderizado e exatamente o que foi importado.

## Escala de font-weight

- 100: Thin
- 200: Extra Light
- 300: Light
- **400: Normal (padrao do browser)**
- **500: Medium (acima de 400 = considerado bold)**
- 600: Semi Bold
- 700: Bold (o que `bold` keyword resolve)
- 800: Extra Bold
- 900: Black

O instrutor destaca que qualquer valor acima de 400 ja e considerado "bold" visualmente. Isso e importante porque muitos devs associam bold apenas com 700.

## text-decoration: as 4 opcoes

O instrutor apresenta as opcoes de text-decoration disponiveis:

1. **`none`** — Remove qualquer decoracao. Essencial para links usados como botoes ou navegacao.
2. **`underline`** — Linha embaixo. E o padrao dos elementos `<a>`. Util quando voce quer manter a semantica visual de link.
3. **`line-through`** — Linha no meio do texto. Usado para indicar texto removido ou precos antigos.
4. **`overline`** — Linha acima do texto. Raramente usado, mas existe como opcao.

## Nao repita o padrao do browser

O instrutor analisou a tipografia no Figma e encontrou:
- font-family: Inter (ja aplicado na pagina inteira)
- font-weight: 500 (precisa declarar)
- font-size: 16px (padrao do browser — NAO declarar)
- line-height: 24px (padrao do browser — NAO declarar)
- text-align: center (resolvido via display flex — NAO declarar)

A licao: analise o design, identifique o que ja e padrao, e so declare o que realmente muda. Menos CSS = menos manutencao = menos bugs.

## Alinhamento: text-align vs display flex

O instrutor mencionou que o alinhamento central foi feito com `display: flex` em vez de `text-align: center`. Sao abordagens diferentes para o mesmo resultado visual, mas flex oferece mais controle sobre alinhamento em ambos os eixos.