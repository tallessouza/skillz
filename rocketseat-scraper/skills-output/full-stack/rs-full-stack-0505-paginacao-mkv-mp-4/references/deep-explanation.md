# Deep Explanation: Paginação no Frontend

## Por que page deve ser dependência do useEffect

O instrutor demonstra um problema clássico: ao clicar no botão de avançar página, o número da página muda na tela, mas os dados exibidos continuam os mesmos. Isso acontece porque o estado `page` não estava no array de dependências do `useEffect`.

O React só re-executa um `useEffect` quando alguma de suas dependências muda. Se `page` não está listada como dependência, o efeito roda apenas na montagem inicial. O estado muda (o número na tela atualiza via re-render), mas a função de fetch dentro do efeito nunca é chamada novamente.

A correção é simples: adicionar `page` como dependência. Assim, toda vez que `setPage` é chamado, o React detecta a mudança e re-executa o efeito, que por sua vez chama `fetchData` com o novo valor de página.

### Analogia do instrutor

O instrutor mostra na prática: "Está vendo que ele até muda o número, mas não reflete aqui na consulta". Esse é o sintoma — a UI atualiza (porque o state mudou e causou re-render), mas os dados não (porque o fetch não foi re-executado). O useEffect é a ponte entre mudança de estado e efeito colateral (a requisição HTTP).

## Fluxo completo de paginação demonstrado

1. **Criação de dados de teste** — O instrutor cria múltiplas contas e solicitações (Maria com 3 solicitações: transporte, hospedagem, alimentação; Anderson com 1)
2. **Visualização como manager** — Todas as 4 solicitações aparecem na lista
3. **Filtro por nome** — Pesquisar "Maria" mostra só 3 registros; pesquisar "Anderson" mostra 1; limpar mostra todos
4. **Configuração de registros por página** — No dashboard, definir 2 registros por página resulta em 2 páginas para 4 registros
5. **Navegação** — Clicar no botão avançar muda para a próxima página; voltar retorna
6. **Limites** — Na última página, botão avançar é bloqueado; na primeira, botão voltar é bloqueado
7. **Teste com 1 por página** — 4 registros = 4 páginas, navegação funciona em todas

## Edge cases demonstrados

### Registros por página maior que total
Com 5 por página e apenas 4 registros, tudo cabe em 1 página. Os botões de navegação ficam ambos desabilitados. O instrutor demonstra: "por enquanto tem quatro então por isso vai mostrar uma página só".

### Filtro + Paginação
O instrutor filtra por nome e depois navega. Quando o filtro é aplicado, o total de páginas recalcula. Quando o filtro é limpo (Enter com campo vazio), volta ao total original.

### Diferentes densidades
O instrutor testa com 1, 2 e 5 por página para mostrar como a mesma lista se comporta de formas diferentes. Isso demonstra que a paginação é flexível quando o estado é reativo.

## Por que desabilitar botões nos limites

O bloqueio de navegação nos limites não é apenas UX — é prevenção de erros. Sem isso:
- Página 0 ou negativa pode ser enviada à API
- Página além do total retorna array vazio, confundindo o usuário
- Múltiplos cliques rápidos podem ultrapassar o limite antes da resposta chegar

O padrão correto é `disabled={page <= 1}` para voltar e `disabled={page >= totalPages}` para avançar, usando o total de páginas calculado a partir da resposta da API.

## Relação entre filtro e paginação

Filtro e paginação são estados independentes que se combinam na requisição. Porém, ao filtrar, a página deve resetar para 1. Exemplo: se o usuário está na página 3 de 4 e aplica um filtro que retorna apenas 2 resultados (1 página), a página 3 não existe mais. Sem o reset, a API retornaria vazio.