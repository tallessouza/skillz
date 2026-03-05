# Deep Explanation: Caso de Uso Deletar Pergunta

## Por que o repository recebe a entidade e não o id?

No DDD, o repositório trabalha com agregados (entidades ricas). Passar o objeto inteiro para `delete` mantém consistência com o padrão — o repositório é uma coleção de objetos de domínio. Além disso, para deletar você já precisou buscar a entidade (para validar existência e autoria), então já tem o objeto em mãos.

## O problema do UniqueEntityId na comparação

O `authorId` dentro da `Question` é um `UniqueEntityId`, que é um value object. Comparar diretamente com uma string (`===`) sempre retorna `false` porque são tipos diferentes. O instrutor destaca que é necessário usar `.toString()` ou `.toValue()` para extrair o valor primitivo antes da comparação.

## Padrão de validação em cascata

O use case segue um padrão específico de validação:

1. **Busca** — entidade existe?
2. **Autorização** — quem está pedindo tem permissão?
3. **Execução** — só depois das validações

Essa ordem importa: não faz sentido verificar autorização de algo que não existe.

## Por que `return {}` e não `void`?

O instrutor menciona preferência pessoal por retornar objeto vazio ao invés de void. A razão prática: se no futuro o use case precisar retornar algo (mensagem de confirmação, dados do que foi deletado), a interface já está preparada. Todos os use cases mantêm a mesma assinatura `Request → Response`.

## Splice vs Filter no InMemory

O instrutor usa `splice(index, 1)` ao invés de `filter`. Splice faz mutação in-place no array, removendo exatamente 1 elemento na posição encontrada. O segundo argumento `1` indica quantos elementos remover a partir do índice.

## Permissionamento como regra de negócio

O instrutor enfatiza que a validação de autoria é uma regra de negócio do domínio, não uma preocupação de infraestrutura. Em um fórum, não faz sentido deletar pergunta de outro autor. Por isso a validação fica no use case (camada de aplicação/domínio) e não no controller ou middleware.

## Teste de rejeição com `rejects.toBeInstanceOf`

Para testar que uma promise rejeita, o padrão é:
```typescript
await expect(promise).rejects.toBeInstanceOf(Error)
```

O `rejects` é necessário porque o use case é assíncrono. Sem ele, o teste passaria mesmo com erro, porque a promise rejeitada não seria capturada.

## Evolução futura mencionada

O instrutor menciona que esse padrão de erro simples (`throw new Error`) será evoluído para algo mais complexo adiante no curso — provavelmente Either pattern ou custom error classes. Por enquanto, o `throw` simples serve para estabelecer o padrão de validação.