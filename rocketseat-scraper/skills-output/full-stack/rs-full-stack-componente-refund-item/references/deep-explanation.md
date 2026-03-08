# Deep Explanation: Componente RefundItem

## Por que agrupar props em um objeto `data`?

O instrutor separa as propriedades de domínio (id, name, category, amount, categoryImg) em um objeto `data` ao invés de recebê-las como props individuais. Isso acontece por três razões:

1. **Separação de concerns**: Props de domínio (dados do refund) ficam separadas de props de apresentação/navegação (className, href, onClick). Quando o componente estende `React.ComponentProps<typeof Link>`, as props nativas do Link não se misturam com as de negócio.

2. **Facilidade de passagem**: Com o objeto agrupado, você passa `data={refundExample}` ao invés de espalhar 5+ props individualmente. Quando o dado vem de uma API, é direto: `data={apiResponse}`.

3. **Tipagem reutilizável**: O `export type RefundItemProps` pode ser importado em outros arquivos — para tipar listas, respostas de API, ou funções utilitárias — sem precisar importar o componente inteiro.

## O padrão `React.ComponentProps<typeof Element>`

O instrutor usa `React.ComponentProps<typeof Link>` para herdar todas as props que o componente Link aceita. Isso é superior a definir manualmente `href?: string, className?: string` porque:

- Herda automaticamente TODAS as props, incluindo eventos e acessibilidade
- Se o Link mudar sua API (nova prop, prop deprecada), o TypeScript detecta automaticamente
- O spread `{...rest}` no elemento garante que qualquer prop válida do Link funcione

O padrão completo fica:

```tsx
type Props = React.ComponentProps<typeof Link> & {
  data: RefundItemProps
}

export function RefundItem({ data, ...rest }: Props) {
  return <Link {...rest}>...</Link>
}
```

## Shorthand de opacidade no Tailwind CSS

Uma das dicas mais práticas da aula: ao invés de usar duas classes (`bg-green-100 opacity-50`), o Tailwind permite especificar a opacidade diretamente na classe de cor usando barra `/`:

- `bg-green-100/5` → 5% de opacidade (quase transparente)
- `bg-green-100/50` → 50% de opacidade
- `bg-green-100/100` → 100% (padrão, totalmente opaco)

O instrutor se corrige durante a aula: inicialmente diz que `/5` é 50%, mas logo corrige para 5%. O valor após a barra é a porcentagem real.

**Por que isso é melhor que `opacity-50`?** Porque `opacity` afeta o elemento INTEIRO (texto, borda, filhos). O shorthand de cor aplica transparência APENAS àquela propriedade (background, text, border), mantendo o resto opaco.

## Estrutura de layout com flex

O componente usa uma composição de flex em dois níveis:

1. **Container (Link)**: `flex items-center gap-3` — alinha imagem, texto e valor na horizontal
2. **Bloco de texto (div)**: `flex flex-col flex-1` — empilha nome e categoria na vertical, e `flex-1` faz ocupar todo espaço disponível

O `flex-1` na div de texto é o que "empurra" o valor monetário para a direita. Sem ele, o valor ficaria colado ao texto.

## Hierarquia visual com variações de cinza

O instrutor usa diferentes tons de cinza para criar hierarquia:

- `text-gray-100` — texto primário (nome, valor) — mais claro, mais destaque
- `text-gray-200` — texto secundário (categoria, símbolo R$) — mais escuro, menos destaque

Combinado com `font-semibold` para o valor e `font-normal` para o símbolo, cria uma hierarquia clara sem precisar de tamanhos muito diferentes.

## Organização de pastas

O instrutor cria o componente dentro de `components/RefundItem.tsx`, mantendo a estrutura plana. Cada componente é um arquivo, sem pasta wrapper com index — abordagem pragmática para projetos de porte médio.