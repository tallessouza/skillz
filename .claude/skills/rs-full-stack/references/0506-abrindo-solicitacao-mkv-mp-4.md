---
name: rs-full-stack-0506-abrindo-solicitacao
description: "Enforces detail view navigation patterns when implementing click-to-view flows with ID passing via URL params, role-based UI rendering, and conditional navigation behavior. Use when user asks to 'open a detail page', 'pass ID to route', 'navigate to item', 'view specific record', or 'implement back button logic'. Applies patterns: route params for entity ID, shared pages across roles with conditional rendering, navigate(-1) for back behavior. Make sure to use this skill whenever building list-to-detail navigation flows. Not for API data fetching, form submission, or list pagination."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [react, routing, useParams, navigation, conditional-rendering]
---

# Abrindo Solicitação — Navegação para Detalhes com ID

> Ao navegar para uma página de detalhes, passe o ID via rota e use params para recuperá-lo, adaptando a UI conforme o papel do usuário.

## Rules

1. **Passe o ID como segmento da rota** — `link="/refund/${item.id}"` não query strings, porque URLs limpas são bookmarkáveis e semânticas
2. **Recupere o ID via useParams** — `const { id } = useParams()` porque é o mecanismo padrão do React Router para parâmetros de rota
3. **Reutilize páginas entre roles** — a mesma página de detalhes serve para employee e manager, porque a estrutura de exibição é idêntica e só o comportamento muda
4. **Condicione ações pelo contexto, não pela role** — verifique `if (id)` para decidir comportamento, porque a presença do ID indica visualização vs criação
5. **Use navigate(-1) para voltar** — não hardcode a rota anterior, porque o usuário pode ter vindo de diferentes origens

## How to write

### Link para detalhes na listagem

```typescript
// No dashboard, cada item linka para a página de detalhes com seu ID
<Link to={`/refund/${item.id}`}>
  <RefundItem data={item} />
</Link>
```

### Recuperando o ID na página de detalhes

```typescript
// Na página de refund, recupere o ID dos params
const { id } = useParams()
```

### Comportamento condicional no submit

```typescript
function handleSubmit() {
  if (id) {
    // Visualização: usuário está vendo um registro existente, voltar
    navigate(-1)
    return
  }

  // Criação: seguir com nova solicitação
  createRefund(formData)
}
```

### Renderização condicional por contexto

```typescript
// Se tem ID, mostra botão "Abrir comprovante" ao invés de upload
{id ? (
  <Button onClick={openAttachment}>Abrir comprovante</Button>
) : (
  <UploadComponent />
)}

// Botão muda de "Enviar" para "Voltar" quando visualizando
<Button type="submit">
  {id ? "Voltar" : "Enviar"}
</Button>
```

## Example

**Before (rotas separadas por role, código duplicado):**
```typescript
// pages/employee/refund.tsx
function EmployeeRefund() { /* form de criação */ }

// pages/manager/refund.tsx
function ManagerRefund() { /* visualização */ }
```

**After (página compartilhada com comportamento condicional):**
```typescript
// pages/refund.tsx — usada em ambas as rotas
function Refund() {
  const { id } = useParams()

  function handleSubmit() {
    if (id) {
      navigate(-1)
      return
    }
    createRefund(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {id ? <OpenAttachmentButton /> : <UploadComponent />}
      <Button>{id ? "Voltar" : "Enviar"}</Button>
    </form>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Lista com itens clicáveis | Use `Link` com ID no path, não onClick + navigate |
| Mesma estrutura para criar e visualizar | Compartilhe a página, condicione pelo ID nos params |
| Botão de voltar | Use `navigate(-1)`, não hardcode a rota |
| Dados pré-carregados em visualização | Desabilite campos ou use modo read-only |
| Página usada em múltiplas rotas | Registre a mesma página em ambas as rotas no router |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| `?id=123` na query string para detalhes | `/refund/123` como segmento de rota |
| Duplicar página para cada role | Compartilhar página com renderização condicional |
| `navigate('/dashboard')` no voltar | `navigate(-1)` para voltar à origem real |
| Checar `user.role === 'manager'` para UI | Checar `if (id)` — o contexto define o comportamento |
| Criar componentes separados para exibir vs editar | Um componente com modo condicional |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre reuso de páginas entre roles e padrão de navegação condicional
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações de roteamento

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `useParams` retorna `undefined` | Rota nao tem parametro dinamico definido | Defina a rota como `/refund/:id` no router |
| Pagina de detalhe mostra formulario de criacao | Condicional baseada em `id` nao implementada | Verifique `if (id)` para alternar entre visualizacao e criacao |
| `navigate(-1)` nao volta para a pagina anterior | Historico de navegacao vazio | Use `navigate('/dashboard')` como fallback |
| Pagina duplicada para cada role | Codigo copiado entre roles | Compartilhe a pagina e use renderizacao condicional |