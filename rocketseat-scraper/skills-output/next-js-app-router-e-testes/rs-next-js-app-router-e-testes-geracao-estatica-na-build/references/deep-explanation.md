# Deep Explanation: Geracao Estatica na Build

## O que e geracao estatica

No Next.js App Router, paginas tendem a ser cacheadas ao maximo. Quando um usuario acessa uma pagina de produto, o proximo usuario recebe uma versao estatica — como um HTML puro, sem requisicoes adicionais dentro do intervalo de cache (1 hora por padrao).

Porem, o **primeiro** usuario que acessa uma pagina ainda precisa aguardar o carregamento completo. A geracao estatica resolve isso: cria uma versao em cache **antes** da aplicacao ir ao ar, no momento da build.

## Como funciona internamente

Quando voce exporta `generateStaticParams` de uma pagina com rota dinamica (`[slug]`), o Next.js durante o `next build`:

1. Executa a funcao `generateStaticParams`
2. Recebe o array de parametros retornado
3. Para cada conjunto de parametros, renderiza a pagina completa
4. Salva o HTML resultante como arquivo estatico
5. Na saida do build, marca essas paginas com um circulo branco (SSG)

O resultado: essas paginas sao servidas instantaneamente, sem bater em nenhuma API. O cache e do Next, nao do navegador — limpar cache do browser nao afeta.

## O problema da API interna

O instrutor destaca um problema importante: quando a API e criada dentro do proprio projeto Next (nas route handlers), o servidor precisa estar rodando para que as chamadas API funcionem durante a build.

Isso significa que voce precisa:
1. Rodar `next dev` em um terminal
2. Rodar `next build` em outro terminal

Esse e um dos motivos pelos quais nao e recomendado criar a API dentro do proprio Next em producao. Geralmente a API e um projeto separado (backend independente).

## Quando usar e quando nao usar

O instrutor e enfatico: geracao estatica **aumenta o tempo de build**. Cada pagina gerada estaticamente executa todas as suas chamadas API durante o build.

**Regra pratica:** se voce tem um e-commerce com 1000 produtos, nao gere estaticamente todos. Pegue apenas os 20 mais acessados, os produtos em destaque — somente o que precisa ser instantaneo para o usuario.

## Diferenca entre cache sob demanda e geracao estatica

- **Cache sob demanda:** primeiro usuario espera, segundo usuario em diante recebe instantaneo
- **Geracao estatica:** todos os usuarios recebem instantaneo desde o primeiro acesso

Para paginas rapidas de carregar, o ganho da geracao estatica e pequeno. O valor real aparece em paginas que demoram para carregar.

## Saida do build

No output do `next build`, paginas geradas estaticamente aparecem com:
- Circulo branco (○) = SSG (Static Site Generation)
- As rotas especificas sao listadas abaixo da rota dinamica