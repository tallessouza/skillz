# Deep Explanation: Getters & Setters em Entidades DDD

## Por que getters e setters existem?

O instrutor enfatiza que muita gente tem dificuldade em entender por que esses metodos existem e por que nao acessar diretamente a propriedade. A resposta: **getters e setters sao portas de entrada e saida da entidade.** Essa metafora e central — a entidade e como uma fortaleza, e voce controla quem entra e quem sai.

### Tres funcoes dos accessors:

1. **Protecao** — nao dar acesso a modificacao de propriedades que nao devem mudar
2. **Validacao** — verificar regras de negocio antes de aceitar um novo valor
3. **Manipulacao/formatacao** — transformar dados antes de expor para fora da classe

## O principio do "comece sem setters"

A recomendacao do instrutor e clara: **nao crie nenhum setter no comeco da classe.** So crie conforme for precisando. O raciocinio:

> "Nem toda informacao da classe a gente quer que seja modificavel. Faz sentido em algum momento o autor dessa resposta ser alterado? Faz sentido a data de criacao ser alterada? Nao faz."

Isso e uma aplicacao direta do principio de menor privilegio no design de entidades. Voce comeca fechado e abre conforme necessidade, nunca o contrario.

## Propriedades computadas — o poder oculto dos getters

Um dos insights mais importantes da aula: getters permitem criar "propriedades" que nao existem no objeto de props. O instrutor mostra dois exemplos:

### `isNew` — propriedade temporal

```typescript
get isNew(): boolean {
  return dayjs().diff(this.createdAt, 'days') <= 3
}
```

Essa propriedade nao esta mapeada em `QuestionProps`, mas pode ser acessada como `question.isNew`. E uma propriedade derivada — calculada em tempo real a partir de dados existentes.

### `excerpt` — propriedade formatada

```typescript
get excerpt() {
  return this.content.substring(0, 120).trimEnd().concat('...')
}
```

O excerpt e util para mostrar um preview da resposta na interface. E um exemplo de como getters podem formatar dados antes de expor.

## O padrao `touch()` — updatedAt automatico

O instrutor identifica um problema sutil: `updatedAt` precisa ser atualizado, mas **nao deve ser exposto como setter publico**. A pergunta chave:

> "Faz sentido a pessoa pegar e fazer `answer.updatedAt = new Date()`? Nao, ne?"

A solucao e o metodo privado `touch()`:

```typescript
private touch() {
  this.props.updatedAt = new Date()
}
```

Todo setter que modifica dados chama `this.touch()` no final. Isso garante que `updatedAt` e sempre consistente sem depender do codigo externo.

## Efeitos colaterais em setters — o caso do Slug

O exemplo mais sofisticado da aula: quando o titulo muda, o slug deve mudar junto.

```typescript
set title(title: string) {
  this.props.title = title
  this.props.slug = Slug.createFromText(title)
  this.touch()
}
```

O instrutor destaca: "Eu nao conseguiria fazer isso caso essa propriedade title fosse simplesmente uma propriedade publica." E exatamente isso que justifica a existencia de setters — comportamento que seria impossivel com propriedades publicas.

Alem disso, o slug se torna opcional na criacao:

```typescript
// No constructor:
this.props.slug = props.slug ?? Slug.createFromText(props.title)
```

Isso significa que o sistema gera o slug automaticamente se nao fornecido, mas permite override quando necessario.

## Validacao dentro de setters

O instrutor mostra um exemplo conceitual de validacao (que ele depois remove por nao fazer sentido no dominio):

```typescript
set content(content: string) {
  if (content.length > 2400) {
    throw new Error('Invalid content length')
  }
  this.props.content = content
}
```

A mensagem e: setters sao o lugar certo para validacoes conectadas a regras de negocio. Mesmo que esse exemplo especifico tenha sido removido, o padrao e claro.

## Propriedades que nao devem ter getter

O instrutor menciona brevemente: se tiver algum campo que voce nao quer expor para fora da classe, simplesmente nao crie o getter. Pode ser um campo interno usado apenas para logica da entidade.

## Setter com parametro opcional — problema do TypeScript

O instrutor encontra um problema pratico: `bestAnswerId` pode ser `undefined`, mas setters no TypeScript nao podem ter parametro opcional. A solucao e usar `UniqueEntityID | undefined` como tipo do parametro sem marcar como opcional.