# Deep Explanation: Abrindo Solicitação — Navegação para Detalhes

## Por que passar o ID na rota e não na query string?

O instrutor mostra que ao clicar num item do dashboard, o link já passa o ID como parte da URL: `/refund/${item.id}`. Isso segue a convenção REST onde recursos são identificados por segmentos de path (`/resources/:id`), não por query strings (`/resources?id=123`).

Vantagens:
- URLs semânticas e bookmarkáveis
- React Router reconhece nativamente como `useParams()`
- Navegação declarativa via `<Link>` ao invés de imperativa via `onClick`

## A sacada do reuso de página entre roles

O instrutor destaca que a página de refund existe tanto na rota de employee quanto na de manager. Isso é intencional — a estrutura de exibição é a mesma, o que muda é:

1. **Employee sem ID**: formulário de criação, com upload e botão "Enviar"
2. **Manager com ID**: visualização de dados pré-carregados, com "Abrir comprovante" e botão "Voltar"

Em vez de criar duas páginas (`EmployeeRefund` e `ManagerRefund`), o instrutor reutiliza uma única página e condiciona o comportamento pela **presença do ID nos params**, não pelo role do usuário.

Isso é elegante porque:
- Elimina duplicação de código
- A lógica é autocontida (o componente sabe o que fazer olhando seus próprios params)
- Não precisa de contexto externo (auth, role) para decidir a UI

## O padrão if (id) no submit

O instrutor explica um `if` dentro do `handleSubmit` que ele havia mencionado anteriormente que explicaria depois. A lógica é:

```
Se tem ID → o usuário está visualizando um registro existente → voltar (navigate(-1))
Se não tem ID → o usuário está criando um novo registro → seguir com a criação
```

Esse padrão transforma o botão de submit em um botão dual-purpose:
- Sem ID: funciona como "Enviar" (submit real)
- Com ID: funciona como "Voltar" (navegação)

## navigate(-1) ao invés de rota hardcoded

O `navigate(-1)` é equivalente a `history.back()`. O instrutor usa isso porque o manager pode ter vindo de diferentes páginas (dashboard, lista filtrada, busca), e hardcodar `/dashboard` quebraria a experiência em alguns cenários.

## Fluxo completo

1. Dashboard lista solicitações
2. Cada item é um `<Link to={/refund/${item.id}}>` 
3. Página de refund recupera `id` via `useParams()`
4. Se `id` existe: modo visualização (dados pré-carregados, botão voltar, abrir comprovante)
5. Se `id` não existe: modo criação (formulário vazio, upload, botão enviar)
6. Submit com `id`: `navigate(-1)` volta para onde veio
7. Submit sem `id`: executa criação da solicitação

## Registro da mesma página em múltiplas rotas

Para que a página funcione tanto para employee quanto para manager, ela é registrada em ambos os grupos de rotas no React Router:

```typescript
// Rotas de employee
{ path: '/employee/refund/:id?', element: <Refund /> }

// Rotas de manager  
{ path: '/manager/refund/:id', element: <Refund /> }
```

O `:id?` (opcional) no employee permite tanto `/employee/refund` (criação) quanto `/employee/refund/123` (visualização). No manager, o ID é obrigatório porque manager sempre visualiza.