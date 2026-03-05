# Deep Explanation: Definindo Permissoes com CASL

## O modelo mental do CASL

O CASL segue uma estrutura fundamental: **por padrao, o usuario nao pode nada**. Voce precisa declarar explicitamente o que ele pode fazer. Isso e o oposto de muitos sistemas onde voce bloqueia acoes especificas.

## A armadilha do `cannot` com condicionais apos `manage all`

Esta e a pegadinha mais importante do CASL e que confunde a maioria dos desenvolvedores. Quando voce declara `can('manage', 'all')`, voce deu permissao total. Agora, se voce tentar negar com condicional:

```typescript
cannot('transfer_ownership', 'Organization', { ownerId: { $ne: userId } })
```

**Isso NAO funciona.** O CASL ignora condicionais em negacoes quando `manage all` esta ativo. A razao tecnica e que o CASL avalia permissoes de forma cumulativa, e uma negacao condicional apos uma permissao incondicional cria uma ambiguidade que o CASL resolve a favor da permissao.

### O padrao correto: Deny + Re-Grant

O instrutor (Diego) enfatiza que o caminho correto e:

1. **Negar completamente** a acao no subject
2. **Re-conceder** com condicional positiva

```typescript
cannot(['transfer_ownership', 'update'], 'Organization')  // nega TUDO
can(['transfer_ownership', 'update'], 'Organization', {    // re-concede com condicao
  ownerId: { $eq: userId }
})
```

Isso funciona porque a negacao e incondicional (sem condicionais), e a re-concessao e uma nova regra positiva com condicional.

## Verificacao de permissoes: "algum" vs "este"

Outro ponto que "mexe com a cabeca" segundo o instrutor:

```typescript
ability.can('delete', 'Project')  // "O usuario pode deletar ALGUM projeto?" → true
ability.can('delete', project)     // "O usuario pode deletar ESTE projeto?" → depende do ownerId
```

Quando voce passa apenas a string do subject, o CASL responde se o usuario tem QUALQUER permissao para aquela acao naquele subject. Quando voce passa a instancia, ele avalia as condicionais.

Analogia do instrutor: e como perguntar "voce sabe dirigir?" vs "voce pode dirigir ESTE carro?". A primeira e generica, a segunda depende de condicoes (habilitacao, seguro, etc).

## Por que `create Organization` nao pertence a roles

O instrutor raciocina em tempo real sobre isso: roles (admin, member, billing) sao roles **dentro** de uma organizacao. Se o usuario ainda nao tem nenhuma organizacao, ele nao tem role nenhuma, logo nao tem permissoes. Portanto, criar organizacao e uma permissao global — todo mundo pode criar organizacoes, independente de roles.

## A diferenca entre `manage all` e `manage Subject`

- `can('manage', 'all')` → todas as acoes em todos os subjects (admin total)
- `can('manage', 'Billing')` → todas as acoes definidas para Billing (ex: get, export), sem tocar em outros subjects

O billing role usa `manage` no subject especifico para herdar todas as acoes daquele dominio sem dar acesso global.

## Recomendacao do instrutor

Diego recomenda fortemente a leitura da documentacao do CASL, especialmente a secao sobre arquitetura de autorizacao, que tem um trecho extenso explicando essas nuances de avaliacao de permissoes.