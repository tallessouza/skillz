# Deep Explanation: Deploy de Aplicações Full-Stack

## O que é deploy no contexto full-stack

Deploy é o processo de pegar uma aplicação que funciona no ambiente local de desenvolvimento e colocá-la em um servidor acessível pela internet, onde usuários reais podem utilizá-la.

## Os dois componentes fundamentais

O instrutor enfatiza que deploy full-stack envolve **dois elementos obrigatórios**:

1. **A aplicação** — o servidor Node.js/Express que processa requisições, renderiza páginas e executa a lógica de negócio
2. **O banco de dados** — onde os dados persistem, precisa estar rodando e acessível pelo servidor da aplicação

Publicar apenas a aplicação sem o banco de dados (ou vice-versa) resulta em uma aplicação quebrada. Ambos precisam estar configurados e conectados em produção.

## Ambiente local vs. produção

No ambiente local, tudo roda na mesma máquina — servidor e banco compartilham `localhost`. Em produção, a aplicação e o banco podem estar em servidores diferentes, com URLs e credenciais específicas. A transição de local para produção exige atenção a:

- **Variáveis de ambiente** — URLs de conexão, portas, credenciais mudam entre ambientes
- **Rede** — o banco precisa aceitar conexões do servidor da aplicação
- **Persistência** — dados em produção são reais e precisam de backup

## A mentalidade de deploy

O objetivo final de qualquer aplicação é ser usada por pessoas reais. Deploy é o momento em que o código deixa de ser apenas um projeto de estudo e se torna um produto acessível. Essa transição exige cuidado extra com segurança, performance e confiabilidade.