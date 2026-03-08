# Deep Explanation: Criando um Componente React

## Por que separar componentes em arquivos?

O instrutor enfatiza que a principal vantagem de criar componentes e **separar a logica**. Quando voce isola um componente em seu proprio arquivo:

- Todas as regras e logica daquele componente ficam contidas em um unico lugar
- O arquivo principal (`App.tsx`) fica limpo e legivel
- Voce pode reutilizar o componente em qualquer parte da aplicacao

Como o instrutor diz: "Ele ta separado em um arquivo, ta num arquivo separadinho, isoladinho, todas as regrinhas eu posso fazer separada."

## A convencao de nomes: arquivo vs funcao

Este e um ponto que gera confusao em iniciantes. O instrutor faz questao de demonstrar na pratica:

- **Nome do arquivo:** pode ser todo minusculo (`button.tsx`). O instrutor deliberadamente usa minusculo para provar que funciona.
- **Nome da funcao:** DEVE comecar com maiuscula (`Button`). Esta e uma regra do React — componentes com inicial minuscula sao interpretados como tags HTML nativas.

O instrutor diz: "O que manda aqui, que a gente tem que respeitar, e o nome da funcao ter a primeira letra maiuscula. O nome do arquivo nao precisa."

## Anatomia de um componente

Um componente React e, na essencia, uma funcao JavaScript que:

1. E exportada (`export function`)
2. Tem nome PascalCase (`Button`)
3. Retorna JSX (o HTML-like que React renderiza)

```tsx
export function Button() {
  return <button>Clique aqui</button>
}
```

Nao ha magica aqui — e uma funcao que retorna markup.

## O fluxo de uso

1. **Criar** o componente em `src/components/button.tsx`
2. **Exportar** a funcao com `export`
3. **Importar** no arquivo que vai usar: `import { Button } from "./components/button"`
4. **Renderizar** como uma tag JSX: `<Button />`

O instrutor mostra que ao usar `<Button />` no App, o React substitui essa tag pelo retorno da funcao `Button` — neste caso, um `<button>Clique aqui</button>`.

## Organizacao de pastas

A convencao ensinada e simples e eficaz:

```
src/
├── components/    ← pasta dedicada para componentes
│   └── button.tsx
├── App.tsx        ← componente raiz
└── main.tsx       ← ponto de entrada
```

O instrutor cria a pasta `components` dentro de `src` explicitamente para demonstrar essa organizacao. A medida que o projeto cresce, outros componentes sao adicionados nessa mesma pasta.

## Importacao por caminho relativo

Ao importar, voce navega pela estrutura de pastas:

```tsx
import { Button } from "./components/button"
```

- `./` — diretorio atual (onde esta o App.tsx, ou seja, `src/`)
- `components/` — a pasta de componentes
- `button` — o arquivo (sem extensao `.tsx`)

O instrutor destaca: "Estou navegando aqui na estrutura de pastas."