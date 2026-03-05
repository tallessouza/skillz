# Deep Explanation: Responsabilidade de Modais

## O raciocinio do instrutor

O ponto central e que **modais sao componentes normais**. A unica diferenca e que eles sao abertos via Dialog do Angular CDK/Material. Isso significa que tecnicamente eles *podem* injetar qualquer service — mas *nao devem* injetar services de dominio.

## Por que nao sentimos a dor em projetos pequenos

O instrutor faz questao de repetir: "No nosso projeto aqui, no GoTask, nos nao vamos sentir isso." Essa e uma observacao importante porque muitos desenvolvedores descartam esse padrao justamente porque em projetos pequenos a diferenca parece irrelevante. A dor aparece em projetos de larga escala com muitos modais, services e componentes — quando voce precisa rastrear "quem esta chamando o que".

## O fluxo linear de dados

A analogia mental e um pipeline:

```
Componente Pai → abre modal → modal coleta dados → modal fecha com resultado → pai processa resultado via service
```

Se o modal tambem chama o service, o fluxo se bifurca:

```
Componente Pai → abre modal → modal chama service (efeito colateral oculto)
                             → modal fecha → pai nao sabe o que aconteceu
```

Isso torna debugging e refatoracao muito mais dificeis.

## Caso concreto: modal de comentarios

O instrutor detalha um caso mais complexo: o modal de comentarios recebe uma **copia** da tarefa (nao a instancia da fonte de verdade no service). O modal manipula os comentarios internamente (adiciona, remove). Quando fecha, ele apenas informa **se houve alteracao**. O componente pai (TaskCardComponent) e quem decide chamar `updateComments()` no service.

Isso preserva:
1. **Fonte de verdade unica** — o service mantem o estado real
2. **Reversibilidade** — se o usuario cancelar, nada muda
3. **Testabilidade** — o modal pode ser testado isoladamente sem mockar o service

## Beneficio de substituicao

Se voce precisar trocar o modal (ex: novo design, novo framework de dialog), o componente pai nao muda — porque ele so depende do contrato de retorno do modal, nao da implementacao interna.

## Aplicacao universal

O instrutor aplica o mesmo principio para:
- **TaskFormModalComponent** (criacao/edicao) → devolve name + description
- **TaskCommentsModalComponent** (comentarios) → devolve flag de alteracao
- Qualquer futuro modal no projeto

A regra e consistente independente do tipo de modal.