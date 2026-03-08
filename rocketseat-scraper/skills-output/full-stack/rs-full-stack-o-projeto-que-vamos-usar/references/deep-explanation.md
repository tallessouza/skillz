# Deep Explanation: Verificação de Projeto Antes de Atualização

## Por que verificar antes de atualizar?

O instrutor enfatiza um princípio fundamental: **antes de mudar qualquer coisa, garanta que o estado atual funciona**. Isso cria um baseline confiável. Se algo quebrar após a atualização de dependências, você sabe que o problema veio da atualização — não de algo que já estava quebrado.

## Organização de projetos

O instrutor menciona que mantém uma pasta "projetos anteriores" onde organiza todos os projetos desenvolvidos ao longo do curso. Essa prática de organização é importante porque:

1. Permite retomar qualquer projeto facilmente
2. Cada projeto fica no estado exato em que foi deixado
3. Facilita comparações entre versões

## Stack do projeto RocketLog

O RocketLog é uma **API de entrega** com a seguinte stack:

- **Runtime:** Node.js
- **Banco de dados:** PostgreSQL (rodando em container Docker)
- **ORM:** Prisma
- **Variáveis de ambiente:** arquivo `.env`
- **Scripts configurados:** `dev`, `build`, `start`

O projeto já passou por deploy anteriormente, o que significa que tem pasta `build/` e scripts de produção configurados.

## Container Docker como dependência

O instrutor mostra que o banco de dados PostgreSQL roda dentro de um container Docker. Isso é uma dependência de infraestrutura — sem o container rodando, a API não funciona. Por isso a verificação começa pelo Docker:

1. `docker image ls` — confirma que a imagem do Postgres existe localmente
2. `docker ps` — confirma que o container está em execução (não apenas criado)

## Ferramentas de verificação

### BKeeper / Cliente SQL
O instrutor usa o BKeeper para verificar a conexão direta com o banco. Os dados de conexão são os padrões do container Docker local:
- Host: localhost
- User/Password: postgres/postgres
- Database: rocketlog

### Prisma Studio
Após testar via API, o instrutor usa `npx prisma studio` para visualizar os dados diretamente no banco, confirmando que a persistência funciona end-to-end.

### Insomnia
O projeto inclui um arquivo `insomnia-routes.json` com todas as rotas da API pré-configuradas. Para quem não tem, basta importar: Create → Import → arrastar o arquivo ou navegar até ele.

## O ponto de partida

O instrutor deixa claro que esse é um **ponto de verificação**, não de desenvolvimento. O projeto já está completo e funcionando. A próxima etapa (atualização de dependências) parte desse estado verificado.

## Dica para quem não tem o projeto

Se o aluno não acompanhou os módulos anteriores, há um link na descrição da aula para baixar o projeto completo. Após o download:
1. `npm install`
2. Configurar `.env`
3. Subir container Docker
4. `npx prisma migrate dev`
5. Seguir o checklist de verificação