# Code Examples: Cart AI — Projeto Marketplace Inteligente

## Nota

Esta aula e de apresentacao do projeto — nao contem codigo implementado. Os exemplos abaixo sao inferidos da arquitetura descrita e servem como referencia para a implementacao.

## Estrutura de Entidades (Schema Conceitual)

```typescript
// Entidades principais do sistema

interface Loja {
  id: string
  nome: string
  produtos: Produto[]
}

interface Produto {
  id: string
  nome: string
  preco: number
  lojaId: string
}

interface Carrinho {
  id: string
  usuarioId: string
  items: CartItem[]
  criadoViaAgente: boolean
}

interface CartItem {
  id: string
  carrinhoId: string
  produtoId: string
  quantidade: number
}

interface ChatSession {
  id: string
  usuarioId: string
  mensagens: Mensagem[]
}

interface Mensagem {
  id: string
  chatSessionId: string
  role: 'user' | 'assistant'
  conteudo: string
  acaoDoAgente?: AcaoDoAgente
}

interface AcaoDoAgente {
  id: string
  mensagemId: string
  tipo: 'criar_carrinho' | string
  carrinhoId?: string
}

interface Receita {
  id: string
  usuarioId: string
  nomeArquivo: string
  conteudo: string
  embedding?: number[]
}
```

## Fluxo de Comparacao de Carrinhos (Conceitual)

```typescript
// O agente monta carrinhos por loja e rankeia
interface CarrinhoComparacao {
  lojaId: string
  lojaNome: string
  items: CartItem[]
  precoTotal: number
  produtosFaltando: string[]
  completo: boolean
}

// Resultado apresentado ao usuario
interface ResultadoComparacao {
  receita: string
  carrinhosPorLoja: CarrinhoComparacao[] // ordenado por preco
}
```

## Estrutura do Projeto Next.js (Esperada)

```
src/
├── app/
│   ├── page.tsx              # Chat principal
│   ├── cart/
│   │   └── page.tsx          # Tela de carrinho
│   ├── recipes/
│   │   └── page.tsx          # Gerenciamento de receitas
│   └── api/
│       ├── chat/             # Endpoint do agente
│       ├── cart/             # CRUD de carrinhos
│       ├── products/         # Busca de produtos
│       └── recipes/          # Upload/listagem de receitas
├── lib/
│   ├── db.ts                 # Conexao PostgreSQL
│   ├── openai.ts             # Cliente OpenAI
│   └── embeddings.ts         # Logica de embeddings
```