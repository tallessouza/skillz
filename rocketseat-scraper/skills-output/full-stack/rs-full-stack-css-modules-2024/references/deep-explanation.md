# Deep Explanation: CSS Modules no React

## Por que CSS escopado?

Conforme a aplicacao React cresce, voce cria dezenas ou centenas de componentes — botoes, inputs, cards, modais. Cada um pode ter sua propria estilizacao. Sem escopo, uma classe `.container` definida no componente Button pode conflitar com `.container` do componente Card.

O CSS tradicional e global por natureza. Quando voce importa um arquivo `.css` normalmente (`import './styles.css'`), todas as classes ficam disponiveis globalmente no DOM. Isso gera conflitos silenciosos que so aparecem quando dois componentes usam o mesmo nome de classe.

## Como CSS Modules resolve

CSS Modules transforma cada classe em um identificador unico em tempo de build. Quando voce escreve `.container` em `styles.module.css`, o bundler gera algo como `.Button_container_a1b2c` no HTML final. Isso garante que nenhuma outra `.container` de outro arquivo interfira.

A chave esta na extensao `.module.css` — e ela que sinaliza ao bundler (Vite, Webpack) para ativar o escopo automatico.

## Analogia do instrutor

Pense em CSS Modules como modulos JavaScript: assim como `export`/`import` controla o que e visivel entre arquivos JS, o `.module.css` controla o que e visivel entre componentes. O `import styles from './styles.module.css'` retorna um objeto onde cada chave e uma classe, e cada valor e o nome unico gerado.

## Organizacao em pasta

A convencao de pasta-por-componente resolve dois problemas:
1. **Agrupamento logico** — estrutura (index.tsx) e visual (styles.module.css) ficam juntos
2. **Import limpo** — `import { Button } from './Button'` funciona sem especificar `/index` porque Node/bundlers resolvem `index` automaticamente

O instrutor destaca que nomear o arquivo como `index.tsx` (e nao `Button.tsx` dentro da pasta `Button/`) evita a duplicacao `Button/Button.tsx` no path.

## Seletores descendentes dentro do modulo

Como o escopo ja e garantido pelo CSS Module, voce nao precisa criar uma classe para cada elemento. Se tem um `span` dentro de `.container`, basta usar:

```css
.container span {
  color: white;
}
```

Isso so afeta spans dentro do `.container` desse modulo especifico. Nenhum outro span da aplicacao sera afetado.

## Diferenca entre CSS global e CSS Module

| Aspecto | Global CSS | CSS Module |
|---------|-----------|------------|
| Escopo | Toda a aplicacao | Apenas o componente que importa |
| Importacao | `import './file.css'` | `import styles from './file.module.css'` |
| Uso no JSX | `className="nome"` | `className={styles.nome}` |
| Conflitos | Possiveis e silenciosos | Impossiveis (nomes unicos) |
| Quando usar | Reset, fontes, variaveis globais | Estilos de componentes |

## Quando continuar usando CSS global

O CSS global (`global.css`) ainda e necessario para:
- Reset de estilos (margin, padding, box-sizing)
- Definicao de fontes
- Variaveis CSS (`:root { --color-primary: ... }`)
- Estilos de elementos HTML base (body, html)

Esses arquivos sao importados uma vez no componente raiz (App) e afetam toda a aplicacao intencionalmente.