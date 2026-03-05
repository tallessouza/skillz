# Code Examples: Criando Tipos Personalizados

## Exemplo base: Tipo Product

O exemplo central da aula — representar um produto:

```typescript
type Product = {
  id: number
  name: string
  price: number
  description: string
  available: boolean
}
```

## Variação: Produto com categorias

```typescript
type Category = {
  id: number
  name: string
}

type Product = {
  id: number
  name: string
  priceInCents: number
  category: Category
  tags: string[]
}
```

## Variação: Usando o tipo em funções

```typescript
type Product = {
  name: string
  priceInCents: number
  inStock: boolean
}

function displayProduct(product: Product): string {
  const priceFormatted = (product.priceInCents / 100).toFixed(2)
  return `${product.name} - R$ ${priceFormatted}`
}

function filterAvailable(products: Product[]): Product[] {
  return products.filter((product) => product.inStock)
}
```

## Variação: Array de tipos customizados

```typescript
type Student = {
  name: string
  email: string
  grade: number
}

const students: Student[] = [
  { name: "Ana", email: "ana@email.com", grade: 9.5 },
  { name: "Carlos", email: "carlos@email.com", grade: 7.8 },
]
```

## Variação: Tipos aninhados (composição)

```typescript
type Address = {
  street: string
  city: string
  state: string
  zipCode: string
}

type Company = {
  name: string
  cnpj: string
  address: Address
  employeeCount: number
}

const company: Company = {
  name: "Tech Corp",
  cnpj: "12.345.678/0001-90",
  address: {
    street: "Rua Principal, 100",
    city: "São Paulo",
    state: "SP",
    zipCode: "01000-000",
  },
  employeeCount: 50,
}
```

## Contraste: Sem tipo vs com tipo

### Sem tipo customizado (frágil)
```typescript
function createOrder(
  customerName: string,
  customerEmail: string,
  productName: string,
  productPrice: number,
  quantity: number
) {
  // Muitos parâmetros soltos, fácil errar a ordem
}
```

### Com tipo customizado (robusto)
```typescript
type Customer = {
  name: string
  email: string
}

type OrderItem = {
  productName: string
  priceInCents: number
  quantity: number
}

function createOrder(customer: Customer, item: OrderItem) {
  // Parâmetros agrupados por significado, impossível confundir
}
```