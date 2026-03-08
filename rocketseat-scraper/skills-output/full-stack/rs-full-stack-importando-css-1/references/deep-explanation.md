# Deep Explanation: Importando CSS no React

## Por que `className` e não `class`?

O instrutor explica que `class` é uma palavra reservada do JavaScript. Quando você escreve `class Teste {}`, o JavaScript interpreta isso como uma declaração de classe. Como JSX é transformado em chamadas JavaScript (`React.createElement`), usar `class` como atributo causaria conflito com a keyword da linguagem.

Por isso, o React adotou `className` — que mapeia diretamente para a propriedade DOM `element.className` que já existe no JavaScript vanilla. Não é uma invenção do React; é o nome real da propriedade no DOM.

## O sistema de imports CSS no React (com bundler)

Quando você faz `import './styles.css'`, quem resolve esse import não é o JavaScript nativo — é o **bundler** (Vite, Webpack, etc.). O bundler:

1. Detecta que é um arquivo `.css`
2. Processa o CSS (autoprefixer, minificação, etc.)
3. Injeta o CSS no `<head>` da página como um `<style>` tag ou arquivo linkado
4. As classes ficam disponíveis globalmente no DOM

Por isso não precisa de named import — não há um objeto JavaScript sendo exportado. O CSS é um **side effect import**: o simples ato de importar já causa o efeito (injeção do CSS no DOM).

### Diferença para CSS Modules

Com CSS Modules (`*.module.css`), o bundler **faz** exportar um objeto:

```tsx
import styles from './Component.module.css'
// styles = { container: "Component_container_abc123" }
```

Nesse caso, o named import faz sentido porque cada classe recebe um hash único para escopo local. Mas para CSS global, o import direto é o correto.

## Por que especificar a extensão `.css`?

O instrutor destaca que componentes React (`.tsx`, `.jsx`) não precisam de extensão no import porque o bundler resolve automaticamente. Mas para CSS, a extensão é obrigatória porque:

1. O bundler precisa saber qual **loader** usar (CSS loader vs JS loader)
2. Sem extensão, o bundler tentaria resolver como JavaScript e falharia
3. É uma convenção que ajuda a identificar visualmente que é um side-effect import

## Viewport Height (`100vh`) vs Percentage (`100%`)

O instrutor mostra que o `background-color` inicialmente não ocupa toda a tela porque o elemento não tem altura definida. A solução é usar `100vh`:

- **`height: 100%`** — percentual do elemento pai. Se o pai não tem altura definida, 100% de nada = nada
- **`height: 100vh`** — 100% da altura da **viewport** (janela do navegador). Funciona independente do pai

Para layouts de página inteira, `100vh` é a escolha mais direta. Para componentes internos, `100%` faz mais sentido quando a cadeia de pais tem altura definida.

## Dica do instrutor sobre zoom do navegador

O instrutor menciona que frequentemente usa zoom no navegador para facilitar a visualização nas aulas. Isso é relevante para debugging: se elementos parecem maiores que o esperado, verifique se o zoom do navegador está em 100% (clique na lupa ou Ctrl+0 para resetar). Isso evita confusão ao comparar layouts.

## Fluxo mental para aplicar CSS no React

1. Crie o arquivo `.css` na pasta `src/` (próximo ao componente)
2. Importe com `import './arquivo.css'` (side-effect import)
3. Use `className="nome-da-classe"` no JSX
4. As classes ficam disponíveis globalmente após o import
5. O bundler cuida de injetar o CSS no DOM automaticamente