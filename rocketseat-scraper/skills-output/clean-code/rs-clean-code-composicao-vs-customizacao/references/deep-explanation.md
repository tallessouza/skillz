# Deep Explanation: Composicao vs Customizacao

## O problema fundamental

Quando criamos componentes React, a tendencia natural e adicionar props para cada variacao visual. O instrutor chama isso de **pattern de configuracao**: cada prop "configura" o que aparece ou nao no componente.

O problema escala exponencialmente. Um input pode precisar de: label, icon, leftIcon, rightIcon, errorMessage, helperText, prefix, suffix, loading... Cada prop nova cria ramificacoes condicionais dentro do componente (`{label ? <label>...</label> : null}`), tornando o codigo dificil de manter.

## Por que configuracao prende voce

O instrutor destaca dois pontos de dor concretos:

1. **Posicionamento rigido** — Se o icone esta hardcoded depois do input e voce precisa dele antes, precisa criar uma NOVA prop (`leftIcon`). Duas props para o mesmo conceito (icone), so por causa de posicao.

2. **Props de sub-elementos** — Se voce precisa passar `htmlFor`, `id`, ou `className` para a label interna, nao consegue. A unica saida e criar uma prop grotesca como `labelProps` — que o instrutor descreve como "horrivel".

## A solucao: composicao

Em vez de um componente monolitico que recebe tudo via props, voce cria sub-componentes pequenos:

- `Root` — container estilizado que aceita children
- `Label` — estende o elemento nativo `<label>`
- `Icon` — wrapper para icones
- `FormField` — o input em si
- `ErrorMessage` — mensagem de erro

Cada sub-componente e independente. O consumidor controla:
- **Ordem** — basta reposicionar no JSX
- **Props nativas** — cada sub-componente aceita suas props HTML diretamente
- **Presenca** — nao incluiu no JSX = nao aparece (sem `showLabel={false}`)

## Import com namespace

O instrutor usa `import * as Input from './components/input'` para agrupar todos os sub-componentes sob o namespace `Input`. Isso gera a sintaxe elegante:

```tsx
<Input.Root>
  <Input.Label>Nome</Input.Label>
  <Input.FormField />
</Input.Root>
```

## Exemplo real do instrutor

O instrutor menciona um projeto com Electron onde usou extensivamente esse pattern. No `TableOfContents`, por exemplo: `Root`, `Section`, `Link`. Na `Sidebar`: `Root`, `Section`, `SectionContent`, `SectionTitle`. Cada componente complexo e decomposto em sub-componentes ao inves de configurado via props.

## Quando NAO usar composicao

O instrutor nao diz explicitamente, mas a implicacao e clara: componentes simples com 1-2 props visuais nao precisam dessa decomposicao. Um botao com `variant` e `size` esta perfeitamente bem como configuracao. A composicao brilha quando o componente tem multiplas areas visuais opcionais e reposicionaveis.