# Deep Explanation: Fontes do Projeto

## Por que preconnect antes da fonte?

O `<link rel="preconnect">` estabelece uma conexao antecipada com o servidor do Google Fonts. Isso inclui DNS lookup, TCP handshake e TLS negotiation. Quando o browser encontra o `<link>` da fonte depois, a conexao ja esta pronta, economizando tempo.

A ordem no HTML importa: o browser processa o `<head>` sequencialmente. Se o preconnect vier depois da fonte, ele perde o proposito.

Padrão recomendado pelo instrutor:
1. Preconnects como primeiros links no head
2. Meta tags e title no meio
3. Link da fonte como ultimo elemento do head

## Font shorthand — por que usar?

A propriedade `font` e um shorthand que combina ate 6 propriedades em uma linha:

```
font: [font-style] [font-variant] [font-weight] [font-size]/[line-height] [font-family]
```

**Obrigatorios:** font-size e font-family (sem eles, a declaracao e invalida).

Exemplo completo:
```css
font: bold 32px/125% "Poppins", sans-serif;
/*    ^     ^    ^     ^
      |     |    |     font-family
      |     |    line-height
      |     font-size
      font-weight
*/
```

Quando font-weight e `400` (regular/normal), pode ser omitido:
```css
font: 16px/1.5 "Poppins", sans-serif;
/* weight 400 esta implicito */
```

## Line-height: porcentagem vs multiplicador

O instrutor destaca que `150%` e `1.5` sao a mesma coisa:
- `16px * 1.5 = 24px`
- `16px * 150% = 24px`

O multiplicador sem unidade (`1.5`) e preferido na industria porque:
- Herda corretamente em elementos filhos
- Com `%`, o valor calculado (ex: 24px) e o que herda, nao a porcentagem

## Observar o projeto nos minimos detalhes

O instrutor enfatiza um ponto crucial: **o style-guide nao e suficiente**. Ele e apenas um guia de estilo, uma referencia rapida. Para pegar todos os detalhes (tamanhos exatos, pesos, espaçamentos), voce precisa:

1. Olhar o style-guide para ter uma visao geral
2. Clicar nos elementos individuais no layout para ver as propriedades reais
3. Comparar o que o style-guide diz com o que o layout usa de fato

No caso da aula, o style-guide mostrava fontes small/medium/heading, mas no layout real havia um texto de 16px/1.5 que nao estava representado no style-guide.

## Copiando CSS do Figma — duas maneiras

### Projeto original (nao duplicado):
- Clicar no elemento → aba "Properties" → copiar valores diretamente
- Mais limpo, mostra apenas o relevante

### Projeto duplicado (copia):
- Botao direito → "Copy/Paste as" → "Copy as CSS"
- Vem com MUITO mais informacao (width, height, display, etc.)
- Filtrar apenas: font-family, font-size, font-weight, line-height

O instrutor alerta: se voce duplicou o projeto Figma, a aba Properties pode nao aparecer. Nesse caso, use o metodo de copiar CSS e filtre manualmente.

## Nomenclatura das variaveis de texto

O instrutor segue um padrao comum na industria:

| Variavel | Significado | Equivalente |
|----------|-------------|-------------|
| `--text-lg` | Large | Heading/titulo |
| `--text-md` | Medium | Paragrafo medio |
| `--text-sm` | Small | Texto pequeno |
| `--text` | Normal/base | Texto padrao do body |

Esse padrao (`lg`, `md`, `sm`) vem de frameworks como Tailwind CSS e Bootstrap. O instrutor encoraja o aluno a pesquisar mais sobre esses padroes conforme avanca nos estudos.