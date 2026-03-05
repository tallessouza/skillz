# Deep Explanation: Tipagem de Permissoes com Zod

## Por que Zod e nao tipos manuais?

O instrutor explica que com poucas permissoes, tipos TypeScript manuais funcionam bem. Mas conforme o sistema cresce com muitos subjects e acoes, a leitura fica dificil. O Zod resolve isso de duas formas:

1. **Semantica**: `z.tuple([z.union([...]), z.literal('Project')])` eh mais legivel que `[('create' | 'delete'), 'Project']` quando ha muitas opcoes
2. **Validacao futura**: Se as permissoes vierem de banco de dados ou fonte externa, o Zod valida em runtime, nao so em compilacao

## Conceito: Tupla vs Array

O instrutor faz uma distincao importante: quando voce tem um array que **sempre** tera exatamente 2 itens (acao + subject), isso nao eh um array — eh uma **tupla**. Tupla eh um conceito da programacao funcional (tambem presente em Ruby, Python, etc) onde o tamanho eh fixo e cada posicao tem tipo definido.

```typescript
// Array: tamanho desconhecido, tipo uniforme
z.array(z.string()) // string[]

// Tupla: exatamente 2 posicoes, cada uma tipada
z.tuple([actionUnion, subjectLiteral]) // [Action, Subject]
```

## Conceito: Union de Literals

O Zod nao aceita strings soltas dentro de `z.union()`. Cada opcao precisa ser um tipo Zod. Para strings especificas, usa-se `z.literal()`:

```typescript
// NAO funciona:
z.union(['create', 'delete']) // ❌

// Funciona:
z.union([z.literal('create'), z.literal('delete')]) // ✅
```

## Subjects nao sao tabelas

O instrutor enfatiza: subjects como `Billing` nao sao necessariamente tabelas no banco. Billing eh um calculo, nao algo persistido. Subject eh qualquer **recurso sobre o qual voce gerencia permissoes**. Voce pode criar quantos quiser.

## Permissoes granulares vs genericas

Exemplo real do instrutor: `transfer_ownership` na Organization. Seria tentador pensar que transferir o dono eh um `update` (estou "atualizando" o dono). Mas o instrutor argumenta que `update` deve ser para titulo/descricao, enquanto `transfer_ownership` eh uma operacao distinta que merece seu proprio literal. Isso permite controle fino — um usuario pode ter permissao de update sem ter permissao de transferir.

## Centralizacao de Roles

O instrutor nota que `Role` estava sendo definida em dois lugares (models e permissoes). A solucao: criar `rolesSchema` em um arquivo na raiz (ex: `src/roles.ts`) e importar em ambos os lugares. O schema Zod serve tanto para tipar (`z.infer`) quanto para usar no codigo JavaScript (validacao runtime).

## Uso de rolesSchema em Models

No model de usuario, em vez de tipar role como string, usa-se o proprio `rolesSchema`:

```typescript
const userSchema = z.object({
  id: z.string(),
  role: rolesSchema, // reutiliza o schema, nao duplica
})
type User = z.infer<typeof userSchema>
```