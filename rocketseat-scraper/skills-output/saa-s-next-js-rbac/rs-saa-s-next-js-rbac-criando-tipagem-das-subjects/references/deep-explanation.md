# Deep Explanation: Tipagem de Subjects no CASL

## Por que subjects tipados existem

O CASL por padrao nao associa acoes a entidades. Quando voce define `Actions` e `Subjects` como unions separadas, qualquer combinacao compila — incluindo absurdos como `can('invite', 'Project')`. Convidar um projeto nao faz sentido semanticamente, mas o TypeScript nao reclama.

A solucao do CASL (documentada em "Advanced TypeScript Support > Safer Permissions Inference") e usar **tuplas**: arrays de duas posicoes onde a primeira e a union de acoes validas e a segunda e o nome da entidade. Isso cria um vinculo direto entre acao e entidade no sistema de tipos.

## Como o CASL infere tipos nas tuplas

Quando voce escreve:

```typescript
can('create', 'Project')
```

O CASL usa o **segundo parametro** (a subject) para determinar quais acoes sao validas no primeiro parametro. Isso significa que a inferencia depende da ordem de preenchimento:

1. Se voce digita o primeiro parametro primeiro, o autocomplete mostra TODAS as acoes de TODOS os subjects (porque ainda nao sabe qual subject)
2. Ao preencher o segundo parametro, o TypeScript valida retroativamente se a combinacao e valida

### Observacao do instrutor sobre a ordem

O instrutor observou que idealmente a ordem deveria ser invertida (subject primeiro, acao depois), porque ao escrever a acao primeiro, o autocomplete mostra todas as opcoes de todos os subjects. Depois de escolher a acao e digitar a subject, podem aparecer subjects onde aquela acao nao existe — e ai o TypeScript aponta erro. Isso e um "bug de UX" do CASL, nao um bug funcional: a validacao final sempre funciona, mas a experiencia de escrita nao e ideal.

## Organizacao em pasta `subjects/`

Cada entidade ganha seu proprio arquivo para:
- **Isolamento**: mudar acoes de `User` nao afeta `Project`
- **Legibilidade**: e obvio quais acoes cada entidade suporta
- **Escalabilidade**: adicionar `Organization`, `Billing`, etc. e criar mais um arquivo

## O papel do `manage` e `all`

- `manage` e um coringa de **acao** — significa "todas as acoes"
- `all` e um coringa de **subject** — significa "todas as entidades"
- `['manage', 'all']` e declarado separadamente porque `all` nao pertence a nenhuma entidade especifica

## Armadilha: ordem de definicao

O instrutor mencionou que a ordem de definicao das entidades e acoes pode causar bugs. Isso acontece porque o TypeScript resolve unions na ordem de declaracao para fins de autocomplete. Nao afeta a corretude do tipo, mas pode confundir durante o desenvolvimento se subjects forem declarados em ordem inesperada.