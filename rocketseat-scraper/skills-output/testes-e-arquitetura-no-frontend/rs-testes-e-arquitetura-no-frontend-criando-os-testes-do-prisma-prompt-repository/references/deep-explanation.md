# Deep Explanation: Testes do Prisma Repository

## Por que testar a camada de infraestrutura isoladamente?

O instrutor enfatiza que cada camada da arquitetura limpa deve ser testada isoladamente. O Prisma Prompt Repository e uma implementacao concreta de uma interface abstrata. Testar ele garante que a "traducao" entre a interface do dominio e o Prisma esta correta.

## A distincao entre searchMany e findMany

Um ponto central da aula: `searchMany` e uma abstracao criada pela aplicacao. O Prisma nao tem `searchMany` — ele so tem `findMany`. Por isso, ao testar `searchMany`, o que se verifica e que `prisma.prompt.findMany` foi chamado com os parametros corretos (WHERE com OR, mode insensitive, etc). O teste valida a traducao, nao o Prisma em si.

> "O searchMany e uma implementacao, uma abstracao nossa. O Prisma nao tem o metodo searchMany, ele tem o metodo findMany."

## A importancia de verificar falsos positivos

O instrutor demonstra ao vivo: apos cada teste passar, ele propositalmente quebra a assertion (ex: troca `desc` por `asc`, ou coloca um valor no lugar de `undefined`). Se o teste continua passando, e falso positivo. Essa pratica simples evita testes que dao falsa sensacao de seguranca.

> "Sera que e um falso positivo? E se eu passar aqui, por exemplo, um ascendente? Opa! Foi de bola. Nao e um falso positivo."

## Tipagem dos mocks: pragmatismo

O instrutor mostra duas abordagens:
1. **Sem tipagem** (`as any`) — rapido, funcional, aceitavel em testes
2. **Com tipagem completa** — cria `PrismaMock`, `PromptDelegateMock` com tipos exatos

Ele reconhece que a tipagem completa e "mais trabalhosa" e "fica a seu criterio". A recomendacao e: geralmente agrega, mas nao e obrigatorio.

> "Fica a seu criterio ai voce pensar nos seus testes do dia a dia, se faz sentido voce fazer toda essa parte de tipagem aqui."

## O casting `as unknown as PrismaClient & PrismaMock`

Para que o mock seja aceito onde se espera um `PrismaClient`, e necessario fazer double casting: primeiro para `unknown`, depois para o tipo desejado. Isso e um padrao comum em testes TypeScript quando o mock nao implementa toda a interface.

## Estrutura de pastas espelhada

Os testes seguem a mesma estrutura de pastas da implementacao:
- Implementacao: `src/infra/repository/prisma-prompt-repository.ts`
- Teste: `test/infra/repository/prisma-prompt-repository.spec.ts`

Isso facilita encontrar o teste correspondente a qualquer arquivo de implementacao.