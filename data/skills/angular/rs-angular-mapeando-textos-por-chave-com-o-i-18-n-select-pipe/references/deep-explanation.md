# Deep Explanation: I18nSelectPipe

## O que e o I18nSelectPipe

Apesar do nome remeter a internacionalizacao (i18n), o I18nSelectPipe do Angular serve para **qualquer mapeamento de string para texto**. Ele recebe um valor (string) e um objeto de mapping, retornando o texto correspondente a chave.

Sintaxe: `{{ valor | i18nSelect: mappingObject }}`

## Por que usar em vez de @switch/@if

O instrutor destaca que a principal vantagem e **economizar codigo no template**. Em vez de blocos condicionais verbosos, uma unica interpolacao resolve. Isso deixa o template mais limpo e declarativo.

## O papel da chave `other`

A chave `other` funciona como fallback. Se o valor passado nao existir como chave no objeto de mapping, o pipe retorna o texto de `other`. Sem essa chave, o resultado sera vazio.

Exemplo do instrutor: ao passar `"teste"` (que nao existe no mapping), o pipe retornou `"convidar"` — o valor de `other`.

## Quando NAO usar I18nSelectPipe

O instrutor faz um alerta importante: **se voce precisa do mesmo mapping em multiplos componentes, use um pipe customizado**.

O raciocinio e simples — se voce tem o mapping de status de pedido em 10 componentes, sao 10 copias do mesmo objeto. Qualquer mudanca exige alterar 10 arquivos. Um pipe customizado centraliza o mapping:

```typescript
@Pipe({ name: 'orderStatus', standalone: true })
export class OrderStatusPipe implements PipeTransform {
  private mapping = {
    created: 'Pedido criado',
    shipping: 'Saiu para entrega',
    delivered: 'Entregue',
  };

  transform(value: string): string {
    return this.mapping[value] ?? 'Status desconhecido';
  }
}
```

## Casos de uso mencionados pelo instrutor

1. **Genero em mensagens** — convidá-lo / convidá-la / convidar
2. **Status de pedido** — criado, saiu para entrega, entregue
3. **Status de usuario** — ativo, inativo

Todos seguem o mesmo padrao: uma chave string que determina qual texto exibir.

## Resumo da regra de ouro

- **Uso isolado (1 componente)** → I18nSelectPipe com mapping local
- **Uso repetido (2+ componentes)** → Pipe customizado encapsulando o mapping