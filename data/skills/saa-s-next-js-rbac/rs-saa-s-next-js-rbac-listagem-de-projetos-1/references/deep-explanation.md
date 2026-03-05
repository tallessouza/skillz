# Deep Explanation: Listagem de Projetos

## Por que buscar com contexto de organizacao

Em aplicacoes SaaS multi-tenant, toda query precisa ser escopada pela organizacao atual. O instrutor mostra o padrao de pegar `getCurrentOrg()` e passar como parametro para `getProjects()`. Isso ja existia no header da aplicacao — a funcao `getProjects` foi reaproveitada aqui na listagem completa. O principio e: nunca faca fetch de recursos sem o contexto do tenant.

## Renderizacao condicional de avatares

O instrutor investigou o schema para verificar se `owner` poderia ser undefined. Concluiu que o owner em si nunca e undefined, mas `owner.avatarUrl` pode ser. A decisao foi: mostrar todos os dados do owner normalmente, e so condicionar o `<AvatarImage>`. Isso evita esconder informacao util (nome) por causa de um campo opcional (imagem).

## dayjs com relativeTime

O instrutor escolheu `dayjs` com o plugin `relativeTime` para exibir datas como "3 days ago" em vez de datas absolutas. O metodo `fromNow()` calcula a distancia automaticamente. Isso e mais legivel para o usuario em contextos de listagem onde a precisao exata da data nao e critica.

## Decisoes de estilizacao

### Remocao do "Created by"
O instrutor percebeu que o texto "Created by" ocupava espaco desnecessario dentro do card e optou por remover. So o nome do owner e a distancia de tempo ja comunicam a informacao necessaria.

### Reducao do titulo
O `text-2xl font-bold` padrao do CardTitle era "grotesco" segundo o instrutor. Reduziu para `text-base font-medium` (ou `font-semibold`) para manter proporcao visual adequada dentro de cards de listagem.

### Truncate para evitar quebra
Projetos com nomes longos ou datas extensas ("a few seconds ago") quebravam o layout do footer. O `truncate` do Tailwind resolve com overflow hidden + text-ellipsis.

### flex-col + justify-between
Quando um projeto nao tem descricao, o footer ficava "colado no topo". A solucao foi aplicar `flex flex-col justify-between` no Card, empurrando o footer para baixo independente do conteudo.

## Reuso de funcoes HTTP

O instrutor destacou que `getProjects` ja existia na pasta HTTP porque havia sido criada para o header. Aqui ela foi reutilizada na pagina de listagem — principio de nao duplicar chamadas HTTP.