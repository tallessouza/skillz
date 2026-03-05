# Deep Explanation: Mapeando Propriedades de Entidades DDD

## Por que IDs tipados em vez de strings?

O instrutor destaca que, ao criar uma classe especifica (`UniqueEntityId`) para representar IDs de entidade, essa classe deve ser usada em **qualquer propriedade que represente um ID** — nao apenas o ID da propria entidade, mas tambem IDs de relacionamento como `authorId` e `questionId`.

A motivacao e consistencia: se o ID da entidade e um `UniqueEntityId`, faz sentido que referencias a outros IDs tambem sejam. Isso cria um contrato no dominio onde "tudo que e ID se comporta da mesma forma".

## updatedAt opcional: uma decisao de dominio, nao tecnica

O instrutor explica com um cenario real de forum: uma pessoa responde a um topico, outra pessoa responde a essa resposta, e entao a primeira pessoa **edita** sua resposta original. A interface precisa mostrar que houve edicao para manter transparencia.

O `updatedAt` e opcional porque:
- No momento da criacao, nao houve edicao
- Nem toda resposta sera editada
- A presenca de `updatedAt` comunica semanticamente "este conteudo foi modificado apos a criacao"

Isso e diferente de um `updatedAt` tecnico que muda em qualquer operacao — aqui ele representa uma **acao explicita do usuario**.

## bestAnswerId: modelando regras de forum

O instrutor menciona que "todo sistema de forum tem isso — desde o StackOverflow ate o forum da Skillz". O `bestAnswerId` e opcional porque:
- Nem toda pergunta recebe uma resposta marcada como melhor
- O autor da pergunta e quem seleciona a melhor resposta
- Representa "a resposta que solucionou o problema dele"

## Mapeamento incremental

O instrutor deliberadamente deixa de fora propriedades como tags e anexos, explicando que "envolvem outros conceitos importantes". Isso reflete uma pratica de DDD: nao modele tudo de uma vez. Adicione propriedades conforme os conceitos necessarios estejam compreendidos e modelados.

Entidades como Student e Instructor tambem ficam incompletas propositalmente — o instrutor prioriza as entidades centrais do dominio (Question e Answer) e deixa as secundarias para depois.