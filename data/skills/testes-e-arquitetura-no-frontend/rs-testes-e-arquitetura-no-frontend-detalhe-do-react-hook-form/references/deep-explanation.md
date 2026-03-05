# Deep Explanation: useWatch vs watch no React Hook Form

## Por que watch causa problemas

O `watch` do React Hook Form retorna valores que mudam a cada alteracao do campo observado. Quando usado no componente raiz do formulario, cada mudanca causa re-renderizacao de todo o componente e todos os seus filhos.

O instrutor descobriu esse problema ao notar um warning do React Compiler (React 19): a API `watch` retorna funcoes que nao podem ser memoizadas sem causar "stale UI" (UI desatualizada). O React Compiler, por default, desabilita a memoizacao automatica do componente ou hook que usa `watch`. Isso significa que voce perde os beneficios de performance do React Compiler ao usar `watch`.

## O insight do React Compiler

Com o React 19 e o React Compiler, componentes sao automaticamente memoizados. Porem, o `watch` quebra essa memoizacao porque seus valores de retorno nao sao estaveis — eles mudam a cada render e nao podem ser memoizados sem risco de mostrar dados desatualizados.

O `useWatch` resolve isso porque isola o escopo de re-renderizacao: apenas o componente onde `useWatch` e chamado re-renderiza, nao o componente raiz do formulario.

## Escopo de re-renderizacao

- **`watch`**: re-renderiza o componente raiz do formulario (onde `useForm` foi chamado) sempre que qualquer campo observado muda
- **`useWatch`**: re-renderiza apenas o componente onde `useWatch` e usado

Essa diferenca e crucial em formularios grandes. Se voce tem 20 campos e usa `watch` no componente raiz para observar 1 campo, cada digitacao nesse campo re-renderiza o formulario inteiro com todos os 20 campos.

## Propriedades adicionais do useWatch

O instrutor mencionou que `useWatch` aceita outras propriedades alem de `control` e `name`:
- `defaultValue`: valor padrao enquanto o campo nao tem valor
- `disabled`: booleano para desabilitar a observacao
- `exact`: para controle mais fino de quando re-renderizar

A documentacao oficial do React Hook Form e recomendada para explorar todas as opcoes.

## Contexto da descoberta

O instrutor admitiu que nao conhecia o `useWatch` antes — descobriu ao investigar o warning do React Compiler sobre o `watch`. Isso ilustra um padrao comum: warnings do compilador/linter frequentemente levam a descobertas de APIs melhores.