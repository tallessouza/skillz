# Deep Explanation: Permissoes por Cargos com CASL

## Por que um objeto indexado por role?

O instrutor segue o pattern recomendado na documentacao do CASL (Cookbook > Predefined Abilities). A ideia central e que permissoes sao **dados**, nao **logica**. Em vez de escrever `if (role === 'admin') { ... } else if (role === 'member') { ... }`, voce cria um objeto onde a chave e a role e o valor e a funcao que define as permissoes.

Isso traz tres vantagens:
1. **Lookup O(1)** — `permissions[user.role]` e direto, sem chain de ifs
2. **Extensibilidade** — adicionar nova role e adicionar uma chave no objeto
3. **Tipagem** — `Record<Role, Function>` garante que toda role tem permissoes definidas

## A funcao recebe user E builder

O parametro `user` existe porque, mais adiante no curso, as permissoes precisarao de contexto do usuario. Por exemplo: "um membro pode editar um projeto **se ele for o dono**". Sem o user, essa condicao seria impossivel.

O `builder` (AbilityBuilder) e o mecanismo do CASL para registrar permissoes. Dele voce desestrutura `can` e `cannot`.

## O generic AppAbility e essencial

```typescript
AbilityBuilder<AppAbility>
```

Sem esse generic, o TypeScript nao sabe quais actions (`invite`, `delete`, `manage`) e quais subjects (`User`, `Project`, `all`) existem. O autocomplete nao funciona e erros de tipagem passam silenciosamente.

`AppAbility` e definido no index.ts do modulo de permissoes como:
```typescript
type AppAbility = MongoAbility<[Action, Subject]>
```

Onde `Action` e `Subject` sao unions de strings que representam todas as acoes e entidades do sistema.

## Validacao de role desconhecida

O instrutor enfatiza: se um usuario tem uma role que nao esta mapeada (ex: `BILLING`), sem a validacao ele simplesmente nao teria nenhuma permissao — silenciosamente. Isso e perigoso porque:
- Nao gera erro
- O usuario fica sem acesso a nada sem saber por que
- Em debug, e dificil perceber que a role nao foi mapeada

Por isso o `throw new Error` e critico: falha explicita > falha silenciosa.

## De ability global para defineAbilityFor

Antes desta aula, o codigo exportava uma `ability` unica, igual para todos. Agora exporta uma **funcao** que cria uma ability especifica por usuario. Essa e a transicao fundamental:

```
// ANTES: todos iguais
export const ability = builder.build()

// DEPOIS: por usuario
export function defineAbilityFor(user: User): AppAbility
```

## Sintaxe JavaScript: metodo de objeto

O instrutor explica que no JavaScript, estas duas formas sao equivalentes:

```javascript
const obj = {
  admin: function(user, builder) { ... }
}

// Equivale a:
const obj = {
  admin(user, builder) { ... }
}
```

A forma curta (shorthand method) e preferida por ser mais limpa.

## manage + all = super admin

No CASL, `can('manage', 'all')` e a convencao para "pode tudo". `manage` representa todas as actions, `all` representa todos os subjects. E o equivalente a um super admin.