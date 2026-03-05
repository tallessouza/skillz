# Code Examples: Aplicativos Web

## Estrutura tipica de cada tipo de projeto

### Pagina web simples (webpage)

```html
<!-- index.html — unico arquivo necessario -->
<!DOCTYPE html>
<html>
<head>
  <title>Minha Pagina</title>
</head>
<body>
  <h1>Bem-vindo</h1>
  <p>Conteudo informativo aqui.</p>
</body>
</html>
```

**Requisitos**: apenas um servidor de arquivos estaticos (ou abrir no navegador).

### Site (website)

```
meu-site/
├── index.html          # Pagina inicial
├── sobre.html          # Pagina sobre
├── contato.html        # Formulario de contato
├── css/
│   └── style.css       # Estilos
└── js/
    └── main.js         # Interatividade basica (menu, animacoes)
```

**Requisitos**: hospedagem estatica (Vercel, Netlify, GitHub Pages). Sem backend.

### Aplicativo web (web application)

```
meu-app/
├── src/
│   ├── app/                    # Frontend (React/Next.js)
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── login/
│   │       └── page.tsx
│   ├── server/                 # Backend / API
│   │   ├── routes/
│   │   │   ├── users.ts
│   │   │   ├── auth.ts
│   │   │   └── courses.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── user.service.ts
│   │   └── database/
│   │       ├── schema.ts       # Definicao das tabelas
│   │       └── migrations/     # Alteracoes de schema
│   └── lib/
│       ├── auth.ts             # Autenticacao
│       └── db.ts               # Conexao com banco
├── docker-compose.yml          # Infraestrutura local
├── .env                        # Variaveis de ambiente
└── package.json
```

**Requisitos**: servidor (Node.js), banco de dados (PostgreSQL), autenticacao, deploy em infraestrutura que suporta processos persistentes.

## Exemplo: mesma feature em site vs aplicativo web

### "Lista de produtos" em um site

```html
<!-- Dados hardcoded no HTML -->
<ul>
  <li>Produto A - R$ 29,90</li>
  <li>Produto B - R$ 49,90</li>
  <li>Produto C - R$ 99,90</li>
</ul>
```

Para atualizar: editar o HTML manualmente e fazer deploy.

### "Lista de produtos" em um aplicativo web

```typescript
// API route — busca produtos do banco de dados
export async function GET() {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.active, true))
    .orderBy(productsTable.createdAt)

  return Response.json(products)
}
```

```tsx
// Frontend — renderiza dinamicamente
export default async function ProductsPage() {
  const products = await fetch('/api/products').then(r => r.json())

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name} - {formatCurrency(product.priceInCents)}
        </li>
      ))}
    </ul>
  )
}
```

Para atualizar: adicionar produto via painel admin (outro aplicativo web) — sem tocar no codigo.

## Indicadores na URL

```
www.skillz.com.br     → Site institucional (marketing, conteudo)
app.skillz.com.br     → Aplicativo web (plataforma de ensino)

www.google.com            → Pagina web (busca simples)
mail.google.com           → Aplicativo web (Gmail)
docs.google.com           → Aplicativo web (Google Docs)
```

O subdominio frequentemente revela a separacao arquitetural entre site e aplicativo.