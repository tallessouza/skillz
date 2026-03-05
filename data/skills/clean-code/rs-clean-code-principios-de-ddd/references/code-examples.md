# Code Examples: Princípios de DDD

## Exemplo 1: Identificando entidades pela fala do domain expert

A técnica central do DDD é extrair entidades e casos de uso da linguagem natural dos especialistas.

### Conversa simulada com domain expert de faturamento:

> "Nosso dia a dia é pegar as **ordens de pedido** e **emitir** **notas fiscais**."

### Extração:

```
Substantivos (entidades candidatas):
  - Ordens de pedido → OrdemDePedido
  - Notas fiscais   → NotaFiscal

Verbos (casos de uso candidatos):
  - Emitir (notas fiscais a partir de ordens) → EmitirNotaFiscal
```

### Traduzido para código:

```typescript
// Entidades do subdomínio de Faturamento
class OrdemDePedido {
  readonly id: string
  readonly itens: ItemPedido[]
  readonly valorTotal: number
}

class NotaFiscal {
  readonly id: string
  readonly numero: string
  readonly ordemDePedidoId: string
  readonly valorTotal: number
  readonly emitidaEm: Date
}

// Caso de uso
class EmitirNotaFiscal {
  execute(ordemDePedido: OrdemDePedido): NotaFiscal {
    // validar ordem
    // calcular impostos
    // gerar nota fiscal
    // retornar nota emitida
  }
}
```

## Exemplo 2: Mesma pessoa, nomes diferentes por subdomínio

Este é o exemplo mais importante da aula. No banco de dados pode existir uma única tabela `users`, mas no código cada subdomínio conhece essa pessoa por um nome diferente.

### Subdomínio: Compras

```typescript
class Comprador {
  readonly id: string
  readonly nome: string
  readonly email: string

  // Métodos relevantes para compra
  adicionarAoCarrinho(produto: Produto): void {}
  finalizarCompra(): Pedido {}
}
```

### Subdomínio: Logística

```typescript
class Destinatario {
  readonly id: string
  readonly nome: string
  readonly enderecoEntrega: Endereco
  readonly telefoneContato: string

  // Métodos relevantes para entrega
  confirmarRecebimento(): void {}
}
```

### Subdomínio: Faturamento

```typescript
class ContribuinteFiscal {
  readonly id: string
  readonly cpfCnpj: string
  readonly razaoSocial?: string
  readonly inscricaoEstadual?: string

  // Métodos relevantes para emissão fiscal
  validarDadosFiscais(): boolean {}
}
```

### Por que isso importa

```typescript
// RUIM — quem é "user" neste contexto?
function processarEntrega(user: User, pedidoId: string) {
  // user.address? user.shippingAddress? user.billingAddress?
}

// BOM — o nome revela o papel
function processarEntrega(destinatario: Destinatario, pedidoId: string) {
  // destinatario.enderecoEntrega — óbvio e inequívoco
}
```

## Exemplo 3: Mapeamento completo de um e-commerce

### Domínio: E-commerce

### Subdomínios e suas entidades:

```
Subdomínio: Catálogo
  Entidades: Produto, Categoria, Avaliacao
  Casos de uso: CadastrarProduto, AvaliarProduto

Subdomínio: Compras
  Entidades: Comprador, Carrinho, Pedido, ItemPedido
  Casos de uso: AdicionarAoCarrinho, RealizarPedido

Subdomínio: Pagamento
  Entidades: Pagante, Transacao, MetodoPagamento
  Casos de uso: ProcessarPagamento, EstornarPagamento

Subdomínio: Faturamento
  Entidades: ContribuinteFiscal, NotaFiscal, OrdemDePedido
  Casos de uso: EmitirNotaFiscal, CancelarNotaFiscal

Subdomínio: Logística
  Entidades: Destinatario, Encomenda, Rastreio
  Casos de uso: DespacharEncomenda, RastrearEncomenda

Subdomínio: Estoque
  Entidades: ItemEstoque, Deposito, MovimentacaoEstoque
  Casos de uso: DarEntradaEstoque, DarBaixaEstoque
```

Note como a mesma pessoa física aparece como `Comprador`, `Pagante`, `ContribuinteFiscal` e `Destinatario` dependendo do subdomínio. Cada nome carrega consigo apenas os atributos e comportamentos relevantes para aquele contexto.