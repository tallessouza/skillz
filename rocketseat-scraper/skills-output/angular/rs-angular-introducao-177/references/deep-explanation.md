# Deep Explanation: Tela de Detalhes de Filme

## Visao geral do instrutor

O instrutor destaca que a tela de detalhes e significativamente mais complexa que as anteriores porque combina multiplas funcionalidades interativas em um unico componente. Nao e apenas exibir dados — envolve interacoes bidirecionais com o servidor.

## Complexidade do componente

A complexidade vem da combinacao de:

1. **Data fetching reativo** — o componente precisa reagir ao ID na URL e buscar os dados correspondentes
2. **Interacao de rating** — o usuario clica em estrelas, o visual atualiza imediatamente (otimista), e uma requisicao HTTP e enviada
3. **Toggle de favoritos** — logica binaria com estado visual e persistencia no servidor
4. **Estado inicial do servidor** — ao abrir a pagina, o componente precisa saber se o filme JA e favorito para exibir o icone correto desde o inicio

## Logica das estrelinhas

O instrutor enfatiza que a logica de preencher estrelas "vai dar uma logica bem legal". O padrao e:
- Usuario clica na estrela N (1-5)
- Todas as estrelas de 1 ate N ficam preenchidas
- Estrelas de N+1 ate 5 ficam vazias
- Isso e naturalmente modelado com um `computed` que mapeia o rating atual para um array visual

## Logica de favoritos — dois momentos

O instrutor distingue claramente dois momentos:
1. **Toggle ativo** — usuario clica no coracao para favoritar/desfavoritar (acao)
2. **Verificacao inicial** — ao carregar o componente, checar se o filme ja esta nos favoritos (leitura)

Essa distincao e importante porque o estado inicial vem do servidor, mas o toggle e local (com sync posterior).

## Ferramentas reativas mencionadas

O instrutor lista explicitamente as ferramentas Angular que serao usadas:
- **signals** — estado reativo basico
- **computed** — derivacoes (estrelas, icone do coracao)
- **linkedSignal** — signals que dependem de outros
- **rxResource** — fetch HTTP reativo (alternativa moderna ao resolver/service manual)
- **Leitura de parametros da URL** — extrair o `:id` da rota `/details/:id`