# Deep Explanation: Update com Prisma ORM

## Por que separar `where` e `data`?

O Prisma exige essa separacao por design. O `where` identifica QUAL registro sera afetado, o `data` define O QUE muda. Essa separacao previne um dos bugs mais perigosos em banco de dados: atualizar registros errados ou todos os registros de uma tabela.

Se voce esquecer o `where`, o Prisma vai lancar um erro (diferente de SQL puro onde um `UPDATE` sem `WHERE` afeta toda a tabela). Mas confiar apenas no erro do ORM nao e suficiente — a pratica de sempre definir o `where` explicitamente torna o codigo auto-documentado.

## Por que o ID vem de `request.params` e nao do body?

Convencao REST: a URL identifica o recurso. `PUT /questions/abc123` diz "estou atualizando a question com id abc123". O body contem apenas os dados que mudam. Misturar identificacao e dados no body quebra a semantica HTTP e dificulta caching, logging e seguranca.

## Por que nao enviar `userId` no update?

O instrutor destaca que ao atualizar uma pergunta, o `userId` (dono) nao muda. Enviar campos imutaveis no body do update cria riscos:

1. **Seguranca:** Um atacante poderia trocar o `userId` e se apropriar do registro
2. **Integridade:** O dono de um registro e definido na criacao e nao deve mudar por update casual
3. **Simplicidade:** Menos campos no body = menos validacao necessaria

A regra e: so envie no body o que o usuario pode legitimamente editar. Campos de propriedade, timestamps de criacao e IDs devem ser protegidos.

## Fluxo completo demonstrado na aula

1. Duplicar a rota de criacao como base (reaproveitar estrutura)
2. Mudar metodo para PUT
3. Adicionar `:id` na URL
4. Extrair `id` de `request.params`
5. Extrair apenas campos editaveis de `request.body`
6. Chamar `prisma.question.update({ data, where: { id } })`
7. Testar via Insomnia (PUT request)
8. Verificar resultado no Prisma Studio

## Analogia do instrutor

O instrutor compara com a criacao: a estrutura e quase identica, mas no update voce precisa dizer QUAL registro quer mudar (via `where`). Na criacao nao existe `where` porque voce esta gerando algo novo.

## Simplicidade do Prisma

O instrutor destaca varias vezes a simplicidade: "olha so, a simplicidade do Prisma". O metodo `update` do Prisma abstrai todo o SQL de UPDATE, deixando o desenvolvedor focado apenas em: qual registro (`where`) e quais dados (`data`).