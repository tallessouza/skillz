# Deep Explanation: Classe Base de Entidades

## Por que criar uma pasta `core/`

O instrutor cria `src/core/` para compartilhar codigo entre multiplos dominios da aplicacao. A pasta `core/entities/` contem tudo que e comum entre entidades — comecando pela classe `Entity` base. Essa separacao evita que codigo compartilhado fique espalhado ou duplicado.

## O problema da duplicacao

Antes da classe base, toda entidade repete:
1. Declaracao de `id: string`
2. Logica condicional: `this.id = id ?? randomUUID()`
3. Atribuicao manual de cada prop: `this.content = props.content`

Com 4-5 entidades, isso ja gera manutencao desnecessaria. Com 20+, vira um problema real.

## Private vs Protected vs Public

O instrutor enfatiza a importancia de **nao expor tudo como public**:

- **`private _id`**: Ninguem fora da classe base pode alterar. O ID de uma entidade e imutavel apos criacao — isso e um principio fundamental de DDD.
- **`protected props`**: Acessivel pela classe filha (para criar getters), mas invisivel para codigo externo. O `protected` e o meio-termo perfeito.
- **`public`**: Evitado porque permite alteracao direta sem controle.

A analogia e: getters sao "portas de entrada controladas". Voce decide exatamente o que pode ser lido e o que pode ser alterado (via setters).

## O truque do Generic

O `Entity<Props>` usa TypeScript generics para que cada entidade filha informe o formato das suas propriedades. Sem o generic, `this.props` seria `any` e o autocompletar nao funcionaria.

```typescript
// Sem generic — perdemos type safety
protected props: any // this.props.qualquerCoisa nao da erro

// Com generic — TypeScript valida tudo
export class Answer extends Entity<AnswerProps> {
  // this.props.content ✓ (autocompletar funciona)
  // this.props.xyz ✗ (erro de compilacao)
}
```

## Eliminacao de construtores

Ponto sutil: quando o construtor de uma classe filha so chama `super(props, id)`, ele e redundante. TypeScript herda o construtor automaticamente. O instrutor mostra que apos a refatoracao, as entidades ficam com **zero construtor** — apenas interface de props e getters.

## Orientacao a objetos no JavaScript

O instrutor menciona que nao quer entrar na discussao de "JavaScript e orientado a objeto ou nao", mas reconhece que conceitos como heranca, encapsulamento (private/protected/public), e getters/setters sao fundamentais para DDD em TypeScript. E programacao orientada a objeto na pratica.