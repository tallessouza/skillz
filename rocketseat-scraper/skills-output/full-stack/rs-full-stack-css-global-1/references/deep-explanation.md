# Deep Explanation: CSS Global — Reset e Configurações Globais

## Por que navegadores têm estilos padrão?

Cada navegador (Chrome, Firefox, Safari, Edge) aplica uma **user agent stylesheet** — um conjunto de estilos CSS padrão que garante que páginas HTML básicas (sem CSS) sejam minimamente legíveis. Isso inclui:

- `margin` no `body` (geralmente 8px)
- `padding` em listas (`ul`, `ol`)
- `font-size` e `font-family` padrão
- Espaçamentos em headings (`h1`-`h6`)

O problema: **cada navegador aplica valores diferentes**. O Chrome pode usar `margin: 8px` no body, enquanto outro navegador pode usar um valor ligeiramente diferente. Isso causa inconsistências visuais entre navegadores.

## A analogia do instrutor

O instrutor mostrou visualmente o problema: ao aplicar `background-color: red` no componente, a cor não preenchia toda a viewport. Havia uma "borda branca" ao redor — que era justamente o `margin` padrão do `body` aplicado pelo navegador. Essa é a evidência visual mais clara de por que o reset é necessário.

## Estratégia de reset vs. normalize

Existem duas abordagens no mercado:

1. **Reset CSS** (abordagem do curso): Remove TODOS os estilos padrão com `* { margin: 0; padding: 0; }`. Dá controle total, mas exige que você estilize tudo do zero.

2. **Normalize CSS**: Mantém estilos úteis e apenas corrige inconsistências entre navegadores. Mais conservador.

O curso usa a abordagem de reset porque em aplicações React modernas você vai estilizar todos os componentes de qualquer forma, então começar do zero é mais previsível.

## Por que a ordem de importação importa

O CSS funciona em cascata (Cascading Style Sheets). Quando dois seletores têm a mesma especificidade, o que aparece **por último** no código vence. Se você importar `global.css` depois de `App.css`:

```tsx
import './App.css'      // Define padding: 16px
import './global.css'   // Reset com padding: 0 → SOBRESCREVE!
```

O reset vai sobrescrever seus estilos específicos. Por isso o global DEVE vir primeiro.

## Por que no App.tsx e não no main.tsx?

O instrutor faz uma distinção clara:

- **`main.tsx`** (ou `index.tsx`): Arquivo de inicialização da aplicação. Configura React DOM, StrictMode, providers. Deve ser "quase intocável".
- **`App.tsx`**: Primeiro componente de renderização real. É onde a aplicação "começa" visualmente. É o lugar correto para importar o CSS global.

Essa separação de responsabilidades mantém o `main.tsx` focado em bootstrap e o `App.tsx` como ponto de entrada visual.

## Quando usar global vs. específico

A regra do instrutor é simples e prática:

- **Tudo que é comum para a aplicação inteira** → `global.css` (background, fonte base, resets)
- **Tudo que é específico de uma tela/componente** → arquivo CSS próprio daquele componente

Isso evita duplicação (definir a mesma `background-color` em 10 arquivos) e facilita manutenção (mudar o background da app inteira = mudar um lugar só).

## Nomes comuns para o arquivo global

O instrutor mencionou alternativas:
- `global.css` — **recomendado**, deixa claro que são configurações globais
- `reset.css` — foca no aspecto de reset, mas ignora que o arquivo também tem configs gerais
- `config.css` — genérico demais

A preferência por `global.css` é por clareza semântica: o nome comunica tanto o reset quanto as configurações base.