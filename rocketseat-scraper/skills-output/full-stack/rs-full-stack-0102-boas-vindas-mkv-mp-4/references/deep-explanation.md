# Deep Explanation: API de Reembolso — Arquitetura do Projeto

## Por que um sistema de reembolso?

O instrutor escolheu esse projeto porque reembolso é um domínio extremamente comum em empresas. Praticamente toda empresa de médio/grande porte tem algum sistema para cobrir custos que colaboradores têm no exercício do trabalho — deslocamento para clientes, hospedagem em viagens, compra de ferramentas, participação em eventos.

A ideia central é: **a empresa cobre o custo para que o colaborador não tenha que tirar do próprio bolso**. Isso cria um fluxo natural de:
1. Colaborador gasta → registra solicitação com comprovante
2. Gerente revisa → aprova ou rejeita
3. Sistema mantém histórico auditável

## Decisão: API-first com frontend separado

O instrutor deixa claro que o foco é 100% na API. O frontend é mostrado apenas como referência visual para entender como as rotas serão consumidas. Essa abordagem tem vantagens pedagógicas:

- **Foco na lógica e regras de negócio** — sem se perder em CSS ou estado de UI
- **Visualização do consumidor** — ver o frontend ajuda a entender POR QUE cada rota existe
- **Reutilizável** — a mesma API poderia servir um app mobile, outro frontend, ou integração com outros sistemas

## Autenticação: Sign-up vs Sign-in

O instrutor diferencia claramente:
- **Sign-up** (criar conta): nome, email, senha, confirmação de senha
- **Sign-in** (entrar): email, senha → retorna credencial

São rotas separadas com responsabilidades distintas. Sign-up cria o recurso (usuário), sign-in valida credenciais e gera token de acesso.

## Autorização: Employee vs Manager

A escolha de dois perfis (roles) é intencional:

**Employee (colaborador):**
- Pode criar solicitações de reembolso
- Só vê suas próprias solicitações
- Não tem acesso às solicitações de outros

**Manager (gerente):**
- Lista todas as solicitações
- Pesquisa por nome do colaborador
- Visualiza detalhes de qualquer solicitação
- Gerencia (aprova/rejeita) solicitações

O instrutor enfatiza: **"um perfil do tipo Employee não pode ver as solicitações de todo mundo, ele só pode fazer solicitações"**. Isso é autorização — garantir que o perfil correto tem acesso apenas às rotas e dados que lhe cabem.

## Paginação: Por que é essencial

O instrutor explica com clareza: se a tabela tem milhares de registros e você traz tudo "numa pancada só", a consulta fica pesada e lenta. A solução é paginação:

- Retornar N registros por vez (ex: 10)
- Calcular quantas páginas existem no total
- Conforme o usuário avança, carregar a próxima página

Isso é feito no back-end (server-side pagination), não no frontend. O frontend apenas solicita a página desejada.

## Upload de arquivos

O instrutor menciona que vai ensinar:
- Como guardar arquivo no back-end
- Como recuperar arquivo salvo
- Armazenamento em pasta dentro da aplicação

Comprovantes de reembolso (notas fiscais, recibos, etc.) são o caso de uso natural. Sem comprovante, não há como validar a solicitação.

## Adaptabilidade do projeto

O instrutor destaca: **"você pode adaptar essa ideia de projeto para qualquer outra coisa"**. O padrão arquitetural (auth + roles + CRUD paginado + upload) se aplica a inúmeros domínios:
- Sistema de chamados/tickets
- Gestão de despesas
- Aprovação de férias
- Controle de inventário

O que muda é o domínio; a estrutura da API permanece a mesma.