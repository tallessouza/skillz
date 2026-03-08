# Deep Explanation: Definindo Tipagem de Retorno de API

## O problema: "estar no escuro"

O instrutor usa a metáfora de "estar no escuro" para descrever o que acontece quando você faz uma requisição API sem tipagem. Ao digitar `data.` após receber a resposta, não aparece nenhuma sugestão — você não sabe quais campos existem, quais são os tipos, ou se está acessando algo que existe.

Isso é problemático porque:
- Erros de digitação em nomes de campo só aparecem em runtime
- Não há documentação implícita do que a API retorna
- Outros desenvolvedores precisam inspecionar a API manualmente para entender a estrutura

## A solução: DTOs como contrato

DTO (Data Transfer Object) é o padrão para definir a "forma" dos dados que transitam entre sistemas. No contexto frontend, o DTO descreve exatamente o que a API retorna.

### Por que arquivos `.d.ts` separados?

O instrutor cria arquivos `.d.ts` dentro de uma pasta `DTOs/`. Isso porque:
1. **Separação de concerns** — tipagens não são lógica de negócio
2. **Reutilização** — o mesmo tipo pode ser usado em múltiplos componentes
3. **Manutenção** — quando a API muda, você atualiza em um lugar só
4. **Documentação implícita** — a pasta `DTOs/` funciona como catálogo de todos os shapes de API

### Arquivos `.d.ts` vs `.ts`

Arquivos `.d.ts` são "declaration files" — contêm apenas definições de tipo, sem código executável. São ideais para DTOs porque:
- Não geram JavaScript no build
- Sinalizam claramente que é apenas tipagem
- São reconhecidos automaticamente pelo TypeScript sem import explícito (dependendo do tsconfig)

## Enums para valores finitos

O instrutor destaca uma "dica" importante: quando um campo tem um conjunto limitado de valores possíveis (como categorias), usar `string` é insuficiente. Uma enum resolve isso:

```typescript
enum CategoriesAPI {
  Food = "food",
  Others = "others",
  Services = "services",
  Transport = "transport",
  Accommodation = "accommodation",
}
```

### Por que enum e não union type?

O instrutor escolheu enum ao invés de `type Category = "food" | "others" | ...`. Ambos funcionam, mas enum tem vantagens:
- **Referência nomeada** — `CategoriesAPI.Food` é mais legível que `"food"`
- **Nome e valor** — o instrutor explica: "a referência que eu quero usar e o valor é esse"
- **Iterável** — pode-se listar todas as categorias em runtime
- **Autocomplete** — o IDE sugere todas as opções ao digitar `CategoriesAPI.`

### Descobrindo os valores

O instrutor mostra que para preencher a enum, basta olhar os dados reais retornados pela API. A prática é: inspecione a resposta da API, identifique os valores possíveis, e crie a enum correspondente.

## Composição de tipos: unitário vs paginado

Uma decisão de design importante do instrutor é separar o tipo unitário do tipo paginado:

```typescript
// Tipo de UM refound
type RefoundAPIResponse = { id: string; name: string; ... }

// Tipo da RESPOSTA PAGINADA (contém lista + metadados)
type RefoundsPaginationAPIResponse = {
  refounds: RefoundAPIResponse[]
  pagination: { page: number; perPage: number; ... }
}
```

O instrutor explica: "eu gosto de criar ele separado porque fica fácil — se eu quiser usar ele sozinho ou se eu quiser usar ele junto como uma lista."

Essa separação permite:
- Usar `RefoundAPIResponse` quando renderizar um único item
- Usar `RefoundAPIResponse[]` quando tiver uma lista sem paginação
- Usar `RefoundsPaginationAPIResponse` quando tiver lista + paginação

## Generics no cliente HTTP

A peça final é usar a tipagem ao fazer a requisição:

```typescript
const { data } = await api.get<RefoundsPaginationAPIResponse>("/refounds")
```

O generic `<RefoundsPaginationAPIResponse>` diz ao TypeScript: "o `data` que volta dessa requisição tem esse formato". A partir daí, todo acesso a `data.refounds`, `data.pagination`, etc. tem autocomplete e type checking.

O instrutor demonstra a diferença: antes, `data.` não mostrava nada. Depois, `data.refounds[0].` mostra `id`, `name`, `user`, etc.

## Sub-objetos inline

Para o campo `user`, o instrutor não importa um tipo completo de usuário. Ao invés disso, define inline apenas o que precisa:

```typescript
user: {
  name: string
}
```

Isso é pragmático: a API retorna um objeto user aninhado, mas para esse DTO específico, só o `name` importa. Não há necessidade de criar uma dependência com um `UserAPIResponse` completo.

## Aplicabilidade

O instrutor fecha dizendo: "você pode fazer isso com outras requisições também." O padrão é universal:
1. Inspecione o retorno da API
2. Crie um DTO com o shape exato
3. Use generics para tipar a chamada
4. Crie enums para campos com valores finitos