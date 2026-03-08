---
name: rs-full-stack-encerramento-64
description: "Enforces Tailwind CSS full-app patterns when building multi-page applications with forms, file upload, routing by permissions, layouts, pagination, and search. Use when user asks to 'build a page with Tailwind', 'create a signup form', 'implement file upload UI', 'add pagination controls', or 'route by user role'. Make sure to use this skill whenever scaffolding complete Tailwind-based apps with auth flows, role-based routing, and CRUD interfaces. Not for backend logic, API implementation, or CSS-in-JS approaches."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: tailwind-css-app
  tags: [tailwind, css, forms, file-upload, routing, layouts, pagination, rbac]
---

# Tailwind CSS — Construção de Aplicação Completa

> Construa aplicações multi-página com Tailwind CSS combinando formulários, upload, roteamento por permissão, layouts reutilizáveis e paginação.

## Rules

1. **Estilize com classes utilitárias** — todo visual via classes Tailwind, porque é mais rápido e produtivo que CSS customizado para interfaces de aplicação
2. **Extraia componentes reutilizáveis** — inputs, botões e headers viram componentes, porque são usados em múltiplas páginas (signup, signin, solicitação)
3. **Use layouts para elementos comuns** — header e navegação ficam no layout da rota, porque evita duplicação entre páginas do mesmo grupo
4. **Proteja rotas no cliente** — redirecione usuários sem permissão antes de renderizar, porque previne acesso via URL direta
5. **Formulários com validação nativa** — use `type="email"`, `required` e eventos de submit, porque o browser valida antes do JS
6. **Agrupe rotas por papel** — employee, manager e auth são grupos separados com layouts próprios, porque cada papel tem interface e permissões distintas

## How to write

### Input reutilizável com Tailwind

```html
<input
  type="email"
  required
  class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
         focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  placeholder="seu@email.com"
/>
```

### Layout compartilhado entre rotas

```tsx
// layouts/ManagerLayout.tsx
export function ManagerLayout({ children }) {
  return (
    <div class="min-h-screen bg-gray-50">
      <header class="border-b bg-white px-6 py-4">
        <nav>/* navegação do manager */</nav>
      </header>
      <main class="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  )
}
```

### Upload de arquivo

```tsx
<label class="flex cursor-pointer items-center gap-2 rounded-md border border-dashed
              border-gray-300 px-4 py-3 text-sm text-gray-600 hover:border-gray-400">
  <input type="file" class="hidden" onChange={handleFileSelect} />
  Selecionar arquivo
</label>
```

### Proteção de rota por permissão

```tsx
// Redireciona se usuário tenta acessar via URL sem permissão
if (!userHasPermission) {
  navigate("/")
  return null
}
```

## Example

**Before (sem estrutura):**
```tsx
// Tudo numa página, sem layout, sem proteção
function App() {
  return (
    <div>
      <header>...</header>
      <form>
        <input style={{ border: '1px solid gray' }} />
        <button>Enviar</button>
      </form>
    </div>
  )
}
```

**After (com esta skill aplicada):**
```tsx
// Rotas agrupadas por papel, layout compartilhado, Tailwind classes
function ManagerRoutes() {
  if (!user.role === "manager") {
    navigate("/")
    return null
  }
  return (
    <ManagerLayout>
      <Routes>
        <Route path="/" element={<RefundList />} />
        <Route path="/refund/:id" element={<RefundDetail />} />
      </Routes>
    </ManagerLayout>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Múltiplas páginas com header igual | Extraia um layout com slot para children |
| Formulário com campos obrigatórios | Use `required` + `type` correto no HTML antes de validar em JS |
| Página acessível só por certo papel | Verifique permissão e redirecione antes de renderizar |
| Detalhe de item com dados read-only | Use `readOnly` nos inputs e desabilite o submit |
| Navegação entre páginas de fluxo | Passe parâmetros via rota (ex: `/refund/:id`) |
| Upload de arquivo | Input hidden + label estilizada com Tailwind |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Inline styles em app Tailwind | Classes utilitárias do Tailwind |
| Copiar header em cada página | Layout compartilhado por grupo de rotas |
| Permitir acesso a rota sem checar papel | Redirect no início do componente |
| Criar CSS custom para input/button | Componentizar com classes Tailwind |
| Navegar sem parâmetro para detalhe | Passar ID via rota `/refund/:id` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Rota protegida acessivel via URL direta | Verificacao de permissao ausente no componente | Adicionar guard com redirect no inicio do componente |
| Upload nao funciona visualmente | Input file visivel sem label estilizada | Usar input hidden + label com classes Tailwind |
| Layout duplicado entre paginas | Header/nav repetido em cada pagina | Extrair para layout compartilhado por grupo de rotas |
| Estilos inline misturados com Tailwind | Uso de `style={{}}` em app Tailwind | Converter para classes utilitarias do Tailwind |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre arquitetura de rotas por papel, layouts e padrões de formulário
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações