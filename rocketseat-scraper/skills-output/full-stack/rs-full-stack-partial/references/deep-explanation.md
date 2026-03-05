# Deep Explanation: TypeScript Partial

## O que e Partial

`Partial<T>` e um utility type nativo do TypeScript que transforma todas as propriedades de um tipo `T` em opcionais. Internamente, o TypeScript implementa assim:

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P]
}
```

Ele itera sobre todas as chaves de `T` e adiciona `?` a cada uma.

## Raciocinio do instrutor

O instrutor (Rodrigo) demonstra o problema de forma progressiva:

1. **Cria a interface User** com todos os campos obrigatorios — id, name, email
2. **Mostra que o TypeScript reclama** quando voce nao preenche todos os campos — isso e o comportamento correto para criacao
3. **Introduz o cenario de update** — ao atualizar, voce nao quer informar todos os campos de novo, so os que mudaram
4. **Mostra a solucao errada implicita** — tornar campos opcionais na interface original quebraria a criacao
5. **Apresenta Partial como solucao** — mantem a interface original intacta, cria versao derivada com tudo opcional

### Insight chave do instrutor

> "A interface User foi preservada, nada mudou. O que muda no update e que a gente usa Partial para dizer que quer sim utilizar o tipo User, mas com todas as propriedades opcionais."

A grande vantagem e **nao precisar criar uma nova tipagem, duplicar ou deixar todos os campos opcionais** — Partial reaproveita a tipagem existente.

## Propriedades opcionais com `?`

O instrutor tambem mostra que voce pode tornar uma propriedade individual opcional com `?`:

```typescript
interface User {
  id: number
  name: string
  email?: string  // opcional
}
```

Mas isso muda o contrato da interface para TODOS os usos. Partial resolve isso sem alterar o original.

## Quando Partial nao e suficiente

- **Campos que nunca devem ser atualizados** (como `id`): use `Partial<Omit<User, 'id'>>`
- **Campos que sao obrigatorios no update** (como `id` para identificar): combine tipos
- **Deep partial** (objetos aninhados): Partial so atua no primeiro nivel

## Edge cases

1. **Partial de tipo com propriedades ja opcionais**: elas continuam opcionais (nao muda nada)
2. **Partial de tipo vazio**: resulta em `{}`
3. **Partial com readonly**: as propriedades continuam readonly, so ficam opcionais
4. **Nested objects**: Partial NAO e recursivo — `Partial<{ address: { city: string } }>` torna `address` opcional, mas `city` dentro de `address` continua obrigatorio