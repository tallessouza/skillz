# Deep Explanation: Background Color, Background Image, Background Repeat

## O background respeita a caixa do elemento

O instrutor enfatiza que o background — seja cor ou imagem — fica **apenas nos limites da caixa** do elemento. Isso é fundamental para entender o box model do CSS:

- No `body`, o background cobre a página inteira (porque o body ocupa todo o viewport por padrão)
- Numa `div` com `width: 200px; height: 200px`, o background fica contido naqueles 200x200 pixels

Essa é uma das primeiras demonstrações práticas do box model: cada elemento é uma caixa, e propriedades visuais respeitam seus limites.

## Formatos de cor aceitos

O `background-color` aceita qualquer formato válido de cor CSS:

- **Named colors:** `red`, `blue`, `coral`, `steelblue` — ~147 nomes predefinidos
- **Hexadecimal:** `#ff0000`, `#1a1a2e` — formato mais comum em design
- **RGB:** `rgb(255, 0, 0)` — controle numérico dos canais
- **HSL, RGBA, HSLA** — formatos adicionais (não cobertos nesta aula mas igualmente válidos)

O instrutor demonstra que trocar entre formatos não muda o comportamento — a escolha é de conveniência e convenção do projeto.

## background-image e a função url()

A propriedade `background-image` aceita **funções** como valor, não strings diretas. A função mais básica é `url()`:

```css
background-image: url("https://example.com/image.jpg");
```

Pontos importantes mencionados pelo instrutor:

1. **URL pode ser local ou externa** — caminhos relativos para arquivos locais ou URLs completas para imagens da web
2. **Aspas são opcionais** — `url(img.png)` funciona, mas `url("img.png")` é mais seguro
3. **Se usar aspas, feche no local correto** — erro de sintaxe comum é esquecer de fechar a aspa antes do parêntese
4. **Existem outras funções além de url()** — `linear-gradient()`, `radial-gradient()`, etc. (mencionado como conteúdo avançado)

## Comportamento de repetição padrão

Quando uma imagem de fundo é menor que o elemento, o CSS por padrão **repete a imagem** para preencher todo o espaço — como um azulejo (tiling). Isso é o comportamento `background-repeat: repeat`.

### Valores de background-repeat

| Valor | Comportamento |
|-------|---------------|
| `repeat` | Repete em ambos os eixos (padrão) |
| `repeat-x` | Repete apenas horizontalmente |
| `repeat-y` | Repete apenas verticalmente |
| `no-repeat` | Não repete — exibe apenas uma vez |

O instrutor destaca que `no-repeat` é o mais usado na prática, porque geralmente não queremos que uma imagem de fundo fique se repetindo como um padrão de azulejo.

## Ordem de aprendizado sugerida

O instrutor menciona que `background-image` aceita valores mais avançados (gradientes, múltiplas imagens), mas nesta aula o foco é apenas em `url()`. Isso sugere uma progressão:

1. `background-color` — cores sólidas
2. `background-image: url()` — imagens simples
3. `background-repeat` — controle de repetição
4. (Avançado) `background-size`, `background-position`, `background` shorthand, gradientes