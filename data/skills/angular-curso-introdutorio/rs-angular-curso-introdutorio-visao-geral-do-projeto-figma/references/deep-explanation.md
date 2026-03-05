# Deep Explanation: Identificacao de Componentes Angular a partir do Figma

## O Exercicio Mental do Instrutor

O instrutor propoe um exercicio deliberado antes de comecar a codar: percorrer todas as telas do Figma e identificar os componentes. Isso nao e opcional — e o primeiro passo do desenvolvimento Angular.

A logica e simples: no Angular, tudo e componente. Uma pagina e um componente. Um botao reutilizavel e um componente. Mas nem tudo PRECISA ser um componente separado. O criterio e **repeticao e reuso**.

## Criterio de Decisao: Componente vs Inline

O instrutor usa um criterio pragmatico:

1. **Navbar** — aparece em TODAS as paginas → componente isolado, fixo no layout. "Voce criando um componente, isso vai te ajudar a reaproveitar aquele conteudo."

2. **Item da lista** — o instrutor destaca: "o item dessa lista e o mesmo, e o mesmo componente". Quando voce ve repeticao visual identica, isso grita "componente".

3. **Conteudo da pagina de formulario** — "aqui eu nao tenho algo que se repete, entao eu posso criar esse conteudo diretamente nessa pagina". Sem repeticao = sem necessidade de componente separado.

4. **Certificado** — caso interessante: "Esse certificado tambem pode ser um componente ou se voce preferir pode desenvolver diretamente na tela, nao tem problema, ja que nessa aplicacao ele so aparece aqui." O instrutor mostra que a decisao nao e binaria — quando algo aparece em um unico lugar, e uma escolha de design.

## Estados vs Paginas

O instrutor mostra dois estados do formulario no Figma lado a lado: botoes desabilitados e botoes habilitados. Ele explica a regra de negocio:

- Preencher titulo da atividade → habilita botao "Adicionar"
- Preencher nome do aluno + pelo menos 1 atividade → habilita botao "Gerar Certificado"

Isso e importante: nao sao paginas diferentes, sao **estados** do mesmo componente. Iniciantes frequentemente confundem estados com paginas separadas.

## Estrutura de Arquivos Angular

O instrutor menciona que cada componente tem seu proprio HTML, TypeScript e CSS. Neste modulo inicial, o foco e apenas no HTML (layout). Isso reforca a abordagem incremental: primeiro a estrutura, depois o comportamento.

## Contagem Final do Projeto

- 5 paginas (componentes de pagina)
- Navbar (componente compartilhado)
- Item da lista de certificados (componente reutilizavel)
- Item da lista de atividades (componente reutilizavel)
- Certificado (decisao em aberto — componente ou inline)