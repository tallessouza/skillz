# Deep Explanation: Autenticação vs Autorização

## Filosofia do instrutor: aprender separado antes de juntar

O ponto central desta etapa do curso é a **separação deliberada de conceitos**. O instrutor escolheu ensinar autenticação e autorização **sem banco de dados** para que o aluno foque exclusivamente na lógica de acesso, sem se distrair com queries, migrations ou configuração de ORM.

Essa abordagem pedagógica reflete um princípio importante de engenharia: **entender cada camada isoladamente antes de integrar**. Quando você implementa auth direto com banco de dados, é fácil confundir "o usuário existe no banco" com "o usuário está autenticado" com "o usuário tem permissão".

## As três perguntas de acesso

Toda requisição protegida passa por três perguntas:

1. **Quem é você?** → Autenticação (credenciais válidas?)
2. **Você é quem diz ser?** → Validação de token (JWT válido, não expirado?)
3. **Você pode fazer isso?** → Autorização (role/permissão permite?)

## JWT como ponte entre autenticação e autorização

O JWT carrega informações do usuário (payload) que são usadas tanto para confirmar identidade quanto para verificar permissões. Ele é o **artefato que conecta** as duas camadas:

- Na autenticação: JWT é **gerado** após credenciais válidas
- Na autorização: JWT é **lido** para extrair roles e verificar acesso

## Roles como implementação de autorização

O conceito de "rules" (roles/papéis) mencionado pelo instrutor é a forma mais comum de implementar autorização:

- Cada usuário tem um ou mais papéis
- Cada rota/recurso exige um ou mais papéis
- O middleware compara os papéis do usuário com os exigidos

## Próximos passos mencionados

O instrutor antecipa que esses conceitos serão integrados com:
- Banco de dados (persistência de usuários e roles)
- Aplicação completa (todas as peças juntas)
- Novos assuntos Node que complementam auth

Isso reforça que autenticação e autorização são **camadas fundamentais** que aparecem em praticamente todo projeto real.