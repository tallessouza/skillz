# Deep Explanation: Extraindo Componentes em Angular

## Raciocinio do instrutor

O instrutor enfatiza que a motivacao principal para extrair o filtro em um componente separado e **evitar que o componente pai cresca demais**. O componente `explore-movies` estava acumulando responsabilidades — exibir a lista de filmes E gerenciar a logica de filtro. Ao separar, cada componente fica com uma unica responsabilidade.

## Por que `components/` e nao `pages/` ou `layout/`

O instrutor explica a classificacao de forma direta:
- **Nao e uma page** porque nao faz parte de uma rota
- **Nao e apenas layout** porque vai ter logica propria (filtro)
- **E um componente reutilizavel** dentro da feature

Essa classificacao em tres categorias (`components/`, `pages/`, `layout/`) e um padrao comum em projetos Angular organizados por feature. Cada feature tem sua propria pasta com essas subdivisoes.

## O fluxo de extracao

O instrutor segue um fluxo muito especifico e deliberado:

1. **Criar a pasta** `components/` dentro da feature `movies`
2. **Abrir terminal integrado** dentro dessa pasta (para o CLI gerar no lugar certo)
3. **Gerar com CLI** usando `--skip-tests=true` (decisao pragmatica para o contexto do curso)
4. **Recortar o HTML** — linhas 33 a 90 do template original, usando Ctrl+X (recortar, nao copiar)
5. **Colar no novo componente** — diretamente no HTML do `movies-filter`
6. **Substituir no pai** — colocar `<app-movies-filter>` onde estava o HTML recortado
7. **Importar no TypeScript** — adicionar nos imports do componente pai
8. **Verificar** — testar no browser e inspecionar o DOM para confirmar que o componente aparece

## Decisao de nao adicionar logica ainda

O instrutor deliberadamente separa a extracao estrutural da adicao de logica. Isso e um padrao pedagogico mas tambem e uma boa pratica: primeiro garanta que a extracao nao quebrou nada (mesmo resultado visual), depois adicione inputs/outputs e logica de filtro.

## Verificacao via DevTools

O instrutor mostra como verificar no inspecionar do browser que o componente `app-movies-filter` aparece corretamente no DOM, dentro da div pai. Isso confirma que:
- O seletor esta correto
- O componente foi importado corretamente
- O HTML foi movido sem perdas