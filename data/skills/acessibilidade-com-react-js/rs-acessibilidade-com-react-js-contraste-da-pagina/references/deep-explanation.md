# Deep Explanation: Contraste de Cores na Acessibilidade Web

## O que e contraste e por que importa

Contraste e a diferenca de luminosidade entre o texto e seu fundo. A WCAG (Web Content Accessibility Guidelines) define niveis minimos para garantir que pessoas com baixa visao ou daltonismo consigam ler o conteudo.

### Niveis da WCAG

- **Nivel AA (minimo):** 4.5:1 para texto normal, 3:1 para texto grande
- **Nivel AAA (ideal):** 7:1 para texto normal, 4.5:1 para texto grande

O instrutor demonstrou que um contraste de 2.5:1 e insuficiente, e foi testando valores incrementalmente no DevTools ate encontrar o limiar: 4.48 nao passa, 4.6 ja passa. O minimo exato e 4.5:1.

## Estrategia do instrutor: resolver globalmente primeiro

A abordagem mais inteligente mostrada na aula foi **nao sair corrigindo elemento por elemento**. Em vez disso:

1. Abrir o `global.css`
2. Verificar se existe uma declaracao de `color` no `body`
3. Adicionar uma cor que atinge bom contraste contra o fundo padrao
4. Remover declaracoes de cor duplicadas nos modulos CSS (como o `color: #555` no `home.module.css`)

Isso resolve **todos os elementos de texto de uma vez**, porque herdam a cor do body.

## Quando o global nao resolve: casos especificos

O footer da pagina tinha um link com contraste insuficiente mesmo apos a correcao global. Isso acontece quando:

- O elemento tem um **fundo diferente** do body
- O elemento tem uma **cor propria** que sobrescreve a global
- O elemento e um **link** com cor do user-agent

### Tres estrategias de correcao

O instrutor explicou claramente que voce tem tres opcoes:

1. **Mudar a cor do texto** — clarear para aumentar contraste contra fundo escuro
2. **Mudar a cor do fundo** — escurecer para aumentar contraste com texto claro
3. **Mudar ambos** — quando nenhuma mudanca isolada resolve

No caso do footer, ele tentou adicionar `background: #202024` mas o contraste ficou em 3.43 (insuficiente). Entao trocou a cor do texto de roxo escuro para `#996dff` (roxo mais claro), atingindo 4.62:1.

## Analogia do equilibrio

O instrutor usou a metafora de "encontrar o equilibrio perfeito" — nao e sobre maximizar contraste (que deixaria tudo preto e branco), mas atingir o minimo necessario mantendo a identidade visual. Ele testou incrementalmente: 3.66 → 4.11 → 5.34 → 4.48 → 4.6, mostrando que o limiar e preciso e que poucos pontos de diferenca no hex fazem a cor passar ou nao.

## DevTools como ferramenta principal

A verificacao de contraste e feita diretamente no Chrome DevTools:

1. Inspecionar elemento de texto
2. Clicar no quadrado de cor no painel de estilos
3. O ratio de contraste aparece com indicacao de PASS/FAIL para AA e AAA
4. Voce pode arrastar o seletor de cor e ver o ratio mudar em tempo real

O aXe (mencionado como "erros do X") tambem lista todos os problemas de contraste automaticamente.