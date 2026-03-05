# Deep Explanation: Separando Componentes

## Por que separar componentes?

O instrutor parte de uma pagina monolitica onde todo o HTML do player, header, lista de modulos e aulas esta num unico arquivo. O problema nao e so tamanho — e que cada parte tem uma responsabilidade diferente e potencial de reutilizacao diferente.

A separacao segue uma logica de **baixo pra cima**: primeiro as folhas (Lesson), depois os intermediarios (Module), depois os containers (Video, Header). Isso porque ao extrair de baixo pra cima, voce ja sabe quais props o componente pai precisa passar.

## A estrategia do instrutor

1. **Header** — extraido primeiro porque e o mais simples (nome da aula + modulo)
2. **Video** — encapsula o ReactPlayer, isolando a dependencia externa
3. **Module** — secao repetitiva da sidebar com titulo e lista de aulas
4. **Lesson** — botao individual de cada aula, extraido POR ULTIMO do Module

Essa ordem nao e arbitraria. O instrutor comeca pelo mais independente e termina pelo mais reutilizavel.

## Colisao de nomes: um problema real

O instrutor destaca um problema pratico: havia um icone `Video` do Lucide React e um componente `Video` sendo criado. A solucao foi remover o import do icone no arquivo pai e manter o componente. No componente filho (Lesson), o icone `Video` do Lucide e importado normalmente sem conflito.

Isso ilustra um principio importante: **nomes de componentes devem ser do dominio da aplicacao**, enquanto icones sao detalhes de implementacao que ficam encapsulados nos componentes folha.

## Props: comece simples, evolua depois

O instrutor explicitamente diz: "vou colocar apenas titulo e duracao por enquanto, mais pra frente a gente vai ter mais propriedades". Isso e intencional — nao tente antecipar todas as props. Comece com o minimo necessario e adicione conforme a necessidade surgir.

## O ajuste de indice (+1)

O `moduleIndex + 1` e um padrao recorrente em React. Arrays JavaScript comecam em zero, mas usuarios esperam ver "Modulo 1", nao "Modulo 0". O instrutor faz esse ajuste no componente de exibicao, nao no dado — o dado continua sendo o indice real do array.

## Estado atual: tudo estatico

O instrutor finaliza reforçando que a interface ainda e estatica — os dados estao hardcoded nas props. A proxima etapa sera integrar com uma API e usar Redux/Zustand para gerenciar estado. A separacao de componentes ANTES da integracao com estado e deliberada: primeiro a estrutura visual, depois o comportamento.