# Deep Explanation: Limpeza de Dados em Testes de Autenticação

## Por que cleanup é essencial

O instrutor demonstrou um problema real: ao rodar os testes uma segunda vez, eles falhavam porque o usuário de teste já existia no banco. Ele precisou ir manualmente ao banco de dados, selecionar o usuário de teste e deletá-lo antes de rodar os testes novamente. Esse é o sintoma clássico de testes sem cleanup.

A solução é replicar o padrão `afterAll` que já existia em outro arquivo de teste (o session controller) e aplicá-lo também no user controller. O instrutor copiou tanto o hook `afterAll` quanto a importação do Prisma de um teste que já funcionava corretamente.

## O padrão afterAll

O `afterAll` do Jest/Vitest executa uma vez após todos os testes do `describe` terminarem. É o lugar ideal para limpar dados que foram criados durante os testes:

```typescript
afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: "test@example.com" }
  })
})
```

## Importância dos testes — insight do instrutor

O instrutor reforçou que essa é "uma ótima oportunidade para reforçar a importância dos testes na programação". O fato de o teste falhar na segunda execução revelou um bug no setup do teste — sem testes automatizados, esse tipo de problema de dados residuais passaria despercebido até causar problemas em produção ou CI.

## Ordem de deleção e foreign keys

Quando há relacionamentos entre tabelas (ex: sessões referenciam usuários), a ordem de deleção importa. Sempre delete os registros dependentes primeiro:

1. Sessões (referencia user_id)
2. Usuários (referenciado por sessões)

Se tentar deletar o usuário primeiro, o banco rejeita pela constraint de foreign key.

## Consistência entre arquivos de teste

O instrutor mostrou que o session controller já tinha o padrão de cleanup implementado. A abordagem foi copiar o mesmo padrão (importação do Prisma + afterAll) para o user controller. Manter consistência entre arquivos de teste facilita manutenção e reduz bugs.

## Fluxo completo demonstrado

1. Percebeu que o teste falhava na segunda execução
2. Identificou que faltava cleanup no user controller test
3. Copiou o padrão afterAll do session controller test
4. Importou o Prisma no arquivo de teste
5. Deletou manualmente o usuário residual no banco (uma última vez)
6. Rodou `npm run test` — todos os testes passaram
7. Confirmou que tanto user controller quanto session controller estavam funcionando