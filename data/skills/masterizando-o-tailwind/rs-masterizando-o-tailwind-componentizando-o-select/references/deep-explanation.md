# Deep Explanation: Componentizando o Select

## Por que não usar Composition Pattern aqui

O instrutor explicitamente escolhe NÃO aplicar o Composition Pattern (que foi usado no FileInput e Input) neste Select. A razão: o foco da aula é Tailwind, não patterns de React. Quando o objetivo é aprender uma ferramenta específica (Tailwind), over-engineering com patterns avançados distrai do aprendizado principal.

Isso é uma decisão pragmática: nem todo componente precisa do pattern mais sofisticado. Um Select simples com `children` e props básicas (`placeholder`, `text`, `value`) resolve 80% dos casos.

## Estratégia de refatoração: arquivo → pasta

A técnica usada é renomear `Select.tsx` para `Select/index.tsx`. No ecossistema React/Next.js, isso é transparente para os imports — quem importava `from './Select'` continua funcionando porque o bundler resolve `Select/index.tsx` automaticamente.

Passos:
1. Renomear `Select.tsx` → criar pasta `Select/`
2. Mover conteúdo para `Select/index.tsx`
3. Criar `Select/SelectItem.tsx` como subcomponente
4. Exportar ambos conforme necessário

## Extensão de props do Radix

Ao invés de definir tipos manualmente, o instrutor usa `extends SelectItemProps` do Radix. Isso garante que:
- Todas as props nativas do Radix SelectItem são aceitas
- O TypeScript valida automaticamente
- Novas props do Radix em updates futuros são herdadas

A prop customizada `text` é adicionada porque o Radix usa `children` internamente para o `ItemText`, mas expor `text` como prop simplifica o uso.

## Bug do margin-x no Input

O instrutor identifica um bug visual: inputs não alinhados nas bordas. A causa era um `mx-1` no componente Input que existia para o campo de busca mas afetava todos os inputs. Remoção do margin genérico corrigiu o alinhamento.

Lição: margins em componentes reutilizáveis são perigosos. Prefira aplicar spacing no contexto de uso (no pai), não no componente filho.

## Reutilização do Select para timezone

O mesmo componente Select é reutilizado para o campo timezone, provando que a abstração funciona. Basta trocar o `placeholder` e os `SelectItem` filhos.