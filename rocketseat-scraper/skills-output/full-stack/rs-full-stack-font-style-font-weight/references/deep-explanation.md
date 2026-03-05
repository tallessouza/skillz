# Deep Explanation: Font Style e Font Weight

## Por que oblique e praticamente inutil

O instrutor (com mais de 20 anos de experiencia) nunca usou `oblique` com angulacao. A razao: `oblique` depende inteiramente da fonte ter suporte a angulacao variavel. A maioria das fontes web simplesmente aplica a mesma inclinacao que `italic`. O valor `oblique 40deg` (degrees) so faz diferenca em fontes variavel (variable fonts) que exponham o eixo `slnt`. Na pratica, `italic` resolve 100% dos casos reais.

### Insight do instrutor sobre "coisas que existem mas voce nao vai usar"

> "Tem coisa que a gente nao vai usar. Tem coisa que voce vai olhar... Voce vai perceber, ne? Com o passar do tempo, voce vai perceber. Tem coisa que nao faz sentido, voce nao precisa nem memorizar e nem vai usar. So existe, so ta la."

Isso se aplica a muitas propriedades CSS. O fato de existir na spec nao significa que tem uso pratico. Desenvolvedores experientes aprendem a filtrar o que importa.

## Font-weight: nomes vs numeros

### Mapeamento completo

| Nome | Valor numerico |
|------|---------------|
| `thin` / `hairline` | 100 |
| `extra-light` | 200 |
| `light` | 300 |
| `normal` / `regular` | 400 |
| `medium` | 500 |
| `semi-bold` | 600 |
| `bold` | 700 |
| `extra-bold` | 800 |
| `black` / `heavy` | 900 |

### Como o browser resolve pesos inexistentes

Quando voce aplica `font-weight: 300` mas a fonte so tem 400 e 700, o browser usa o algoritmo de fallback:
- Para pesos < 400: tenta valores menores, depois maiores
- Para pesos > 500: tenta valores maiores, depois menores
- Para 400: tenta 500, depois valores menores
- Para 500: tenta 400, depois valores menores

Resultado pratico: em fontes com apenas normal/bold, qualquer valor de 100-500 renderiza como normal, e 600-900 como bold.

## `lighter` e `bolder` — valores relativos

Esses valores sao relativos ao peso do elemento pai, nao absolutos:
- `bolder`: proximo peso disponivel ACIMA do pai
- `lighter`: proximo peso disponivel ABAIXO do pai

O instrutor destaca que `bolder` ficaria entre 800-900, enquanto `bold` fica entre 600-700. Mas isso depende completamente da fonte — "nao adianta voce sair aplicando, porque nao e assim que funciona. A fonte vai permitir ou nao."

## Headings e o user-agent stylesheet

Todos os headings (`h1` a `h6`) recebem `font-weight: bold` (700) do stylesheet padrao do browser. Por isso, para ter um heading com peso normal, voce precisa explicitamente declarar `font-weight: 400` ou `font-weight: normal`.

## Fontes que nem tem bold

O instrutor menciona que "vai ter fonte que nem tem bold". Isso e comum em fontes decorativas ou display fonts. Nesses casos, o browser tenta sintetizar bold (faux bold), que geralmente fica ruim. A solucao correta e escolher uma fonte que tenha os pesos que voce precisa, ou aceitar que aquele peso nao estara disponivel.