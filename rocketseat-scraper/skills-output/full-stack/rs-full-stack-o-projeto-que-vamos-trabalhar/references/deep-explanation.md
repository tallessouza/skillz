# Deep Explanation: Estrutura de Projeto Frontend para Integração com API

## Por que visual primeiro, funcionalidade depois?

O instrutor apresenta uma abordagem clara: o projeto DiverFound (aplicação de reembolsos) começa **apenas com o visual**. Nenhuma funcionalidade está implementada — sem chamadas a API, sem autenticação real, sem persistência de dados.

Essa não é uma decisão casual. É uma estratégia deliberada:

1. **Validação de fluxo** — Ao ter todas as páginas navegáveis, é possível percorrer o fluxo completo do usuário (login → dashboard → nova solicitação → confirmação) sem depender de backend. Isso permite detectar problemas de UX e navegação cedo.

2. **Paralelização de trabalho** — O frontend pode avançar independentemente do backend. Quando a API estiver pronta, a integração é uma camada adicionada sobre algo que já funciona visualmente.

3. **Menor complexidade por fase** — Ao separar "fazer parecer certo" de "fazer funcionar", cada fase tem escopo reduzido e é mais fácil de debugar.

## A simulação de perfil como técnica

O instrutor mostra que no `index.tsx` das rotas, há uma simulação de perfil de usuário. Ao trocar o valor para `"employee"`, a página muda. Ao remover o perfil (null), volta para a tela de login.

Essa técnica é poderosa porque:

- **Permite testar todas as rotas** sem implementar autenticação
- **Mostra o comportamento esperado** para cada tipo de usuário
- **Facilita o desenvolvimento** de cada "caminho" da aplicação independentemente
- **Será substituída** pela autenticação real quando a API for integrada

A chave é que essa simulação está **centralizada no router**, não espalhada por vários componentes. Quando a auth real for implementada, há um único ponto para trocar.

## Estrutura de rotas em três grupos

O projeto organiza rotas em três categorias:

1. **Rotas públicas** — SignIn, SignUp (acessíveis sem autenticação)
2. **Rotas autenticadas (app)** — Dashboard, Confirmação (requerem perfil)
3. **Rota de fallback** — NotFound (qualquer URL inválida)

Essa separação antecipa a implementação de guards de autenticação. Quando a auth real existir, basta adicionar um wrapper de proteção nas rotas autenticadas.

## Páginas como componentes visuais puros

Cada página no projeto é um componente que renderiza apenas visual:

- **SignIn** — Formulário de login (sem submit funcional)
- **SignUp** — Formulário de cadastro (sem submit funcional)
- **Dashboard** — Lista de solicitações (com dados estáticos)
- **Confirmation** — Mensagem de confirmação de envio
- **NotFound** — Página de erro com link para voltar ao início

Os estados visuais já existem (loading, empty, etc.), mas não são acionados por lógica real. Isso significa que quando a funcionalidade for implementada, os estados visuais já estarão prontos.

## O ponto de partida como contrato

O instrutor enfatiza: "o ponto de partida do nosso projeto é apenas o visual". Isso estabelece um contrato claro:

- **O que está pronto:** Toda a estrutura visual, navegação, componentes, páginas
- **O que será feito:** Funcionalidades, conexão com API, integração front-back
- **O que não muda:** A estrutura de pastas, os nomes dos componentes, o fluxo de navegação

Esse contrato é valioso porque qualquer pessoa que entrar no projeto sabe exatamente o estado atual e o que falta.

## Aplicação DiverFound — Contexto

A aplicação é um sistema de reembolsos (Refund) com:

- Autenticação (login/cadastro)
- Dashboard com listagem de solicitações de reembolso
- Criação de novas solicitações
- Confirmação de envio
- Dois perfis: administrador e funcionário
- Tratamento de rotas inexistentes