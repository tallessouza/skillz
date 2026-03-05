# Deep Explanation: Remocao de Documento

## Por que setQueryData + filter ao inves de invalidateQueries?

O instrutor escolhe atualizar o cache manualmente com `setQueryData` usando `.filter()` para remover o item deletado. Isso e o mesmo padrao usado na criacao de documentos (onde usou `setQueryData` para adicionar). A vantagem e que a UI atualiza instantaneamente sem um round-trip ao backend.

Quando o instrutor testa sem o `onSuccess`, o item e deletado no banco mas a lista lateral continua mostrando o documento. So apos F5 (refresh completo) o item desaparece. Isso demonstra claramente por que a atualizacao otimista do cache e necessaria.

## O problema do tipo Document

Um ponto sutil que o instrutor destaca: TypeScript pode resolver `Document` para o tipo global do DOM (`HTMLDocument`) ao inves do tipo customizado da aplicacao. O erro aparece como `id does not exist on type Document` — confuso porque voce sabe que seu tipo tem `id`.

A solucao: importar explicitamente `import { Document } from '@shared/types'`. O instrutor comenta que "isso e um errinho pra perder horas" — um insight valioso sobre armadilhas de naming em TypeScript.

## Navegacao pos-delete

Apos deletar, o usuario ficava vendo o conteudo do documento deletado. O instrutor resolve navegando para `/` (rota raiz), que mostra uma tela de "selecione ou crie um documento". A ordem importa: primeiro atualiza o cache (setQueryData), depois navega.

## Renderizacao condicional e altura fixa do header

Quando o botao de apagar e as breadcrumbs sao ocultados (porque nenhum documento esta selecionado), o header encolhe. Isso causa um problema de layout: o botao de maximizar/minimizar da janela Electron se reposiciona. A solucao pragmatica do instrutor: fixar a altura do header em pixels (testou 48px, ficou pequeno, ajustou para 56px com classe tipo `h-14`).

## Padrao reutilizavel: mutation com cache update

O instrutor destaca que o padrao e "semelhante ao que fizemos no createPage" — copiar o codigo de criacao e adaptar. Na criacao, voce adiciona ao array no cache. Na delecao, voce filtra do array. O esqueleto e identico:

1. `useMutation` com `mutationFn`
2. `onSuccess` com `queryClient.setQueryData`
3. Manipulacao do array (push vs filter)
4. Navegacao pos-operacao

## Uso de useParams em componentes fora da rota

O header nao e a pagina do documento, mas como esta dentro do layout do React Router DOM, ele tambem tem acesso aos parametros da rota via `useParams`. O instrutor explica que qualquer componente renderizado dentro de um `<Route>` (incluindo layouts) pode acessar params.