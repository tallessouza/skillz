# Code Examples: Codigo em Ingles

## Exemplo central da aula: loadPessoa

O exemplo que Diego usa para ilustrar o problema:

```typescript
// ERRADO — mistura idiomas, inacessivel
function loadPessoa() { ... }
```

Diego diz que isso da "tres tipos de ruim":
1. O leitor de tela nao consegue ler
2. `load` e ingles, `Pessoa` e portugues — inconsistente
3. Qualquer dev internacional nao entende

```typescript
// CORRETO — totalmente em ingles
function loadPerson() { ... }
```

## Variacoes do mesmo padrao

### Funcoes CRUD

```typescript
// ERRADO
function criarUsuario(dados) { ... }
function buscarPedido(pedidoId) { ... }
function atualizarEstoque(produtoId, quantidade) { ... }
function deletarComentario(comentarioId) { ... }

// CORRETO
function createUser(data) { ... }
function findOrder(orderId) { ... }
function updateStock(productId, quantity) { ... }
function deleteComment(commentId) { ... }
```

### Variaveis de dominio brasileiro

```typescript
// ERRADO
const cpfValido = validarCpf(documento)
const boletos = listarBoletosPendentes(clienteId)
const notaFiscal = gerarNotaFiscal(pedido)

// CORRETO — termos brasileiros como nomes proprios
const isValidCpf = validateCpf(document)
const pendingBoletos = listPendingBoletos(clientId)
const invoice = generateInvoice(order)
// Nota: CPF, CNPJ, boleto sao termos proprios sem traducao direta
```

### Tabelas do banco de dados

```sql
-- ERRADO
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(id),
  valor_total DECIMAL(10,2),
  data_criacao TIMESTAMP DEFAULT NOW()
);

-- CORRETO
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Nomes de arquivos e modulos

```
# ERRADO
src/
  servicos/
    servicoUsuario.ts
    servicoPagamento.ts
  modelos/
    modeloPedido.ts

# CORRETO
src/
  services/
    userService.ts
    paymentService.ts
  models/
    orderModel.ts
```

### Enums e constantes

```typescript
// ERRADO
enum StatusPedido {
  PENDENTE = 'pendente',
  APROVADO = 'aprovado',
  CANCELADO = 'cancelado'
}

// CORRETO
enum OrderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  CANCELED = 'canceled'
}
```