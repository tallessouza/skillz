# Deep Explanation: Menu e Social Icons com Degradê CSS

## Por que degradê em texto com CSS?

O instrutor usa uma técnica de 3 passos para aplicar gradiente em texto, que é a abordagem padrão cross-browser:

1. **Definir o background como linear-gradient** — isso cria o degradê como fundo do elemento
2. **Aplicar background-clip: text** — recorta o fundo para que só apareça onde há texto (precisa do prefixo `-webkit-` para compatibilidade)
3. **Tornar o texto transparente** — `color: transparent` remove a cor sólida do texto, revelando o gradiente recortado por trás

O instrutor aplica isso **globalmente em todos os links `<a>`**, filosofia de "aplica em tudo, remove onde não precisa". Isso é eficiente porque na landing page a maioria dos links terá esse estilo.

## O conflito background-clip com ícones sociais

Problema descoberto durante a aula: quando o gradient text clip é aplicado globalmente em `<a>`, ele afeta também os links dos ícones sociais (que são `<a>` com background-image). O background-clip: text recorta a imagem de fundo do ícone, fazendo-o desaparecer.

**Solução:** Resetar `background-clip: initial` e `-webkit-background-clip: initial` especificamente nos links `.social`. Isso restaura o comportamento padrão do background nos ícones.

## Estratégia de SVGs com degradê para hover

O Figma não exporta SVGs com degradê diretamente de forma utilizável. A estratégia do instrutor:

1. **Copiar o SVG original** de cada rede social
2. **Criar uma versão hover** adicionando um bloco `<defs>` com `<linearGradient>`
3. **Substituir o `fill` do path** por `fill="url(#gradient-id)"`, onde o ID referencia o linear gradient definido no `<defs>`

### Como funciona o `fill: url(#id)` no SVG

Dentro de um SVG, `<defs>` define elementos reutilizáveis que não são renderizados diretamente. O `<linearGradient>` dentro do `<defs>` cria um gradiente com um ID único. O `<path>` que desenha o ícone usa `fill="url(#id)"` para referenciar esse gradiente como sua cor de preenchimento.

O instrutor chama atenção para a **engenharia manual** necessária: para cada ícone (tiktok, instagram, twitter, discord), é preciso:
- Copiar o SVG original
- Renomear para `{nome}-hover.svg`
- Adicionar o bloco `<defs>` com o gradiente
- Trocar o `fill` do path pela referência ao gradiente

## CSS Custom Properties para troca de imagem

Em vez de repetir `background-image` no estado normal e hover de cada ícone, o instrutor usa uma custom property `--bg-image`:

- Na classe `.social`, define `background-image: var(--bg-image)`
- No seletor `[aria-label="nome"]`, define `--bg-image: url(...normal.svg)`
- No seletor `[aria-label="nome"]:hover`, define `--bg-image: url(...hover.svg)`

Isso centraliza a lógica de background-image em um único lugar e facilita manutenção.

## Acessibilidade dos ícones

Os ícones são links `<a>` vazios (sem texto), então `aria-label` é obrigatório para leitores de tela. O instrutor usa `aria-label` tanto para acessibilidade quanto como seletor CSS (`[aria-label="tiktok"]`), evitando classes extras.

**Atenção ao typo:** o instrutor cometeu o erro de escrever `arial-label` ao invés de `aria-label` — erro comum que quebra tanto a acessibilidade quanto os seletores CSS.

## Dimensionamento consistente

Todos os ícones usam 1.5rem (24px) tanto de largura quanto altura, coincidindo com o tamanho 24x24 do SVG. O instrutor verifica no layout que todos os ícones em diferentes seções da página mantêm o mesmo tamanho, garantindo consistência visual.

## Organização de arquivos

O instrutor organiza os SVGs em `assets/icons/` com nomes descritivos:
- `tiktok.svg` (normal)
- `tiktok-hover.svg` (com degradê)
- `instagram.svg` / `instagram-hover.svg`
- `twitter.svg` / `twitter-hover.svg`
- `discord.svg` / `discord-hover.svg`

Os estilos são separados em `social.css`, importado no CSS principal, seguindo a filosofia de componentes CSS.